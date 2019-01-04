/*
 * MySQLDB.cpp
 *
 *  Created on: 2013-3-5
 *      Author: qujianbiao
 */

#include "MySQLDB.h"
#include <iostream>
DECLARE_DLLMAIN()

IInterface* CreateInterface(const TQGUID& guid) {
	if (guid != IUID_IDB)
		return NULL;

	IInterface* interFace = new IO::MySQLDB;
	interFace->SetIUID(guid);
	return interFace;
}

void DestroyInterface(IInterface** interFace) {
	if (interFace == NULL || *interFace == NULL)
		return;
	if ((*interFace)->GetIUID() != IUID_IDB)
		return;

	delete ((IO::MySQLDB*) (*interFace));
	(*interFace) = NULL;
}

/////////////////////////////////////////////////////////
namespace IO {

MySQLDB::MySQLDB() {
	INIT_TQINTERFACE()
	m_handle = 0;
	m_res = 0;
	SetLog(true);
	m_realEscapeStrBuf = new char[REALESCAPESTRBUF_LEN];
	m_port = 0;
}

MySQLDB::~MySQLDB() {
	Close();
	SafeDeleteArray(m_realEscapeStrBuf);
}

bool MySQLDB::Connect(const char *host, ushort port, const char *userName, const char *password, const char *dbName) {
	m_host = host;
	m_port = port;
	m_userName = userName;
	m_password = password;
	m_dbName = dbName;

	Close();
	m_handle = mysql_init(0);
	if (m_handle == 0)
		return false;
	if (port == 0)
		port = MYSQL_PORT;
	if (mysql_real_connect(m_handle, host, userName, password, 0, port, 0, 0) == 0) {
		ShowError();
		return false;
	}

	if (mysql_select_db(m_handle, dbName) != 0) {
		ShowError();
		return false;
	}
	return true;
}

bool MySQLDB::ReConnect() {
	bool ret = Connect(m_host.c_str(), m_port, m_userName.c_str(), m_password.c_str(), m_dbName.c_str());
	if (!ret) {
		return ret;
	}
	return SetCharacterSet(m_charSetName.c_str());
}

bool MySQLDB::SetCharacterSet(const char* charSetName) {
	m_charSetName = charSetName;
	return (mysql_set_character_set(m_handle, charSetName) == 0);
}

const char* MySQLDB::RealEscapeString(const char* rawString, int rawStrLen) {
	if (REALESCAPESTRBUF_LEN < 2 * rawStrLen + 1) {
		return NULL;
	}

	unsigned long ret = mysql_real_escape_string(m_handle, m_realEscapeStrBuf, rawString, rawStrLen);
	if (ret == 0) {
		return NULL;
	}

	return m_realEscapeStrBuf;
}

ulong MySQLDB::RealEscapeString(char *to, const char *from, ulong len) {
	return mysql_real_escape_string(m_handle, to, from, len);
}

void MySQLDB::Close() {
	if (m_handle) {
		mysql_close(m_handle);
		m_handle = 0;
	}

	if (m_res) {
		mysql_free_result(m_res);
		m_res = 0;
	}
}

#define CR_SERVER_GONE_ERROR 2006
bool MySQLDB::Query(const char *sql, int len) {
	if (!m_handle)
		return false;
	if (len == 0)
		len = strlen(sql);
	if (mysql_real_query(m_handle, sql, len) != 0) {
		ShowError();
		if (GetLastError() == CR_SERVER_GONE_ERROR && ReConnect()) {
			return Query(sql, len);
		}
		return false;
	}

	if (m_res != 0)
		mysql_free_result(m_res);
	m_res = mysql_store_result(m_handle);
	if (m_res != 0) {
		m_fieldCnt = mysql_num_fields(m_res);
		m_fields = mysql_fetch_fields(m_res);
	}
	return true;
}

int MySQLDB::GetFieldCount() {
	return m_fieldCnt;
}

int MySQLDB::GetRowCount() {
	return (int) mysql_num_rows(m_res);
}

void MySQLDB::ShowError() {
	if (m_log) {
		std::cerr << "SQL error = [" << GetLastErrorStr() << "], error code = [" << GetLastError() << "]" << std::endl;
	}
}

//-------------------------------------
// Get next row
//-------------------------------------
bool MySQLDB::GetRow() {
	m_row = mysql_fetch_row(m_res);
	if (m_row == 0)
		return false;
	return true;
}

char *MySQLDB::GetField(const char *fname, int *pnLen) {
	int i;
	unsigned long *lengths;
	lengths = mysql_fetch_lengths(m_res);
	for (i = 0; i < m_fieldCnt; i++) {
		if (strcmp(fname, m_fields[i].name) == 0) {
			if (pnLen)
				*pnLen = lengths[i];
			return m_row[i];
		}
	}
	return 0;
}

//-------------------------------------------
// Get Field data value, data len, data type
//-------------------------------------------
char *MySQLDB::GetField(char *fname, int *pnLen, int *type) {
	int i;
	unsigned long *lengths;
	lengths = mysql_fetch_lengths(m_res);
	for (i = 0; i < m_fieldCnt; i++) {
		if (strcmp(fname, m_fields[i].name) == 0) {
			*pnLen = lengths[i];
			*type = m_fields[i].type;
			return m_row[i];
		}
	}
	return NULL;
}

//-------------------------------------
// Get Field Name , Data Type And Value
//-------------------------------------
bool MySQLDB::GetField(int idx, char *field, int *type, char **value) {
	if (idx < 0 || idx > m_fieldCnt)
		return false;
	strcpy(field, m_fields[idx].name);
	*type = m_fields[idx].type;
	*value = m_row[idx];
	return true;
}

//-------------------------------------
// Get Field Value
//-------------------------------------
char* MySQLDB::GetField(int idx) {
	if (idx < 0 || idx > m_fieldCnt)
		return NULL;
	return m_row[idx];
}

//------------------------
// Get Field Name And Type
//------------------------
int MySQLDB::GetFieldInfo(int idx, char *name) {
	if (idx < 0 || idx >= m_fieldCnt) {
		return 0;
	}
	if (name) {
		strcpy(name, m_fields[idx].name);
	}
	return m_fields[idx].type;
}

//------------------------------
// Get Field Data Type And Value
//------------------------------
bool MySQLDB::GetFieldContent(int idx, int *type, char **value) {
	if (idx < 0 || idx >= m_fieldCnt) {
		return false;
	}
	*type = m_fields[idx].type;
	*value = m_row[idx];
	return true;
}

ulong MySQLDB::GetInsertId() {
	return (ulong) mysql_insert_id(m_handle);
}

ulong MySQLDB::GetAffectedRows() {
	return (ulong) mysql_affected_rows(m_handle);
}

void MySQLDB::SetLog(bool log) {
	m_log = log;
}

uint MySQLDB::GetLastError() {
	return mysql_errno(m_handle);
}

const char* MySQLDB::GetLastErrorStr() {
	return mysql_error(m_handle);
}

void MySQLDB::GetFieldsLen(unsigned long** lengths) {
	*lengths = mysql_fetch_lengths(m_res);
}

} /* namespace IO */
