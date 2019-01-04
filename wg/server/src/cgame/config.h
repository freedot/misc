#ifndef _CONFIG_H_
#define _CONFIG_H_ 
const ulong MAX_CFG_ZONE_CNT = 256;
const ulong MAX_PATH_LEN = 1024;

struct SConfig
{
	/// 数据库的ip
	std::string strDBHostIp;
	/// 数据库的端口
	ushort usDBHostPort;
	/// 登录数据库用户名
	std::string strDBUsername;
	/// 登录数据库的密码
	std::string strDBPassword;
	/// 登录的数据库的具体名
	std::string strDatabase;
	
	SConfig():usDBHostPort(0){}
};

#endif // _CONFIG_H_
