#ifndef _I_LOGSYS_H_
#define _I_LOGSYS_H_
#include "IInterface.h"

// {4312CD49-3210-4cd6-B83B-A7BA0530347C}
static const TQGUID IUID_ILOGSYS = { 0x4312cd49, 0x3210, 0x4cd6, { 0xb8, 0x3b,
		0xa7, 0xba, 0x5, 0x30, 0x34, 0x7c } };

//tolua_begin

/** 在输出一条日志时使用的标志 */
enum EOutLogFlag {
	/// 普通类型
	EOLF_NORMAL = 0x0000,
	/// 在日志的头回自动添加时间标签
	EOLF_OUTTIME = 0x0001,
};

/** 日志系统 */
class ILogSys: public IInterface {
public:
	/** 添加一个日志的属性
	@param key
		日志文件对应的key值
	@param outPath
		日志文件的路径名称或udp服务器路径名
		可以是"./log/xxx.log"或"udp://172.0.0.1:4444"
	@param cacheItemCount
		最多可缓冲的条目数
	@param maxLogSubFileCount
		当前key对应的日志可容许生成的最大日志子序列文件个数
	@param fileMaxSize
		该值表示单个子序列文件可容纳的最大字节数
	@return
		返回true或false
	*/
	virtual bool AddLog(const char* key,
		const char* outPath,
		uint32 cacheItemCount,
		uint32 maxLogSubFileCount,
		uint32 fileMaxSize) = 0;

	/** 获得某个key对应的日志文件路径名
	@param key
		日志文件对应的key值
	@return
		返回日志文件路径名(UTF8)
	*/
	virtual const char* GetLogPath(const char* key) = 0;

	/** 日志输出, 用法示例:
	@param key
		日志文件对应的key值
	@param iFlag
		发送日志可选的标志位,如LOG_FLAG_SHOWDATE
	@param fmt
		格式字符串
	@param ...
		可变长参数列表
	*/
	virtual void Log(const char* key, EOutLogFlag flag, const char* fmt, ... ) = 0;
	virtual void Log(const char* key, EOutLogFlag flag, const char* fmt, va_list args) = 0;

	/** 日志输出, 输出Warning日志
	@param key
		日志文件对应的key值
	@param iFlag
		发送日志可选的标志位,如LOG_FLAG_SHOWDATE
	@param fmt
		格式字符串
	@param ...
		可变长参数列表
	*/
	virtual void LogWarning(const char* key, EOutLogFlag flag, const char* fmt, ... ) = 0;
	virtual void LogWarning(const char* key, EOutLogFlag flag, const char* fmt, va_list args) = 0;

	/** 日志输出, 输出Error日志
	@param key
		日志文件对应的key值
	@param iFlag
		发送日志可选的标志位,如LOG_FLAG_SHOWDATE
	@param fmt
		格式字符串
	@param ...
		可变长参数列表
	*/
	virtual void LogError(const char* key, EOutLogFlag flag, const char* fmt, ... ) = 0;
	virtual void LogError(const char* key, EOutLogFlag flag, const char* fmt, va_list args) = 0;

	/** 日志输出, 输出一整块二进制数据块
	@param key
		日志文件对应的key值
	@param data
		将要发送的日志数据缓冲
	@param dataLen
		日志缓冲的长度
	*/
	virtual void LogData(const char* key, const char* data, int dataLen) = 0;

	/** 将缓冲中的数据写入到设备中
		在日志的输出过程中，可能是被缓冲了，并没真正写入到设备中
	@param key
		日志文件对应的key值
	*/
	virtual void Flush(const char* key) = 0;
};

//tolua_end

#endif // _I_LOGSYS_H_
