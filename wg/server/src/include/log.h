#ifndef _LOG_H_
#define _LOG_H_
#include "singleton.h"
#include "ILogSys.h"

class CLog: public Singleton<CLog> {
	DECLARE_SINGLETON (CLog);
public:
	virtual ~CLog();

public:
	bool Init(ILogSys* lpLogSys);
	void Log(const char* lpszKey, const char* lpszFmt, ...);
	void Flush(const char* lpszKey);

private:
	CLog();

private:
	ILogSys* m_lpLogSys;
};

//---------------------------------------------------------------------------------
inline CLog::CLog() :
		m_lpLogSys(NULL) {
}

//---------------------------------------------------------------------------------
inline CLog::~CLog() {
}

//---------------------------------------------------------------------------------
inline bool CLog::Init(ILogSys* lpLogSys) {
	m_lpLogSys = lpLogSys;
	return true;
}

//---------------------------------------------------------------------------------
inline void CLog::Log(const char* lpszKey, const char* lpszFmt, ...) {
	if (m_lpLogSys != NULL) {
		va_list argPtr;
		va_start(argPtr, lpszFmt);
		m_lpLogSys->Log(lpszKey, EOLF_OUTTIME, lpszFmt, argPtr);
		va_end(argPtr);
	}
}

//---------------------------------------------------------------------------------
inline void CLog::Flush(const char* lpszKey) {
	if (m_lpLogSys != NULL) {
		m_lpLogSys->Flush(lpszKey);
	}
}

//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
#define LOG_INIT CLog::Instance()->Init
#define LOG CLog::Instance()->Log
#define LOG_FLUSH CLog::Instance()->Flush

#endif // _LOG_H_
