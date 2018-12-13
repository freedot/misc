using UnityEngine;
namespace Assets.Scripts.game.resloader
{
    public class ResConfig
    {
        static public string assetBundleBasePath()
        {
            if (Uts.Platform.IsEditor())
                return Application.dataPath + "/AssetBundles/publish/";
            else
                return Application.persistentDataPath + "/AssetBundles/publish/";
        }
        static public string assetBundleUrlBasePath
        {
            get { return "file:///" + assetBundleBasePath(); }
        }
        static public string assetConfigPath
        {
            get { return assetBundleBasePath() + "ablist.txt"; }
        }
        static public string assetBasePath
        {
            get { return "Assets/AssetSources/"; }
        }
        static public string assetBasePathForMakeKey
        {
            get { return "AssetBundles/"; }
        }
    }
}
