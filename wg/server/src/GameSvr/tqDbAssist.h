#ifndef _TQ_DB_ASSIST_H_
#define _TQ_DB_ASSIST_H_
#include <result.h>

	inline int VarReadBlobFromDB(const char* lpBuf, int iBufLen, SPkgBase* lpBase)
	{
		if ( iBufLen >= 2 )
		{
			ushort usVer = ntohs(*((ushort*)lpBuf));
			lpBuf += 2;
			iBufLen -= 2;
			if ( lpBase->Decode(lpBuf, iBufLen, 0, usVer) < 0 )
			{
				return RET_LOGIN_DBFIELD_ERR;
			}
			return RET_LOGIN_OK;
		}
		else if ( iBufLen == 0 )
		{
			// 只是简单的返回
			return RET_LOGIN_OK;
		}
		return RET_LOGIN_DBFIELD_NOENOUGH_LEN;
	}	
	
	inline int VarWriteBlobForDB(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, char* lpBuf, int iBufLen, const SPkgBase* lpBase)
	{
		lpBuf[0] = 0;
		if ( iBufLen >= 2 )
		{
			*((ushort*)lpszSql) = htons(PKG_CUR_VER);
			int iPackLen = ((SPkgBase*)lpBase)->Encode(lpszSql+2, iSqlBufLen-2, 0, PKG_CUR_VER);
			if ( iPackLen >= 0 )
			{
				iPackLen += 2;
				if ( iBufLen < 2*iPackLen + 1 )
				{
					LOG("COM", "***buffer len must great 2*iPackLen + 1, falied in VarWriteBlobForDB!");
					return RET_CREATEROLE_DBFIELD_ERR;
				}
	
				if ( lpIDB->RealEscapeString(lpBuf, lpszSql, iPackLen) > 0 )
				{
					return RET_CREATEROLE_OK;
				}
			}
		}
		LOG("COM", "***buffer len must great 2, falied in VarWriteBlobForDB!");
		return RET_CREATEROLE_DBFIELD_NOENOUGH_LEN;
	}
	
	inline int RoleVarInitRoleFromDB(IO::IDatabase* lpIDB, SDBVar* lpDBVar)
	{
		int iRet = 0;
		int iFieldLen = 0;
		char* lpszFieldVar = NULL;
		lpszFieldVar = lpIDB->GetField("roleid", &iFieldLen);
		lpDBVar->ullRoleId=SafeAsciToUInt64(lpszFieldVar);
		lpszFieldVar = lpIDB->GetField("uname", &iFieldLen);
		SafeStrCpy(lpDBVar->szUName, lpszFieldVar, sizeof(lpDBVar->szUName));
		lpszFieldVar = lpIDB->GetField("rname", &iFieldLen);
		SafeStrCpy(lpDBVar->szRName, lpszFieldVar, sizeof(lpDBVar->szRName));
		lpszFieldVar = lpIDB->GetField("sex", &iFieldLen);
		lpDBVar->ucSex=(uint8)SafeAsciToULong(lpszFieldVar);
		lpszFieldVar = lpIDB->GetField("bfixvars", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stFixVar);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stFixVar from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bbinfos", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stBInfos);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stBInfos from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bheros", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stHeros);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stHeros from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bsoldiers", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->soldiers);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode soldiers from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bcitys", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stCitys);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stCitys from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bfarms", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stFarms);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stFarms from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bcultures", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->cultures);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode cultures from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bitems", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stItems);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stItems from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bbuffs", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->states);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode states from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bmilitary", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->military);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode military from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("btasks", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->tasks);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode tasks from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bbulletins", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stBulletins);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stBulletins from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bbuddys", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->buddys);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode buddys from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("bmiscs", &iFieldLen);
		iRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->stMiscs);
		if ( iRet < 0 )
		{
			LOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode stMiscs from db failed!", 
				lpDBVar->ullRoleId, lpDBVar->szRName, iRet);
			return iRet;
		}
		lpszFieldVar = lpIDB->GetField("regtime", &iFieldLen);
		lpDBVar->regTime=SafeAsciToULong(lpszFieldVar);
		lpszFieldVar = lpIDB->GetField("locktotime", &iFieldLen);
		lpDBVar->lockToTime=SafeAsciToULong(lpszFieldVar);
		return iRet;
	}

	inline int VarConvertRoleFieldToBlob(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, SDBVar* lpDBVar, std::vector<char*>& vctBlobs)
	{
		int iRet = 0;
		int iPos = 0;
		char* lpszBlobBuf = NULL;
		const int c_max_buf_len = 204800;
		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stFixVar);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stBInfos);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->military);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stHeros);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->soldiers);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stCitys);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stFarms);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->cultures);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stItems);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->states);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->tasks);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stBulletins);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->buddys);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		if ( (int)vctBlobs.size() <= iPos )
		{
		lpszBlobBuf = new char[c_max_buf_len];
		vctBlobs.push_back(lpszBlobBuf);
		}
		else
		{
		lpszBlobBuf = vctBlobs[iPos];
		}
		iRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->stMiscs);
		if ( iRet < 0 )
		{
			return iRet;
		}
		++iPos;

		return iRet;
	}

	inline int VarInsertRoleIntoDB(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, SDBVar* lpDBVar, std::vector<char*>& vctBlobs)
	{
		int iRet = 0;
		SafeSprintf(lpszSql, iSqlBufLen, "insert into roles ("
			"id, roleid, uname, rname, sex, bfixvars, bbinfos, bmilitary, bheros, bsoldiers, bcitys, bfarms, bcultures, bitems, bbuffs, btasks, bbulletins, bbuddys, bmiscs, regtime, locktotime) values ("
			"\"\", %I64u, \"%s\", \"%s\", %u, \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", %u, %u);",
						lpDBVar->ullRoleId, lpDBVar->szUName, lpDBVar->szRName, (uint)(lpDBVar->ucSex), vctBlobs[0], vctBlobs[1], vctBlobs[2], vctBlobs[3], vctBlobs[4], vctBlobs[5], vctBlobs[6], vctBlobs[7], vctBlobs[8], vctBlobs[9], vctBlobs[10], vctBlobs[11], vctBlobs[12], vctBlobs[13], (uint)(lpDBVar->regTime), (uint)(lpDBVar->lockToTime));
		if ( lpIDB->Query(lpszSql, strlen(lpszSql)) )
		{
			iRet = 0;
		}
		else
		{
			iRet = -4;
		}
		return iRet;
	}
	
	inline int VarUpdateRoleIntoDB(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, SDBVar* lpDBVar, std::vector<char*>& vctBlobs) {
		int iRet = 0;
		SafeSprintf(lpszSql, iSqlBufLen, "UPDATE roles SET bfixvars=\"%s\",bbinfos=\"%s\",bmilitary=\"%s\",bheros=\"%s\",bsoldiers=\"%s\",bcitys=\"%s\",bfarms=\"%s\",bcultures=\"%s\",bitems=\"%s\",bbuffs=\"%s\",btasks=\"%s\",bbulletins=\"%s\",bbuddys=\"%s\",bmiscs=\"%s\",locktotime=%u WHERE roleid=%I64u;"
			,vctBlobs[0],vctBlobs[1],vctBlobs[2],vctBlobs[3],vctBlobs[4],vctBlobs[5],vctBlobs[6],vctBlobs[7],vctBlobs[8],vctBlobs[9],vctBlobs[10],vctBlobs[11],vctBlobs[12],vctBlobs[13],(uint)(lpDBVar->lockToTime),lpDBVar->ullRoleId);
		if ( lpIDB->Query(lpszSql, strlen(lpszSql)) ) {
			iRet = 0;
		} else {
			iRet = -4;
		}
		return iRet;
	} 
	
	inline int AlliVarInitAlliFromDB(IO::IDatabase* lpIDB, SDBAlliVar* lpDBVar)
	{
		int iRet = 0;
		int iFieldLen = 0;
		char* lpszFieldVar = NULL;
		lpszFieldVar = lpIDB->GetField("allianceId", &iFieldLen);
		lpDBVar->ullallianceId=SafeAsciToUInt64(lpszFieldVar);
		return iRet;
	}

	inline int VarConvertAlliFieldToBlob(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, SDBAlliVar* lpDBVar, std::vector<char*>& vctBlobs)
	{
		int iRet = 0;
		int iPos = 0;
		char* lpszBlobBuf = NULL;
		const int c_max_buf_len = 204800;
		return iRet+iPos+c_max_buf_len+(long)lpszBlobBuf;
	}

	inline int VarInsertAlliIntoDB(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, SDBAlliVar* lpDBVar, std::vector<char*>& vctBlobs)
	{
		int iRet = 0;
		SafeSprintf(lpszSql, iSqlBufLen, "insert into roles ("
			"allianceId, level, name, flagName, cityResId, honour, leader, buildVal, card, qqGroup, introduction, bulletin, member, lawLight, misc, createTime, lastLevel, lastHonour, rank) values ("
			"%I64u, \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\");",
						lpDBVar->ullallianceId);
		if ( lpIDB->Query(lpszSql, strlen(lpszSql)) )
		{
			iRet = 0;
		}
		else
		{
			iRet = -4;
		}
		return iRet;
	}
	
	inline int VarUpdateAlliIntoDB(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, SDBAlliVar* lpDBVar, std::vector<char*>& vctBlobs) {
		int iRet = 0;
		SafeSprintf(lpszSql, iSqlBufLen, "UPDATE alliances SET  WHERE allianceId=%I64u;"
			,lpDBVar->ullallianceId);
		if ( lpIDB->Query(lpszSql, strlen(lpszSql)) ) {
			iRet = 0;
		} else {
			iRet = -4;
		}
		return iRet;
	} 
	
	static const char* sc_lpszLoginSql = "select * from roles where uname='%s';";
	static const char* sc_lpszGetLastRoleAutoId = "select id from roles order by id desc limit 1;";
	static const char* sc_lpszFindRoleNameExist = "select id from roles where rname='%s';";
	static const char* sc_lpszFindUserNameExist = "select id from roles where uname='%s';";
	static const char* sc_lpszGetAlliById = "select id from alliances where uid=%I64u;";

#endif // _TQ_DB_ASSIST_H_
