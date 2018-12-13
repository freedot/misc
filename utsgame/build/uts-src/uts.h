#ifndef UTS_H_INCLUDED
#define UTS_H_INCLUDED
#include "duk.h"

DUK_EXTERNAL_DECL duk_context * duk_create_heap_default_u();
DUK_EXTERNAL_DECL duk_ret_t duk_peval_file_u(duk_context *ctx, const char *path);
DUK_EXTERNAL_DECL const char * duk_safe_to_string_u(duk_context *ctx, duk_idx_t index);
DUK_EXTERNAL_DECL void duk_error_u(duk_context *ctx, int err_code, const char *error);
DUK_EXTERNAL_DECL void duk_eval_string_u(duk_context *ctx, const char *src);
DUK_EXTERNAL_DECL duk_idx_t duk_push_error_object_u(duk_context *ctx, int err_code, const char *error);
DUK_EXTERNAL_DECL duk_int_t duk_peval_lstring_u(duk_context *ctx, const char *src_buffer, duk_size_t src_length);
DUK_EXTERNAL_DECL duk_int_t duk_pcompile_lstring_filename_u(duk_context *ctx, duk_uint_t flags, const char *src_buffer, duk_size_t src_length);
DUK_EXTERNAL_DECL void* duk_to_buffer_u(duk_context *ctx, duk_idx_t index);
DUK_EXTERNAL_DECL void uts_push_heap_stash(duk_context *ctx);
DUK_EXTERNAL_DECL duk_idx_t uts_push_array(duk_context *ctx);
DUK_EXTERNAL_DECL const char *uts_push_lstring_d(duk_context *ctx, const char *str, duk_size_t len);
#endif // UTS_H_INCLUDED