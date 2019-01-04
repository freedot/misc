#include "tean.h"
#include "log.h" 
#pragma GCC diagnostic ignored "-Wparentheses"
#define ROUNDS 32
#define DELTA 0x9e3779b9 /* sqr(5)-1 * 2^31 */

//----------------------------------------------------------------------------------------------------------------
void tean(const uint32 *k, const uint32 *v, uint32 *outv, long N) {
	int32 y = v[0], z = v[1];
	int32 limit, sum = 0;
	if (N > 0) { /* ENCRYPT */
		limit = DELTA * N;
		while (sum != limit) {
			y += ((z << 4) ^ (z >> 5)) + (z ^ sum) + k[sum & 3];
			sum += DELTA;
			z += ((y << 4) ^ (y >> 5)) + (y ^ sum) + k[(sum >> 11) & 3];
		}
	} else { /* DECRYPT */
		sum = DELTA * (-N);
		while (sum) {
			z -= ((y << 4) ^ (y >> 5)) + (y ^ sum) + k[(sum >> 11) & 3];
			sum -= DELTA;
			y -= ((z << 4) ^ (z >> 5)) + (z ^ sum) + k[sum & 3];
		}
	}
	outv[0] = y;
	outv[1] = z;
}

//----------------------------------------------------------------------------------------------------------------
void cl_enc_block(const uint32 *k, const uint32 *v, uint32 *outv) {
	tean(k, v, outv, ROUNDS);
}

//----------------------------------------------------------------------------------------------------------------
void cl_dec_block(const uint32 *k, const uint32 *v, uint32 *outv) {
	tean(k, v, outv, -ROUNDS);
}

//----------------------------------------------------------------------------------------------------------------
int GetEncryptLength(uchar ucType, int iInBufLen) {
	return (iInBufLen + 7) / 8 * 8 + 2;
}

//----------------------------------------------------------------------------------------------------------------
bool Encrypt(uchar ucType, const uchar* lpInBuf, int iInBufLen,
		const uchar* lpKey, uchar* lpOutBuf, int *lpiOutBufLen) {
	if (iInBufLen < 0) {
		return false;
	}

	int iOutLen = GetEncryptLength(ucType, iInBufLen);
	if (iOutLen > *lpiOutBufLen) {
		return false;
	}

	// encrypt the buffer
	int iAlignLen = iInBufLen / 8;
	for (int i = 0, n = 0; n < iAlignLen; i += 8, ++n) {
		cl_enc_block((const uint32*) lpKey, (const uint32*) (lpInBuf + i),
				(uint32*) (lpOutBuf + i));
	}

	int iLeftLen = iInBufLen - iAlignLen * 8;
	if (iLeftLen > 0) {
		uchar aucLeftBuf[8];
		memset(aucLeftBuf, 0, sizeof(aucLeftBuf));
		memcpy(aucLeftBuf, lpInBuf + iAlignLen * 8, iLeftLen);
		cl_enc_block((const uint32*) lpKey, (const uint32*) aucLeftBuf,
				(uint32*) (lpOutBuf + iAlignLen * 8));
	}

	if (iLeftLen == 0) {
		*(lpOutBuf + iOutLen - 2) = 0;
	} else {
		*(lpOutBuf + iOutLen - 2) = 8 - iLeftLen;
	}

	*(lpOutBuf + iOutLen - 1) = ucType;
	*lpiOutBufLen = iOutLen;

	return true;
}

//----------------------------------------------------------------------------------------------------------------
bool Decrypt(const uchar* lpInBuf, int iInBufLen, const uchar* lpKey,
		uchar* lpOutBuf, int *lpiOutBufLen) {
	// check the length vailed
	if (iInBufLen <= 2 || (iInBufLen % 8) != 2) {
		return false;
	}

	// check the type vailed
	uchar ucType = *(lpInBuf + iInBufLen - 1);
	if (ucType != 1) {
		return false;
	}

	// get pad length
	uchar ucPadLen = *(lpInBuf + iInBufLen - 2);
	if (ucPadLen >= 8) {
		return false;
	}

	// cal the output length
	int iOutLen = iInBufLen - 2 - ucPadLen;
	if (iOutLen <= 0 || iOutLen > *lpiOutBufLen) {
		return false;
	}

	// decrypt the buffer
	int iAlignLen = iOutLen / 8;
	for (int i = 0, n = 0; n < iAlignLen; i += 8, ++n) {
		cl_dec_block((const uint32*) lpKey, (const uint32*) (lpInBuf + i),
				(uint32*) (lpOutBuf + i));
	}

	if (ucPadLen > 0) {
		int iLeftLen = 8 - ucPadLen;
		uchar aucLeftBuf[8];
		cl_dec_block((const uint32*) lpKey,
				(const uint32*) (lpInBuf + iAlignLen * 8),
				(uint32*) aucLeftBuf);
		memcpy(lpOutBuf + iAlignLen * 8, aucLeftBuf, iLeftLen);
	}

	*lpiOutBufLen = iOutLen;

	return true;
}

//----------------------------------------------------------------------------------------------------------------
inline char BinHexToChar(char cHex) {
	if (cHex < 10) {
		return '0' + cHex;
	} else {
		return 'A' + (cHex - 10);
	}
}

//----------------------------------------------------------------------------------------------------------------
void BinsToHexChars(char* lpOutBuffer, int iOutLength, const uchar *lpInBuffer,
		int iInLength) {
	if (iOutLength < 2 * iInLength + 1) {
		assert(false);
		return;
	}

	int i = 0;
	for (i = 0; i < iInLength; ++i) {
		*(lpOutBuffer + 2 * i) = BinHexToChar((*(lpInBuffer + i)) >> 4);
		*(lpOutBuffer + 2 * i + 1) = BinHexToChar((*(lpInBuffer + i)) & 0xF);
	}

	lpOutBuffer[2 * i] = '\0';
}

//----------------------------------------------------------------------------------------------------------------
inline uchar CharToBinHex(char c1, char c2) {
	uchar ucVal1 = 0;
	uchar ucVal2 = 0;
	if (c1 >= '0' && c1 <= '9') {
		ucVal1 = c1 - '0';
	} else if (c1 >= 'A' && c1 <= 'F') {
		ucVal1 = c1 - 'A' + 10;
	}

	if (c2 >= '0' && c2 <= '9') {
		ucVal2 = c2 - '0';
	} else if (c2 >= 'A' && c2 <= 'F') {
		ucVal2 = c2 - 'A' + 10;
	}

	return ((ucVal1 << 4) | ucVal2);
}

//----------------------------------------------------------------------------------------------------------------
void HexCharsToBins(uchar* lpOutBuffer, int* lpiOutLength,
		const char *lpInBuffer, int iInLength) {
	if (*lpiOutLength < iInLength / 2 + 1) {
		assert(false);
		*lpiOutLength = 0;
		return;
	}

	*lpiOutLength = 0;
	if ((iInLength % 2) != 0) {
		assert(false);
		return;
	}

	*lpiOutLength = iInLength / 2;
	for (int i = 0; i < *lpiOutLength; ++i) {
		*(lpOutBuffer + i) = CharToBinHex(*(lpInBuffer + 2 * i),
				*(lpInBuffer + 2 * i + 1));
	}
}

#define MX (z>>5^y<<2) + (y>>3^z<<4)^(sum^y) + (k[p&3^e]^z);
long btea(long* v, long n, long* k) {
	unsigned long z = v[n - 1];
	unsigned long y = v[0];
	unsigned long sum = 0;
	unsigned long e = 0;

	long p, q;
	if (n > 1) {
		q = 6 + 52 / n;
		while (q-- > 0) {
			sum += DELTA;
			e = (sum >> 2) & 3;
			for (p = 0; p < n - 1; p++)
				y = v[p + 1], z = v[p] += MX
			;
			y = v[0];
			z = v[n - 1] += MX
			;
		}
		return 0;
	} else if (n < -1) {
		n = -n;
		q = 6 + 52 / n;
		sum = q * DELTA;
		while (sum != 0) {
			e = (sum >> 2) & 3;
			for (p = n - 1; p > 0; p--)
				z = v[p - 1], y = v[p] -= MX
			;
			z = v[n - 1];
			y = v[0] -= MX
			;
			sum -= DELTA;
		}
		return 0;
	}
	return 1;
}

int GetXXEncryptLen(int iInBufLen) {
	return ((iInBufLen + 3) / 4 + 1) * 4;
}

bool XXEncrypt(uchar ucType, const uchar* lpInBuf, int iInBufLen,
		const uchar* lpKey, uchar* lpOutBuf, int *lpiOutBufLen) {
	int iEncryptLen = GetXXEncryptLen(iInBufLen);
	if (*lpiOutBufLen < iEncryptLen) {
		return false;
	}

	*lpiOutBufLen = iEncryptLen;
	memcpy(lpOutBuf, lpInBuf, iInBufLen);
	*(((ulong*) lpOutBuf) + iEncryptLen / 4 - 1) = htonl(iInBufLen);
	return btea((long*) lpOutBuf, iEncryptLen / 4, (long*) lpKey) == 0;
}

bool XXDecrypt(const uchar* lpInBuf, int iInBufLen, const uchar* lpKey,
		uchar* lpOutBuf, int *lpiOutBufLen) {
	if (*lpiOutBufLen < iInBufLen) {
		return false;
	}

	if ((iInBufLen % 4) != 0) {
		return false;
	}

	memcpy(lpOutBuf, lpInBuf, iInBufLen);
	btea((long*) lpOutBuf, -iInBufLen / 4, (long*) lpKey);

	ulong ulDataLen = ntohl(*(((ulong*) lpOutBuf) + iInBufLen / 4 - 1));
	if ((int) ulDataLen > *lpiOutBufLen || (int) ulDataLen <= 0) {
		return false;
	}
	*lpiOutBufLen = ulDataLen;
	return true;
}
