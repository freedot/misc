/*
 * DataProcessor.cpp
 *
 *  Created on: 2013-3-3
 *      Author: qujianbiao
 */

#include "DataProcessor.h"
extern "C" {
#include "md5.h"
}

namespace Net {
#pragma GCC diagnostic ignored "-Wparentheses"
#define DELTA 0x9e3779b9 /* sqr(5)-1 * 2^31 */
#define MX (z>>5^y<<2) + (y>>3^z<<4)^(sum^y) + (k[p&3^e]^z);
inline int btea(int32* v, int32 n, int32* k) {
	uint32 z = v[n - 1];
	uint32 y = v[0];
	uint32 sum = 0;
	uint32 e = 0;

	int32 p, q;
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

inline int GetXXEncryptLen(int bufLen) {
	return ((bufLen + 3) / 4 + 1) * 4;
}

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

bool DataProcessor::Encrypt(uchar type, const uchar* inBuf, int inBufLen,
		const uchar* key, uchar* outBuf, int *outBufLen) {
	int encryptLen = GetXXEncryptLen(inBufLen);
	if (*outBufLen < encryptLen) {
		return false;
	}

	*outBufLen = encryptLen;
	memcpy(outBuf, inBuf, inBufLen);
	*(((uint32*) outBuf) + encryptLen / 4 - 1) =
			(type == 1) ? 0 : htonl(inBufLen);
	return btea((int32*) outBuf, encryptLen / 4, (int32*) key) == 0;
}

bool DataProcessor::Decrypt(const uchar* inBuf, int inBufLen, const uchar* key,
		uchar* outBuf, int *outBufLen) {
	
	if (*outBufLen < inBufLen) {
		std::clog
				<< "*** error: xxdecrypt len error ( *lpiOutBufLen < iInBufLen ) : ("
				<< *outBufLen << "," << inBufLen << ")" << std::endl;
		return false;
	}

	if ((inBufLen % 4) != 0) {
		std::clog
				<< "*** error: xxdecrypt len error ( (iInBufLen ге 4) != 0 ) : iInBufLen="
				<< inBufLen << std::endl;
		return false;
	}

	memcpy(outBuf, inBuf, inBufLen);
	btea((int32*) outBuf, -inBufLen / 4, (int32*) key);

	uint32 ulDataLen = ntohl(*(((uint32*) outBuf) + inBufLen / 4 - 1));
	if (ulDataLen == 0) {
		ulDataLen = strlen((const char *) outBuf);
	}
	if (ulDataLen > (uint32) (*outBufLen)) {
		std::clog
				<< "*** error: xxdecrypt len error ( ulDataLen > *lpiOutBufLen ) : ("
				<< ulDataLen << "," << *outBufLen << ")" << std::endl;
		return false;
	}
	*outBufLen = ulDataLen;
	return true;
}

void DataProcessor::HexCharsToBins(uchar* outBuf, int* outBufLen,
		const char *inBuf, int inBufLen) {
	if (*outBufLen < inBufLen / 2 + 1) {
		*outBufLen = 0;
		return;
	}

	*outBufLen = 0;
	if ((inBufLen % 2) != 0) {
		return;
	}

	*outBufLen = inBufLen / 2;
	for (int i = 0; i < *outBufLen; ++i) {
		*(outBuf + i) = CharToBinHex(*(inBuf + 2 * i), *(inBuf + 2 * i + 1));
	}
}

void DataProcessor::Md5HashBuf(uchar* outBuf/*16bytes*/, const uchar *inBuf,
		int inBufLen) {
	Md5HashBuffer(outBuf, inBuf, inBufLen);
}

int DataProcessor::HashString(const char* str) {
	int len = strlen(str);
	int ret = 0;
	while (len--) {
		ret <<= 4;
		ret ^= *str;
		str++;
	}
	return ret;
}

} /* namespace Net */
