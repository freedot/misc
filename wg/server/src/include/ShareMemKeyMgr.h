#ifndef _SHAREMEMKEYMGR_H_
#define _SHAREMEMKEYMGR_H_
#include <platform.h>
#include <./tinyxml/tinyxml.h>
#include <buffer.h>
#include <safefun.h>
#include <map>
#include <string>
using namespace std;

#define SMEMTYPE_CMD_CFG_HEAD 1
#define SMEMTYPE_MUTEX_GAME 2

class ShareMemKeyMgr {
public:
	ShareMemKeyMgr() {
		m_serverNameMap["flashconnect"] = 1;
		m_serverNameMap["gamesvr"] = 2;
	}
	virtual ~ShareMemKeyMgr() {}

public:
	const char* MakeKey(int shareMemType, const char* serverNameAndId);

private:
	void SplitSvrNameAndId(const char* svrNameAndId, Buffer<char>* svrName,
			int& svrId);
	int GetShareMemSvrValue(const char* svrName);

private:
	char m_key[64];
	map<string, int> m_serverNameMap;
};

inline const char* ShareMemKeyMgr::MakeKey(int shareMemType,
		const char* serverNameAndId) {
	memset(m_key, 0, sizeof(m_key));

	Buffer<char> svrName;
	int svrId = 0;
	SplitSvrNameAndId(serverNameAndId, &svrName, svrId);

	int svrVal = GetShareMemSvrValue(svrName.GetBuffer());

	int key = shareMemType * 10000000 + svrVal * 100000 + svrId;
	SafeSprintf(m_key, sizeof(m_key), "%d", key);
	return m_key;
}

inline void ShareMemKeyMgr::SplitSvrNameAndId(const char* svrNameAndId,
		Buffer<char>* svrName, int& svrId) {
	int pos = strlen(svrNameAndId) - 1;
	for (int i = pos; i >= 0; --i) {
		char c = svrNameAndId[i];
		if (c < '0' || c > '9') {
			pos = i;
			break;
		}
	}

	svrName->Recount(pos + 2);
	memcpy(svrName->GetBuffer(), svrNameAndId, pos + 1);
	svrName->GetBuffer()[pos + 1] = '\0';

	Buffer<char> ssvrId(strlen(svrNameAndId) - pos + 1);
	memcpy(ssvrId.GetBuffer(), svrNameAndId + pos + 1,
			strlen(svrNameAndId) - pos);
	svrId = SafeAsciToInt(ssvrId.GetBuffer());
}

inline int ShareMemKeyMgr::GetShareMemSvrValue(const char* svrName) {
	map<string, int>::iterator iter = m_serverNameMap.find(svrName);
	if (iter == m_serverNameMap.end())
		return 0;
	return (*iter).second;
}

#endif //_SHAREMEMKEYMGR_H_
