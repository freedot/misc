
// The following ifdef block is the standard way of creating macros which make exporting 
// from a DLL simpler. All files within this DLL are compiled with the DYNALLOC_EXPORTS
// symbol defined on the command line. this symbol should not be defined on any project
// that uses this DLL. This way any other project whose source files include this file see 
// DYNALLOC_API functions as being imported from a DLL, wheras this DLL sees symbols
// defined with this macro as being exported.
#ifdef DYNALLOC_EXPORTS
#define DYNALLOC_API __declspec(dllexport)
#else
#define DYNALLOC_API __declspec(dllimport)
#endif

// This class is exported from the DynAlloc.dll
class DYNALLOC_API CDynAlloc {
public:
	CDynAlloc(void);
	// TODO: add your methods here.
};

extern DYNALLOC_API int nDynAlloc;

extern DYNALLOC_API int fnDynAlloc(void);

extern "C" DYNALLOC_API void *ll_aabbcc (void *ud, void *ptr, size_t osize, size_t nsize);

