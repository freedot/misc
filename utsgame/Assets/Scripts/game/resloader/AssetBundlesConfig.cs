using System.Collections.Generic;
using System.IO;
using Assets.Scripts.game.misc;

namespace Assets.Scripts.game.resloader
{
    enum LoadABFlag
    {
        NONE = 0,
        FIXED = 0x1,
        IMMEDIATE = 0x2,
    }

    class AssetBundleInfo
    {
        public string assetbundlename;
        public int version;
        public LoadABFlag flag;
        public int[] dependencies;
        public AssetBundleInfo(string assetbundle, int version, LoadABFlag flag, int[] dependencies)
        {
            this.assetbundlename = assetbundle;
            this.version = version;
            this.flag = flag;
            this.dependencies = dependencies;
        }
    }

    class AssetBundlesConfig
    {
        private int _version = 0;
        private Dictionary<int, AssetBundleInfo> _assetbundles = new Dictionary<int, AssetBundleInfo>();
        private Dictionary<string, int> _assets = new Dictionary<string, int>();

        public bool Load(string path)
        {
            FileStream fs = File.OpenRead(path);
            StreamReader sr = new StreamReader(fs);
            _version = readIntValueByKey(sr.ReadLine(), "version");
            int bundlescount = readIntValueByKey(sr.ReadLine(), "assetbundles");
            for (int i = 0; i < bundlescount; i++)
            {
                string bundleline = sr.ReadLine();
                if (bundleline == null)
                    return loadError(fs, sr, "AssetConfigLoader::Load read bundle failed! need line:" + bundlescount);
                string[] segments = bundleline.Split('|');
                if (segments.Length != 5)
                    return loadError(fs, sr, "AssetConfigLoader::Load read bundle failed, segments error! in line:" + i);

                int id = safeToInt(segments[0]);
                string abname = segments[1];
                int[] dependencies = safeToInts(segments[2].Split(';'));
                string sflag = segments[3];
                int version = safeToInt(segments[4]);

                LoadABFlag flag = LoadABFlag.NONE;
                if (sflag.IndexOf("fixed") >= 0) flag |= LoadABFlag.FIXED;
                if (sflag.IndexOf("immediate") >= 0) flag |= LoadABFlag.IMMEDIATE;
                _assetbundles.Add(id, new AssetBundleInfo(abname, version, flag, dependencies));
            }

            int assetscount = readIntValueByKey(sr.ReadLine(), "assets");
            for (int i = 0; i < assetscount; i++)
            {
                string assetline = sr.ReadLine();
                if (assetline == null)
                    return loadError(fs, sr, "AssetConfigLoader::Load read files failed! need line:" + assetscount);
                string[] segments = assetline.Split('|');
                if (segments.Length != 2)
                    return loadError(fs, sr, "AssetConfigLoader::Load read files failed, segments error! in line:" + i);

                string assetname = segments[0];
                int assetbundleid = safeToInt(segments[1]);

                _assets.Add(assetname, assetbundleid);
            }

            sr.Close();
            fs.Close();

            return true;
        }

        public int Version
        {
            get { return _version; }
        }

        public void Diff(AssetBundlesConfig newcfg, out List<string> changes, out List<string> adds, out List<string> dels)
        {
            changes = new List<string>();
            adds = new List<string>();
            dels = new List<string>();

            Dictionary<string, int> newabs = new Dictionary<string, int>();
            foreach (AssetBundleInfo abInfo in newcfg._assetbundles.Values)
            {
                newabs.Add(abInfo.assetbundlename, abInfo.version);
            }

            Dictionary<string, int> curabs = new Dictionary<string, int>();
            foreach (AssetBundleInfo abInfo in _assetbundles.Values)
            {
                curabs.Add(abInfo.assetbundlename, abInfo.version);
            }

            foreach (KeyValuePair<string, int> pair in newabs)
            {
                string abname = pair.Key;
                int newver = pair.Value;
                int curver;
                if (curabs.TryGetValue(abname, out curver))
                {
                    if (curver != newver) changes.Add(abname);
                }
                else
                {
                    adds.Add(abname);
                }
            }

            foreach (KeyValuePair<string, int> pair in curabs)
            {
                string abname = pair.Key;
                if (!newabs.ContainsKey(abname))
                {
                    dels.Add(abname);
                }
            }
        }

        public AssetBundleInfo GetAssetBundle(string assetName)
        {
            int assetbundleId;
            if (!_assets.TryGetValue(Hash.hash(assetName), out assetbundleId))
                return null;

            AssetBundleInfo abInfo;
            if (!_assetbundles.TryGetValue(assetbundleId, out abInfo))
                return null;

            return abInfo;
        }

        public AssetBundleInfo GetAssetBundleById(int bundleId)
        {
            AssetBundleInfo abInfo;
            if (!_assetbundles.TryGetValue(bundleId, out abInfo))
                return null;

            return abInfo;
        }

        private int readIntValueByKey(string segment, string key)
        {
            string keywithtoken = key + ":";
            int pos = segment.IndexOf(keywithtoken);
            if (pos < 0)
            {
                BugReport.Report("AssetConfigLoader::readIntValueByKey read key:" + key + " from segment:" + segment + " failed!");
                return 0;
            }
            return safeToInt(segment.Substring(pos + keywithtoken.Length));
        }

        private int safeToInt(string sval)
        {
            int val;
            if (!int.TryParse(sval, out val))
            {
                BugReport.Report("AssetConfigLoader::safeToInt convert sval:" + sval + " failed!");
                return 0;
            }
            return val;
        }

        private int[] safeToInts(string[] svals)
        {
            int[] vals = null;
            if (svals.Length == 1 && svals[0] == "")
            {
                vals = new int[0];
                return vals;
            }

            vals = new int[svals.Length];
            for (int i = 0; i < vals.Length; i++)
                vals[i] = safeToInt(svals[i]);
            return vals;
        }

        private bool loadError(FileStream fs, StreamReader sr, string errormsg)
        {
            sr.Close();
            fs.Close();
            BugReport.Report(errormsg);
            return false;
        }
    }
}
