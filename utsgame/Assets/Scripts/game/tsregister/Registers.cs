using UnityEngine;
using System;
using Uts;
using Assets.Scripts.game.ui;
using UnityEngine.UI;
using UnityEngine.Events;
using System.Collections.Generic;
using Assets.Scripts.game.resloader;
using Assets.Scripts.game;
namespace Assets.Scripts.game.tsregister.GameEngine
{
    public class CsObjectRegister
    {
        static public void Register(IntPtr ctx)
        {
            Bind.RegClassStart(ctx, "CsObject", "", null);
            Bind.RegClassEnd(ctx);
        }
    }
    public class GameObjectRegister
    {
        [InvokeCallback(typeof(cs_function))]
        static public int instantiate(IntPtr ctx)
        {
            try
            {
                IntPtr resobjptr = Native.duk_get_heapptr(ctx, 0);
                UnityEngine.Object resobj = BindObjectsMgr.GetCsObject(resobjptr) as UnityEngine.Object;
                string toType = Native.duk_require_string_s(ctx, 1);
                if (toType == "GameEngine.ui.Form")
                {
                    var obj = GameObject.Instantiate(resobj, Vector3.zero, Quaternion.identity) as GameObject;
                    Bind.PushCsObject(ctx, new TsForm(obj), toType);
                }
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }
        static public void Register(IntPtr ctx)
        {
            Bind.RegClassStart(ctx, "GameObject", "", null);
            Bind.RegCsFunction(ctx, "instantiate", instantiate, 2);
            Bind.RegClassEnd(ctx);
        }
    }
    public class ElementRegister
    {
        [InvokeCallback(typeof(cs_function))]
        static public int elementType(IntPtr ctx)
        {
            try
            {
                Native.duk_push_string(ctx, "Element");
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int isElement(IntPtr ctx)
        {
            try
            {
                Native.duk_push_boolean(ctx, 1);
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int removeAllListeners(IntPtr ctx)
        {
            try
            {
                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        static public void Register(IntPtr ctx)
        {
            Bind.RegClassStart(ctx, "Element", "", null);
            Bind.RegCsFunction(ctx, "elementType", elementType, 0);
            Bind.RegCsFunction(ctx, "isElement", isElement, 0);
            Bind.RegCsFunction(ctx, "removeAllListeners", removeAllListeners, 0);
            Bind.RegClassEnd(ctx);
        }
    }
    public class ButtonRegister
    {
        private static Dictionary<Button, List<UnityAction>> _buttonActions = new Dictionary<Button, List<UnityAction>>();

        [InvokeCallback(typeof(cs_function))]
        static public int elementType(IntPtr ctx)
        {
            try
            {
                Native.duk_push_string(ctx, "Button");
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int addClickListener(IntPtr ctx)
        {
            try
            {
                Button btn = (Button)Bind.RequireThis(ctx);
                IntPtr callbackptr = Native.duk_get_heapptr(ctx, 0);
                Native.duk_push_heapptr(ctx, callbackptr);
                int callbackref = Native.duv_ref(ctx);
                Context context = Engine.GetContent(ctx);
                TsDelegate td = new TsDelegate(context, callbackref, 0);
                UnityAction act = Delegate.CreateDelegate(typeof(UnityAction), td, "Deleg", true, true) as UnityAction;
                btn.onClick.AddListener(act);

                if (!_buttonActions.ContainsKey(btn))
                    _buttonActions[btn] = new List<UnityAction>();
                _buttonActions[btn].Add(act);

                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int removeAllListeners(IntPtr ctx)
        {
            try
            {
                Button btn = (Button)Bind.RequireThis(ctx);

                List<UnityAction> acts;
                if (!_buttonActions.TryGetValue(btn, out acts) || acts == null)
                    return 0;
                for (int i = 0; i < acts.Count; i++)
                {
                    btn.onClick.RemoveListener(acts[i]);
                }
                _buttonActions.Remove(btn);

                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        static public void Register(IntPtr ctx)
        {
            Bind.RegClassStart(ctx, "Button", "Element", null);
            Bind.RegCsFunction(ctx, "elementType", elementType, 0);
            Bind.RegCsFunction(ctx, "addClickListener", addClickListener, 1);
            Bind.RegCsFunction(ctx, "removeAllListeners", removeAllListeners, 0);
            Bind.RegClassEnd(ctx);
        }
    }
    public class TextRegister
    {
        [InvokeCallback(typeof(cs_function))]
        static public int elementType(IntPtr ctx)
        {
            try
            {
                Native.duk_push_string(ctx, "Text");
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int setText(IntPtr ctx)
        {
            try
            {
                Text textobj = (Text)Bind.RequireThis(ctx);
                string text = Native.duk_require_string_s(ctx, 0);
                textobj.text = text;
                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int setColor(IntPtr ctx)
        {
            try
            {
                Text textobj = (Text)Bind.RequireThis(ctx);
                int r = Native.duk_require_int(ctx, 0);
                int g = Native.duk_require_int(ctx, 1);
                int b = Native.duk_require_int(ctx, 2);
                int a = Native.duk_require_int(ctx, 3);
                textobj.color = new Color(r / 255f, g / 255f, b / 255f, a / 255f);
                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        static public void Register(IntPtr ctx)
        {
            Bind.RegClassStart(ctx, "Text", "Element", null);
            Bind.RegCsFunction(ctx, "elementType", elementType, 0);
            Bind.RegCsFunction(ctx, "setText", setText, 1);
            Bind.RegCsFunction(ctx, "setColor", setColor, 4);
            Bind.RegClassEnd(ctx);
        }
    }
    public class FormRegister
    {
        [InvokeCallback(typeof(cs_function))]
        static public int show(IntPtr ctx)
        {
            try
            {
                TsForm form = (TsForm)Bind.RequireThis(ctx);
                form.show();
                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int hide(IntPtr ctx)
        {
            try
            {
                TsForm form = (TsForm)Bind.RequireThis(ctx);
                form.hide();
                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int getElement(IntPtr ctx)
        {
            try
            {
                TsForm form = (TsForm)Bind.RequireThis(ctx);
                string name = Native.duk_require_string_s(ctx, 0);
                GameObject elem = form.getElement(name);
                Bind.PushCsObject(ctx, elem, "GameEngine.ui.Element");
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        static public int getButton(IntPtr ctx)
        {
            try
            {
                TsForm form = (TsForm)Bind.RequireThis(ctx);
                string name = Native.duk_require_string_s(ctx, 0);
                Button elem = form.getElement<Button>(name);
                Bind.PushCsObject(ctx, elem, "GameEngine.ui.Button");
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        static public int getText(IntPtr ctx)
        {
            try
            {
                TsForm form = (TsForm)Bind.RequireThis(ctx);
                string name = Native.duk_require_string_s(ctx, 0);
                Text elem = form.getElement<Text>(name);
                Bind.PushCsObject(ctx, elem, "GameEngine.ui.Text");
                return 1;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }


        static public void Register(IntPtr ctx)
        {
            Bind.RegClassStart(ctx, "Form", "", null);
            Bind.RegCsFunction(ctx, "show", show, 0);
            Bind.RegCsFunction(ctx, "hide", hide, 0);
            Bind.RegCsFunction(ctx, "getElement", getElement, 1);
            Bind.RegCsFunction(ctx, "getButton", getButton, 1);
            Bind.RegCsFunction(ctx, "getText", getText, 1);
            Bind.RegClassEnd(ctx);
        }
    }
    public class UiRegisters
    {
        static public void Register(IntPtr ctx)
        {
            Bind.RegModuleBegin(ctx, "ui");
            ElementRegister.Register(ctx);
            ButtonRegister.Register(ctx);
            TextRegister.Register(ctx);
            FormRegister.Register(ctx);
            Bind.RegModuleEnd(ctx);
        }
    }
    public class ResLoaderRegister
    {
        [InvokeCallback(typeof(cs_function))]
        static public int load(IntPtr ctx)
        {
            try
            {
                string prefabPath = Native.duk_require_string_s(ctx, 0);

                IntPtr callbackptr = Native.duk_get_heapptr(ctx, 1);
                Native.duk_push_heapptr(ctx, callbackptr);
                int callbackref = Native.duv_ref(ctx);
                Context context = Engine.GetContent(ctx);
                TsDelegate td = new TsDelegate(context, callbackref, 1);
                td.AddArgType(0, ARG_TYPE.CSOBJECT, -1, "GameEngine.CsObject");
                AssetLoadedCallback callback = Delegate.CreateDelegate(typeof(AssetLoadedCallback), td, "Deleg", true, true) as AssetLoadedCallback;
                Global.resLoader.Load(prefabPath, callback);

                return 0;
            }
            catch (Exception e)
            {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }
        static public void Register(IntPtr ctx)
        {
            Bind.RegClassStart(ctx, "ResLoader");
            Bind.RegStaticCsFunction(ctx, "load", load, 2);
            Bind.RegClassEnd(ctx);
        }
    }
    public class Registers
    {
        static public void Register(IntPtr ctx)
        {
            Bind.RegModuleBegin(ctx, "GameEngine");
            CsObjectRegister.Register(ctx);
            GameObjectRegister.Register(ctx);
            UiRegisters.Register(ctx);
            ResLoaderRegister.Register(ctx);
            Bind.RegModuleEnd(ctx);
        }
    }
}



