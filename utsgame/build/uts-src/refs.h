/* https://github.com/creationix/dukluv/blob/master/src/refs.h */
#ifndef DUV_REFS_H
#define DUV_REFS_H

#include "duk.h"

/* Create a global array refs in the heap stash. */
DUK_EXTERNAL_DECL void duv_ref_setup(duk_context *ctx);
/* like luaL_ref, but assumes storage in "refs" property of heap stash */
DUK_EXTERNAL_DECL int duv_ref(duk_context *ctx);
DUK_EXTERNAL_DECL void duv_push_ref(duk_context *ctx, int ref);
DUK_EXTERNAL_DECL void duv_unref(duk_context *ctx, int ref);

#endif