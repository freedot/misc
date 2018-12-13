using System;
using System.Runtime.InteropServices;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Uts {
    public class DynBindMgr {
        public class MInfo {
            public Type classType;
            public MethodInfo method;
            public MInfo(Type classType, MethodInfo method) {
                this.classType = classType;
                this.method = method;
            }
        }

        private static Dictionary<string, MInfo> _map = new Dictionary<string, MInfo>();

        public static MInfo GetMethodInfo(string keyName) {
            MInfo minfo = null;
            _map.TryGetValue(keyName, out minfo);
            return minfo;
        }

        public static void SetMethodInfo(string keyName, Type classType, MethodInfo m) {
            _map[keyName] = new MInfo(classType, m);
        }
    }

    public class DynBind {
        static private int matchType(IntPtr ctx, int pos, Type type) {
            int top = Native.duk_get_top(ctx);
            if (pos >= top) return -1;
            DUK_TYPE tsType = (DUK_TYPE)Native.duk_get_type(ctx, pos++);
            if (tsType == DUK_TYPE.STRING && type.Name == "String" ) {
                return pos;
            }
            else if (tsType == DUK_TYPE.NUMBER && 
                (type.Name == "Int16"
                ||type.Name == "Int32"
                ||type.Name == "Int64"
                ||type.Name == "UInt16"
                ||type.Name == "UInt32"
                ||type.Name == "UInt64"
                ||type.Name == "Float"
                ||type.Name == "Double" )){
                return pos;
            }
            else if (tsType == DUK_TYPE.OBJECT) {
                // read object type
                if (pos >= top) return -1;
                ARG_TYPE rtType = (ARG_TYPE)Native.duk_require_int(ctx, pos++);
                if (rtType == ARG_TYPE.CALLBACK) {
                    if (pos >= top) return -1;
                    int argsCount = Native.duk_require_int(ctx, pos++);
                    pos += argsCount;
                    if (pos > top) return -1;
                }
                return pos;
            }
            return -1;
        }

        static private bool matchArgs(IntPtr ctx, int from, ParameterInfo[] pis) {
            int top = Native.duk_get_top(ctx);
            int pos = from;
            for (int i = 0; i < pis.Length; i++) {
                pos = matchType(ctx, pos, pis[i].ParameterType);
                if ( pos < 0 ) return false;
            }
            return (pos == top);
        }

        static private MethodInfo getMethod(IntPtr ctx, string member, int fromStackPos, Type type) {
            MethodInfo m;
            MemberInfo[] mis = type.GetMember(member, BindingFlags.Static | BindingFlags.Instance | BindingFlags.Public);
            for (int i = 0; i < mis.Length; i++) {
                m = (MethodInfo)mis[i];
                if (matchArgs(ctx, fromStackPos, m.GetParameters())) {
                    return m;
                }
            }

            return null;
        }

        static private ConstructorInfo getConstructor(IntPtr ctx, int fromStackPos, ConstructorInfo[] ctors) {
            if (ctors.Length == 1) {
                return ctors[0];
            }

            ConstructorInfo ctor = null;
            for (int i = 0; i < ctors.Length; i++) {
                ctor = ctors[i];
                if (matchArgs(ctx, fromStackPos, ctor.GetParameters())) {
                    return ctor;
                }
            }
            return null;
        }

        static private TsDelegate makeCallBack(Context context, int funref, int pos, int argsCount) {
            IntPtr ctx = context.ptr;
            TsDelegate td = new TsDelegate(context, funref, argsCount);
            for (int i = 0; i < argsCount; i++) {
                DUK_TYPE tsType = (DUK_TYPE)Native.duk_get_type(ctx, pos);
                if (tsType == DUK_TYPE.OBJECT) {
                    Native.duk_dup(ctx, pos);
                    int argref = Native.duv_ref(ctx);
                    pos++;
                    td.AddArgType(i, ARG_TYPE.OBJECT, argref);
                }
                else {
                    ARG_TYPE argType = (ARG_TYPE)Native.duk_require_int(ctx, pos++);
                    td.AddArgType(i, argType, 0);
                }
            }
            return td;
        }

        static private int fillArg(IntPtr ctx, int pos, Type argType, out object arg) {
            arg = null;
            DUK_TYPE tsType = (DUK_TYPE)Native.duk_get_type(ctx, pos);
            if (tsType == DUK_TYPE.NUMBER) {
                arg = Native.duk_require_int(ctx, pos++);
            }
            else if (tsType == DUK_TYPE.STRING) {
                arg = Native.duk_require_string_s(ctx, pos++);
            }
            else if (tsType == DUK_TYPE.OBJECT) {
                IntPtr ptr = Native.duk_get_heapptr(ctx, pos++);
                arg = BindObjectsMgr.GetCsObject(ptr);
                // read object type
                ARG_TYPE rtType = (ARG_TYPE)Native.duk_require_int(ctx, pos++);
                if (rtType == ARG_TYPE.OBJECT) {
                    if (arg == null) {
                        throw new Exception("Can not find arg in bindmgr!");
                    }
                }
                else if (rtType == ARG_TYPE.CALLBACK) {
                    int argsCount = Native.duk_require_int(ctx, pos++);
                    Native.duk_push_heapptr(ctx, ptr);
                    int funref = Native.duv_ref(ctx);
                    Context context = Engine.GetContent(ctx);
                    if (context == null) {
                        throw new Exception("Get context failed!");
                    }
                    TsDelegate td = makeCallBack(context, funref, pos, argsCount);
                    arg = Delegate.CreateDelegate(argType, td, "Deleg", true, true);
                    pos += argsCount;
                }
            }
            return pos;
        }

        static private void fillArgs(IntPtr ctx, int from, ParameterInfo[] ps, out object[] args) {
            args = new object[ps.Length];
            for (int i = 0, pos = from; i < ps.Length; i++) {
                object arg;
                pos = fillArg(ctx, pos, ps[i].ParameterType, out arg);
                args[i] = arg;
            }
        }

        static private string getMemberKey(object csObject, bool isStaticCall, string member, int memberid) {
            StringBuilder sb = new StringBuilder();
            if (!isStaticCall) {
                sb.Append(csObject.GetType().FullName).Append(".").Append(member).Append(memberid).ToString();
            }
            else {
                sb.Append(member).Append(memberid);
            }
            return sb.ToString();
        }

        static private void getNeedInfo(object csObject, bool isStaticCall, string member, int memberid, out string methodName, out Type type) {
            if (!isStaticCall) {
                type = csObject.GetType();
                methodName = member;
            }
            else {
                string[] paths = member.Split('.');
                methodName = paths[paths.Length - 1];
                string className = member.Substring(0, member.Length - methodName.Length - 1);
                type = Type.GetType(className);
                if (type == null) {
                    throw new Exception(string.Format("Not find class {0} type.", className));
                }
            }
        }

        static private int pushRetVal(IntPtr ctx, object ret, RET_TYPE retType, string member, Type type, int tsTypePos) {
            Type t = ret.GetType();
            if (retType == RET_TYPE.CLASSOBJECT) {
                Bind.PushDynCsObject(ctx, ret, tsTypePos);
            }
            else if (t.IsEnum || t.Name == "Int32") {
                Native.duk_push_int(ctx, Convert.ToInt32(ret));
            }
            else if (t.Name == "String") {
                Native.duk_push_string(ctx, Convert.ToString(ret));
            }
            else {
                throw new Exception(string.Format("Return value is invalid! attr<{0}> in {1} return type is {2}.", member, type.Name, t.Name));
            }
            return 1;
        }

        [InvokeCallback(typeof(cs_function))]
        static public int __call(IntPtr ctx) {
            try {
                // read params
                int memberid = Native.duk_require_int(ctx, 0);
                string member = Native.duk_require_string_s(ctx, 1);
                bool isStaticCall = member.IndexOf(".") > 0;
                object csObject = isStaticCall ? null : Bind.RequireThis(ctx);
                RET_TYPE retType = (RET_TYPE)Native.duk_require_int(ctx, 2);
                int fromStackPos = retType == RET_TYPE.CLASSOBJECT ? 4 : 3;

                MethodInfo m = null;
                Type type = null;
                string memberKey = getMemberKey(csObject, isStaticCall, member, memberid);
                DynBindMgr.MInfo mInfo = DynBindMgr.GetMethodInfo(memberKey);
                if (mInfo == null) {
                    string methodName = null;
                    getNeedInfo(csObject, isStaticCall, member, memberid, out methodName, out type);
                    m = getMethod(ctx, methodName, fromStackPos, type);
                    DynBindMgr.SetMethodInfo(memberKey, type, m);
                }
                else {
                    type = mInfo.classType;
                    m = mInfo.method;
                }

                if (m == null) {
                    throw new Exception(string.Format("Not find method[{0}] in {1}.", member, type.Name));
                }

                // handle args
                object[] args;
                fillArgs(ctx, fromStackPos, m.GetParameters(), out args);
                object ret = m.Invoke(m.IsStatic ? null : csObject, args);
                if (ret == null) {
                    return 0;
                }

                // handle return value
                return pushRetVal(ctx, ret, retType, member, type, 3);
            }
            catch (Exception e) {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int __set(IntPtr ctx) {
            try {
                // read params
                object csObject = Bind.RequireThis(ctx);
                string member = Native.duk_require_string_s(ctx, 0);

                Type type = csObject.GetType();
                FieldInfo finfo = null;
                PropertyInfo prop = type.GetProperty(member);
                if (prop == null) {
                    finfo = type.GetField(member);
                }

                if (finfo == null && prop == null) {
                    throw new Exception(string.Format("Attr<{0}> not in {1} !", member, type.Name));
                }

                Type valType = prop != null ? prop.GetType() : finfo.GetType();
                object value = null;
                fillArg(ctx, 1, valType, out value);
                if (prop != null) prop.SetValue(csObject, value, null);
                else finfo.SetValue(csObject, value);
                return 0;
            }
            catch (Exception e) {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int __get(IntPtr ctx) {
            try {
                // read params
                object csObject = Bind.RequireThis(ctx);
                string member = Native.duk_require_string_s(ctx, 0);
                RET_TYPE retType = (RET_TYPE)Native.duk_require_int(ctx, 1);

                Type type = csObject.GetType();
                FieldInfo finfo = null;
                PropertyInfo prop = type.GetProperty(member);
                if (prop == null) {
                    finfo = type.GetField(member);
                }

                if (finfo == null && prop == null) {
                    throw new Exception(string.Format("Attr<{0}> not in {1} !", member, type.Name));
                }

                object ret = (prop != null) ? prop.GetValue(csObject, null) : finfo.GetValue(csObject);

                // handle return value
                return pushRetVal(ctx, ret, retType, member, type, 2);
            }
            catch (Exception e) {
                return Native.duk_throw_error(ctx, Convert.ToString(e));
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int __as(IntPtr ctx) {
            try {
                // read params
                IntPtr optr = Native.duk_get_heapptr(ctx, 0);
                object o = BindObjectsMgr.GetCsObject(optr);
                string sretType = Native.duk_require_string_s(ctx, 1);
                // stack.pos2 is tsToTypeClass
                Type retType = Type.GetType(sretType);
                if (retType == null) {
                    throw new Exception(string.Format("Not find class {0} type when as op.", sretType));
                }
                BindObjectsMgr.RemoveByCsObject(o);
                Bind.PushDynCsObject(ctx, Convert.ChangeType(o, retType), 2);
                return 1;
            }
            catch (Exception e) {
                return Native.duk_throw_error(ctx, Convert.ToString(e));
            }
        }

        [InvokeCallback(typeof(cs_function))]
        static public int ctor_DynBind(IntPtr ctx) {
            try {
                if (Native.duk_is_string(ctx, 0) != 1) {
                    return 0; // use default ctor: _super.apply(this, arguments);
                }
                string className = Native.duk_require_string_s(ctx, 0);
                int fromStackPos = 1;
                Type type = Type.GetType(className);
                if (type == null ) {
                    throw new Exception(string.Format("Not find class {0} type in ctor.", className));
                }
                ConstructorInfo ctor = getConstructor(ctx, fromStackPos, type.GetConstructors(BindingFlags.Instance | BindingFlags.Public));
                if (ctor == null) {
                    throw new Exception(string.Format("Not find ctor in {0} !", type.Name));
                }

                // handle args
                object[] args;
                fillArgs(ctx, fromStackPos, ctor.GetParameters(), out args);
                object csObject = ctor.Invoke(args);

                IntPtr ptr = IntPtr.Zero;
                ptr = Native.duk_require_this(ctx);
                BindObjectsMgr.Bind(ptr, csObject);
                return 0;
            }
            catch (Exception e) {
                return Native.duk_throw_error(ctx, e.ToString());
            }
        }

        static public void Register(IntPtr ctx) {
            Bind.RegClassStart(ctx, "__DynBind", "", ctor_DynBind, -1);
            Bind.RegCsFunction(ctx, "__call", __call, -1);
            Bind.RegStaticCsFunction(ctx, "__call", __call, -1);
            Bind.RegCsFunction(ctx, "__set", __set, 2);
            Bind.RegCsFunction(ctx, "__get", __get, -1);
            Bind.RegStaticCsFunction(ctx, "__as", __as, 3);
            Bind.RegClassEnd(ctx);
        }
    }
}
