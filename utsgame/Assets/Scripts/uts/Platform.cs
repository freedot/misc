using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uts {
    public class Platform {
        public static bool IsEditor() {
#if UNITY_EDITOR
            return true;
#else
            return false;
#endif
        }

        public static bool IsIOS() {
#if UNITY_IPHONE
            return true;
#else
            return false;
#endif
        }

        public static bool IsAndroid() {
#if UNITY_ANDROID
            return true;
#else
            return false;
#endif
        }
    }
}
