using UnityEditor;
using UnityEngine;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;
using Assets.Scripts.game.misc;
using Assets.Scripts.game.resloader;

class MakerResConfig
{
    static public string tsbuildToolPath
    {
        get { return "Assets/Editor/tools/tsbuild.py"; }
    }

    static public string tssPath
    {
        get { return "Assets/AssetSources/tss"; }
    }

    static public string assetBundlesOutPath
    {
        get { return "Assets/AssetBundles/"; }
    }

    static public string assetBundlesPublishPath
    {
        get { return "Assets/AssetBundles/publish/"; }
    }

    static public string mainManifestAssetBundle
    {
        get { return "Assets/AssetBundles/AssetBundles"; }
    }
}

public class AssetBundleMaker : EditorWindow
{
    [@MenuItem("Build/Build ts script")]
    public static void BuildTsScript()
    {
        Process p = new Process();
        p.StartInfo.FileName = "python";
        p.StartInfo.Arguments = MakerResConfig.tsbuildToolPath + " " + MakerResConfig.tssPath;
        p.Start();
        p.WaitForExit();
        AssetDatabase.Refresh();
        UnityEngine.Debug.Log("build ts script finished!");
    }

    [@MenuItem("Build/Make AssetBundles")]
    public static void BuildAssetBundles()
    {
        BuildAssetBundleOptions options = BuildAssetBundleOptions.DeterministicAssetBundle;
        BuildPipeline.BuildAssetBundles(MakerResConfig.assetBundlesOutPath, options, BuildTarget.StandaloneWindows);
        CreateABListCfg();
        UnityEngine.Debug.Log("build assetbundles finished!");
    }

    private static void CreateABListCfg()
    {
        byte[] buf = File.ReadAllBytes(MakerResConfig.mainManifestAssetBundle);
        AssetBundle assetbundle = AssetBundle.LoadFromMemory(buf);
        UnityEngine.Object obj = assetbundle.LoadAsset("AssetBundleManifest");
        AssetBundleManifest manif = obj as AssetBundleManifest;
        string[] abnames = manif.GetAllAssetBundles();
        List<string> ablist = new List<string>(abnames);

        string assets_cfg = "";
        int assets_cnt = 0;
        string cfg = "version:1212" + "\n";
        cfg += "assetbundles:" + ablist.Count;
        for (int i=0; i< ablist.Count; i++)
        {
            cfg += "\n";

            int id = i + 1;
            string abname = ablist[i];
            File.Copy(MakerResConfig.assetBundlesOutPath + abname, MakerResConfig.assetBundlesPublishPath + Hash.hash(abname), true);

            cfg += id + "|" + Hash.hash(abname) + "|";
            string[] depends = manif.GetDirectDependencies(abname);
            for (int dindex = 0; dindex < depends.Length; dindex++)
            {
                int dependid = ablist.FindIndex(s => s == depends[dindex]) + 1;
                if (dindex!=0) cfg += ";";
                cfg += dependid;
            }
            cfg += "|fixed;immediate|1002";

            bool startAsset = false;
            string abmanifest = MakerResConfig.assetBundlesOutPath + abname + ".manifest";
            string [] absmanifests = File.ReadAllLines(abmanifest);
            foreach ( string line in absmanifests)
            {
                if (startAsset)
                {
                    if (line.IndexOf("- ") != 0)
                        break;
                    assets_cfg += "\n";
                    assets_cfg += Hash.hash(line.Substring("- ".Length));
                    assets_cfg += "|" + id;
                    assets_cnt++;
                }
                else if ( line.IndexOf("Assets:") == 0 )
                {
                    startAsset = true;
                }
            }
        }

        cfg += "\n";
        cfg += "assets:" + assets_cnt;
        cfg += assets_cfg;
        File.WriteAllText(ResConfig.assetConfigPath, cfg);
    }
}
