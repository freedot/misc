#ifndef _I_DB_H_
#define _I_DB_H_
 
class IDB
{
public:
    virtual unsigned long GetInsertId() = 0;
	
    virtual unsigned long GetAffectedRows() = 0;
	
    virtual bool Query(const char *lpszSql, int ilen) = 0;
	
    virtual bool Connect(const char *lpszHost, unsigned short usPort, 
		const char *lpszName, const char *lpszPwd, const char *lpszDb) = 0;
	
	virtual bool SetCharacterSet(const char* lpszSetName) = 0;
	
	virtual unsigned long RealEscapeString(char *lpszTo, const char *lpszFrom, unsigned long ulLength) = 0;
	
    virtual bool GetField(int iIdx, char *lpszField, int *lpiType,char **lplpszValue) = 0;
	
    virtual bool GetFieldContent(int iIdx , int * lpiType , char **lplpszValue) = 0;
	
    virtual bool GetRow() = 0;
	
    virtual void SetLog(bool bLog) = 0;
	
    virtual void ShowError() = 0;
	
    virtual int GetFieldInfo(int iIdx, char *lpszName) = 0;
	
    virtual int GetRowCount() = 0;
	
    virtual int GetFieldCount() = 0;
	
    virtual char* GetField(char *lpszName,int *lpiLen) = 0;

	virtual void GetFieldsLen(unsigned long** lplpLengths) = 0;
	
	virtual char* GetField(int idx) = 0;
	
    virtual unsigned int GetLastError() = 0;

	virtual const char* GetLastErrorStr() = 0;
	
	virtual void Close() = 0;
};

extern IDB* CreateIDB();
extern void DestroyIDB(IDB* lpIDB);

#endif // _I_DB_H_
