#ifndef _CDB_H_
#define _CDB_H_
#include "idb.h"
#include <platform.h>
#include <mysql/mysql.h>
 
class CDB : public IDB
{
public:
    unsigned long GetInsertId();
	
    unsigned long GetAffectedRows();
	
    bool Query(const char *lpszSql, int ilen);
	
    bool Connect(const char *lpszHost, unsigned short usPort, 
		const char *lpszName, const char *lpszPwd, const char *lpszDb);
	
	bool SetCharacterSet(const char* lpszSetName);
	
	unsigned long RealEscapeString(char *lpszTo, const char *lpszFrom, unsigned long ulLength);
	
    bool GetField(int iIdx, char *lpszField, int *lpiType,char **lplpszValue);
	
    bool GetFieldContent(int iIdx , int * lpiType , char **lplpszValue);
	
    bool GetRow();
	
    void SetLog(bool bLog);
	
    void ShowError();
	
    int GetFieldInfo(int iIdx, char *lpszName);
	
    int GetRowCount();
	
    int GetFieldCount();
	
    char* GetField(char *lpszName,int *lpiLen);
	
	void GetFieldsLen(unsigned long** lplpLengths);

	char* GetField(int idx);

    unsigned int GetLastError();

	const char* GetLastErrorStr();
	
	void Close();
    
public:
    CDB(void);
    virtual ~CDB(void);
	
private:
    bool            m_log;
    MYSQL*          m_handle;
    MYSQL_RES*      m_res;
    MYSQL_ROW       m_row;
    MYSQL_FIELD*    m_fields;
    int             m_fieldCnt;
};

#endif // _CDB_H_
