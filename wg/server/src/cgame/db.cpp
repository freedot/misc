#include "db.h"
 
IDB* CreateIDB()
{
	return new CDB;
}

void DestroyIDB(IDB* lpIDB)
{
	if ( lpIDB != NULL )
	{
		CDB* lpDB = (CDB*)lpIDB;
		delete lpDB;
	}
}

CDB::CDB()
{
    m_handle = 0;
    m_res = 0;
    SetLog(true);
}

CDB::~CDB()
{
    Close();
}

bool CDB::Connect( const char *lpszHost, 
				  unsigned short usPort, 
				  const char *lpszName, 
				  const char *lpszPwd, 
				  const char *lpszDb )
{
    Close();
    m_handle = mysql_init(0);
    if (m_handle==0) return false;
    if (usPort == 0) usPort = MYSQL_PORT;
    if (mysql_real_connect(m_handle, lpszHost, lpszName, lpszPwd, 0, usPort, 0, 0) == 0)
    {
        ShowError();
        return false;
    }

    if (mysql_select_db(m_handle, lpszDb) != 0) 
    {
        ShowError();
        return false;
    }
    return true;
}

bool CDB::SetCharacterSet(const char* lpszSetName)
{
	return ( mysql_set_character_set(m_handle, lpszSetName) == 0 );
}

unsigned long CDB::RealEscapeString(char *lpszTo, const char *lpszFrom, unsigned long ulLength)
{
	return mysql_real_escape_string(m_handle, lpszTo, lpszFrom, ulLength);
}

void CDB::Close()
{
    if (m_handle)
    {
        mysql_close(m_handle);
        m_handle = 0;
    }
	
    if (m_res)
    {
        mysql_free_result(m_res);
        m_res = 0;
    }
}

bool CDB::Query(const char *sql,int len)
{
    if (!m_handle) return false;
    if (len == 0) len = strlen(sql);
    if (mysql_real_query(m_handle, sql, len) != 0) 
    {
        ShowError();
        return false;
    }

    if (m_res != 0) mysql_free_result(m_res);
    m_res = mysql_store_result(m_handle);
    if (m_res != 0)
    {
        m_fieldCnt = mysql_num_fields(m_res);
        m_fields = mysql_fetch_fields(m_res);
    }
    return true;
}

int CDB::GetFieldCount()
{
    return m_fieldCnt;
}

int CDB::GetRowCount()
{
    return (int)mysql_num_rows(m_res);
}

void CDB::ShowError()
{
    if ( m_log )
	{
		mysql_error(m_handle);
	}
}

//-------------------------------------
// Get next row
//-------------------------------------
bool CDB::GetRow()
{
    m_row = mysql_fetch_row(m_res);
    if (m_row == 0) 
        return false;
    return true;
}

char *CDB::GetField(char *fname, int *pnLen)
{
    int i;
    unsigned long *lengths;
    lengths = mysql_fetch_lengths(m_res);
    for(i = 0; i < m_fieldCnt; i++)
    {
        if (strcmp(fname,m_fields[i].name)==0)
        {
            if(pnLen) *pnLen = lengths[i];
            return m_row[i];
        }
    }
    return 0;
}

void CDB::GetFieldsLen(unsigned long** lplpLengths)
{
	*lplpLengths = mysql_fetch_lengths(m_res);
}

//-------------------------------------
// Get Field Name , Data Type And Value
//-------------------------------------
bool CDB::GetField(int idx,char *field,int *type,char **value)
{
    if(idx<0 || idx>m_fieldCnt)
        return false;
    strcpy(field,m_fields[idx].name);
    *type = m_fields[idx].type;
    *value = m_row[idx];
    return true;
}

//-------------------------------------
// Get Field Value
//-------------------------------------
char* CDB::GetField(int idx)
{
    if(idx<0 || idx>m_fieldCnt)
        return NULL;
    return m_row[idx];
}

//------------------------
// Get Field Name And Type
//------------------------
int CDB::GetFieldInfo(int nIdx, char *pszName)
{
    if(nIdx<0 || nIdx>=m_fieldCnt)
    {
        return 0;
    }
    if(pszName)
    {
        strcpy(pszName, m_fields[nIdx].name);
    }
    return m_fields[nIdx].type;
}


//------------------------------
// Get Field Data Type And Value
//------------------------------
bool CDB::GetFieldContent(int nIdx , int *pnType , char **ppValue)
{
    if(nIdx<0 || nIdx>=m_fieldCnt)
    {
        return false;
    }
    *pnType  = m_fields[nIdx].type;
    *ppValue = m_row[nIdx];
    return true;
}

unsigned long CDB::GetInsertId()
{
    return (unsigned long)mysql_insert_id(m_handle);
}

unsigned long CDB::GetAffectedRows()
{
    return (unsigned long)mysql_affected_rows(m_handle);
}

void CDB::SetLog(bool log)
{
    m_log = log;
} 

unsigned int CDB::GetLastError()
{
    return mysql_errno(m_handle);
}

const char* CDB::GetLastErrorStr()
{
	return mysql_error(m_handle);
}