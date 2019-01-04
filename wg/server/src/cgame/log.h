#ifndef _LOG_H_
#define _LOG_H_
#include <commhead.h>
#include <singleton.h>
#include <string>
#include <safefun.h>
 
const int LOG_MAX_FILE_SIZE = 2000000;
const int LOG_MAX_ITEMS = 1;
const int LOG_ITEM_LEN = 4096;
const int LOG_CATCH_MAX_LEN = LOG_ITEM_LEN*LOG_MAX_ITEMS+LOG_MAX_ITEMS+1;


class CLog : public Singleton<CLog>
{
	DECLARE_SINGLETON(CLog);
public:
	virtual ~CLog();

public:
	bool Init(const char* lpszFile, int iMaxCatchItems=LOG_MAX_ITEMS, bool bOutputTime=true);
	void Log(const char* lpszFmt, ...);
	void FlushToFile();

private:
	CLog();

private:
	void ShiftFile();

private:
	bool m_bOutputTime;
	std::string m_strBaseFile;
	std::string m_strLogFile;
	std::string m_strLogIdxFile;
	char* m_lpszCatchBuf;
	int m_iMaxCatchItems;
	int m_iCatchItems;
	ulong m_ulLastLogTime;
	int m_iFileIdx;
};

//---------------------------------------------------------------------------------
inline CLog::CLog():m_bOutputTime(true),
	m_lpszCatchBuf(NULL),
	m_iMaxCatchItems(LOG_MAX_ITEMS),
	m_iCatchItems(0),
	m_ulLastLogTime(0),
	m_iFileIdx(1)
{
}

//---------------------------------------------------------------------------------
inline CLog::~CLog()
{
	FlushToFile();
	SafeDeleteArray(m_lpszCatchBuf);
}

//---------------------------------------------------------------------------------
inline bool CLog::Init(const char* lpszFile, int iMaxCatchItems, bool bOutputTime)
{
	m_strBaseFile = lpszFile;
	m_iMaxCatchItems = iMaxCatchItems;
	m_bOutputTime = bOutputTime;
	SafeDeleteArray(m_lpszCatchBuf);
	m_lpszCatchBuf = new char[LOG_CATCH_MAX_LEN];
	m_lpszCatchBuf[0] = 0;
	m_strLogIdxFile = lpszFile;
	m_strLogIdxFile = m_strLogIdxFile + ".idx";

	FILE* fp = fopen(m_strLogIdxFile.c_str(), "r");
	if ( fp != NULL )
	{
		fscanf(fp, "%d", &m_iFileIdx);
		fclose(fp);
	}
	else
	{
		fp = fopen(m_strLogIdxFile.c_str(), "w");
		if ( fp != NULL )
		{
			fprintf(fp, "%d", m_iFileIdx);
			fclose(fp);
		}
	}

	char szBuf[1024];
	SafeSprintf(szBuf, sizeof(szBuf), "%s%08d.log", m_strBaseFile.c_str(), m_iFileIdx);
	m_strLogFile = szBuf;
	return true;
}

//---------------------------------------------------------------------------------
inline void CLog::Log(const char* lpszFmt, ...)
{
#ifdef LINUX
	replace(lpszFmt, "%I64d", "%lld ");
	replace(lpszFmt, "%I64u", "%llu ");
#endif
	char szFmt[LOG_ITEM_LEN];
	va_list argPtr;
	va_start(argPtr, lpszFmt);

	time_t lTime = 0;
	tm* lpstToday = NULL;
	time( &lTime );
	lpstToday = localtime( &lTime );
	SafeSprintf(szFmt, sizeof(szFmt), "[%d-%02d-%02d %02d:%02d:%02d]:", 
		lpstToday->tm_year+1900, 
		lpstToday->tm_mon+1,
		lpstToday->tm_mday,
		lpstToday->tm_hour,
		lpstToday->tm_min,
		lpstToday->tm_sec);
	long lPos = strlen(szFmt);
	long lSize = sizeof(szFmt) - lPos;
	_vsnprintf(szFmt+lPos, lSize, lpszFmt, argPtr);
	SafeStrCat(m_lpszCatchBuf, szFmt, LOG_CATCH_MAX_LEN);
	SafeStrCat(m_lpszCatchBuf, "\n", LOG_CATCH_MAX_LEN);
	va_end(argPtr);
	++m_iCatchItems;
	
	if ( m_iCatchItems >= m_iMaxCatchItems || (lTime - m_ulLastLogTime) > 30 )
	{
		m_ulLastLogTime = (ulong)lTime;
		FlushToFile();
	}
}

//---------------------------------------------------------------------------------
inline void CLog::FlushToFile()
{
	if ( m_iCatchItems > 0 )
	{
		ShiftFile();
		FILE* fp = fopen(m_strLogFile.c_str(), "a");
		if ( fp != NULL )
		{
			fprintf(fp, "%s", m_lpszCatchBuf);
			fclose(fp);
		}
		m_iCatchItems = 0;
		m_lpszCatchBuf[0] = 0;
	}
}

//---------------------------------------------------------------------------------
inline void CLog::ShiftFile()
{
	FILE* fp = fopen(m_strLogFile.c_str(), "r");
	if ( fp != NULL )
	{
		fseek(fp, 0, SEEK_END);
		int iLen = ftell(fp);
		fclose(fp);

		if ( iLen > LOG_MAX_FILE_SIZE )
		{
			++m_iFileIdx;
			FILE* fpidx = fopen(m_strLogIdxFile.c_str(), "w");
			if ( fpidx != NULL )
			{
				fprintf(fp, "%d", m_iFileIdx);
				fclose(fpidx);
			}

			char szBuf[1024];
			SafeSprintf(szBuf, sizeof(szBuf), "%s%08d.log", m_strBaseFile.c_str(), m_iFileIdx);
			m_strLogFile = szBuf;
		}
	}
}

//=================================================================================
#define LOG_INIT CLog::Instance()->Init
#define LOG CLog::Instance()->Log
#define LOG_FLUSH CLog::Instance()->FlushToFile

#endif // _LOG_H_
