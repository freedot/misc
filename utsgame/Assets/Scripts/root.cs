using UnityEngine;
using Assets.Scripts.game.tsregister.GameEngine;
using Assets.Scripts.game.resloader;
using System.IO;
using Assets.Scripts.game;

public class root : MonoBehaviour {
    public bool ScriptFromAssetBundle = false;
    private Uts.Engine _uts = new Uts.Engine();
    
    void Start()
    {
        Global.create();
        AssetBundleManager.setMonoBehaviour(this);

        string basePath = "tss/compiled/";
        string ext = "bytes";
        ///@build_delete_start
        if (IsLoadFromLocalFile())
        {
            basePath = "Assets/AssetSources/tss/.dist/";
            ext = "js"; 
        }
        ///@build_delete_end
        if (!_uts.Create(basePath, ext, readScript, BugReport.Report, Debug.Log, Debug.LogWarning, Debug.LogError)) 
            return;

        Registers.Register(_uts.GetContent().ptr);

        if (!_uts.EvalFile("root")) 
            return;
    }

    byte[] readScript(string path)
    {
        if (IsLoadFromLocalFile())
            return File.ReadAllBytes(path);
        else
            return Global.resLoader.immediateLoad(path);
    }

    void Update()
    {
        AssetBundleManager.collectGarbage();
    }

    void OnDestroy()
    {
        _uts.Release();
    }

    private bool IsLoadFromLocalFile()
    {
        return Uts.Platform.IsEditor() && !ScriptFromAssetBundle;
    }
}
