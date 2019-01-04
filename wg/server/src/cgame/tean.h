#ifndef _TEAN_H_
#define _TEAN_H_ 
#include <commhead.h>

extern int GetEncryptLength(uchar ucType, int iInBufLen);

extern bool Encrypt(uchar ucType, 
	const uchar* lpInBuf, 
	int iInBufLen, 
	const uchar* lpKey, 
	uchar* lpOutBuf, 
	int *lpiOutBufLen );

extern bool Decrypt(const uchar* lpInBuf, 
	int iInBufLen, 
	const uchar* lpKey, 
	uchar* lpOutBuf, 
	int *lpiOutBufLen );

extern void BinsToHexChars(char* lpOutBuffer, 
	int iOutLength, 
	const uchar *lpInBuffer, 
	int iInLength);

extern void HexCharsToBins(uchar* lpOutBuffer, 
	int* lpiOutLength, 
	const char *lpInBuffer,
	int iInLength);

extern bool XXEncrypt(uchar ucType,
	const uchar* lpInBuf, 
	int iInBufLen, 
	const uchar* lpKey, 
	uchar* lpOutBuf, 
	int *lpiOutBufLen );

extern bool XXDecrypt(const uchar* lpInBuf, 
	int iInBufLen, 
	const uchar* lpKey, 
	uchar* lpOutBuf, 
	int *lpiOutBufLen );


#endif // _TEAN_H_
