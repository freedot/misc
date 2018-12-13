using UnityEngine;
using UnityEngine.UI;

public class BugReport {
    static public void Report(string error) {
        Debug.LogError(error);
    }
}
