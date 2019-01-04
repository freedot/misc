/*
 * LogSys.h
 *
 *  Created on: 2013-2-20
 *      Author: Administrator
 */

#ifndef LOGSYS_H_
#define LOGSYS_H_
#include <ILogSys.h>
#include <commhead.h>
#include <Socket.h>
#include <IpHelper.h>
#include <string>
#include <map>

#define MAX_LOG_BUFFER_LEN 4096

class LogSys: public ILogSys {
DECLARE_TQINTERFACE()
	;DECLARE_DEFAULT_EVENTLISTENER()
	;DECLARE_DEFAULT_RENDERLISTENER()
	;DECLARE_DEFAULT_UPDATELISTENER()
	;
public:
	bool AddLog(const char* key, const char* outPath, uint32 cacheItemCount,
			uint32 maxLogSubFileCount, uint32 fileMaxSize);

	const char* GetLogPath(const char* key);
	void Log(const char* key, EOutLogFlag flag,
			const char* fmt, ...);
	void Log(const char* key, EOutLogFlag flag,
			const char* fmt, va_list args);
	void LogWarning(const char* key, EOutLogFlag flag,
			const char* fmt, ...);
	void LogWarning(const char* key, EOutLogFlag flag,
			const char* fmt, va_list args);
	void LogError(const char* key, EOutLogFlag flag,
			const char* fmt, ...);
	void LogError(const char* key, EOutLogFlag flag,
			const char* fmt, va_list args);
	void LogData(const char* key, const char* data, int len);
	void Flush(const char* key);

	bool OnOneTimeInit();
	void OnOneTimeRelease();
public:
	/** 构造函数 */
	LogSys();
	/** 析构函数 */
	virtual ~LogSys();

public:
	/** 日志类型 */
	enum ELogNodeType {
		/// 没有初始化的类型
		ELNT_NONE,
		/// udp类型
		ELNT_UDP,
		/// 本地文件类型
		ELNT_FILE,
	};

	/** 日志的数据标志 */
	enum ELogTextFlag {
		/// 文本格式
		ELTF_TEXT,
		/// 二进制格式
		ELTF_BIN,
	};

private:
	/** Upd网络日志 */
	struct SLogUdp {
		/// 日志服务器的IP
		uint32 ip;
		/// 日志服务器的端口
		ushort port;
		/// UPD的SOCKET
		Net::Socket objSocket;

		/** 构造函数 */
		SLogUdp() :
				ip(0), port(0) {
		}
	};

	/** 文件日志 */
	struct SLogFile {
		/// 可以生成的最大子文件个数
		uint32 maxSubLogFilesCount;
		/// 单个文件最大很容纳的字节数
		uint32 fileMaxSize;
		/// 日志输出的基础文件(不包含扩展名)
		std::string basePath;
		/// 日志输出文件
		std::string fileName;
		/// 当前文件的大小
		uint32 fileSize;
		/// 可缓冲的的最多log条目,积累到该条目数才进行一次文件的写入
		uint32 maxCacheItems;
		/// 当前已缓冲的条目个数
		uint32 curCacheItems;
		/// 上次flush的时间
		uint32 lastLogTime;
		/// 用于缓冲的buf
		char* cacheBuf;

		/** 构造函数 */
		SLogFile() :
				maxSubLogFilesCount(10), fileMaxSize(1000000), fileSize(0), maxCacheItems(
						1), curCacheItems(0), lastLogTime(0), cacheBuf(
						NULL) {
		}
	};

	/** 一个日志节点,以key一一对应 */
	struct SLogNode {
		/// 日志类型
		ELogNodeType flag;
		/// Upd网络日志
		SLogUdp udp;
		/// 文件日志
		SLogFile file;
		/// 将要输出的文件或upd路径
		std::string outPath;

		SLogNode() :
				flag(ELNT_NONE) {
		}
	};
	typedef std::map<std::string, SLogNode> StdMapLogs;
	typedef StdMapLogs::iterator StdMapLogsIter;

private:
	bool AddLogNode(const char* key, const char* outPath);

	SLogNode* GetNodeByKey(const char* key);

	void FormatLogString(const char* tag, EOutLogFlag flag,
			const char* fmt, va_list args, char* outBuf,
			int outBufLen);

	void WriteLog(SLogNode* node, ELogTextFlag flag, const void* buf,
			int bufLen);

	void WriteToFile(SLogNode* node, ELogTextFlag flag, const void* buf,
			int bufLen);

	void WriteToUdpServer(SLogNode* node, ELogTextFlag flag,
			const void* buf, int bufLen);

	/** 将当前节点对应的系列日志文件重命名，目的是控制一个文件可容纳的最大字节数量，
	 会名称成如: ... xxx.3.log xxx.2.log xxx.1.log */
	void RenameSubLogFile(SLogNode* node);

	void InnerFlush(SLogNode* node);

private:
	/// 日志节点map
	StdMapLogs m_mapLogs;
};

#endif /* LOGSYS_H_ */
