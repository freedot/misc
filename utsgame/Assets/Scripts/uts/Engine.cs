using System;
using System.Runtime.InteropServices;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace Uts {
    public delegate void deleg_bug_report(string msg);
    public delegate void deleg_log(string msg);
    public delegate byte[] deleg_readscript(string path);

    public class Context {
        private IntPtr _ctx;
        private object _engine;
        public Context(IntPtr ctx, object engine) {
            _ctx = ctx;
            _engine = engine;
        }
        public IntPtr ptr{
            get { return _ctx; }
            set { _ctx = value; }
        }
        public bool IsSameEngine(object engine) {
            return ReferenceEquals(_engine, engine);
        }
    }

    public class Engine : IDisposable
    {
        static private string _ext = "";
        static private string _workSpace = "";
        static private deleg_readscript _readScript = null;
        static private deleg_bug_report _bugReport = null;
        static private deleg_log _log = null;
        static private deleg_log _logWarning = null;
        static private deleg_log _logError = null;
        static private Dictionary<IntPtr, Context> _contexts = new Dictionary<IntPtr, Context>();

        class InnerFuncs {
            static private int _moduleLevel = 0;

            [InvokeCallback(typeof(cs_function))]
            static private int inner_bugReport(IntPtr ctx) {
                try {
                    string msg = Native.duk_require_string_s(ctx, 0);
                    _bugReport(msg);
                    return 0;
                }
                catch (Exception e) {
                    return Uts.Native.duk_throw_error(ctx, e.ToString());
                }
            }

            [InvokeCallback(typeof(cs_function))]
            static private int inner_log(IntPtr ctx) {
                try {
                    string msg = Native.duk_require_string_s(ctx, 0);
                    _log(msg);
                    return 0;
                }
                catch (Exception e) {
                    return Uts.Native.duk_throw_error(ctx, e.ToString());
                }
            }

            [InvokeCallback(typeof(cs_function))]
            static private int inner_logWarning(IntPtr ctx) {
                try {
                    string msg = Native.duk_require_string_s(ctx, 0);
                    _logWarning(msg);
                    return 0;
                }
                catch (Exception e) {
                    return Uts.Native.duk_throw_error(ctx, e.ToString());
                }
            }

            [InvokeCallback(typeof(cs_function))]
            static private int inner_logError(IntPtr ctx) {
                try {
                    string msg = Native.duk_require_string_s(ctx, 0);
                    _logError(msg);
                    return 0;
                }
                catch (Exception e) {
                    return Uts.Native.duk_throw_error(ctx, e.ToString());
                }
            }

            [InvokeCallback(typeof(cs_function))]
            static private int inner_read_file(IntPtr ctx) {
                try {
                    string path = Native.duk_require_string_s(ctx, 0);
                    if ( !File.Exists(path) ) {
                        return 0;
                    }
                    string content = File.ReadAllText(path);
                    Native.duk_push_string(ctx, content);
                    return 1;
                }
                catch (Exception e) {
                    return Uts.Native.duk_throw_error(ctx, e.ToString());
                }
            }

            [InvokeCallback(typeof(cs_function))]
            static private int inner_workSpace(IntPtr ctx) {
                try {
                    Native.duk_push_string(ctx, _workSpace);
                    return 1;
                }
                catch (Exception e) {
                    return Uts.Native.duk_throw_error(ctx, e.ToString());
                }
            }

            [InvokeCallback(typeof(cs_function))]
            static private int inner_modSearch(IntPtr ctx)
            {
                try
                {
                    string path = Native.duk_require_string_s(ctx, 0);
                    string abpath = _workSpace + path + "." + _ext;
                    byte[] src = _readScript(abpath);
                    if (IsByteCode(src))
                        return inner_modSearch_byteCode(ctx, src);
                    else
                        return inner_modSearch_src(ctx, src);
                }
                catch (Exception e)
                {
                    return Uts.Native.duk_throw_error(ctx, e.ToString());
                }
            }

            static private int inner_modSearch_src(IntPtr ctx, byte[] src)
            {
                Native.duk_push_lstring(ctx, src, src.Length);
                byte[] newline = System.Text.Encoding.ASCII.GetBytes("\n");
                Native.duk_push_lstring(ctx, newline, newline.Length);
                Native.duk_concat(ctx, 2);
                return 1;
            }

            static private int inner_modSearch_byteCode(IntPtr ctx, byte[] src)
            {
                Native.uts_push_lstring_d(ctx, src, src.Length);
                Native.duk_to_buffer_u(ctx, -1);
                Native.duk_load_function(ctx);

                pushModSearchArgs(ctx);
                setModSearchArgs(ctx);

                if (Native.duk_pcall(ctx, 0) != 0)
                {
                    BugReport.Report("Error: " + Native.duk_safe_to_string(ctx, -1));
                }

                Native.duk_pop(ctx); // pop result or error
                popModSearchArgs(ctx);
                setModSearchArgs(ctx);

                return 0;
            }

            static public void createhModSearchArgsStack(IntPtr ctx)
            {
                Native.uts_push_heap_stash(ctx);
                Native.uts_push_array(ctx);
                Native.duk_put_prop_string(ctx, -2, "modSearchArgs");
                Native.duk_pop(ctx);
            }

            static private void pushModSearchArgs(IntPtr ctx)
            {
                Native.uts_push_heap_stash(ctx);
                Native.duk_get_prop_string(ctx, -1, "modSearchArgs");
                Native.duk_remove(ctx, -2);

                if (_moduleLevel == 0)
                {
                    Native.duk_push_global_object(ctx); // stack: modSearchArgs list, global
                    Native.duk_get_prop_string(ctx, -1, "require"); // stack: modSearchArgs list, global, require
                    Native.duk_put_prop_index(ctx, -3, _moduleLevel * 3 + 0);
                    Native.duk_get_prop_string(ctx, -1, "exports"); // stack: modSearchArgs list, global, exports
                    Native.duk_put_prop_index(ctx, -3, _moduleLevel * 3 + 1);
                    Native.duk_get_prop_string(ctx, -1, "module"); // stack: modSearchArgs list, global, module
                    Native.duk_put_prop_index(ctx, -3, _moduleLevel * 3 + 2);  // stack: modSearchArgs list, global
                    Native.duk_pop(ctx);  /* pop global */
                    _moduleLevel++;
                }

                // stack : modSearchArgs list
                Native.duk_dup(ctx, 1); // stack: modSearchArgs list, require
                Native.duk_put_prop_index(ctx, -2, _moduleLevel * 3 + 0);

                Native.duk_dup(ctx, 2); // stack: modSearchArgs list, exports
                Native.duk_put_prop_index(ctx, -2, _moduleLevel * 3 + 1);

                Native.duk_dup(ctx, 3); // stack: modSearchArgs list, module
                Native.duk_put_prop_index(ctx, -2, _moduleLevel * 3 + 2);

                Native.duk_pop(ctx);  /* pop array */

                _moduleLevel++;
            }
            static private void popModSearchArgs(IntPtr ctx)
            {
                _moduleLevel--;
                Native.uts_push_heap_stash(ctx);
                Native.duk_get_prop_string(ctx, -1, "modSearchArgs");
                Native.duk_remove(ctx, -2);

                Native.duk_del_prop_index(ctx, -1, _moduleLevel * 3 + 2);
                Native.duk_del_prop_index(ctx, -1, _moduleLevel * 3 + 1);
                Native.duk_del_prop_index(ctx, -1, _moduleLevel * 3 + 0);

                Native.duk_pop(ctx);  /* pop array */
            }
            static private void setModSearchArgs(IntPtr ctx)
            {
                int level = _moduleLevel - 1;
                if (level < 0)
                    return;

                Native.uts_push_heap_stash(ctx);
                Native.duk_get_prop_string(ctx, -1, "modSearchArgs");
                Native.duk_remove(ctx, -2); // stack: modSearchArgs list

                Native.duk_push_global_object(ctx); // stack: modSearchArgs list, global

                Native.duk_get_prop_index(ctx, -2, level * 3 + 0); // stack: modSearchArgs list, global, require
                Native.duk_put_prop_string(ctx, -2, "require"); // stack: modSearchArgs list, global

                Native.duk_get_prop_index(ctx, -2, level * 3 + 1); // stack: modSearchArgs list, global, exports
                Native.duk_put_prop_string(ctx, -2, "exports"); // stack: modSearchArgs list, global

                Native.duk_get_prop_index(ctx, -2, level * 3 + 2); // stack: modSearchArgs list, global, module
                Native.duk_put_prop_string(ctx, -2, "module"); // stack: modSearchArgs list, global

                Native.duk_pop(ctx); /* pop global */
                Native.duk_pop(ctx); /* pop list */
            }

            static public void Register(IntPtr ctx) {
                Bind.RegGlobalCsFunction(ctx, "Duktape.modSearch", inner_modSearch, 4);
                Bind.RegGlobalCsFunction(ctx, "__bugReport", inner_bugReport, 1);
                Bind.RegGlobalCsFunction(ctx, "__log", inner_log, 1);
                Bind.RegGlobalCsFunction(ctx, "__logWarning", inner_logWarning, 1);
                Bind.RegGlobalCsFunction(ctx, "__logError", inner_logError, 1);
                Bind.RegGlobalCsFunction(ctx, "__read_file", inner_read_file, 1);
                Bind.RegGlobalCsFunction(ctx, "__workSpace", inner_workSpace);
            }
        }

        public static Context GetContent(IntPtr ctx) {
            Context context = null;
            _contexts.TryGetValue(ctx, out context);
            return context;
        }

        private Context _context = null;
        public bool Create(string workSpace, string ext, deleg_readscript readScript, deleg_bug_report bugReport, deleg_log log, deleg_log logWarning, deleg_log logError) {
            _readScript = readScript;
            _workSpace = workSpace;
            _ext = ext;
            _bugReport = bugReport;
            _log = log;
            _logWarning = logWarning;
            _logError = logError;

            IntPtr ctx = Native.duk_create_heap_default_u();
            if (ctx == IntPtr.Zero) {
                _bugReport("Error: create duk heap failed!");
                return false;
            }

            _context  = new Context(ctx, this);
            _contexts[ctx] = _context;

            Native.duv_ref_setup(ctx);
            InnerFuncs.createhModSearchArgsStack(ctx);
            RegisterInnerFunctions();

            return true;
        }

        public Context GetContent() {
            return _context;
        }

        public bool EvalFile(string filename)
        {
            string abpath = _workSpace + filename + "." + _ext;
            byte[] src = _readScript(abpath);
            if (IsByteCode(src))
                return EvalFile_byteCode(src);
            else
                return EvalFile_src(abpath, src);
        }

        public bool EvalFile_byteCode(byte[] src)
        {
            IntPtr ctx = _context.ptr;
            Native.uts_push_lstring_d(ctx, src, src.Length);
            Native.duk_to_buffer_u(ctx, -1);
            Native.duk_load_function(ctx);
            int rt = Native.duk_pcall(ctx, 0);
            if (rt != 0)
                BugReport.Report("Error: " + Native.duk_safe_to_string(ctx, -1));

            Native.duk_pop(ctx); // pop result or error

            return rt == 0;
        }

        public bool EvalFile_src(string abpath, byte [] src)
        {
            IntPtr ctx = _context.ptr;
            Native.duk_push_string(ctx, abpath);
            if (Native.duk_pcompile_lstring_filename_u(ctx, 0, src, src.Length) != 0)
            {
                _bugReport("Error: " + Native.duk_safe_to_string(ctx, -1));
                Native.duk_pop(ctx);
                return false;
            }

            if (Native.duk_pcall(ctx, 0) != 0)
            {
                _bugReport("Error: " + Native.duk_safe_to_string(ctx, -1));
                Native.duk_pop(ctx);
                return false;
            }

            Native.duk_pop(ctx);
            return true;
        }

        ~Engine() {
			Dispose(false);
		}

		public void Dispose() {
			Dispose(true);
			GC.SuppressFinalize(this);
		}

        public virtual void Dispose(bool disposing) {
            Release();
		}

        public void Release() {
            if (_context == null) return;
            if (_context.IsSameEngine(this)) {
                _contexts.Remove(_context.ptr);
                Native.duk_destroy_heap(_context.ptr);
                _context.ptr = IntPtr.Zero;
                _context = null;
            }
        }

        private void RegisterInnerFunctions() {
            InnerFuncs.Register(_context.ptr);
            DynBind.Register(_context.ptr);
        }

        private static bool IsByteCode(byte [] src)
        {
            return (src.Length >= 2) && (src[0] == (byte)0xff);
        }
    }
}
