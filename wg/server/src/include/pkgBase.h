#ifndef _PKG_BASE_H_
#define _PKG_BASE_H_

struct SPkgBase
{
	virtual int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer) = 0;
	virtual int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer) = 0;
	virtual ~SPkgBase() {
	}
};


#endif // _PKG_BASE_H_ 
