#include "Base64.h"
#include <stdio.h>
#include <string.h>
#include <DataProcessor.h>

static const char base[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

char Base64::find_pos(char ch) {   
	char *ptr = (char*)strrchr(base, ch);
	return (ptr - base);
}

int Base64::Encode(const char* src, int srclen, char* out, int outlen) {
    int prepare = 0;   
    int ret_len;   
    int temp = 0;   
    char *ret = NULL;   
    char *f = NULL;   
    int tmp = 0;   
    char changed[4];   
    int i = 0;   
    ret_len = srclen / 3;   
    temp = srclen % 3;   
    if (temp > 0)   
    {   
        ret_len += 1;   
    }   
    ret_len = ret_len*4 + 1; 
	if ( ret_len > outlen ) return -1;
    ret = out;
    memset(ret, 0, ret_len);   
    f = ret;   
    while (tmp < srclen)   
    {   
        temp = 0;   
        prepare = 0;   
        memset(changed, '\0', 4);   
        while (temp < 3)   
        {   
            if (tmp >= srclen)   
            {   
                break;   
            }   
            prepare = ((prepare << 8) | (src[tmp] & 0xFF));   
            tmp++;   
            temp++;   
        }   
        prepare = (prepare<<((3-temp)*8));   
        for (i = 0; i < 4 ;i++ )   
        {   
            if (temp < i)   
            {   
                changed[i] = 0x40;   
            }   
            else  
            {   
                changed[i] = (prepare>>((3-i)*6)) & 0x3F;   
            }   
            *f = base[(int)(changed[i])];
            f++;   
        }   
    }   
    *f = '\0';   
	
    return ret_len;   
}

int Base64::Decode(const char* src, int srclen, char* out, int outlen) {
    int ret_len = (srclen / 4) * 3;   
    int equal_count = 0;   
    char *ret = NULL;   
    char *f = NULL;   
    int tmp = 0;   
    int temp = 0;   
    char need[4];
    int prepare = 0;   
    int i = 0;   
    if (*(src + srclen - 1) == '=')   
    {   
        equal_count += 1;   
    }   
    if (*(src + srclen - 2) == '=')   
    {   
        equal_count += 1;   
    }   
    if (*(src + srclen - 3) == '=')   
    {//seems impossible   
        equal_count += 1;   
    }   
    switch (equal_count)   
    {   
    case 0:   
        ret_len += 4;//3 + 1 [1 for NULL]   
        break;   
    case 1:   
        ret_len += 4;//Ceil((6*3)/8)+1   
        break;   
    case 2:   
        ret_len += 3;//Ceil((6*2)/8)+1   
        break;   
    case 3:   
        ret_len += 2;//Ceil((6*1)/8)+1   
        break;   
    }  
	if ( ret_len > outlen ) {
		return 0;
	}
    ret = out;
    memset(ret, 0, ret_len);   
    f = ret;   
    while (tmp < (srclen - equal_count))   
    {   
        temp = 0;   
        prepare = 0;   
        memset(need, 0, 4);   
        while (temp < 4)   
        {   
            if (tmp >= (srclen - equal_count))   
            {   
                break;   
            }   
            prepare = (prepare << 6) | (find_pos(src[tmp]));   
            temp++;   
            tmp++;   
        }   
        prepare = prepare << ((4-temp) * 6);   
        for (i=0; i<3 ;i++ )   
        {   
            if (i == temp)   
            {   
                break;   
            }   
            *f = (char)((prepare>>((2-i)*8)) & 0xFF);   
            f++;   
        }
    }   
    *f = '\0';
	int retlen = f - ret;
	return (retlen + 2) / 4 * 4;

}

w_char* UtfParser::Utf8To16(char* src, int srclen, w_char* out, int outlen) {
	int srcpos = 0;
	int outpos = 0;
	char c = 0;
	char c2 = 0;
	char c3 = 0;
	while ( srcpos < srclen ) {
		c = src[srcpos++];
		switch ( c>>4 ) {
		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			out[outpos++] = c;
			break;
		case 12: case 13:
			c2 = src[srcpos++];
			out[outpos++] = ((c&0x1F)<<6) | (c2&0x3F);
			break;
		case 14:
			c2 = src[srcpos++];
			c3 = src[srcpos++];
			out[outpos++] = ((c&0x0F)<<12) | ((c2&0x3F)<<6) | ((c3&0x3F)<<0);
			break;
		}
	}
	out[outpos] = 0;
	return out;
}

char* UtfParser::Utf16To8(w_char* src, int srclen, char* out, int outlen) {
	int srcpos = 0;
	int outpos = 0;
	while ( srcpos < srclen ) {
		w_char c = src[srcpos++];
		if ( (c >= 0x0001) && (c <= 0x007F) ) {
			out[outpos++] = c;
		}
		else if ( c > 0x07FF ) {
			out[outpos++] = 0xE0 | ((c >> 12) & 0x0F);
			out[outpos++] = 0x80 | ((c >>  6) & 0x3F);
			out[outpos++] = 0x80 | ((c >>  0) & 0x3F);
		}
		else {
			out[outpos++] = 0xC0 | ((c >>  6) & 0x1F);
			out[outpos++] = 0x80 | ((c >>  0) & 0x3F);
		}
	}
	out[outpos] = 0;
	return out;
}

bool XXTea::Encrypt(const uchar* src, int srclen, const uchar* key, uchar* out, int* outlen) {
	char emsg[65535];
	int elen = sizeof(emsg);
	bool rt = Net::DataProcessor::Encrypt(1, src, srclen, key, (uchar*)emsg, &elen);
	if ( !rt ) return false;
	Base64::Encode((const char *)emsg, elen, (char*)out, *outlen);
	return true;
}

bool XXTea::Decrypt(const uchar* src, int srclen, const uchar* key, uchar* out, int* outlen) {
	char dmsg[65535];
	int msglen = Base64::Decode((const char *)src, srclen, dmsg, sizeof(dmsg));
	return Net::DataProcessor::Decrypt((const uchar*)dmsg, msglen, key, out, outlen);
}


