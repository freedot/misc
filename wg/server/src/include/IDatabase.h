#ifndef _I_DATEBASE_H_
#define _I_DATEBASE_H_
#include "IInterface.h"

// {4BCC118B-60F9-4e52-9361-655A0ACD8E89}
static const TQGUID IUID_IDB = { 0x4bcc118b, 0x60f9, 0x4e52, { 0x93, 0x61, 0x65,
		0x5a, 0xa, 0xcd, 0x8e, 0x89 } };

static const int REALESCAPESTRBUF_LEN = 1048576;

namespace IO {

class IDatabase //tolua_export
	:public IInterface
	 { //tolua_export
public:
	virtual ulong GetInsertId() = 0;

	virtual ulong GetAffectedRows() = 0;

	virtual bool Connect(const char *host, ushort port, const char *userName,
			const char *password, const char *dbName) = 0;

	virtual bool SetCharacterSet(const char* charSetName) = 0;

//tolua_begin
	virtual bool Query(const char *sql, int len = 0) = 0;

	virtual bool GetRow() = 0;

	virtual int GetRowCount() = 0;

	virtual int GetFieldCount() = 0;

	virtual char* GetField(char *fieldName, int *len, int *type) = 0;

	virtual uint GetLastError() = 0;

	virtual const char* GetLastErrorStr() = 0;

	/** 只能在单线程中使用 */
	virtual const char* RealEscapeString(const char* rawString,
			int rawStrLen) = 0;

//tolua_end
	virtual ulong RealEscapeString(char *to, const char *from, ulong toLen) = 0;

	virtual bool GetFieldContent(int idx, int * type, char** value) = 0;

	virtual void SetLog(bool bLog) = 0;

	virtual void ShowError() = 0;

	virtual int GetFieldInfo(int idx, char *name) = 0;

	virtual char* GetField(const char *name, int *len) = 0;

	virtual bool GetField(int idx, char *field, int *type, char **value) = 0;

	virtual char* GetField(int idx) = 0;

	virtual void GetFieldsLen(unsigned long** lengths) = 0;

	virtual void Close() = 0;
};//tolua_export

}// namespace IO end

#endif //_I_DATEBASE_H_
