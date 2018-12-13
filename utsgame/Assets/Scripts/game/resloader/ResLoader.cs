using UnityEngine;
namespace Assets.Scripts.game.resloader
{
    public delegate void AssetLoadedCallback(object asset);

    public class ResLoader
    {
        private AssetBundlesConfig _cfg = null;
        public ResLoader()
        {
            _cfg = new AssetBundlesConfig();
            _cfg.Load(ResConfig.assetConfigPath);
        }
        public bool Load(string res, AssetLoadedCallback callback)
        {
            res = fullResPath(res);
            AssetBundleInfo abInfo = _cfg.GetAssetBundle(res);
            if (abInfo == null)
            {
                BugReport.Report("ResLoader::Load not find res:" + res);
                return false;
            }

            bool isimmediate = (abInfo.flag & LoadABFlag.IMMEDIATE) == LoadABFlag.IMMEDIATE;
            bool isfixed = (abInfo.flag & LoadABFlag.FIXED) == LoadABFlag.FIXED;
            if (isimmediate) {
                AssetBundle ab = immediateLoadAssetBundle(abInfo);
				callback(ab.LoadAsset(res));
            }
            else {
                preImmediateLoadDependAssetBundle(abInfo);
                AssetBundleManager.loadAssetBundle(ResConfig.assetBundleUrlBasePath + abInfo.assetbundlename, abInfo.version, isfixed, (AssetBundle ab) => {
					callback(ab.LoadAsset(res));
                });
            }

            return true;
        }
        public byte[] immediateLoad(string res)
        {
            string fullresname = fullResPath(res);
            AssetBundleInfo abInfo = _cfg.GetAssetBundle(fullresname);
            if (abInfo == null)
            {
                BugReport.Report("ResLoader::immediateLoad not find res:" + fullresname);
                return null;
            }

            AssetBundle ab = immediateLoadAssetBundle(abInfo);
            Object asset = ab.LoadAsset(fullresname);
            TextAsset textAsset = (TextAsset)asset;
            return textAsset.bytes;
        }

        private AssetBundle immediateLoadAssetBundle(AssetBundleInfo abInfo)
        {
            preImmediateLoadDependAssetBundle(abInfo);
            bool isfixed = (abInfo.flag & LoadABFlag.FIXED) == LoadABFlag.FIXED;
            return AssetBundleManager.immediateLoadAssetBundle(ResConfig.assetBundleBasePath() + abInfo.assetbundlename, abInfo.version, isfixed);
        }

        private void preImmediateLoadDependAssetBundle(AssetBundleInfo abInfo, bool parent=true)
        {
            for (int i = 0; i < abInfo.dependencies.Length; i++)
            {
                int bundleId = abInfo.dependencies[i];
                AssetBundleInfo dependAbInfo = _cfg.GetAssetBundleById(bundleId);
                if (dependAbInfo == null) return;
                preImmediateLoadDependAssetBundle(dependAbInfo, false);
            }

            if (!parent)
            {
                bool isfixed = (abInfo.flag & LoadABFlag.FIXED) == LoadABFlag.FIXED;
                AssetBundleManager.immediateLoadAssetBundle(ResConfig.assetBundleBasePath() + abInfo.assetbundlename, abInfo.version, isfixed);
            }
        }

        private string fullResPath(string res)
        {
            return ResConfig.assetBasePath + res;
        }
    }
}
