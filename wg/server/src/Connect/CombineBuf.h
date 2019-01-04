/*
 * CombineBuf.h
 *
 *  Created on: 2015-9-10
 *      Author: qujianbiao
 */

#ifndef COMBINEBUF_H_
#define COMBINEBUF_H_
#include <commhead.h>

static const int C_PKG_HEAD_FLAG_LEN = 1;
static const int C_PKG_HEAD_BODY_LEN = 4;
static const int C_PKG_HEAD_LEN = C_PKG_HEAD_FLAG_LEN + C_PKG_HEAD_BODY_LEN;
static const int RET_OK = 0;
static const int RET_CONTINUE = -1;
static const int RET_FAILED = -2;

static const char* C_REQUESTCROSS = "<policy-file-request/>";

//tgw_l7_forward\r\nHost:url:port\r\n\r\n
static const char* C_TWG_HEAD_END = "\r\n\r\n";
static const int C_TWG_HEAD_PKG_MAX_LEN = 1024;

static const char* C_WS_HEAD_END = "\r\n\r\n";
static const int C_WS_HEAD_PKG_MAX_LEN = 1024;

static const int C_WS_HEAD_LEN = 2;

class CombineBuf {
public:

	const char* CombineHeadTag(const char* src, int& srclen) {
		if (m_pos == 0) {
			src = CopyMem(src, C_PKG_HEAD_FLAG_LEN, srclen);
		}
		return src;
	}

	const char* CombineCrossPkg(const char* src, int& srclen) {
		if (srclen >= (int) (sizeof(m_buf) - m_pos)) {
			return NULL;
		} else {
			src = CopyMem(src, srclen, srclen);
		}
		return src;
	}

	const char* CombineTGWHeadTag(const char* src, int& srclen, int& state) {
		return CombineHeadTagByEndStr(src, srclen, state, C_TWG_HEAD_END, C_TWG_HEAD_PKG_MAX_LEN);
	}

	const char* CombineWSHeadTag(const char* src, int& srclen, int& state) {
		return CombineHeadTagByEndStr(src, srclen, state, C_WS_HEAD_END, C_WS_HEAD_PKG_MAX_LEN);
	}

	const char* CombineHeadTagByEndStr(const char* src, int& srclen, int& state, const char* endStr, int headMaxLen) {
		state = RET_FAILED;
		char* find = (char*) strstr(src, endStr);
		if (find == NULL) {
			src = CopyMem(src, srclen, srclen);
			state = RET_CONTINUE;
		} else {
			int needcopylen = (int) (find - src) + strlen(endStr);
			src = CopyMem(src, needcopylen, srclen);
			state = RET_OK;
		}

		if (m_pos > headMaxLen) {
			state = RET_FAILED;
			return NULL;
		}

		return src;
	}

	const char* CombineInGamePkg(const char* src, int& srclen) {
		if (m_pkglen == 0) {
			src = CombinePkgLen(src, srclen);
		} else {
			int needcopylen = std::min<int>(m_pkglen - m_pos, srclen);
			src = CopyMem(src, needcopylen, srclen);
		}
		return src;
	}

	const char* CombineInGamePkgForWS(const char* src, int& srclen) {
		if (m_pkglen == 0) {
			return src;
		} else {
			int needcopylen = std::min<int>(m_pkglen - m_pos, srclen);
			src = CopyMem(src, needcopylen, srclen);
			if (IsCompleteOnePkg()) {
				this->DecodeWSData(0, m_pkglen, m_buf);
			}
		}
		return src;
	}

	char GetTag() {
		return m_buf[0];
	}

	int GetCrossRequestState() {
		if (m_pos < (int) strlen(C_REQUESTCROSS)) {
			return RET_CONTINUE;
		} else if (strnicmp(C_REQUESTCROSS, m_buf, strlen(C_REQUESTCROSS)) != 0) {
			return RET_FAILED;
		}
		return RET_OK;
	}

	bool IsCompleteOnePkg() {
		return (m_pkglen > 0) && (m_pos == (int) m_pkglen);
	}

	void Clear() {
		m_pos = 0;
		m_last_pos = 0;
		m_pkglen = 0;
		m_wsHandleHead = false;
	}

	const char* CopyMem(const char* src, int copylen, int& srclen) {
		if ((m_pos + copylen + 1) >= (int) sizeof(m_buf)) {
			return NULL;
		}

		memcpy(m_buf + m_pos, src, copylen);
		m_pos += copylen;
		m_buf[m_pos] = '\0';
		srclen -= copylen;
		src += copylen;
		return src;
	}

	const char* CombinePkgLen(const char* src, int& srclen) {
		int headneedlen = std::min<int>(C_PKG_HEAD_LEN - m_pos, srclen);
		src = CopyMem(src, headneedlen, srclen);
		if (src == NULL) {
			return NULL;
		}

		if (m_pos == C_PKG_HEAD_LEN) {
			char* lenBuf = m_buf + C_PKG_HEAD_FLAG_LEN;
			m_pkglen = ntohl(*((uint32*) lenBuf));
			if (m_pkglen == 0 || m_pkglen >= sizeof(m_buf)) {
				return NULL;
			}
			m_pos = 0;
		}
		return src;
	}

	char* GetBuf() {
		return m_buf;
	}

	int GetBufLen() {
		return m_pos;
	}

	char* SkipWSSplitCharV1(char* src, int& srclen) {
		if (m_wsHandleHead)
			return src;

		if ((*((uchar*) src) == 0xff) && (srclen > 0)) {
			srclen--;
			src++;
		}

		if ((*((uchar*) src) == 0x0) && (srclen > 0)) {
			srclen--;
			src++;
			m_wsHandleHead = true;
		}
		return src;
	}

	void ConvertStringToBinary(char* src, int& srclen) {
		uchar * s = (uchar*) src;
		uchar * d = (uchar*) src;
		int len = srclen;
		for (int i = 0; i < len; i++) {
			uchar c = *(s++);
			if ((c == 194) && (i < len - 1)) {
				*(d++) = *(s++);
				i++;
				srclen--;
			} else if ((c == 195) && (i < len - 1)) {
				*(d++) = *(s++) + 64;
				i++;
				srclen--;
			} else {
				*(d++) = c;
			}
		}
		//(128 - 191) -> 194,128 - 194,191
		//(192 - 255) -> 195,128 - 195,191
	}

	int ConvertBinaryToString(const char* src, char* des, int srclen, int desMaxLen) {
		if ( 2*srclen > desMaxLen ) {
			std::cerr << "*error: ConvertBinaryToString , srclen to long:" << srclen << std::endl;
			return srclen;
		}
		uchar * s = (uchar*) src;
		uchar * d = (uchar*) des;
		int len = 0;
		for (int i = 0; i < srclen; i++) {
			uchar c = *(s++);
			if (c < 128) {
				*(d++) = c;
				len++;
			} else if (c < 192) {
				*(d++) = 194;
				*(d++) = c;
				len += 2;
			} else {
				*(d++) = 195;
				*(d++) = c - 64;
				len += 2;
			}
		}
		return len;
	}

	char* SkipWSSplitCharV2(char* src, int& srclen) {
		if (m_wsStep == 0) { // get mask offset
			int needpos = m_last_pos + C_WS_HEAD_LEN;
			int headneedlen = std::min<int>(needpos - m_pos, srclen);
			src = (char*) CopyMem(src, headneedlen, srclen);
			if (m_pos != needpos)
				return src;

			//uchar pin = *((uchar*) m_buf + m_last_pos + 0);
			uchar flag = *((uchar*) m_buf + m_last_pos + 1);

			m_code_length = 0;
			m_mask_offset = 0;
			uchar code_flag = flag & 0x7f;
			if (code_flag < 125) {
				m_code_length = code_flag;
				m_mask_offset = 2;
			} else if (code_flag == 126) {
				m_mask_offset = 4;
			} else if (code_flag == 127) {
				m_mask_offset = 10;
			}

			m_mask_len = 0;
			uchar mask_flag = flag & 0x80;
			if (mask_flag == 0x80) {
				m_mask_len = 4;
			}

			m_wsStep = 1;
			return src;
		} else if (m_wsStep == 1) { //get mask data
			uchar data_offset = m_mask_offset + m_mask_len;
			int needpos = m_last_pos + data_offset;
			int needlen = std::min<int>(needpos - m_pos, srclen);
			src = (char*) CopyMem(src, needlen, srclen);
			if (m_pos != needpos)
				return src;

			if (m_mask_offset == 4) {
				ushort rawLen = 0;
				memcpy(&rawLen, m_buf + m_last_pos + 2, sizeof(rawLen));
				m_code_length = ntohs(rawLen);
			} else if (m_mask_offset == 10) {
				uint64 rawLen = 0;
				memcpy(&rawLen, m_buf + m_last_pos + 2, sizeof(rawLen));
				m_code_length = (int) ntohqex(rawLen);
			}

			if (m_mask_len > 0) {
				memcpy(m_wsmasks, m_buf + m_last_pos + m_mask_offset, m_mask_len);
			}

			m_pos -= data_offset;
			m_ws_data_pos = 0;
			m_wsStep = 2;

			return src;
		} else if (m_wsStep == 2 && m_pkglen == 0) {
			return (char*) CombinePkgLenForWS(src, srclen);
		} else if (m_wsStep == 2 && m_pkglen > 0) {
			int last_pos = m_pos;
			int needcopylen = std::min<int>(m_pkglen - m_pos, srclen);
			needcopylen = std::min<int>(needcopylen, m_code_length - m_ws_data_pos);
			if (needcopylen > 0) {
				src = (char*) CopyMem(src, needcopylen, srclen);
				this->DecodeWSData(m_ws_data_pos, needcopylen, m_buf + last_pos);
				m_ws_data_pos += needcopylen;
			}

			if (m_ws_data_pos == m_code_length || m_code_length == m_ws_data_pos) {
				m_ws_data_pos = 0;
				m_wsStep = 0;
				m_last_pos = m_pos;
			}
			return src;
		} else {
			return src;
		}
	}

	const char* CombinePkgLenForWS(const char* src, int& srclen) {
		int needpos = m_last_pos + C_PKG_HEAD_BODY_LEN;
		int headneedlen = std::min<int>(needpos - m_pos, srclen);
		src = CopyMem(src, headneedlen, srclen);
		if (src == NULL) {
			return NULL;
		}

		if (m_pos == needpos) {
			char* lenBuf = DecodeWSData(m_ws_data_pos, C_PKG_HEAD_BODY_LEN, m_buf + m_last_pos);
			m_pkglen = ntohl(*((uint32*) lenBuf));
			if (m_pkglen == 0 || m_pkglen >= sizeof(m_buf)) {
				return NULL;
			}
			m_pos -= C_PKG_HEAD_BODY_LEN;
			m_ws_data_pos += C_PKG_HEAD_BODY_LEN;
		}
		return src;
	}

	uchar GetWsStep() {
		return m_wsStep;
	}

	char* DecodeWSData(int startPos, int srcLen, char* src) {
		if (m_mask_len == 0)
			return src;

		uchar* data = (uchar*) src;
		for (int i = 0, maskPos = startPos; i < srcLen; ++i) {
			*(data + i) = (*(data + i)) ^ m_wsmasks[(maskPos++) % m_mask_len];
		}
		return (char*) data;
	}

	CombineBuf() :
			m_pos(0), m_pkglen(0), m_wsHandleHead(false), m_wsStep(0), m_mask_offset(0), m_mask_len(0), m_code_length(
					0), m_ws_data_pos(0), m_last_pos(0) {
	}

private:
	char m_buf[8192];
	int m_pos;
	uint32 m_pkglen;
	bool m_wsHandleHead;

	uchar m_wsmasks[4];
	uchar m_wsStep;
	uchar m_mask_offset;
	uchar m_mask_len;
	int m_code_length;
	int m_ws_data_pos;
	int m_last_pos;
};

#endif /* COMBINEBUF_H_ */
