#ifndef _GAME_H_
#define _GAME_H_ 
#include <commhead.h>
#include <tinyxml/tinyxml.h>
#include <safefun.h>
#include <pkgBase.h>
#include "idb.h"
#include "tean.h"
#include "log.h"
#include "zoneline.h"
#include "config.h"
#include <map>
#include <python/Python.h>

#define MAX_ZONE_COUNT 2

class CGame {
public:
	/** 默认构造函数 */
	CGame();
	/** 析构函数 */
	virtual ~CGame();

public:
	void SetConfig(const char* cfg, const char* log);

	/** 初始化游戏对象
	 @return 返回true表示初始化成功
	 */
	bool Init();

public:
	/** 重新装载所有线的配置
	 @return 返回true表示装在成功
	 */
	bool ReLoadZones();

	/** 检查当前的用户名是否存在
	 @param 将要被检查的用户名
	 @return 返回1表示存在
	 */
	int HasUserName(const char* lpszUserName);

	/** 注册一个用户帐号
	 @param lpszUser 用户名
	 @param lpszPwd 用户密码
	 @param lpszEmail 用户邮箱
	 @param lpszIp 用户注册ip
	 @param lpszCommentId 推荐的用户名
	 @param iCommentFlag 推荐类型
	 @return 返回1表示注册成功
	 */
	int RegAccount(const char* lpszUser, const char* lpszPwd,
			const char* lpszEmail, const char* lpszIp,
			const char* lpszCommentId, const int iCommentFlag);

	/** 检查用户名密码是否正确
	 @param lpszUser 用户名
	 @param lpszPwd 密码
	 @return 返回1表示存在
	 */
	int HasUserPwd(const char* lpszUser, const char* lpszPwd);

	/** 检查指定的用户名是否有该邮件
	 @param lpszUser 用户名
	 @param lpszEmail 邮箱
	 @return 返回1表示存在
	 */
	int HasUserEmail(const char* lpszUser, const char* lpszEmail);

	/** 获得区的列表
	 @param lpszUser 用户名
	 @param iFlag 1-表示电信，2-表示网通，3-表示用户已激活
	 @return 返回区列表的python对象
	 */
	PyObject* GetZonelist(const char* lpszUser, int iFlag);

	PyObject* GetZoneGrouplist();

	/** 改变用户密码
	 @param lpszUser 用户名
	 @param lpszNewPwd 新的密码
	 @return 1表示修改成功
	 */
	int ChangeUserpassword(const char* lpszUser, const char* lpszNewPwd);

	/** 加密一段字符串，输出的也是字符串形式
	 @param lpInBuf 将要被加密的字符串
	 @param lpOutBuf 存放加密后的结果
	 @param iOutBufLen 存放加密后的结果buf的最大长度
	 */
	void EncodeSigStr(const char* lpInBuf, char* lpOutBuf, int iOutBufLen);

	/** 解密一段字符串，输出的也是字符串形式
	 @param lpInBuf 将要被解密的字符串
	 @param lpOutBuf 存放解密后的结果
	 @param iOutBufLen 存放解密后的结果buf的最大长度
	 */
	void DecodeSigStr(const char* lpInBuf, char* lpOutBuf, int iOutBufLen);

	/** 删除当前线下的所有角色数据
	 */
	void DeleteRoles();

public:
	typedef std::map<ushort, SDir> StdMapZone;
	typedef StdMapZone::iterator StdMapDirIter;
	typedef std::vector<SDir> StdVctDir;
	typedef StdVctDir::iterator StdVctZoneIter;

private:
	/** 初始化密钥 */
	void InitKey();

	/** 装在服务器的配置 */
	bool LoadConfig();

	/** 初始化游戏系统 */
	bool InitGame();

	/** 连接数据库 
	 @return 返回true表示连接成功
	 */
	bool ConnectDB();

	/** 关闭数据库 */
	void CloseDB();

	/** 装载所有线的配置
	 @return 返回true表示装在成功
	 */
	bool LoadZones();

	int LoadXMLInteger(TiXmlDocument& doc, const char* key);
	const char* LoadXMLString(TiXmlDocument& doc, const char* key);
	void GetMyActiveZoneList(const char* user, StdVctDir& zone);
	void GetZoneListByFlag(const char* user, StdVctDir& zonelist, uchar flag);
	PyObject* NewPyZoneList(StdVctDir* zonelist);
	int ReadBlobFromDB(const char* buf, int buflen, SPkgBase* basepkg);
	int WriteBlobForDB(char* buf, int buflen, const SPkgBase* basepkg);

private:
	/// 配置文件
	std::string m_configName;

	/// 日志文件
	std::string m_logName;

	/// 初始化成功标志
	bool m_bInitOk;
	/// 线程是否停止标志
	bool m_bStop;
	/// 数据库对象
	IDB* m_db;
	/// 用做查询的Sql缓冲buf
	char* m_lpszSql;
	/// 签名秘钥
	uchar m_aucKey[MAX_KEY_LEN];
	/// 所有小区map表
	StdMapZone m_dirs;
	/// 游戏配置文件
	SConfig m_stConfig;
};

#endif // _GAME_H_
