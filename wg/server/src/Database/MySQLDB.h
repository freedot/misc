/*
 * MySQLDB.h
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#ifndef MYSQLDB_H_
#define MYSQLDB_H_
#include <IDatabase.h>

#if defined(WIN32)
#include <./mysql/mysql.h>
#elif defined(LINUX)
#include </usr/include/mysql/mysql.h>
#endif

namespace IO {

class MySQLDB: public IO::IDatabase {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()
	DECLARE_DEFAULT_ONONETIME()

public:
	ulong GetInsertId();

	ulong GetAffectedRows();

	bool Query(const char *sql, int len);

	bool Connect(const char *host, ushort port, const char *userName,
			const char *password, const char *dbName);

	bool SetCharacterSet(const char* charSetName);

	const char* RealEscapeString(const char* rawString, int rawStrLen);

	ulong RealEscapeString(char *to, const char *from, ulong toLen);

	bool GetField(int idx, char *field, int *type, char **value);

	bool GetFieldContent(int idx, int * type, char **value);

	bool GetRow();

	void SetLog(bool bLog);

	void ShowError();

	int GetFieldInfo(int idx, char *name);

	int GetRowCount();

	int GetFieldCount();

	char* GetField(const char *name, int *lpiLen);

	char* GetField(char *fname, int *pnLen, int *type);

	char* GetField(int idx);

	void GetFieldsLen(unsigned long** lengths);

	uint GetLastError();

	const char* GetLastErrorStr();

	void Close();

public:
	MySQLDB();
	virtual ~MySQLDB();

private:
	bool ReConnect();

private:
	bool m_log;
	MYSQL* m_handle;
	MYSQL_RES* m_res;
	MYSQL_ROW m_row;
	MYSQL_FIELD* m_fields;
	int m_fieldCnt;

	char* m_realEscapeStrBuf;

	std::string m_host;
	unsigned short m_port;
	std::string m_userName;
	std::string m_password;
	std::string m_dbName;
	std::string m_charSetName;
};

} /* namespace IO */
#endif /* MYSQLDB_H_ */
