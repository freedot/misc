using System;
using System.Runtime.InteropServices;
using System.Text;
using UnityEngine;

namespace Uts {
	#pragma warning disable 414
	public class InvokeCallback : System.Attribute {
		private Type type;
		public InvokeCallback(Type t) {	type = t; }
	}
	#pragma warning restore 414

	#if UNITY_EDITOR_WIN || UNITY_STANDALONE_WIN
	 [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
	 public delegate int cs_function(IntPtr luaState);
	#else
	 public delegate int cs_function(IntPtr luaState);
	#endif

    enum DUK_TYPE {
         NONE = 0,
         UNDEFINED = 1,
         NULL = 2,
         BOOLEAN = 3,
         NUMBER = 4,
         STRING = 5,
         OBJECT = 6,
         BUFFER = 7,
         POINTER = 8,
         LIGHTFUNC = 9
    }

    enum DUK_RET {
        THROW = -1000000,
    }
	
	public class Native {
		#if UNITY_IPHONE && !UNITY_EDITOR
		 const string UTS_DLL = "__Internal";
		#else
		 const string UTS_DLL = "uts";
		#endif

		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		private static extern IntPtr duk_safe_to_string_u(IntPtr ctx, int index);

		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		private static extern IntPtr duk_require_string(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_require_heapptr(IntPtr ctx, int index);

		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		private static extern int duk_push_c_function(IntPtr ctx, IntPtr funcs_ptr, int nargs);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_push_string(IntPtr ctx, string str);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_push_lstring(IntPtr ctx, byte [] str, int len);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr uts_push_lstring_d(IntPtr ctx, byte[] str, int len);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_to_buffer_u(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_load_function(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_error_u(IntPtr ctx, int error_code, string error);
		
		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern IntPtr duk_create_heap_default_u();
		
		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern int duk_peval_file_u(IntPtr ctx, string path);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_peval_lstring_u(IntPtr ctx, byte[] path, int length);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_pcompile_lstring_filename_u(IntPtr ctx, int flags, byte[] path, int length);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern void duk_pop(IntPtr ctx);
		
		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern void duk_destroy_heap(IntPtr ctx);

		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern void duk_push_global_object(IntPtr ctx);

		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern int duk_get_prop_string(IntPtr ctx, int obj_index, string key);

		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern int duk_pcall(IntPtr ctx, int nargs);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_call(IntPtr ctx, int nargs);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_del_prop(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern int duk_put_prop_string(IntPtr ctx, int obj_index, string key);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uts_push_heap_stash(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int uts_push_array(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_put_prop_index(IntPtr ctx, int obj_index, int arr_index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_get_prop_index(IntPtr ctx, int obj_index, int arr_index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_del_prop_string(IntPtr ctx, int obj_index, string arr_index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_del_prop_index(IntPtr ctx, int obj_index, int arr_index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern int duk_push_object(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_concat(IntPtr ctx, int count);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern int duk_get_top(IntPtr ctx);

		[DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
		public static extern int duk_get_top_index(IntPtr ctx);
        
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_set_prototype(IntPtr ctx, int obj_index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_push_this(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_require_pointer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_pop_n(IntPtr ctx, int count);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_get_heapptr(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_push_pointer(IntPtr ctx, IntPtr p);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_push_heapptr(IntPtr ctx, IntPtr p);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_set_finalizer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_get_finalizer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr duk_to_pointer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_get_prototype(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_eval_string_u(IntPtr ctx, string s);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_require_int(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_array(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_boolean(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_bound_function(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_buffer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_c_function(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_function(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_dynamic_buffer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_ecmascript_function(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_error(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_fixed_buffer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_lightfunc(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_nan(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_null(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_null_or_undefined(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_number(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_object(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_object_coercible(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_pointer(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_primitive(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_strict_call(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_string(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_thread(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_undefined(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_is_valid_index(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_push_int(IntPtr ctx, int val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_dup(IntPtr ctx, int from_index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_new(IntPtr ctx, int nargs);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_push_boolean(IntPtr ctx, int val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_get_type(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_throw(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duk_push_error_object_u(IntPtr ctx, int err_code, string error);

        
        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duv_ref_setup(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern int duv_ref(IntPtr ctx);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duv_push_ref(IntPtr ctx, int iref);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duv_unref(IntPtr ctx, int iref);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_remove(IntPtr ctx, int index);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_push_number(IntPtr ctx, double val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_push_uint(IntPtr ctx, UInt32 val);

        [DllImport(UTS_DLL, CallingConvention = CallingConvention.Cdecl)]
        public static extern void duk_push_undefined(IntPtr ctx);



		public static string duk_safe_to_string(IntPtr ctx, int index){
			IntPtr p = duk_safe_to_string_u(ctx, index);
			return Marshal.PtrToStringAnsi(p);
		}

		public static string duk_require_string_s(IntPtr ctx, int index){
			IntPtr p = duk_require_string(ctx, index);
			return Marshal.PtrToStringAnsi(p);
		}

		public static int duk_push_cs_function(IntPtr ctx, cs_function funcs, int nargs){
			IntPtr funcs_ptr = Marshal.GetFunctionPointerForDelegate(funcs);
			return duk_push_c_function(ctx, funcs_ptr, nargs);
		}

        public static IntPtr duk_require_this(IntPtr ctx) {
            duk_push_this(ctx); // stack: object
            IntPtr ptr = duk_get_heapptr(ctx, -1); // stack: object
            duk_pop(ctx);
            return ptr;
        }

        public static int duk_throw_error(IntPtr ctx, string error) {
            duk_push_string(ctx, error);
            return (int)DUK_RET.THROW;
        }
    }
}
