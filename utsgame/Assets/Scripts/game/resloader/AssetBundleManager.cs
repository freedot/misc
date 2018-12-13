using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;

namespace Assets.Scripts.game.resloader
{
    public delegate void LoadedCallback(AssetBundle ab);

    class AssetBundleManager
    {
        private const float timeout = 15f;
        private static Dictionary<string, AssetBundleRef> _refs = new Dictionary<string, AssetBundleRef>();
        private static List<AssetBundleRef> _refslist = new List<AssetBundleRef>();
        private static MonoBehaviour _behaviour;
        private class AssetBundleRef
        {
            public string key;
            public AssetBundle assetBundle;
            public int version;
            public string url;
            public float lastUsedTime;
            public List<LoadedCallback> callbacks = new List<LoadedCallback>();
            public AssetBundleRef(AssetBundle assetBundle, string strUrlIn, int intVersionIn)
            {
                this.assetBundle = assetBundle;
                this.url = strUrlIn;
                this.version = intVersionIn;
                this.lastUsedTime = Time.realtimeSinceStartup;
                this.key = makeKey(this.url, this.version);
            }
        };

        public static void setMonoBehaviour(MonoBehaviour behaviour)
        {
            _behaviour = behaviour;
        }

        public static AssetBundle immediateLoadAssetBundle(string path, int version, bool isFixed)
        {
            string keyName = makeKey(path, version);
            AssetBundleRef abRef;
            if (_refs.TryGetValue(keyName, out abRef))
            {
                if (abRef.assetBundle == null)
                    throw new Exception("immediateLoadAssetBundle: load ab can only use one method! [path]" + path);
                refreshRef(abRef);
                return abRef.assetBundle;
            }
            else
            {
                byte[] buf = File.ReadAllBytes(path);
                AssetBundle ab = AssetBundle.LoadFromMemory(buf);
                addRef(keyName, isFixed, new AssetBundleRef(ab, path, version));
                return ab;
            }
        }

        public static void loadAssetBundle(string path, int version, bool isFixed, LoadedCallback callback)
        {
            _behaviour.StartCoroutine(loadAssetBundleCoroutine(path, version, isFixed, callback));
        }

        public static void unload(string url, int version, bool allObjects)
        {
            string keyName = makeKey(url, version);
            AssetBundleRef abRef;
            if (_refs.TryGetValue(keyName, out abRef))
            {
                if (abRef.assetBundle != null)
                {
                    abRef.assetBundle = null;
                    abRef.assetBundle.Unload(allObjects);
                }
                _refs.Remove(keyName);
                _refslist.Remove(abRef);
            }
        }

        public static void collectGarbage()
        {
            if (_refslist.Count == 0)
                return;

            for (int i=0, n=_refslist.Count; i<n; i++)
            {
                AssetBundleRef abRef = _refslist[i];
                if ((Time.realtimeSinceStartup - abRef.lastUsedTime) >= timeout)
                {
                    _refslist.RemoveAt(i);
                    unload(abRef.url, abRef.version, false);
                    break;
                }
            }
        }

        private static IEnumerator loadAssetBundleCoroutine(string path, int version, bool isFixed, LoadedCallback callback)
        {
            string keyName = makeKey(path, version);
            AssetBundleRef abRef;
            if (_refs.TryGetValue(keyName, out abRef))
            {
                refreshRef(abRef);
                if (abRef.assetBundle != null)
                {
                    callback(abRef.assetBundle);
                    yield return null;
                }
                else
                {   // in www loading ...
                    abRef.callbacks.Add(callback);
                }
            }
            else
            {
                abRef = new AssetBundleRef(null, path, version);
                abRef.callbacks.Add(callback);
                addRef(keyName, isFixed, abRef);

                using (WWW www = WWW.LoadFromCacheOrDownload(path, version))
                {
                    yield return www;
                    if (www.error != null)
                    {
                        _refs.Remove(keyName);
                        throw new Exception("WWW download:" + www.error + "! [path]" + path);
                    }

                    abRef = null;
                    if (_refs.TryGetValue(keyName, out abRef))
                    {
                        abRef.assetBundle = www.assetBundle;
                        for (int i = 0, n = abRef.callbacks.Count; i < n; i++)
                        {
                            abRef.callbacks[i](abRef.assetBundle);
                        }
                        abRef.callbacks.Clear();
                    }
                    else
                    {
                        www.assetBundle.Unload(true);
                        throw new Exception("loadAssetBundleCoroutine: can not find keyName:" + keyName);
                    }
                }
            }
        }

        private static void addRef(string keyName, bool isFixed, AssetBundleRef abRef)
        {
            _refs.Add(keyName, abRef);
            if (!isFixed) _refslist.Add(abRef);
        }

        private static void refreshRef(AssetBundleRef abRef)
        {
            abRef.lastUsedTime = Time.realtimeSinceStartup;
        }
        
        private static string makeKey(string path, int version)
        {
            return path.Substring(path.IndexOf(ResConfig.assetBasePathForMakeKey)) + ":" + version.ToString();
        }

    }
}
