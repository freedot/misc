#ifndef _PKGBITS_H_
#define _PKGBITS_H_
#include "commhead.h"

/** 将本结构的数据压缩到BUF中 */

#define E_UINT8(val, needver)\
	assert(sizeof(val)==1);\
	if (iVer>=needver){\
		if ( iPos + (int)sizeof(val) > iOutBufLen ) return -1;\
		*((uchar*)lpOutBuf+iPos) = val; iPos += (int)sizeof(val);\
	}

#define E_INT8(val, needver)\
	assert(sizeof(val)==1);\
	if (iVer>=needver){\
		if ( iPos + (int)sizeof(val) > iOutBufLen ) return -1;\
		*(lpOutBuf+iPos) = val; iPos += (int)sizeof(val);\
	}

#define E_UINT16(val, needver)\
	assert(sizeof(val)==2);\
	if ((uint32)(iVer)>=(uint32)(needver)){\
		if ( (uint32)(iPos + (int)sizeof(val)) > (uint32)(iOutBufLen) ) return -1;\
		unsigned short usval_net_ = htons(val);\
		memcpy(lpOutBuf+iPos, &usval_net_, (int)sizeof(usval_net_)); iPos += (int)sizeof(usval_net_);\
	}

#define E_INT16(val, needver)\
	assert(sizeof(val)==2);\
	if ((uint32)(iVer)>=(uint32)(needver)){\
		if ( iPos + (int)sizeof(val) > iOutBufLen ) return -1;\
		short sval_net_ =(short) htons((ushort)val);\
		memcpy(lpOutBuf+iPos, &sval_net_, (int)sizeof(sval_net_)); iPos += (int)sizeof(sval_net_);\
	}

#define E_UINT32(val, needver)\
	assert(sizeof(val)==4);\
	if (iVer>=needver){\
		if ( iPos + (int)sizeof(val) > iOutBufLen ) return -1;\
		uint32 ulval_net_ = htonl(val);\
		memcpy(lpOutBuf+iPos, &ulval_net_, (int)sizeof(ulval_net_)); iPos += (int)sizeof(ulval_net_);\
	}

#define E_INT32(val, needver)\
	assert(sizeof(val)==4);\
	if (iVer>=needver){\
		if ( iPos + (int)sizeof(val) > iOutBufLen ) return -1;\
		int32 lval_net_ = (int32)htonl((uint32)val);\
		memcpy(lpOutBuf+iPos, &lval_net_, (int)sizeof(lval_net_)); iPos += (int)sizeof(lval_net_);\
	}

#define E_UINT64(val, needver)\
	assert(sizeof(val)==8);\
	if (iVer>=needver){\
		if ( iPos + (int)sizeof(val) > iOutBufLen ) return -1;\
		uint64 ulval_net_ = htonq(val);\
		memcpy(lpOutBuf+iPos, &ulval_net_, (int)sizeof(ulval_net_)); iPos += (int)sizeof(ulval_net_);\
	}

#define E_INT64(val, needver)\
	assert(sizeof(val)==8);\
	if (iVer>=needver){\
		if ( iPos + (int)sizeof(val) > iOutBufLen ) return -1;\
		int64 lval_net_ = (int64)htonq((uint64)val);\
		memcpy(lpOutBuf+iPos, &lval_net_, (int)sizeof(lval_net_)); iPos += (int)sizeof(lval_net_);\
	}

#define E_STRUCT(val, needver)\
	if (iVer>=needver){\
		iPos = val.Encode(lpOutBuf, iOutBufLen, iPos, iVer);\
		if ( iPos < 0 ) { return iPos;}\
	}

#define E_STRING(val, max_count, needver)\
	if (iVer>=needver){\
		int iLen_ = strlen(val);\
		if ( iPos + iLen_ + 2 > iOutBufLen ) return -1;\
		if ( iLen_ >= max_count ) return -2;\
		unsigned short usLen_ = htons((unsigned short )iLen_);\
		memcpy(lpOutBuf+iPos, &usLen_, (int)sizeof(usLen_)); iPos += (int)sizeof(usLen_);\
		if ( iLen_ > 0 ) {\
			memcpy(lpOutBuf+iPos, val, iLen_); iPos += iLen_;\
		}\
	}

#define E_ARRAY_UINT8(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iOutBufLen ) return -1;\
		if ( cur_count > 0 ){\
			memcpy(lpOutBuf+iPos, val, (int)sizeof(val[0])*cur_count);\
			iPos += (int)sizeof(val[0])*cur_count;\
		}\
	}

#define E_ARRAY_INT8(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iOutBufLen ) return -1;\
		if ( cur_count > 0 ){\
			memcpy(lpOutBuf+iPos, val, (int)sizeof(val[0])*cur_count);\
			iPos += (int)sizeof(val[0])*cur_count;\
		}\
	}

#define E_ARRAY_UINT16(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( (uint32)(cur_count) > (uint32)(max_count) ) return -2;\
		if ( (uint32)( iPos + (int)sizeof(val[0])*cur_count ) > (uint32)(iOutBufLen) ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			unsigned short usval_net_ = htons(val[inerIdx]);\
			memcpy(lpOutBuf+iPos, &usval_net_, (int)sizeof(usval_net_));\
			iPos += (int)sizeof(val[0]);\
		}\
	}

#define E_ARRAY_INT16(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iOutBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			short sval_net_ = (short)htons((ushort)val[inerIdx]);\
			memcpy(lpOutBuf+iPos, &sval_net_, (int)sizeof(sval_net_));\
			iPos += (int)sizeof(val[0]);\
		}\
	}
	
#define E_ARRAY_UINT32(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iOutBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			uint32 ulval_net_ = htonl(val[inerIdx]);\
			memcpy(lpOutBuf+iPos, &ulval_net_, (int)sizeof(ulval_net_));\
			iPos += (int)sizeof(val[0]);\
		}\
	}

#define E_ARRAY_INT32(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iOutBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			int32 lval_net_ = (int32)htonl((uint32)val[inerIdx]);\
			memcpy(lpOutBuf+iPos, &lval_net_, (int)sizeof(lval_net_));\
			iPos += (int)sizeof(val[0]);\
		}\
	}
	
#define E_ARRAY_UINT64(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iOutBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			uint64 ulval_net_ = htonq(val[inerIdx]);\
			memcpy(lpOutBuf+iPos, &ulval_net_, (int)sizeof(ulval_net_));\
			iPos += (int)sizeof(val[0]);\
		}\
	}

#define E_ARRAY_INT64(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iOutBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			int64 lval_net_ = (int64)htonq((uint64)val[inerIdx]);\
			memcpy(lpOutBuf+iPos, &lval_net_, (int)sizeof(lval_net_));\
			iPos += (int)sizeof(val[0]);\
		}\
	}

#define E_ARRAY_STRUCT(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ){\
			iPos = val[inerIdx].Encode(lpOutBuf, iOutBufLen, iPos, iVer);\
			if ( iPos < 0 ) { return iPos;}\
		}\
	}

/** 将BUF中数据恢复到本结构中 */
#define D_UINT8(val, needver)\
	assert(sizeof(val)==1);\
	if ( iVer >= needver ) {\
		if ( iPos + (int)sizeof(val) > iInBufLen ) return -1;\
		val = *((uchar*)(lpInBuf + iPos)); iPos += (int)sizeof(val);\
	}

#define D_INT8(val, needver)\
	assert(sizeof(val)==1);\
	if ( iVer >= needver ) {\
		if ( iPos + (int)sizeof(val) > iInBufLen ) return -1;\
		val = *((char*)(lpInBuf + iPos)); iPos += (int)sizeof(val);\
	}

#define D_UINT16(val, needver)\
	assert(sizeof(val)==2);\
	if ( (uint32)(iVer) >= (uint32)(needver) ) {\
		if ( (uint32)(iPos + (int)sizeof(val)) > (uint32)(iInBufLen) ) return -1;\
		ushort usVal_ = *((ushort*)(lpInBuf + iPos));\
		val = ntohs(usVal_); iPos += (int)sizeof(val);\
	}

#define D_INT16(val, needver)\
	assert(sizeof(val)==2);\
	if ( iVer >= needver ) {\
		if ( iPos + (int)sizeof(val) > iInBufLen ) return -1;\
		short sVal_ = *((short*)(lpInBuf + iPos));\
		val = (short)ntohs((ushort)sVal_); iPos += (int)sizeof(val);\
	}

#define D_UINT32(val, needver)\
	assert(sizeof(val)==4);\
	if ( iVer >= needver ) {\
		if ( iPos + (int)sizeof(val) > iInBufLen ) return -1;\
		uint32 ulVal_ = *((uint32*)(lpInBuf + iPos));\
		val = ntohl(ulVal_); iPos += (int)sizeof(val);\
	}

#define D_INT32(val, needver)\
	assert(sizeof(val)==4);\
	if ( iVer >= needver ) {\
		if ( iPos + (int)sizeof(val) > iInBufLen ) return -1;\
		uint32 ulVal_ = *((uint32*)(lpInBuf + iPos));\
		val = (int32)ntohl(ulVal_); iPos += (int)sizeof(val);\
	}

#define D_UINT64(val, needver)\
	assert(sizeof(val)==8);\
	if ( iVer >= needver ) {\
		if ( iPos + (int)sizeof(val) > iInBufLen ) return -1;\
		uint64 ulVal_ = *((uint64*)(lpInBuf + iPos));\
		val = ntohq(ulVal_); iPos += (int)sizeof(val);\
	}

#define D_INT64(val, needver)\
	assert(sizeof(val)==8);\
	if ( iVer >= needver ) {\
		if ( iPos + (int)sizeof(val) > iInBufLen ) return -1;\
		uint64 ulVal_ = *((uint64*)(lpInBuf + iPos));\
		val = (int64)ntohq(ulVal_); iPos += (int)sizeof(val);\
	}

#define D_STRUCT(val, needver)\
	if ( iVer >= needver ) {\
		iPos = val.Decode(lpInBuf, iInBufLen, iPos, iVer);\
		if ( iPos < 0 ) { return iPos;}\
	}

#define D_STRING(val, max_count, needver)\
	if ( iVer >= needver ) {\
		if ( (iPos + 2) > iInBufLen ) return -1;\
		ushort usLen_ = *((ushort*)(lpInBuf + iPos));\
		usLen_ = ntohs(usLen_);\
		iPos += 2;\
		if ( usLen_ >= max_count ) return -2;\
		val[0] = 0;\
		if ( usLen_ > 0 ){\
			memcpy(val, lpInBuf+iPos, usLen_); iPos += usLen_;\
			val[usLen_] = 0;\
		}\
	}

#define D_ARRAY_UINT8(val, cur_count, max_count, needver)\
	if ( iVer >= needver ) {\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iInBufLen ) return -1;\
		if ( cur_count > 0 ){\
			memcpy(val, lpInBuf+iPos, (int)sizeof(val[0])*cur_count);\
			iPos += (int)sizeof(val[0])*cur_count;\
		}\
	}

#define D_ARRAY_INT8(val, cur_count, max_count, needver)\
	if ( iVer >= needver ) {\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iInBufLen ) return -1;\
		if ( cur_count > 0 ){\
			memcpy(val, lpInBuf+iPos, (int)sizeof(val[0])*cur_count);\
			iPos += (int)sizeof(val[0])*cur_count;\
		}\
	}

#define D_ARRAY_UINT16(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( (uint32)(cur_count) > (uint32)(max_count) ) return -2;\
		if ( (uint32)( iPos + (int)sizeof(val[0])*cur_count ) > (uint32)(iInBufLen) ) return -1;\
		for ( int inerIdx = 0; inerIdx < (int)(cur_count); ++inerIdx ) { \
			ushort usVal_ = *((ushort*)(lpInBuf + iPos));\
			val[inerIdx] = ntohs(usVal_);\
			iPos += (int)sizeof(usVal_);\
		}\
	}

#define D_ARRAY_INT16(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iInBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			ushort usVal_ = *((ushort*)(lpInBuf + iPos));\
			val[inerIdx] = (short)ntohs(usVal_);\
			iPos += (int)sizeof(usVal_);\
		}\
	}

#define D_ARRAY_UINT32(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iInBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			uint32 ulVal_ = *((uint32*)(lpInBuf + iPos));\
			val[inerIdx] = ntohl(ulVal_);\
			iPos += (int)sizeof(ulVal_);\
		}\
	}

#define D_ARRAY_INT32(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iInBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			uint32 ulVal_ = *((uint32*)(lpInBuf + iPos));\
			val[inerIdx] = (int32)ntohl(ulVal_);\
			iPos += (int)sizeof(ulVal_);\
		}\
	}

#define D_ARRAY_UINT64(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iInBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			uint64 ulVal_ = *((uint64*)(lpInBuf + iPos));\
			val[inerIdx] = ntohq(ulVal_);\
			iPos += (int)sizeof(ulVal_);\
		}\
	}

#define D_ARRAY_INT64(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		if ( ( iPos + (int)sizeof(val[0])*cur_count ) > iInBufLen ) return -1;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ) { \
			uint64 ulVal_ = *((uint64*)(lpInBuf + iPos));\
			val[inerIdx] = (int64)ntohq(ulVal_);\
			iPos += (int)sizeof(ulVal_);\
		}\
	}

#define D_ARRAY_STRUCT(val, cur_count, max_count, needver)\
	if (iVer>=needver){\
		if ( cur_count > max_count ) return -2;\
		for ( int inerIdx = 0; inerIdx < cur_count; ++inerIdx ){\
			iPos = val[inerIdx].Decode(lpInBuf, iInBufLen, iPos, iVer);\
			if ( iPos < 0 ) { return iPos;}\
		}\
	}



#endif //_PKGBITS_H_
