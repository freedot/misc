#ifndef _SAFEFUN_H_
#define _SAFEFUN_H_
#include "platform.h"
#include <stdarg.h>
#include <stdio.h>
#include <buffer.h>

inline bool HasLongLongFmt(const char* fmt){
	return strstr(fmt, "%I64") != NULL;
}

inline const char* ConvertToLinuxLongLongFmt(const char* fmt){
	static Buffer<char> s_fmt;
	s_fmt.Recount(strlen(fmt)+1);
	char* newfmt = s_fmt.GetBuffer();
	const char* src = fmt;
	char* des = newfmt;
	while ( *src != '\0' ){
		if ( *src == '%' && *(src+1) == 'I' && *(src+2) == '6' && *(src+3) == '4' ){
			*(des++) = '%';
			*(des++) = 'l';
			*(des++) = 'l';
			src += 4;
		}
		else {
			*(des++) = *(src++);
		}
	}
	*(des++) = '\0';

	return newfmt;
}

inline int SafeSprintf(char* pszBuf, int iBufTotalSize, const char* pszFmt,
		...) {
	if (IsLinux() && HasLongLongFmt(pszFmt) ){
		pszFmt = ConvertToLinuxLongLongFmt(pszFmt);
	}
	va_list argptr;
	va_start( argptr, pszFmt);
	int iRt = vsnprintf(pszBuf, iBufTotalSize, pszFmt, argptr);
	va_end( argptr);
	pszBuf[iBufTotalSize - 1] = '\0';
	return iRt;
}

inline char* SafeStrCpy(char* pszDest, const char* pszSrc, int iDestTotalSize) {
	if (pszDest != NULL && pszSrc != NULL && pszDest != pszSrc
			&& iDestTotalSize > 0) {
		strncpy(pszDest, pszSrc, iDestTotalSize);
		pszDest[iDestTotalSize - 1] = '\0';
	}
	return pszDest;
}

inline char* SafeStrCat(char* pszDest, const char* pszSrc, int iDestTotalSize) {
	if (pszDest != NULL && pszSrc != NULL && iDestTotalSize > 0) {
		int iPrivateCatLen = iDestTotalSize - strlen(pszDest) - 1;
		if (iPrivateCatLen > 0) {
			strncat(pszDest, pszSrc, iPrivateCatLen);
			pszDest[iDestTotalSize - 1] = '\0';
		}
	}
	return pszDest;
}

inline int SafeAsciToInt(const char* lpszVal) {
	int iRt = 0;
	if (lpszVal) {
		int iLen = strlen(lpszVal);
		int iDes = 10;
		int iStart = 0;
		if (iLen > 1 && lpszVal[0] == 'H') {
			iStart = 1;
			iDes = 16;
		}

		if (iLen > 2 && lpszVal[0] == '0'
				&& (lpszVal[1] == 'x' || lpszVal[1] == 'X')) {
			iStart = 2;
			iDes = 16;
		}

		char c = 0;
		for (int i = iStart; i < iLen; ++i) {
			c = *(lpszVal + i);
			if (c >= '0' && c <= '9') {
				iRt = iRt * iDes + (c - '0');
			} else {
				if (iDes == 16) {
					if (c >= 'a' && c <= 'f') {
						iRt = iRt * iDes + (c - 'a' + 10);
					} else if (c >= 'A' && c <= 'F') {
						iRt = iRt * iDes + (c - 'A' + 10);
					} else {
						break;
					}
				} else {
					break;
				}
			}
		}
	}

	return iRt;
}

inline uint32 SafeAsciToULong(const char* lpszVal) {
	uint32 ulRt = 0;
	if (lpszVal) {
		int iLen = strlen(lpszVal);
		int iDes = 10;
		int iStart = 0;
		if (iLen > 1 && lpszVal[0] == 'H') {
			iStart = 1;
			iDes = 16;
		}

		if (iLen > 2 && lpszVal[0] == '0'
				&& (lpszVal[1] == 'x' || lpszVal[1] == 'X')) {
			iStart = 2;
			iDes = 16;
		}

		char c = 0;
		for (int i = iStart; i < iLen; ++i) {
			c = *(lpszVal + i);
			if (c >= '0' && c <= '9') {
				ulRt = ulRt * iDes + (c - '0');
			} else {
				if (iDes == 16) {
					if (c >= 'a' && c <= 'f') {
						ulRt = ulRt * iDes + (c - 'a' + 10);
					} else if (c >= 'A' && c <= 'F') {
						ulRt = ulRt * iDes + (c - 'A' + 10);
					} else {
						break;
					}
				} else {
					break;
				}
			}
		}
	}

	return ulRt;
}

inline TQGUID SafeAsciToUUID(const char* lpszVal) {
	TQGUID IGUID;
	memset(&IGUID, 0, sizeof(TQGUID));
	if (lpszVal && strlen(lpszVal) >= 36) {
		char* lpszValBegin = const_cast<char*>(lpszVal);
		if (lpszValBegin[0] == '{') {
			if (lpszValBegin[strlen(lpszValBegin) - 1] != '}') {
				return IGUID;
			}
			lpszValBegin[strlen(lpszValBegin) - 1] = '\0';
			++lpszValBegin;
		}

		int iIndex = 0;
		char* lpszToken = strtok(lpszValBegin, "-");
		char szBuf[32];
		while (lpszToken) {
			SafeSprintf(szBuf, sizeof(szBuf), "0x%s", lpszToken);
			if (iIndex == 0) {
				if (strlen(lpszToken) != 8) {
					break;
				}

				IGUID.Data1 = (unsigned int) (SafeAsciToInt(szBuf));
			} else if (iIndex == 1) {
				if (strlen(lpszToken) != 4) {
					break;
				}

				IGUID.Data2 = (unsigned short) (SafeAsciToInt(szBuf));
			} else if (iIndex == 2) {
				if (strlen(lpszToken) != 4) {
					break;
				}

				IGUID.Data3 = (unsigned short) (SafeAsciToInt(szBuf));
			} else if (iIndex == 3) {
				if (strlen(lpszToken) != 4) {
					break;
				}

				for (int i = 0; i < 2; ++i) {
					szBuf[0] = '0';
					szBuf[1] = 'x';
					szBuf[2] = lpszToken[2 * i + 0];
					szBuf[3] = lpszToken[2 * i + 1];
					szBuf[4] = '\0';
					IGUID.Data4[i] = (unsigned char) (SafeAsciToInt(szBuf));
				}
			} else if (iIndex == 4) {
				if (strlen(lpszToken) != 12) {
					break;
				}

				for (int i = 0; i < 6; ++i) {
					szBuf[0] = '0';
					szBuf[1] = 'x';
					szBuf[2] = lpszToken[2 * i + 0];
					szBuf[3] = lpszToken[2 * i + 1];
					szBuf[4] = '\0';
					IGUID.Data4[i + 2] = (unsigned char) (SafeAsciToInt(szBuf));
				}

				break;
			}

			lpszToken = strtok(NULL, "-");
			++iIndex;
		}
	}

	return IGUID;
}

inline uint64 SafeAsciToUInt64(const char* lpszVal) {
	uint64 uiRt = 0;
	if (lpszVal) {
		int iLen = strlen(lpszVal);
		int iDes = 10;
		int iStart = 0;
		if (iLen > 1 && lpszVal[0] == 'H') {
			iStart = 1;
			iDes = 16;
		}

		if (iLen > 2 && lpszVal[0] == '0'
				&& (lpszVal[1] == 'x' || lpszVal[1] == 'X')) {
			iStart = 2;
			iDes = 16;
		}

		char c = 0;
		for (int i = iStart; i < iLen; ++i) {
			c = *(lpszVal + i);
			if (c >= '0' && c <= '9') {
				uiRt = uiRt * iDes + (c - '0');
			} else {
				if (iDes == 16) {
					if (c >= 'a' && c <= 'f') {
						uiRt = uiRt * iDes + (c - 'a' + 10);
					} else if (c >= 'A' && c <= 'F') {
						uiRt = uiRt * iDes + (c - 'A' + 10);
					} else {
						break;
					}
				} else {
					break;
				}
			}
		}
	}

	return uiRt;
}

#ifndef SafeDelete
#define SafeDelete(p) { if(p) { delete(p); (p)=NULL; } }
#endif // SafeDelete
#ifndef SafeDeleteArray
#define SafeDeleteArray(p) { if(p) { delete[] (p); (p)=NULL; } }
#endif // SafeDeleteArray
#ifndef SafeDecRef
#define SafeDecRef(p) { if(p) { p##->DecRefCount(); (p)=NULL;} }
#endif // SafeDecRef
#ifndef SafeIncRef
#define SafeIncRef(p) { if(p) { p##->IncRefCount(); } }
#endif // SafeIncRef
#ifndef SafeNew
#define SafeNew(p, P) { if(p) { p = new P; } }
#endif

#ifndef SafeRelease
#define SafeRelease(p) { if(p) { p##->Release(); (p)=NULL;} }
#endif // SafeRelease
#ifndef SafeAddRef
#define SafeAddRef(p) { if(p) { p##->AddRef(); } }
#endif // SafeAddRef

inline int ALIGNMEMPAGESIZE(int iLen) {
	return (iLen + 4095) / 4096 * 4096;
}

#endif // _SAFEFUN_H_
