using System;
using System.Collections.Generic;
using System.Reflection;

namespace Uts {
    public enum RET_TYPE {
        VOID = 0,
        NUMBER = 1,
        STRING = 2,
        BOOL = 3,
        FUN = 4,
        ARRAY = 5,
        DICT = 6,
        CLASSOBJECT = 7,
        MULTIDICT = 8,
    }
    public enum ARG_TYPE {
        OBJECT = 0,
        CSOBJECT = 1,
        CALLBACK = 2,
        NUMBER = 3,
        STRING = 4,
        BOOL = 5,
        FUN = 6,
        ARRAY = 7,
        DICT = 8,
    }
    public class TsDelegate : IDisposable {
        class Arg {
            public object arg = null;
            public ARG_TYPE type = ARG_TYPE.OBJECT;
            public int iref = 0;
            public string typeName = null;
            public Arg(object arg, ARG_TYPE type, int iref, string typeName) {
                this.arg = arg;
                this.type = type;
                this.iref = iref;
                this.typeName = typeName;
            }
        }
        private Context _context = null;
        private int _funref = 0;
        private bool _unrefed = false;
        private Arg[] _args = null;
        public TsDelegate(Context context, int funref, int argsCnt) {
            _context = context;
            _funref = funref;
            _args = new Arg[argsCnt];
        }
        public void AddArgType(int index, ARG_TYPE type, int objRef, string typeName = null) {
            _args[index] = new Arg(null, type, objRef, typeName);
        }
        public void Deleg() {
            TsCall();
        }
        public void Deleg(object arg) {
            AddArgs(arg, null, null, null);
            TsCall();
        }
        public void Deleg(object arg1, object arg2) {
            AddArgs(arg1, arg2, null, null);
            TsCall();
        }
        public void Deleg(object arg1, object arg2, object arg3) {
            AddArgs(arg1, arg2, arg3, null);
            TsCall();
        }
        public void Deleg(object arg1, object arg2, object arg3, object arg4) {
            AddArgs(arg1, arg2, arg3, arg4);
            TsCall();
        }
        private void AddArgs(object arg1, object arg2, object arg3, object arg4) {
            if (arg1 != null) _args[0].arg = arg1;
            if (arg2 != null) _args[1].arg = arg2;
            if (arg3 != null) _args[2].arg = arg3;
            if (arg4 != null) _args[3].arg = arg4;
        }
        private void TsCall() {
            IntPtr ctx = _context.ptr;
            Native.duv_push_ref(ctx, _funref);
            if (Native.duk_is_function(ctx, -1) != 1) {
                Native.duk_pop(ctx);
                return;
            }

            FillCallArgs(ctx);

            if (Native.duk_pcall(ctx, _args.Length) != 0) {
                BugReport.Report("Error: " + Native.duk_safe_to_string(ctx, -1));
                Native.duk_pop(ctx); // pop error
                return;
            }

            Native.duk_pop(ctx); // pop result
            return;
        }
        private void FillCallArgs(IntPtr ctx) {
            foreach ( Arg a in _args){
                Type t = a.arg.GetType();
                if (a.type == ARG_TYPE.OBJECT) {
                    Native.duv_push_ref(ctx, a.iref);
                    Bind.PushDynCsObject(ctx, a.arg, -1);
                    Native.duk_remove(ctx, -2);
                }
                else if (a.type == ARG_TYPE.CSOBJECT) {
                    Bind.PushCsObject(ctx, a.arg, a.typeName);
                }
                else if (t.IsEnum || t.Name == "Int32") {
                    Uts.Native.duk_push_int(ctx, Convert.ToInt32(a.arg));
                }
                else if (t.Name == "UInt32") {
                    Uts.Native.duk_push_uint(ctx, Convert.ToUInt32(a.arg));
                }
                else if (t.Name == "Float" || t.Name == "Double") {
                    Uts.Native.duk_push_number(ctx, Convert.ToDouble(a.arg));
                }
                else if (t.Name == "Boolean") {
                    Uts.Native.duk_push_boolean(ctx, Convert.ToBoolean(a.arg) ? 1 : 0);
                }
                else if (t.Name == "String") {
                    Uts.Native.duk_push_string(ctx, Convert.ToString(a.arg));
                }
                else {
                    Uts.Native.duk_push_undefined(ctx);
                }
            }
        }
        ~TsDelegate() {
			Dispose(false);
		}
		public void Dispose() {
			Dispose(true);
			GC.SuppressFinalize(this);
		}
        public virtual void Dispose(bool disposing) {
            if (!_unrefed) {
                UnRefFunPtr();
                UnRefFunArgs();
                _unrefed = true;
			}
		}
        private void UnRefFunPtr() {
            if (_context.ptr == IntPtr.Zero) return;
            Native.duv_unref(_context.ptr, _funref);
        }
        private void UnRefFunArgs() {
            if (_context.ptr == IntPtr.Zero) return;
            foreach (Arg a in _args) {
                if (a.type == ARG_TYPE.OBJECT) {
                    Native.duv_unref(_context.ptr, a.iref);
                }
            }
        }
    }

    public class BindObjectsMgr {
        public class ObjectDynInfo {
            public object obj;
            public Dictionary<string, MethodInfo> mems;
            public ObjectDynInfo(object obj) {
                this.obj = obj;
                this.mems = new Dictionary<string, MethodInfo>();
            }
        }
        
        private static Dictionary<IntPtr, object> _tsMapCs = new Dictionary<IntPtr, object>();
        private static Dictionary<object, IntPtr> _csMapTs = new Dictionary<object, IntPtr>();

        public static object GetCsObject(IntPtr ptr) {
            object csObject;
            if (_tsMapCs.TryGetValue(ptr, out csObject)) {
                return csObject;
            }
            return null;
        }

        public static IntPtr GetTsObjectPtr(object csObject) {
            IntPtr tsObjectPtr;
            if (_csMapTs.TryGetValue(csObject, out tsObjectPtr)) {
                return tsObjectPtr;
            }
            return IntPtr.Zero;
        }

        public static void Bind(IntPtr tsObjectPtr, object csObject) {
            _tsMapCs[tsObjectPtr] = csObject;
            _csMapTs[csObject] = tsObjectPtr;
        }

        [InvokeCallback(typeof(cs_function))]
        public static int ctor(IntPtr ctx) {
            return 0;
        }

        [InvokeCallback(typeof(cs_function))]
        public static int dtor(IntPtr ctx) {
            IntPtr ptr = Native.duk_to_pointer(ctx, -1);
            object csObject = GetCsObject(ptr);
            if (csObject != null){
                _tsMapCs.Remove(ptr);
                _csMapTs.Remove(csObject);
            }
            return 0;
        }

        public static void RemoveByCsObject(object csObject) {
            IntPtr ptr = GetTsObjectPtr(csObject);
            if (ptr != IntPtr.Zero) {
                _tsMapCs.Remove(ptr);
                _csMapTs.Remove(csObject);
            }
        }
    }

	public class Bind {
        private static Stack<string> _moduleStack = new Stack<string>();
        private static string _className = "";

		public static void RegGlobalCsFunction(IntPtr ctx, string func_name, cs_function funcs, int nargs=0){
			string[] paths = func_name.Split('.');
			if (paths.Length == 1) {
				Native.duk_push_global_object (ctx);
				Native.duk_push_cs_function (ctx, funcs, nargs);
				Native.duk_put_prop_string (ctx, -2, func_name);
				Native.duk_pop (ctx);
			} 
            else {
				for ( int i=0; i<paths.Length-1; i++ ) { // walk to modules tail like: xxx.xxx
					string module = paths[i];
					RegModuleBegin(ctx, module);
				}
				string name = paths[paths.Length-1];
				RegCsFunction(ctx, name, funcs, nargs);
				for ( int i=0; i<paths.Length-1; i++ ) {// pop modules stack
					RegModuleEnd(ctx);
				}
			}
		}
		
		public static void RegModuleBegin(IntPtr ctx, string moduleName){
			if (_moduleStack.Count == 0) {
				Native.duk_push_global_object (ctx);
			}

			if ( Native.duk_get_prop_string(ctx, -1, moduleName) == 1 ) {
				_moduleStack.Push (moduleName);
			} 
            else {
				Native.duk_pop(ctx); // pop undefined return value
				Native.duk_push_object (ctx);
				_moduleStack.Push (moduleName);
			}
		}

		public static void RegCsFunction(IntPtr ctx, string func_name, cs_function funcs, int nargs=0){
			Native.duk_push_cs_function (ctx, funcs, nargs);
			Native.duk_put_prop_string (ctx, -2, func_name);
		}

        public static void RegStaticCsFunction(IntPtr ctx, string func_name, cs_function funcs, int nargs = 0) {
            Native.duk_push_cs_function(ctx, funcs, nargs);
            Native.duk_put_prop_string(ctx, -3, func_name);
        }

		public static void RegModuleEnd(IntPtr ctx){
			string moduleName = _moduleStack.Pop ();
			Native.duk_put_prop_string (ctx, -2, moduleName);

			if (_moduleStack.Count == 0) {//pop global object
				Native.duk_pop(ctx);
			}
		}

        public static void RegClassStart(IntPtr ctx, string name, string baseName="", cs_function ctor = null, int nargs = 0)
        {
            _className = name;
            if (_moduleStack.Count == 0) {
                Native.duk_push_global_object(ctx);
            }

            RegClassType(ctx, name, baseName, ctor, nargs);
        }

        public static void RegClassEnd(IntPtr ctx) {
            //stack: parentmodule, class type, proto object
            Native.duk_set_prototype(ctx, -2);  // stack: parentmodule, class type
                                                // class ->proto = proto object
            Native.duk_get_prototype(ctx, -1); //stack: parentmodule, class type, proto object
            Native.duk_put_prop_string(ctx, -2, "prototype"); //stack: parentmodule, class type
            Native.duk_put_prop_string(ctx, -2, _className); // stack: parentmodule
            if (_moduleStack.Count == 0) {
                Native.duk_pop(ctx); // pop global
            }
        }

        private static void RegClassType(IntPtr ctx, string name, string baseName, cs_function ctor, int nargs) {
            Native.duk_get_prop_string(ctx, -1, name); // stack: parentmodule, classtype/undefined
            if (Native.duk_is_undefined(ctx, -1) == 1) {
                Native.duk_pop(ctx); // pop undefined value, stack: parentmodule

                // create class type object {...}
                Native.duk_push_cs_function(ctx, (ctor != null) ? ctor : BindObjectsMgr.ctor, nargs); // stack: parentmodule, class type

                // create  proto
                Native.duk_push_object(ctx);// stack: parentmodule, class type, proto object
                Native.duk_push_cs_function(ctx, BindObjectsMgr.dtor, 1 /*nargs*/);// stack: parentmodule, class type, proto object, finalizer fun
                Native.duk_set_finalizer(ctx, -2); // stack: parentmodule, class type, proto object
                
                Native.duk_get_prototype(ctx, -2); // stack: parentmodule, class type, proto object, class type default proto object
                Native.duk_get_prop_string(ctx, -1, "call");// stack: parentmodule, class type, proto object, class type default proto object, call fun
                Native.duk_put_prop_string(ctx, -3, "call");// stack: parentmodule, class type, proto object, class type default proto object
                Native.duk_get_prop_string(ctx, -1, "apply");// stack: parentmodule, class type, proto object, class type default proto object, call fun
                Native.duk_put_prop_string(ctx, -3, "apply");// stack: parentmodule, class type, proto object, class type default proto object
                Native.duk_pop(ctx);// stack: parentmodule, class type, proto object
                
                // attach base proto object to current class proto object
                // stack: parentmodule, class type, proto object
                if (baseName != "") {
                    Native.duk_get_prop_string(ctx, -3, baseName);
                    if (Native.duk_is_object(ctx, -1) == 0) {// stack: stack: parentmodule, class type, proto object, base type/undefine
                        Native.duk_pop(ctx); // stack: stack: parentmodule, class type, proto object
                        PushProtoType(ctx, baseName); // stack: stack: parentmodule, class type, proto object, base type/undefine
                        if (Native.duk_is_object(ctx, -1) == 0) {
                            Native.duk_pop_n(ctx, 4);// pop undefined value, proto object, class object, parentmodule object
                            throw new Exception("Error: regist class " + name + " failed! Not find base class " + baseName + ".");
                        }
                    }

                    // stack: stack: parentmodule, class type, proto object, base type
                    Native.duk_get_prototype(ctx, -1); // stack: stack: parentmodule, class type, proto object, base type, base proto object
                    Native.duk_set_prototype(ctx, -3); // stack: stack: parentmodule, class type, proto object, base type
                                                       // proto object -> proto = base proto object
                    Native.duk_pop(ctx); // stack: stack: parentmodule, class type, proto object
                }
            }
            else {
                Native.duk_get_prototype(ctx, -1); // stack: stack: parentmodule, class type, proto object
            }
        }

        public static Object RequireThis(IntPtr ctx){
            Native.duk_push_this(ctx);
            IntPtr ptr = Native.duk_get_heapptr(ctx, -1);
            Native.duk_pop(ctx);
            return BindObjectsMgr.GetCsObject(ptr);
        }

        public static void PushProtoType(IntPtr ctx, string type) {
            string[] paths = type.Split('.');
            if (paths.Length == 1) {
                Native.duk_push_global_object(ctx); // stack : global
                Native.duk_get_prop_string(ctx, -1, type); // stack: global, class type
                IntPtr ptr = Native.duk_get_heapptr(ctx, -1);
                Native.duk_pop_n(ctx, 2); // stack : empty
                Native.duk_push_heapptr(ctx, ptr); // stack : class type
            }
            else {
                Native.duk_push_global_object(ctx); // stack : global
                for (int i = 0; i < paths.Length - 1; i++) { // walk to modules tail like: xxx.xxx
                    string module = paths[i];
                    Native.duk_get_prop_string(ctx, -1, module); // stack: parent module, current module/undefined
                    if (Native.duk_is_undefined(ctx, -1) == 1) {
                        IntPtr uptr = Native.duk_get_heapptr(ctx, -1); // stack: global, ... parent module, undefined
                        Native.duk_pop_n(ctx, i+1); //pop modules
                        Native.duk_pop(ctx); // pop global object, stack : empty
                        Native.duk_push_heapptr(ctx, uptr); // stack : undefined
                        return;
                    }
                }

                string typename = paths[paths.Length - 1];

                // stack : parentmodule
                Native.duk_get_prop_string(ctx, -1, typename); // stack: parentmodule, class type
                IntPtr ptr = Native.duk_get_heapptr(ctx, -1);
                Native.duk_pop(ctx); // stack: parentmodule

                Native.duk_pop_n(ctx, paths.Length - 1); //pop modules,  stack: global
                Native.duk_pop(ctx); // pop global object, stack : empty

                Native.duk_push_heapptr(ctx, ptr); // stack : class type
            }
        }

        public static void PushCsObject(IntPtr ctx, object csObject, string typeName)
         {
            IntPtr ptr = BindObjectsMgr.GetTsObjectPtr(csObject);
            if (ptr == IntPtr.Zero) {
                Native.duk_push_object(ctx); // stack : object

                PushProtoType(ctx, typeName); // stack : object, protoType
                Native.duk_set_prototype(ctx, -2); // stack : object

                SetFinalizer(ctx);

                ptr = Native.duk_get_heapptr(ctx, -1);
                BindObjectsMgr.Bind(ptr, csObject);
            }
            else {
                Native.duk_push_heapptr(ctx, ptr);
            }
        }

        public static void PushDynCsObject(IntPtr ctx, object csObject, int tsTypeInStackPos) {
            IntPtr ptr = BindObjectsMgr.GetTsObjectPtr(csObject);
            if (ptr == IntPtr.Zero) {
                Uts.Native.duk_dup(ctx, tsTypeInStackPos); // stack: type clor
                Uts.Native.duk_push_boolean(ctx, 0); // not create cs class object, stack: type clor, isCreate(false)
                Uts.Native.duk_new(ctx, 1); // stack: object
                SetFinalizer(ctx);
                ptr = Native.duk_get_heapptr(ctx, -1);
                BindObjectsMgr.Bind(ptr, csObject);
            }
            else {
                Native.duk_push_heapptr(ctx, ptr);
            }
        }

        private static void SetFinalizer(IntPtr ctx) {
            Native.duk_get_finalizer(ctx, -1);
            if (Native.duk_is_undefined(ctx, -1) == 1) {
                Native.duk_pop(ctx);
                Native.duk_push_cs_function(ctx, BindObjectsMgr.dtor, 1 /*nargs*/);
                Native.duk_set_finalizer(ctx, -2);
            }
            else {
                Native.duk_pop(ctx);
            }
        }
	}
}
