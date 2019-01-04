#ifndef _BASE64_H__
#define _BASE64_H__
#include <commhead.h>
typedef unsigned short w_char;

class Base64 {
public:
	static int Encode(const char* src, int srclen, char* out, int outlen);
	static int Decode(const char* src, int srclen, char* out, int outlen);

private:
	static char find_pos(char ch);
};

class UtfParser {
public:
	static w_char* Utf8To16(char* src, int srclen, w_char* out, int outlen);
	static char* Utf16To8(w_char* src, int srclen, char* out, int outlen);
};

class XXTea {
public:
	static bool Encrypt(const uchar* src, int srclen, const uchar* key, uchar* out, int* outlen);
	static bool Decrypt(const uchar* src, int srclen, const uchar* key, uchar* out, int* outlen);
};

#endif // _BASE64_H__
