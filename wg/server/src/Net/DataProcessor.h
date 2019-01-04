/*
 * DataProcessor.h
 *
 *  Created on: 2013-3-3
 *      Author: qujianbiao
 */

#ifndef DATAPROCESSOR_H_
#define DATAPROCESSOR_H_
#include <commhead.h>

namespace Net {

class DataProcessor {
public:

	/** 通过密码加密一块数据
	 @param type
	 加密算法类型
	 @param inBuf
	 需要加密的缓冲区
	 @param inBufLen
	 需加密缓冲区的长度
	 @param key
	 加密密码
	 @param outBuf
	 存放加密后的数据缓冲区
	 @param outBufLen
	 加密后的数据缓冲区长度
	 @return
	 返回true或false
	 */
	static bool Encrypt(uchar type, const uchar* inBuf, int inBufLen,
			const uchar* key, uchar* outBuf, int *outBufLen);

	/** 通过密码解密一块数据
	 @param inBuf
	 将被解密的原始数据缓冲
	 @param inBufLen
	 将被解密的原始数据缓冲的长度
	 @param key
	 解密使用的密钥
	 @param outBuf
	 将被解密的目的数据缓冲
	 @param outBufLen [I/O]
	 将被解密的目的数据缓冲的长度,
	 输入为buf的最大长度,输出为解密后数据的实际长度
	 @return
	 返回true或false
	 */
	static bool Decrypt(const uchar* inBuf, int inBufLen, const uchar* key,
			uchar* outBuf, int *outBufLen);

	/** convert the hex chars to bins */
	static void HexCharsToBins(uchar* outBuf, int* outBufLen, const char *inBuf,
			int inBufLen);

	/** hash the buffer by md5, the out buffer length must be 16 bytes */
	static void Md5HashBuf(uchar* outBuf/*16bytes*/, const uchar *inBuf,
			int inBufLen);

	static int HashString(const char* str);
};

} /* namespace Net */
#endif /* DATAPROCESSOR_H_ */
