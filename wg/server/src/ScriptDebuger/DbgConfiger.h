#ifndef _DBGCONFIGER_H__
#define _DBGCONFIGER_H__
#include <singleton.h>
#include <set>

class DbgConfiger : public Singleton<DbgConfiger>
{
	DECLARE_SINGLETON(DbgConfiger);
public:
	/** 从文件装载Debug配置项
	@param lpszFileName
		配置文件名称
	@return
		返回true或false
	*/
	bool Load(const char* lpszFileName);

	/** 是否是合法的ip
	@return
		返回true表示合法的ip
	*/
	bool IsValidIp(uint32 lIp);

	/** 是否在启动时就设置调试状态
	@return
		返回true需要设置
	*/
	bool IsSetTrackInStart();

private:
	DbgConfiger();

private:
	std::set<uint32> m_setVaildIps;
	bool m_bSetTrackInStart;
};

#endif // _DBGCONFIGER_H__
