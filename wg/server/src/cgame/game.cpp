#include "game.h"
#include "zoneactive.h"

extern "C" {
#include "md5.h"
}
;
#define CONFIG_PATH ""
#define DEFAULT_LOG_PATH ""

#define ZONE_FLAG_COMMENT 98
#define ZONE_FLAG_MYZONE 99

//-----------------------------------------------------------------------------
CGame::CGame() :
		m_bInitOk(false), m_bStop(false), m_db(NULL) {
	m_lpszSql = new char[MAX_SQL_LEN];
	m_configName = CONFIG_PATH;
	m_logName = DEFAULT_LOG_PATH;
}

//-----------------------------------------------------------------------------
CGame::~CGame() {
	m_bStop = true;
	Sleep(3000);
	DestroyIDB(m_db);
	SafeDeleteArray(m_lpszSql);
	LOG_FLUSH();
}

//-----------------------------------------------------------------------------
void CGame::SetConfig(const char* cfg, const char* log) {
	m_configName = cfg;
	m_logName = log;
}

//-----------------------------------------------------------------------------
bool CGame::Init() {
	LOG_INIT(m_logName.c_str());
	InitKey();

	if (!LoadConfig()) {
		return false;
	}

	if (!ConnectDB()) {
		return false;
	}

	if (!InitGame()) {
		return false;
	}
	m_bInitOk = true;
	return true;
}

//-----------------------------------------------------------------------------
bool CGame::LoadConfig() {
	TiXmlDocument doc(m_configName.c_str());
	doc.LoadFile();
	if (doc.Error() && doc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		std::cerr << "Load global configure xml file failed: " << m_configName
				<< std::endl;
		return false;
	}

	// 读取数据库服务器IP配置
	m_stConfig.strDBHostIp = LoadXMLString(doc, "DBHostIp");
	// 读取数据库服务器port配置
	m_stConfig.usDBHostPort = (ushort) LoadXMLInteger(doc, "DBHostPort");
	// 读取数据库服务器登陆用户名配置
	m_stConfig.strDBUsername = LoadXMLString(doc, "DBUsername");
	// 读取数据库服务器登陆密码配置
	char dkey[17] = { 0 };
	DecodeSigStr(LoadXMLString(doc, "DBPassword"), dkey, sizeof(dkey));
	m_stConfig.strDBPassword = dkey;
	// 读取数据库名称配置
	m_stConfig.strDatabase = LoadXMLString(doc, "Database");

	return true;
}

//-----------------------------------------------------------------------------
void CGame::InitKey() {
	const char* loginKey = "3420891zcqEAD21r";
	memcpy(m_aucKey, loginKey, 16);
}

//-----------------------------------------------------------------------------
bool CGame::InitGame() {
	if (!LoadZones()) {
		return false;
	}
	return true;
}

//-----------------------------------------------------------------------------
void CGame::EncodeSigStr(const char* lpInBuf, char* lpOutBuf, int iOutBufLen) {
	uchar szOutBufTmp[4096];
	int iOutBufTmpLen = sizeof(szOutBufTmp);
	if (!XXEncrypt(1, (const uchar*) lpInBuf, strlen(lpInBuf), m_aucKey,
			szOutBufTmp, &iOutBufTmpLen)) {
		lpOutBuf[0] = '\0';
		return;
	}
	BinsToHexChars(lpOutBuf, iOutBufLen, szOutBufTmp, iOutBufTmpLen);
}

//-----------------------------------------------------------------------------
void CGame::DecodeSigStr(const char* lpInBuf, char* lpOutBuf, int iOutBufLen) {
	uchar szOutBufTmp[4096];
	int iOutBufTmpLen = sizeof(szOutBufTmp);
	HexCharsToBins(szOutBufTmp, &iOutBufTmpLen, lpInBuf, strlen(lpInBuf));
	if (!XXDecrypt(szOutBufTmp, iOutBufTmpLen, m_aucKey, (uchar *) lpOutBuf,
			&iOutBufLen)) {
		lpOutBuf[0] = '\0';
		return;
	}
	lpOutBuf[iOutBufLen] = '\0';
}

//-----------------------------------------------------------------------------
bool CGame::ConnectDB() {
	CloseDB();
	m_db = CreateIDB();
	if (!m_db->Connect(m_stConfig.strDBHostIp.c_str(), m_stConfig.usDBHostPort,
			m_stConfig.strDBUsername.c_str(), m_stConfig.strDBPassword.c_str(),
			m_stConfig.strDatabase.c_str())) {
		DestroyIDB(m_db);
		m_db = NULL;
		return false;
	}
	return true;
}

//-----------------------------------------------------------------------------
void CGame::CloseDB() {
	if (m_db != NULL) {
		m_db->Close();
		DestroyIDB(m_db);
		m_db = NULL;
	}
}

//-----------------------------------------------------------------------------
bool CGame::ReLoadZones() {
	m_dirs.clear();
	return LoadZones();
}

//-----------------------------------------------------------------------------
bool CGame::LoadZones() {
	LOG("start load zones ...");
	if ( !m_dirs.empty() ) return true;
	SafeSprintf(m_lpszSql, MAX_SQL_LEN, "select * from dirs order by id;");
	if ( !m_db->Query(m_lpszSql, strlen(m_lpszSql)) ) {
		LOG("*start zones failed!");
		return false;
	}
	for ( int i=0; m_db->GetRow(); ++i ) {
		SDir dir;
		dir.id = SafeAsciToULong(m_db->GetField(0));
		memcpy(dir.svrName, m_db->GetField(1), sizeof(dir.svrName));
		memcpy(dir.svrUrl, m_db->GetField(2), sizeof(dir.svrUrl));
		m_dirs[dir.id] = dir;
	}
	LOG("load zones ok!");
	return true;
}

//-----------------------------------------------------------------------------
int CGame::HasUserName(const char* user) {
	int ret = 0;
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"select username from users where username='%s';", user);
	if (!m_db->Query(m_lpszSql, strlen(m_lpszSql))) {
		ret = 0;
	} else if (m_db->GetRow() && m_db->GetRowCount() > 0) {
		ret = 1;
	}
	return ret;
}

//-----------------------------------------------------------------------------
int CGame::RegAccount(const char* user, const char* pwd, const char* email,
		const char* ip, const char* comment, const int commentflag) {
	int ret = 0;
	time_t nowtime = time(NULL);
	time_t regtime = nowtime;
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"insert into users (username,password,email,question,"
					"answer,reg_time,reg_ip,last_time,commend_id,commend_flag)"
					"values ('%s','%s','%s','','',%d,'%s',%d,'%s',%d);", user,
			pwd, email, regtime, ip, nowtime, comment, commentflag);
	ret = m_db->Query(m_lpszSql, strlen(m_lpszSql)) ? 1 : 0;
	return ret;
}

//-----------------------------------------------------------------------------
int CGame::HasUserPwd(const char* user, const char* pwd) {
	int ret = 0;
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"select username from users where username='%s' and password='%s';",
			user, pwd);
	if (!m_db->Query(m_lpszSql, strlen(m_lpszSql))) {
		ret = 0;
	} else if (m_db->GetRow() && m_db->GetRowCount() > 0) {
		ret = 1;
	}
	return ret;
}

//-----------------------------------------------------------------------------
int CGame::HasUserEmail(const char* user, const char* email) {
	int ret = 0;
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"select username from users where username='%s' and email='%s';",
			user, email);
	if (!m_db->Query(m_lpszSql, strlen(m_lpszSql))) {
		ret = 0;
	} else if (m_db->GetRow() && m_db->GetRowCount() > 0) {
		ret = 1;
	}
	return ret;
}

//-----------------------------------------------------------------------------
PyObject* CGame::GetZonelist(const char* user, int flag) {
	StdVctDir vctActives;
	if (flag == ZONE_FLAG_MYZONE) {
		GetMyActiveZoneList(user, vctActives);
	} else if (flag == ZONE_FLAG_COMMENT) {
	} else {
		GetZoneListByFlag(user, vctActives, flag);
	}
	return NewPyZoneList(&vctActives);
}

//-----------------------------------------------------------------------------
PyObject* CGame::GetZoneGrouplist() {
	int fieldCount = 2;
	PyObject * pyRows = PyList_New(1);
	PyObject * op = NULL;
	PyObject * pyFields = PyTuple_New(fieldCount);

	op = PyInt_FromLong(0);
	PyTuple_SetItem(pyFields, 0, op);

	op = PyString_FromString("All Servers"); // cluster name
	PyTuple_SetItem(pyFields, 1, op);

	PyList_SetItem(pyRows, 0, pyFields);
	return pyRows;
}

//-----------------------------------------------------------------------------
int CGame::ChangeUserpassword(const char* user, const char* newpwd) {
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"update users set password='%s' where username='%s';", user,
			newpwd);
	return m_db->Query(m_lpszSql, strlen(m_lpszSql)) ? 1 : 0;
}

//-----------------------------------------------------------------------------
int CGame::ReadBlobFromDB(const char* buf, int buflen, SPkgBase* basepkg) {
	if (buflen >= 2) {
		ushort ver = ntohs(*((ushort*) buf));
		buf += 2;
		buflen -= 2;
		if (basepkg->Decode(buf, buflen, 0, ver) < 0) {
			return 0;
		}
		return 1;
	}
	return 0;
}

//-----------------------------------------------------------------------------
int CGame::WriteBlobForDB(char* buf, int buflen, const SPkgBase* basepkg) {
	buf[0] = 0;
	if (buflen >= 2) {
		*((ushort*) m_lpszSql) = htons(CUR_VER);
		int packlen = ((SPkgBase*) basepkg)->Encode(m_lpszSql + 2,
				MAX_SQL_LEN - 2, 0, CUR_VER);
		if (packlen >= 0) {
			packlen += 2;
			if (buflen < 2 * packlen + 1) {
				return -1;
			}
			if (m_db->RealEscapeString(buf, m_lpszSql, packlen) > 0) {
				return 1;
			}
		}
	}
	return 0;
}

//-----------------------------------------------------------------------------
int CGame::LoadXMLInteger(TiXmlDocument& doc, const char* key) {
	int val = 0;
	TiXmlNode* node = doc.FirstChild(key);
	if (node != NULL) {
		TiXmlElement* element = node->ToElement();
		element->Attribute("value", &val);
	}
	return val;
}

//-----------------------------------------------------------------------------
const char* CGame::LoadXMLString(TiXmlDocument& doc, const char* key) {
	TiXmlNode* node = doc.FirstChild(key);
	if (node != NULL) {
		TiXmlElement* element = node->ToElement();
		return element->Attribute("value");
	}
	return NULL;
}

//-----------------------------------------------------------------------------
void CGame::GetMyActiveZoneList(const char* user, StdVctDir& dirs) {
	dirs.reserve(256);
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"select lastsvr, regsvrs from logins where uname='%s';", user);
	if (!m_db->Query(m_lpszSql, strlen(m_lpszSql)))
		return;
	if (!m_db->GetRow() || m_db->GetRowCount() == 0)
		return;
	ulong* lpLengths = NULL;
	m_db->GetFieldsLen(&lpLengths);
	SLoginsList regSvrs;
	if (ReadBlobFromDB(m_db->GetField(1), lpLengths[1], &regSvrs) != 1)
		return;
	if (regSvrs.usTotal == 0)
		return;

	ushort lastLoginSvrId = (ushort) SafeAsciToULong(m_db->GetField(0));
	StdMapDirIter iter = m_dirs.find(lastLoginSvrId);
	if (iter != m_dirs.end()) {
		dirs.push_back((*iter).second);
	}

	for (int i = 0; i < regSvrs.usTotal; ++i) {
		StdMapDirIter iter = m_dirs.find(regSvrs.ausZones[i]);
		if (iter != m_dirs.end() && lastLoginSvrId != (*iter).first) {
			dirs.push_back((*iter).second);
		}
	}
}

//-----------------------------------------------------------------------------
void CGame::GetZoneListByFlag(const char* user, StdVctDir& dirs, uchar flag) {
	dirs.reserve(256);
	StdMapDirIter iter = m_dirs.begin();
	for (; iter != m_dirs.end(); ++iter) {
		SDir& dir = (*iter).second;
		dirs.push_back(dir);
	}
}

//-----------------------------------------------------------------------------
PyObject* CGame::NewPyZoneList(StdVctDir* dirs) {
	PyObject * pyRows = NULL;
	if (dirs == NULL || dirs->empty())
		return pyRows;
	int fieldCount = 7;
	pyRows = PyList_New(dirs->size());
	StdVctZoneIter iter = dirs->begin();
	for (int i = 0; iter != dirs->end(); ++i, ++iter) {
		SDir& dir = (*iter);

		PyObject * op = NULL;
		PyObject * pyFields = PyTuple_New(fieldCount);

		op = PyInt_FromLong((long) dir.id);
		PyTuple_SetItem(pyFields, 0, op);

		op = PyInt_FromLong((long) dir.id);
		PyTuple_SetItem(pyFields, 1, op);

		op = PyString_FromString(dir.svrName);
		PyTuple_SetItem(pyFields, 2, op);

		// flag 
		op = PyInt_FromLong(0);
		PyTuple_SetItem(pyFields, 3, op);

		// server url
		op = PyString_FromString(dir.svrUrl);
		PyTuple_SetItem(pyFields, 4, op);

		// max count
		op = PyInt_FromLong((long) dir.maxCnt);
		PyTuple_SetItem(pyFields, 5, op);

		// online count
		op = PyInt_FromLong((long) dir.onlineCnt);
		PyTuple_SetItem(pyFields, 6, op);

		PyList_SetItem(pyRows, i, pyFields);
	}
	return pyRows;
}

//-----------------------------------------------------------------------------
void CGame::DeleteRoles() {
#ifndef GAME_PUBLISH
	SafeSprintf(m_lpszSql, MAX_SQL_LEN, "delete from roles;");
	m_db->Query(m_lpszSql, strlen(m_lpszSql));
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"update mapgrids set objType=0, resId=0, modelId=17000601, roleId=0, roleName='', userName='', icon=0, level=0, sex=0, state=0, allianceId=0, enemyAlliId=0, refreshTime=0, alliName='', cityLevel=0, buildCurVal=0, roleSort=0, introduction='' where objType=1;");
	m_db->Query(m_lpszSql, strlen(m_lpszSql));
	SafeSprintf(m_lpszSql, MAX_SQL_LEN,
			"update mapgrids set roleId=0 where roleId>0;");
	m_db->Query(m_lpszSql, strlen(m_lpszSql));
#endif
}
