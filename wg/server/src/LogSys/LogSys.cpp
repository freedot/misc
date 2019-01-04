/*
 * LogSys.cpp
 *
 *  Created on: 2013-2-20
 *      Author: Administrator
 */
#include "LogSys.h"

DECLARE_DLLMAIN()

const int LOG_ITEM_LEN = 4096;

IInterface* CreateInterface(const TQGUID& IGUID) {
	if (IGUID != IUID_ILOGSYS)
		return NULL;

	LogSys* logSys = new LogSys;
	logSys->SetIUID(IGUID);

	return (IInterface*) logSys;
}

void DestroyInterface(IInterface** lplpInterface) {
	if (lplpInterface == NULL || (*lplpInterface) == NULL)
		return;
	if ((*lplpInterface)->GetIUID() != IUID_ILOGSYS)
		return;

	LogSys* lpLogSys = (LogSys*) (*lplpInterface);
	delete lpLogSys;
	(*lplpInterface) = NULL;
}

//////////////////////////////////
LogSys::LogSys() {
	INIT_TQINTERFACE()
}

LogSys::~LogSys() {
	StdMapLogsIter iter = m_mapLogs.begin();
	for (; iter != m_mapLogs.end(); ++iter) {
		SLogNode* node = &((*iter).second);
		InnerFlush(node);
		SafeDeleteArray(node->file.cacheBuf);
	}
	m_mapLogs.clear();
}

bool LogSys::AddLog(const char* key, const char* outPath, uint32 cacheItemCount,
		uint32 maxLogSubFileCount, uint32 fileMaxSize) {
	if (!AddLogNode(key, outPath)) {
		return false;
	}

	SLogNode* node = GetNodeByKey(key);
	if (node == NULL) {
		return false;
	}

	if (node->flag == ELNT_FILE) {
		assert(maxLogSubFileCount > 0 && fileMaxSize > 0);
		if (maxLogSubFileCount <= 0 || fileMaxSize == 0) {
			return false;
		}
		node->file.maxSubLogFilesCount = maxLogSubFileCount;
		node->file.fileMaxSize = fileMaxSize;
		node->file.maxCacheItems = cacheItemCount;
		node->file.curCacheItems = 0;
		node->file.cacheBuf = new char[node->file.maxCacheItems * LOG_ITEM_LEN];
		node->file.cacheBuf[0] = '\0';
	}

	return true;
}

const char* LogSys::GetLogPath(const char* key) {
	SLogNode* node = GetNodeByKey(key);
	if (node != NULL) {
		return node->outPath.c_str();
	}
	return NULL;
}

void LogSys::Log(const char* key, EOutLogFlag flag, const char* fmt, ...) {
	if (IsLinux() && HasLongLongFmt(fmt)) {
		fmt = ConvertToLinuxLongLongFmt(fmt);
	}
	va_list argPtr;
	va_start(argPtr, fmt);
	Log(key, flag, fmt, argPtr);
	va_end(argPtr);
}

void LogSys::Log(const char* key, EOutLogFlag flag, const char* fmt,
		va_list args) {
	if (IsLinux() && HasLongLongFmt(fmt)) {
		fmt = ConvertToLinuxLongLongFmt(fmt);
	}
	SLogNode* node = GetNodeByKey(key);
	if (node != NULL) {
		char buf[MAX_LOG_BUFFER_LEN];
		FormatLogString("", flag, fmt, args, buf, MAX_LOG_BUFFER_LEN);
		WriteLog(node, ELTF_TEXT, buf, strlen(buf));
	}
}

void LogSys::LogWarning(const char* key, EOutLogFlag flag, const char* fmt,
		...) {
	va_list args;
	va_start(args, fmt);
	LogWarning(key, flag, fmt, args);
	va_end(args);
}

void LogSys::LogWarning(const char* key, EOutLogFlag flag, const char* fmt,
		va_list args) {
	if (IsLinux() && HasLongLongFmt(fmt)) {
		fmt = ConvertToLinuxLongLongFmt(fmt);
	}
	SLogNode* node = GetNodeByKey(key);
	if (node != NULL) {
		char buf[MAX_LOG_BUFFER_LEN];
		FormatLogString("*Warning*", flag, fmt, args, buf, MAX_LOG_BUFFER_LEN);
		WriteLog(node, ELTF_TEXT, buf, strlen(buf));
	}
}

void LogSys::LogError(const char* key, EOutLogFlag flag, const char* fmt, ...) {
	if (IsLinux() && HasLongLongFmt(fmt)) {
		fmt = ConvertToLinuxLongLongFmt(fmt);
	}
	va_list args;
	va_start(args, fmt);
	LogError(key, flag, fmt, args);
	va_end(args);
}

void LogSys::LogError(const char* key, EOutLogFlag flag, const char* fmt,
		va_list args) {
	if (IsLinux() && HasLongLongFmt(fmt)) {
		fmt = ConvertToLinuxLongLongFmt(fmt);
	}
	SLogNode* node = GetNodeByKey(key);
	if (node != NULL) {
		char buf[MAX_LOG_BUFFER_LEN];
		FormatLogString("*Error*", flag, fmt, args, buf, MAX_LOG_BUFFER_LEN);
		WriteLog(node, ELTF_TEXT, buf, strlen(buf));
	}
}

void LogSys::LogData(const char* key, const char* data, int dataLen) {
	SLogNode* node = GetNodeByKey(key);
	if (node != NULL) {
		WriteLog(node, ELTF_BIN, data, dataLen);
	}
}

void LogSys::Flush(const char* key) {
	SLogNode* node = GetNodeByKey(key);
	if (node == NULL) {
		return;
	}

	if (node->flag == ELNT_FILE) {
		InnerFlush(node);
	}
}

bool LogSys::OnOneTimeInit() {
	return true;
}

void LogSys::OnOneTimeRelease() {
	StdMapLogsIter iter = m_mapLogs.begin();
	for (; iter != m_mapLogs.end(); ++iter) {
		SLogNode& node = (*iter).second;
		if (node.flag == ELNT_UDP) {
			node.udp.objSocket.Close();
		}
	}
	m_mapLogs.clear();
}

void LogSys::InnerFlush(SLogNode* node) {
	if (node->file.curCacheItems > 0) {
		FILE* fp = fopen(node->file.fileName.c_str(), "a+");
		if (fp != NULL) {
			fprintf(fp, "%s", node->file.cacheBuf);
			fseek(fp, 0, SEEK_END);
			node->file.fileSize = ftell(fp);
			fclose(fp);
		}
		node->file.curCacheItems = 0;
		node->file.cacheBuf[0] = 0;
	}

}

bool LogSys::AddLogNode(const char* key, const char* outPath) {
	if (key == NULL || outPath == NULL)
		return false;

	SLogNode node;
	if (Net::IpHelper::GetPTypeFromUrl(outPath) == Net::EP_UDP) {
		uint32 ip = Net::IpHelper::GetIpFromUrl(outPath);
		short port = Net::IpHelper::GetPortFromUrl(outPath);
		if (ip == 0 || port == 0)
			return false;

		if (!node.udp.objSocket.CreateSocket(AF_INET, SOCK_DGRAM, 0, 0))
			return false;

		node.flag = ELNT_UDP;
		node.udp.ip = ip;
		node.udp.port = port;

	} else {
		node.flag = ELNT_FILE;
		node.file.basePath = outPath;
		node.file.fileName = outPath;
		node.file.fileName += ".log";
	}

	node.outPath = outPath;
	m_mapLogs[key] = node;
	return true;
}

LogSys::SLogNode* LogSys::GetNodeByKey(const char* key) {
	if (key == NULL)
		return NULL;

	StdMapLogsIter iter = m_mapLogs.find(key);
	if (iter == m_mapLogs.end())
		return NULL;

	return &((*iter).second);
}

void LogSys::FormatLogString(const char* tag, EOutLogFlag flag, const char* fmt,
		va_list args, char* outBuf, int outBufLen) {
	int size = outBufLen;
	if ((flag & EOLF_OUTTIME) == EOLF_OUTTIME) {
		time_t timeVal = 0;
		tm* today = NULL;
		time(&timeVal);
		today = localtime(&timeVal);
		SafeSprintf(outBuf, size, "[%d-%02d-%02d %02d:%02d:%02d]:",
				today->tm_year + 1900, today->tm_mon + 1, today->tm_mday,
				today->tm_hour, today->tm_min, today->tm_sec);
	}
	SafeStrCat(outBuf, tag, size);
	int pos = strlen(outBuf);
	int leftSize = size - pos;
	if (leftSize > 0) {
		vsnprintf(outBuf + pos, leftSize, fmt, args);
	}
}

void LogSys::WriteLog(SLogNode* node, ELogTextFlag flag, const void* buf,
		int bufLen) {
	if (node->flag == ELNT_FILE) {
		WriteToFile(node, flag, buf, bufLen);
	} else if (node->flag == ELNT_UDP) {
		WriteToUdpServer(node, flag, buf, bufLen);
	}
}

void LogSys::WriteToUdpServer(SLogNode* node, ELogTextFlag flag,
		const void* buf, int bufLen) {
	if (node != NULL && node->flag == ELNT_UDP && buf != NULL && bufLen > 0) {
		assert(false);
		//lpLogNode->stUdp.objSocket.SendTo();
	}
}

void LogSys::WriteToFile(SLogNode* node, ELogTextFlag flag, const void* buf,
		int bufLen) {
	if (node == NULL || node->flag != ELNT_FILE || buf == NULL)
		return;

	if (flag == ELTF_TEXT) {
		// 只对txt类型的条目进行缓冲
		time_t timeVal = 0;
		time(&timeVal);
		SafeStrCat(node->file.cacheBuf, (char*) buf,
				node->file.maxCacheItems * LOG_ITEM_LEN);
		SafeStrCat(node->file.cacheBuf, "\n",
				node->file.maxCacheItems * LOG_ITEM_LEN);
		++(node->file.curCacheItems);
		if (node->file.curCacheItems >= node->file.maxCacheItems
				|| (timeVal - node->file.lastLogTime) > 30) {
			node->file.lastLogTime = (uint32) timeVal;
			InnerFlush(node);
		}
	} else {
		FILE* fp = fopen(node->file.fileName.c_str(), "ba+");
		if (fp != NULL) {
			fwrite(&bufLen, sizeof(bufLen), 1, fp);
			fwrite(buf, sizeof(char), bufLen, fp);
			fseek(fp, 0, SEEK_END);
			node->file.fileSize = ftell(fp);
			fclose(fp);
		}
	}
	RenameSubLogFile(node);
}

void LogSys::RenameSubLogFile(SLogNode* node) {
	if (node == NULL || node->flag != ELNT_FILE)
		return;

	if (node->file.fileSize < node->file.fileMaxSize)
		return;

	char logFileName[MAX_PATH];
	char newLogFileName[MAX_PATH];

	// 删除最后一个文件
	SafeSprintf(logFileName, MAX_PATH, "%s%08d.log",
			node->file.basePath.c_str(), node->file.maxSubLogFilesCount - 1);
	if (access(logFileName, F_OK) == 0) {
		unlink(logFileName);
	}

	for (int i = node->file.maxSubLogFilesCount - 2; i >= 0; --i) {
		if (i == 0) {
			SafeSprintf(logFileName, MAX_PATH, "%s.log",
					node->file.basePath.c_str());
		} else {
			SafeSprintf(logFileName, MAX_PATH, "%s%08d.log",
					node->file.basePath.c_str(), i);
		}

		if (access(logFileName, F_OK) == 0) {
			SafeSprintf(newLogFileName, MAX_PATH, "%s%08d.log",
					node->file.basePath.c_str(), i + 1);
			if (rename(logFileName, newLogFileName) < 0) {
				return;
			}
		}
	}
}
