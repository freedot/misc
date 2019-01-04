#ifndef _DBGHELPER_H__
#define _DBGHELPER_H__
#include <string>

class DbgHelper  
{
public:
	DbgHelper();
	virtual ~DbgHelper();

public:
	const char* GetHelpInfo(const char* lpCmd);

private:
	std::string m_strHelpInfo;
};

#endif // _DBGHELPER_H__
