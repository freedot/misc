#define DUK_COMPILING_DUKTAPE
#include "uts.h"

/* duk_create_heap_default_u */
DUK_EXTERNAL duk_context * duk_create_heap_default_u(){
	return duk_create_heap(NULL, NULL, NULL, NULL, NULL);
}

/* duk_peval_file_u */
DUK_EXTERNAL duk_ret_t duk_peval_file_u(duk_context *ctx, const char *path) {
	duk_push_string_file_raw(ctx, (path), DUK_STRING_PUSH_SAFE);
	duk_push_string(ctx, path);
	return duk_eval_raw(ctx, NULL, 0, DUK_COMPILE_EVAL | DUK_COMPILE_SAFE);
}

/* duk_safe_to_string_u */
DUK_EXTERNAL const char * duk_safe_to_string_u(duk_context *ctx, duk_idx_t index) {
	return duk_safe_to_lstring(ctx, index, NULL);
}

/* duk_error_u */
DUK_EXTERNAL void duk_error_u(duk_context *ctx, int err_code, const char *error) {
	duk_error_raw(ctx, (duk_errcode_t) (err_code), (const char *) (__FILE__), (duk_int_t) (__LINE__), error);
}

/* duk_eval_string_u */
DUK_EXTERNAL void duk_eval_string_u(duk_context *ctx, const char *src) {
	duk_push_string(ctx, (const char *) (__FILE__));
	duk_eval_raw(ctx, src, 0, DUK_COMPILE_EVAL | DUK_COMPILE_NOSOURCE | DUK_COMPILE_STRLEN);
}

DUK_EXTERNAL duk_idx_t duk_push_error_object_u(duk_context *ctx, int err_code, const char *error) {
	return duk_push_error_object(ctx, err_code, error);
}

DUK_EXTERNAL duk_int_t duk_peval_lstring_u(duk_context *ctx, const char *src_buffer, duk_size_t src_length) {
	return duk_peval_lstring(ctx, src_buffer, src_length);
}

DUK_EXTERNAL duk_int_t duk_pcompile_lstring_filename_u(duk_context *ctx, duk_uint_t flags, const char *src_buffer, duk_size_t src_length) {
	return duk_pcompile_lstring_filename(ctx, flags, src_buffer, src_length);
}

DUK_EXTERNAL void* duk_to_buffer_u(duk_context *ctx, duk_idx_t index) {
    return duk_to_buffer(ctx, index, NULL);
}

DUK_EXTERNAL void uts_push_heap_stash(duk_context *ctx) {
    duk_push_heap_stash(ctx);
}

DUK_EXTERNAL duk_idx_t uts_push_array(duk_context *ctx) {
    return duk_push_array(ctx);
}

DUK_EXTERNAL const char *uts_push_lstring_d(duk_context *ctx, const char *rstr, duk_size_t len) {
    const char g_xorpsw[] = {0x40,0x11,0x34,0x68,0x81,0xa1,0x02,0xf1,0xf9,0xbf,0x4b,0x6f,0x74,0x32,0x55,0xaa};
    int passlen;
    int i;
    char *str = (char*)rstr;
    passlen = sizeof(g_xorpsw)/sizeof(g_xorpsw[0]);
    for (i=0; i<len; i++) {
        if (i == 0)  continue;
        str[i] = str[i] ^ g_xorpsw[(i+len)%passlen];
    }
    return duk_push_lstring(ctx, str, len);
}
