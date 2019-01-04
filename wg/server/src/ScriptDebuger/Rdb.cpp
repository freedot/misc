#include <commhead.h>

#include "Rdb.h"
#include "DbgServer.h"
#include "DbgConfiger.h"
#include "safefun.h"

#define DEBUG_CMD "debug"
#define QUIT_CMD "quit"
#define QUIT2_CMD "q"
#define SYSQUIT_CMD "sysquit"
#define CONTINUE_CMD "continue"
#define CONTINUE2_CMD "c"
#define STEP_CMD "step"
#define STEP2_CMD "s"
#define NEXT_CMD "next"
#define NEXT2_CMD "n"
#define RETURN_CMD "return"
#define BREAK_CMD "break"
#define BREAK2_CMD "b"
#define TBREAK_CMD "tbreak"
#define TBREAK2_CMD "tb"
#define CLEAR_CMD "clear"
#define CLEAR2_CMD "cl"
#define WHERE_CMD "where"
#define WHERE2_CMD "w"
#define DOWN_CMD "down"
#define DOWN2_CMD "d"
#define UP_CMD "up"
#define UP2_CMD "u"
#define SETPATH_CMD "setpath"
#define PRINT_CMD "print"
#define PRINT2_CMD "p"
#define WHATIS_CMD "whatis"
#define ARGS_CMD "args"
#define ARGS2_CMD "a"
#define EXEC_CMD "!"
#define JUMP_CMD "jump"
#define JUMP2_CMD "j"
#define DISABLE_CMD "disable"
#define ENABLE_CMD "enable"
#define IGNORE_CMD "ignore"
#define CONDITION_CMD "condition"
#define HELP_CMD "help"
#define HELP2_CMD "h"

void MyHookCallback(lua_State *L, lua_Debug *ar);
void MyHookCallback(lua_State *L, lua_Debug *ar) {
	switch (ar->event) {
	case LUA_HOOKCALL:
		Rdb::Instance()->DispatchCall(ar);
		break;
	case LUA_HOOKRET:
		Rdb::Instance()->DispatchReturn(ar);
		break;
	case LUA_HOOKLINE:
		Rdb::Instance()->DispatchLine(ar);
		break;
	case LUA_HOOKCOUNT:
		break;
	case LUA_HOOKTAILRET:
		Rdb::Instance()->DispatchTailReturn(ar);
		break;
	}
}

Rdb::Rdb() :
		m_lpLuaState(NULL), m_bPreExec(false), m_iStackLevel(0), m_iStepLevel(
				0), m_iLastFNameNo(0), m_iCurStackFrame(0), m_iLastBreakId(1), m_bStepOver(
				false), m_bStepInto(false) {
	m_vctVar.reserve(16);
}

Rdb::~Rdb() {

}

void Rdb::SetState(lua_State* lpLuaState) {
	m_lpLuaState = lpLuaState;
	if (DbgConfiger::Instance()->IsSetTrackInStart()) {
		SetTrace();
	}
}

bool Rdb::DoCommand(const char* lpszPreFlag, const char* lpszCmd,
		StdVctVar& vctVar, const char* lpszLine) {
	bool bRt = false;
	bool bSendMessage = false;
	m_strPreFlag = lpszPreFlag;
	if (strcmp(lpszCmd, DEBUG_CMD) == 0) {
		m_strSendMsg = m_strPreFlag + "message#debuging";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

		// 设置文件的基本路径
		if (!vctVar.empty()) {
			SetBasePath(vctVar[0]);
		}

		// 设置脚本的钩子
		if (!DbgConfiger::Instance()->IsSetTrackInStart()) {
			SetTrace();
		}

		bRt = true;
		bSendMessage = true;
	} else if (strcmp(lpszCmd, QUIT_CMD) == 0
			|| strcmp(lpszCmd, QUIT2_CMD) == 0) {
		ClearDebugInfo();
		m_strSendMsg = m_strPreFlag + "quit#";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		bRt = true;
		bSendMessage = true;
	} else if (strcmp(lpszCmd, SYSQUIT_CMD) == 0) {
		ClearDebugInfo();
		bRt = true;
		bSendMessage = true;
	} else if (strcmp(lpszCmd, CONTINUE_CMD) == 0
			|| strcmp(lpszCmd, CONTINUE2_CMD) == 0) {
		m_strSendMsg = m_strPreFlag + "prompt#";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		SetContinue();
		bRt = true;
		bSendMessage = true;
	} else if (strcmp(lpszCmd, STEP_CMD) == 0
			|| strcmp(lpszCmd, STEP2_CMD) == 0) {
		m_strSendMsg = m_strPreFlag + "prompt#";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		SetStep();
		bRt = true;
		bSendMessage = true;
	} else if (strcmp(lpszCmd, NEXT_CMD) == 0
			|| strcmp(lpszCmd, NEXT2_CMD) == 0) {
		m_strSendMsg = m_strPreFlag + "prompt#";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		SetNext();
		bRt = true;
		bSendMessage = true;
	} else if (strcmp(lpszCmd, RETURN_CMD) == 0) {
		m_strSendMsg = m_strPreFlag + "prompt#";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		SetReturn();
		bRt = true;
		bSendMessage = true;
	} else if (strcmp(lpszCmd, BREAK_CMD) == 0
			|| strcmp(lpszCmd, BREAK2_CMD) == 0
			|| strcmp(lpszCmd, TBREAK_CMD) == 0
			|| strcmp(lpszCmd, TBREAK2_CMD) == 0) {
		if (strcmp(lpszCmd, BREAK_CMD) == 0
				|| strcmp(lpszCmd, BREAK2_CMD) == 0) {
			DoBreak(vctVar, false);
		} else {
			DoBreak(vctVar, true);
		}

		DbgServer::Instance()->PushSendMsg(m_strBreakMsg.c_str());
		if (m_strBreakPointMsg != "") {
			DbgServer::Instance()->PushSendMsg(m_strBreakPointMsg.c_str());
		}
		bSendMessage = true;
	} else if (strcmp(lpszCmd, CLEAR_CMD) == 0
			|| strcmp(lpszCmd, CLEAR2_CMD) == 0) {
		DoClear(vctVar);
		bSendMessage = true;
	} else if (strcmp(lpszCmd, WHERE_CMD) == 0
			|| strcmp(lpszCmd, WHERE2_CMD) == 0) {
		SendStackTrace();
		bSendMessage = true;
	} else if (strcmp(lpszCmd, DOWN_CMD) == 0
			|| strcmp(lpszCmd, DOWN2_CMD) == 0) {
		DoDown(vctVar);
		bSendMessage = true;
	} else if (strcmp(lpszCmd, UP_CMD) == 0 || strcmp(lpszCmd, UP2_CMD) == 0) {
		DoUp(vctVar);
		bSendMessage = true;
	} else if (strcmp(lpszCmd, SETPATH_CMD) == 0) {
		if (!vctVar.empty()) {
			m_strSendMsg = m_strPreFlag + "prompt#";
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			bSendMessage = true;
			SetBasePath(vctVar[0]);
		}
	} else if (strcmp(lpszCmd, PRINT_CMD) == 0
			|| strcmp(lpszCmd, PRINT2_CMD) == 0) {
		if (!vctVar.empty()) {
			bSendMessage = true;
			const char* lpszMsg = DoPrint(vctVar);
			m_strSendMsg = m_strPreFlag + "message#";
			m_strSendMsg = m_strSendMsg + lpszMsg;
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		}
	} else if (strcmp(lpszCmd, WHATIS_CMD) == 0) {
		if (!vctVar.empty()) {
			bSendMessage = true;
			const char* lpszMsg = DoWhatis(vctVar);
			m_strSendMsg = m_strPreFlag + "message#";
			m_strSendMsg = m_strSendMsg + lpszMsg;
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		}
	} else if (strcmp(lpszCmd, ARGS_CMD) == 0
			|| strcmp(lpszCmd, ARGS2_CMD) == 0) {
		if (!vctVar.empty()) {
			bSendMessage = true;
			const char* lpszMsg = DoArgs(vctVar);
			m_strSendMsg = m_strPreFlag + "message#";
			m_strSendMsg = m_strSendMsg + lpszMsg;
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		}
	} else if (strcmp(lpszCmd, EXEC_CMD) == 0) {
		if (!vctVar.empty()) {
			bSendMessage = true;
			const char* lpszMsg = DoExec(vctVar);
			m_strSendMsg = m_strPreFlag + "message#";
			m_strSendMsg = m_strSendMsg + lpszMsg;
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		}
	} else if (strcmp(lpszCmd, JUMP_CMD) == 0
			|| strcmp(lpszCmd, JUMP2_CMD) == 0) {
		if (!vctVar.empty()) {
			m_strSendMsg = m_strPreFlag + "prompt#";
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			DoJump(vctVar);
			bRt = true;
			bSendMessage = true;
		}
	} else if (strcmp(lpszCmd, DISABLE_CMD) == 0) {
		if (!vctVar.empty()) {
			bSendMessage = true;
			DoDisable(vctVar);
		}
	} else if (strcmp(lpszCmd, ENABLE_CMD) == 0) {
		if (!vctVar.empty()) {
			bSendMessage = true;
			DoEnable(vctVar);
		}
	} else if (strcmp(lpszCmd, IGNORE_CMD) == 0) {
		if (!vctVar.empty()) {
			bSendMessage = true;
			DoIgnore(vctVar);
		}
	} else if (strcmp(lpszCmd, CONDITION_CMD) == 0) {
		if (vctVar.size() >= 2) {
			bSendMessage = true;
			DoCondition(vctVar);
		}
	} else if (strcmp(lpszCmd, HELP_CMD) == 0
			|| strcmp(lpszCmd, HELP2_CMD) == 0) {
		bSendMessage = true;
		DoHelp(vctVar);
	}

	if (!bSendMessage) {
		m_strSendMsg = m_strPreFlag + "message#*Invalied command or param";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
	}

	return bRt;
}

void Rdb::SetTrace() {
	lua_sethook(m_lpLuaState, MyHookCallback,
			LUA_MASKCALL | LUA_MASKRET | LUA_MASKLINE, 0);
}

void Rdb::SetBasePath(const char* lpszBasePath) {
	if (lpszBasePath != NULL) {
		std::string paths = lpszBasePath;
		int pos = paths.find(";");
		if (pos < 0)
			return;

		m_strBasePath = paths.substr(0, pos);
		m_strClientBasePath = paths.substr(pos+1);
	}
}

void Rdb::MainLoop(lua_Debug *ar) {
	m_bPreExec = false;
	while (true) {
		if (!DbgServer::Instance()->IsRecvMsgEmpty()) {
			const char* lpszPopMsg = DbgServer::Instance()->RecvMsgTop();
			char szMsg[c_recvbuffer_size];
			SafeStrCpy(szMsg, lpszPopMsg, sizeof(szMsg));
			DbgServer::Instance()->PopRecvMsg();

			if (HandleCommand(szMsg)) {
				break;
			}
		}

		tq_sleep(50);
	}
}

bool Rdb::HandleCommand(char* lpszMsg) {
	char* lpszLine = lpszMsg;
	if (strlen(lpszMsg) > 0 && lpszMsg[0] == '!') {
		++lpszLine;
	}

	char szPreFlag[32];
	char* lpszCmd = strtok(lpszMsg, "#");

	m_vctVar.clear();
	while (true) {
		char* lpszVar = strtok(NULL, "#");
		if (lpszVar == NULL) {
			break;
		}
		m_vctVar.push_back(lpszVar);
	}

	szPreFlag[0] = '\0';
	if (strlen(lpszCmd) > 0 && lpszCmd[0] == '@') {
		szPreFlag[0] = '@';
		szPreFlag[1] = '\0';
		++lpszCmd;
	}

	return DoCommand(szPreFlag, lpszCmd, m_vctVar, lpszLine);
}

void Rdb::UserLine(lua_Debug *ar) {
	Interaction(ar);
}

void Rdb::UserCall(lua_Debug *ar) {
}

void Rdb::UserReturn(lua_Debug *ar) {
}

void Rdb::UserTailReturn(lua_Debug *ar) {
}

void Rdb::DispatchLine(lua_Debug *ar) {
	lua_Debug aar;
	GetInfo(0, "S", &aar);
	aar.currentline = ar->currentline;
	char szFullPath[4096];
	MakeFullPath(szFullPath, sizeof(szFullPath), m_strBasePath.c_str(),
			aar.source);
	ConvertToWindowPath(szFullPath);
	//strlwr(szFullPath);
	m_strCurFName = szFullPath;
	if (IsStopHere(&aar) || IsBreakHere(&aar)) {
		UserLine(&aar);
	}
}

void Rdb::DispatchCall(lua_Debug *ar) {
	++m_iStackLevel;
}

void Rdb::DispatchReturn(lua_Debug *ar) {
	--m_iStackLevel;
}

void Rdb::DispatchTailReturn(lua_Debug *ar) {
	--m_iStackLevel;
}

bool Rdb::IsStopHere(lua_Debug *ar) {
	if ((m_bStepOver && m_iStackLevel <= m_iStepLevel) || m_bStepInto) {
		m_bStepOver = false;
		m_bStepInto = false;
		return true;
	}

	return false;
}

bool Rdb::IsBreakHere(lua_Debug *ar) {
	StdMapBreakPointIter mapIter = m_mapBreakPoints.find(m_strCurFName);
	for (; mapIter != m_mapBreakPoints.end(); ++mapIter) {
		StdLstBreakPoint& lstBreakPoint = (*mapIter).second;
		StdLstBreakPointIter lstIter = lstBreakPoint.begin();
		for (; lstIter != lstBreakPoint.end(); ++lstIter) {
			SBreakPoint& stBP = (*lstIter);
			if (stBP.iLine == ar->currentline) {
				// 忽略的次数还没有达到
				if (stBP.iIgnoreCount > 0) {
					--stBP.iIgnoreCount;
					return false;
				}

				// 该断点是否非激活
				if (!stBP.bEnable) {
					return false;
				}

				// 是否有断点条件
				bool bCondition = false;
				if (stBP.strCondition != "") {
					const char* lpszRet = LuaExec(stBP.strCondition.c_str(),
							"tqdb_exec_exp");
					if (strcmp(lpszRet, "1") == 0) {
						bCondition = true;
					}
				}

				if (stBP.strCondition != "" && !bCondition) {
					return false;
				}

				// 对临时断点的处理，将该临时断点删除
				if (stBP.bTemporary) {
					char szLineNo[32];
					m_strSendMsg = m_strPreFlag;
					m_strSendMsg = m_strSendMsg + "clearbreakpoint#";
					m_strSendMsg = m_strSendMsg + m_strCurFName;
					m_strSendMsg = m_strSendMsg + ":";
					m_strSendMsg = m_strSendMsg
							+ itoa(stBP.iLine, szLineNo, 10);
					DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

					m_strSendMsg = m_strPreFlag + "prompt#";
					DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

					lstBreakPoint.erase(lstIter);
					if (lstBreakPoint.empty()) {
						m_mapBreakPoints.erase(mapIter);
					}
				}

				return true;
			}
		}
	}

	return false;
}

int Rdb::SetBreak(const char* lpFilePath, int iLineNo, bool bTemp,
		const char* lpszCondition) {
	//strlwr((char*)lpFilePath);
	ConvertToWindowPath((char*) lpFilePath);
	StdLstBreakPoint& lstBreakPoint = m_mapBreakPoints[lpFilePath];
	StdLstBreakPointIter iter = lstBreakPoint.begin();
	for (; iter != lstBreakPoint.end(); ++iter) {
		SBreakPoint& stBP = (*iter);
		if (stBP.iLine == iLineNo) {
			return -1;
		}
	}

	SBreakPoint stBP;
	stBP.iId = (m_iLastBreakId++);
	stBP.iLine = iLineNo;
	stBP.bTemporary = bTemp;
	stBP.strFilePath = lpFilePath;
	if (lpszCondition != NULL) {
		stBP.strCondition = lpszCondition;
	}
	lstBreakPoint.push_back(stBP);
	return stBP.iId;
}

void Rdb::SetContinue() {
	DisableCurPos();
}

void Rdb::SetStep() {
	m_bStepInto = true;
}

void Rdb::SetNext() {
	m_bStepOver = true;
	m_iStepLevel = m_iStackLevel;
}

void Rdb::SetReturn() {
	m_bStepInto = false;
	m_bStepOver = true;
	m_iStepLevel = m_iStackLevel - 1;
}

void Rdb::SendStackTrace() {
	char szBuffer[2048];
	char szFullPath[1024];
	szBuffer[0] = 0;
	szFullPath[0] = 0;

	m_strSendMsg = m_strPreFlag + "stacklist#";
	m_strSendMsg = m_strSendMsg + itoa(m_iCurStackFrame, szBuffer, 10);
	m_strSendMsg = m_strSendMsg + "#\n";

	bool bHasStack = false;
	lua_Debug ar;
	int i = 0;
	while (true) {
		int iStatus = GetInfo(i, "lS", &ar);
		if (iStatus != 1) {
			break;
		}

		MakeFullPath(szFullPath, sizeof(szFullPath), m_strBasePath.c_str(),
				ar.source);
		ConvertToWindowPath(szFullPath);
		//strlwr(szFullPath);
		if (i == m_iCurStackFrame) {
			SafeSprintf(szBuffer, sizeof(szBuffer), " (stack)->[%03d]%s(%d)\n",
					i, szFullPath, ar.currentline);
		} else {
			SafeSprintf(szBuffer, sizeof(szBuffer), " (stack)  [%03d]%s(%d)\n",
					i, szFullPath, ar.currentline);
		}

		m_strSendMsg = m_strSendMsg + szBuffer;
		bHasStack = true;

		++i;
	}

	if (!bHasStack) {
		m_strSendMsg = m_strPreFlag + "message#Can't get stack";
	}

	DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
}

void Rdb::DoBreak(StdVctVar& vctVar, bool bTemp) {
	m_strBreakMsg = "";
	m_strBreakPointMsg = "";
	char* lpszVar = NULL;
	if (!vctVar.empty()) {
		lpszVar = vctVar[0];
	}

	if (lpszVar == NULL) {
		if (!m_mapBreakPoints.empty()) {
			char szBuf[32];
			m_strBreakMsg =
					"message#No.\tType\t\t\tFile:lineno\t\t\t\t\t\t\tCondition and ignore hits\n";
			StdMapBreakPointIter mapIter = m_mapBreakPoints.begin();
			for (; mapIter != m_mapBreakPoints.end(); ++mapIter) {
				StdLstBreakPoint& lstBreakPoint = (*mapIter).second;
				StdLstBreakPointIter lstIter = lstBreakPoint.begin();
				for (; lstIter != lstBreakPoint.end(); ++lstIter) {
					SBreakPoint& stBP = (*lstIter);
					m_strBreakMsg += itoa(stBP.iId, szBuf, 10);
					m_strBreakMsg += "\t";

					// print type
					char szType[256];
					szType[0] = 0;
					if (stBP.bEnable) {
						SafeStrCat(szType, "enable|", sizeof(szType));
					} else {
						SafeStrCat(szType, "disable|", sizeof(szType));
					}

					if (stBP.bTemporary) {
						SafeStrCat(szType, "temp|", sizeof(szType));
					}

					if (stBP.strCondition != "") {
						SafeStrCat(szType, "cond|", sizeof(szType));
					}

					if (stBP.iIgnoreCount > 0) {
						SafeStrCat(szType, "ignore|", sizeof(szType));
					}

					m_strBreakMsg += szType;
					AppendTabsByAlignLen(strlen(szType), 8, 3, m_strBreakMsg);

					// print file:no
					char szFileNo[1024];
					szFileNo[0] = 0;
					SafeSprintf(szFileNo, sizeof(szFileNo), "%s:%d",
							stBP.strFilePath.c_str(), stBP.iLine);
					m_strBreakMsg += szFileNo;
					AppendTabsByAlignLen(strlen(szFileNo), 8, 8, m_strBreakMsg);

					// print condition
					if (stBP.strCondition != "") {
						m_strBreakMsg += "[if ";
						m_strBreakMsg += stBP.strCondition;
						m_strBreakMsg += "] ";
					}

					// print ignore count
					if (stBP.iIgnoreCount > 0) {
						m_strBreakMsg += "[ignore next ";
						m_strBreakMsg += itoa(stBP.iIgnoreCount, szBuf, 10);
						m_strBreakMsg += "hits]";
					}

					m_strBreakMsg += "\t\n";
				}
			}
		} else {
			m_strBreakMsg = "message#No break point";
		}

		m_strBreakMsg = m_strPreFlag + m_strBreakMsg;
		return;
	}

	char* lpFilePath = NULL;
	int iLineNo = 0;
	SplitFileInfo(lpszVar, lpFilePath, iLineNo);
	int iRetId = SetBreak(lpFilePath, iLineNo, bTemp, NULL);
	if (iRetId > 0) {
		char szMsgBuf[4096];
		SafeSprintf(szMsgBuf, sizeof(szMsgBuf),
				"message#Breakpoint %d at %s:%d", iRetId, lpFilePath, iLineNo);
		m_strBreakMsg = m_strPreFlag + szMsgBuf;
		SafeSprintf(szMsgBuf, sizeof(szMsgBuf), "breakpoint#1#%s:%d:",
				lpFilePath, iLineNo);
		m_strBreakPointMsg = m_strPreFlag + szMsgBuf;
	} else {
		if (iRetId == -1) {
			m_strBreakMsg = m_strPreFlag
					+ "message#The breakpoint is already exist!";
		} else {
			m_strBreakMsg = m_strPreFlag + "message#***Set breakpoint failed!";
		}
	}
}

void Rdb::DoClear(StdVctVar& vctVar) {
	char* lpszVar = NULL;
	if (!vctVar.empty()) {
		lpszVar = vctVar[0];
	}

	if (lpszVar == NULL) {
		m_mapBreakPoints.clear();
		DbgServer::Instance()->PushSendMsg("clearbreakpoint#");
		m_strSendMsg = m_strPreFlag + "prompt#";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
	}

	if (m_mapBreakPoints.empty()) {
		m_iLastBreakId = 1;
	} else {
		if (!IsDigital(lpszVar)) {
			bool bClearOk = false;
			char* lpFilePath = NULL;
			int iLineNo = 0;
			SplitFileInfo(lpszVar, lpFilePath, iLineNo);

			StdMapBreakPointIter iters = m_mapBreakPoints.find(lpFilePath);
			if (iters != m_mapBreakPoints.end()) {
				StdLstBreakPoint& lstBreakPoint = (*iters).second;
				StdLstBreakPointIter iter = lstBreakPoint.begin();
				for (; iter != lstBreakPoint.end(); ++iter) {
					SBreakPoint& stBP = (*iter);
					if (stBP.iLine == iLineNo) {
						lstBreakPoint.erase(iter);
						bClearOk = true;
						break;
					}
				}

				if (lstBreakPoint.empty()) {
					m_mapBreakPoints.erase(iters);
				}
			}

			if (bClearOk) {
				char szLineNo[32];
				m_strSendMsg = m_strPreFlag;
				m_strSendMsg = m_strSendMsg + "clearbreakpoint#";
				m_strSendMsg = m_strSendMsg + lpFilePath;
				m_strSendMsg = m_strSendMsg + ":";
				m_strSendMsg = m_strSendMsg + itoa(iLineNo, szLineNo, 10);
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

				m_strSendMsg = m_strPreFlag + "prompt#";
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			} else {
				m_strSendMsg = m_strPreFlag
						+ "message#Invalid file path or line number";
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			}
		} else {
			bool bClearOk = false;
			int iBpId = SafeAsciToInt(lpszVar);
			SBreakPoint* lpstBP = (SBreakPoint*) FindBreakpointNodeById(iBpId);
			if (lpstBP != NULL) {
				char szLineNo[32];
				m_strSendMsg = m_strPreFlag;
				m_strSendMsg = m_strSendMsg + "clearbreakpoint#";
				m_strSendMsg = m_strSendMsg + lpstBP->strFilePath;
				m_strSendMsg = m_strSendMsg + ":";
				m_strSendMsg = m_strSendMsg + itoa(lpstBP->iLine, szLineNo, 10);
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

				m_strSendMsg = m_strPreFlag + "prompt#";
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

				StdMapBreakPointIter iters = m_mapBreakPoints.begin();
				for (; iters != m_mapBreakPoints.end(); ++iters) {
					StdLstBreakPoint& lstBreakPoint = (*iters).second;
					StdLstBreakPointIter iter = lstBreakPoint.begin();
					for (; iter != lstBreakPoint.end(); ++iter) {
						SBreakPoint& stBP = (*iter);
						if (stBP.iId == iBpId) {
							lstBreakPoint.erase(iter);
							bClearOk = true;
							break;
						}
					}

					if (lstBreakPoint.empty()) {
						m_mapBreakPoints.erase(iters);
					}

					if (bClearOk) {
						break;
					}
				}
			} else {
				m_strSendMsg = m_strPreFlag
						+ "message#Invalid breakpoint number id!";
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			}
		}
	}
}

void Rdb::DoDown(StdVctVar& vctVar) {
	int iDrtFrames = 1;
	if (!vctVar.empty()) {
		iDrtFrames = SafeAsciToInt(vctVar[0]);
	}

	int iStackFrame = m_iCurStackFrame + iDrtFrames;
	GotoStack(iStackFrame);
}

void Rdb::DoUp(StdVctVar& vctVar) {
	int iDrtFrames = 1;
	if (!vctVar.empty()) {
		iDrtFrames = SafeAsciToInt(vctVar[0]);
	}

	int iStackFrame = m_iCurStackFrame - iDrtFrames;
	GotoStack(iStackFrame);
}

void Rdb::GotoStack(int iStackFrame) {
	bool bStackFrameVailed = true;
	if (iStackFrame < 0) {
		m_strSendMsg = m_strPreFlag
				+ "message#Already goto the top stack frame!";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
		bStackFrameVailed = false;
	}

	if (bStackFrameVailed) {
		lua_Debug ar;
		int iStatus = GetInfo(iStackFrame, "l", &ar);
		if (iStatus == 0) {
			bStackFrameVailed = false;
			m_strSendMsg = m_strPreFlag + "message#Invailed stack frame!";
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			bStackFrameVailed = false;
		}
	}

	if (bStackFrameVailed) {
		m_iCurStackFrame = iStackFrame;
		SendCurpos();
	}

	SendStackTrace();
}

const char* Rdb::DoPrint(StdVctVar& vctVar) {
	if (vctVar.empty()) {
		return "Invailed param!";
	}

	const char* lpszRet = LuaExec(vctVar[0], "tqdb_exec_exp");
	if (strcmp(lpszRet, "") == 0) {
		return "Invailed param!";
	}

	return lpszRet;
}

const char* Rdb::DoWhatis(StdVctVar& vctVar) {
	char szBuffer[4096];
	szBuffer[0] = 0;
	SafeSprintf(szBuffer, sizeof(szBuffer), "type(%s)", vctVar[0]);
	const char* lpszRet = LuaExec(szBuffer, "tqdb_exec_exp");
	if (strcmp(lpszRet, "") == 0) {
		return "Unknow!";
	}

	return lpszRet;
}

const char* Rdb::DoArgs(StdVctVar& vctVar) {
	return "do args";
}

const char* Rdb::DoExec(StdVctVar& vctVar) {
	if (vctVar.empty()) {
		return "Invailed param!";
	}

	char szBuffer[4096];
	szBuffer[0] = 0;
	for (uint i = 0; i < vctVar.size(); ++i) {
		SafeStrCat(szBuffer, vctVar[i], sizeof(szBuffer));
		SafeStrCat(szBuffer, " ", sizeof(szBuffer));
	}

	const char* lpszRet = LuaExec(szBuffer, "tqdb_exec_exec");
	if (strcmp(lpszRet, "") == 0) {
		return "Invailed param!";
	}

	return lpszRet;
}

void Rdb::DoJump(StdVctVar& vctVar) {
	DoBreak(vctVar, true);
	SetContinue();
}

void Rdb::DoDisable(StdVctVar& vctVar) {
	bool bSendMsg = false;
	for (uint i = 0; i < vctVar.size(); ++i) {
		int iBpNo = SafeAsciToInt(vctVar[i]);
		if (iBpNo != 0) {
			SBreakPoint* lpBP = (SBreakPoint*) FindBreakpointNodeById(iBpNo);
			if (lpBP != NULL) {
				lpBP->bEnable = false;

				char szMsgBuf[4096];
				SafeSprintf(szMsgBuf, sizeof(szMsgBuf), "breakpoint#2#%s:%d:",
						lpBP->strFilePath.c_str(), lpBP->iLine);
				DbgServer::Instance()->PushSendMsg(szMsgBuf);

				m_strSendMsg = m_strPreFlag + "message#Disable bp ok!";
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

				bSendMsg = true;
			}
		}
	}

	if (!bSendMsg) {
		m_strSendMsg = m_strPreFlag + "message#Invalid param";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
	}
}

void Rdb::DoEnable(StdVctVar& vctVar) {
	bool bSendMsg = false;
	for (uint i = 0; i < vctVar.size(); ++i) {
		int iBpNo = SafeAsciToInt(vctVar[i]);
		if (iBpNo != 0) {
			SBreakPoint* lpBP = (SBreakPoint*) FindBreakpointNodeById(iBpNo);
			if (lpBP != NULL) {
				lpBP->bEnable = true;

				char szMsgBuf[4096];
				SafeSprintf(szMsgBuf, sizeof(szMsgBuf), "breakpoint#1#%s:%d:",
						lpBP->strFilePath.c_str(), lpBP->iLine);
				DbgServer::Instance()->PushSendMsg(szMsgBuf);

				m_strSendMsg = m_strPreFlag + "message#Enable bp ok!";
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

				bSendMsg = true;
			}
		}
	}

	if (!bSendMsg) {
		m_strSendMsg = m_strPreFlag + "message#Invalid param";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
	}
}

void Rdb::DoIgnore(StdVctVar& vctVar) {
	bool bSendMsg = false;
	if (vctVar.size() == 2) {
		int iBpNo = SafeAsciToInt(vctVar[0]);
		int iIgnoreCount = SafeAsciToInt(vctVar[1]);
		if (iBpNo > 0 && iIgnoreCount > 0) {
			SBreakPoint* lpBP = (SBreakPoint*) FindBreakpointNodeById(iBpNo);
			if (lpBP != NULL) {
				lpBP->iIgnoreCount = iIgnoreCount;
				m_strSendMsg = m_strPreFlag + "message#Set ignore ok!";
				DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
				bSendMsg = true;
			}
		}
	}

	if (!bSendMsg) {
		m_strSendMsg = m_strPreFlag + "message#Invalid param";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
	}
}

void Rdb::DoCondition(StdVctVar& vctVar) {
	bool bSendMsg = false;
	int iBpNo = SafeAsciToInt(vctVar[0]);
	char szCondition[4096];
	szCondition[0] = 0;
	for (uint i = 1; i < vctVar.size(); ++i) {
		SafeStrCat(szCondition, vctVar[i], sizeof(szCondition));
		SafeStrCat(szCondition, " ", sizeof(szCondition));
	}
	if (iBpNo > 0) {
		SBreakPoint* lpBP = (SBreakPoint*) FindBreakpointNodeById(iBpNo);
		if (lpBP != NULL) {
			lpBP->strCondition = szCondition;
			m_strSendMsg = m_strPreFlag + "message#Set condition ok!";
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			bSendMsg = true;
		}
	}

	if (!bSendMsg) {
		m_strSendMsg = m_strPreFlag + "message#Invalid param";
		DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
	}
}

void Rdb::DoHelp(StdVctVar& vctVar) {
	char* lpszCommand = NULL;
	if (!vctVar.empty()) {
		lpszCommand = vctVar[0];
	}

	m_strSendMsg = m_strPreFlag + "message#";
	m_strSendMsg = m_strSendMsg + m_objHelper.GetHelpInfo(lpszCommand);
	DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());

}

int Rdb::GetInfo(int iLevel, const char* option, lua_Debug* ar) {
	int arg;
	lua_State *L1 = GetThread(m_lpLuaState, &arg);
	if (!lua_getstack(L1, iLevel, ar)) {
		return 0;
	}

	if (!lua_getinfo(L1, option, ar)) {
		return 0;
	}

	return 1;
}

lua_State* Rdb::GetThread(lua_State *L, int *arg) {
	if (lua_isthread(L, 1)) {
		*arg = 1;
		return lua_tothread(L, 1);
	} else {
		*arg = 0;
		return L;
	}
}

void Rdb::MakeFullPath(char* lpszFullPath, int iBufLen,
		const char* lpszBasePath, const char* lpszFileName) {
	// 首先判断当前文件是否是完整的绝对路径
	if (lpszFileName[0] == '/' || lpszFileName[1] == ':'
			|| lpszFileName[2] == ':') {
		SafeStrCpy(lpszFullPath, lpszFileName, iBufLen);
		RemoveUpDot(lpszFullPath);
		return;
	}

	// 进行组合
	SafeStrCpy(lpszFullPath, lpszBasePath, iBufLen);
	int iPos = strlen(lpszFullPath) - 1;
	if (iPos >= 0 && lpszFullPath[iPos] != '\\' && lpszFullPath[iPos] != '/') {
		SafeStrCat(lpszFullPath, "/", iBufLen);
	}

	char* lpszFmtFileName = (char*) lpszFileName;
	while (lpszFmtFileName) {
		if (*lpszFmtFileName == '.' || *lpszFmtFileName == '/'
				|| *lpszFmtFileName == '\\') {
			++lpszFmtFileName;
		} else {
			break;
		}
	}

	SafeStrCat(lpszFullPath, lpszFmtFileName, iBufLen);
	RemoveUpDot(lpszFullPath);
}

void Rdb::MakeClientFullPath(const char* fullPath, char* clientFullPath, int pathLen){
	const char* fileName = fullPath + m_strBasePath.length();
	SafeSprintf(clientFullPath, pathLen, "%s%s", m_strClientBasePath.c_str(), fileName);
}

void Rdb::RemoveUpDot(char* path) {
	int pos = 0;
	char* c = path;
	while (*c != '\0') {
		if (*c == '.' && (*(c + 1) == '.' || *(c + 1) == '/')) {
			for (int i = pos - 1; i >= 0; --i) {
				if (path[i] == '/') {
					pos = i;
					break;
				}
			}
			c++;
		} else {
			path[pos++] = *(c++);
		}
	}
	path[pos++] = '\0';
}

void Rdb::ConvertToLinuxPath(char* lpszPath) {
	int iLen = strlen(lpszPath);
	for (int i = 0; i < iLen; ++i) {
		if (lpszPath[i] == '\\') {
			lpszPath[i] = '/';
		}
	}
}

void Rdb::ConvertToWindowPath(char* lpszPath) {
	int iLen = strlen(lpszPath);
	for (int i = 0; i < iLen; ++i) {
		if (lpszPath[i] == '/') {
			lpszPath[i] = '\\';
		}
	}
}

void Rdb::Step(lua_Debug *ar) {

}

void Rdb::Forget(lua_Debug *ar) {
	m_iLastFNameNo = 0;
	m_iCurStackFrame = 0;
}

void Rdb::Interaction(lua_Debug *ar) {
	Step(ar);
	SendCurpos();
	MainLoop(ar);
	Forget(ar);
}

void Rdb::SendCurpos() {
	lua_Debug ar;
	int iStatus = GetInfo(m_iCurStackFrame, "lS", &ar);
	if (iStatus == 1) {
		if (ar.currentline != m_iLastFNameNo) {
			char szBuf[32];
			char szFullPath[1024];
			MakeFullPath(szFullPath, sizeof(szFullPath), m_strBasePath.c_str(),
					ar.source);

			char szClientFullPath[1024];
			MakeClientFullPath(szFullPath, szClientFullPath, sizeof(szClientFullPath));
			ConvertToWindowPath(szClientFullPath);

			m_strSendMsg = m_strPreFlag + "curpos#";
			m_strSendMsg = m_strSendMsg + szClientFullPath;
			m_strSendMsg = m_strSendMsg + ":";
			m_strSendMsg = m_strSendMsg + itoa(ar.currentline, szBuf, 10);
			DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
			m_iLastFNameNo = ar.currentline;
		}
	} else {
		// 取消光标的显示
		DisableCurPos();
	}
}

void Rdb::DisableCurPos() {
	m_strSendMsg = m_strPreFlag + "disablecurpos#";
	DbgServer::Instance()->PushSendMsg(m_strSendMsg.c_str());
}

void Rdb::ClearDebugInfo() {
	m_iLastFNameNo = 0;
	m_mapBreakPoints.clear();
	m_iStepLevel = 0;
	m_iLastFNameNo = 0;
	m_strCurFName = "";
	m_iLastBreakId = 1;
	m_bStepOver = false;
	m_bStepInto = false;
	if (!DbgConfiger::Instance()->IsSetTrackInStart()) {
		lua_sethook(m_lpLuaState, NULL, 0, 0);
	}
}

void Rdb::SplitFileInfo(const char* lpszFileFnameNo, char* & lpszFileName,
		int& iLineNo) {
	char* lpszNext = (char*) lpszFileFnameNo;
	char* lpszLineNo = (char*) lpszFileFnameNo;
	while (true) {
		lpszLineNo = lpszNext;
		lpszNext = strstr((lpszNext + 1), ":");
		if (lpszNext == NULL) {
			lpszLineNo[0] = 0;
			++lpszLineNo;
			break;
		}
	}

	lpszFileName = (char*) lpszFileFnameNo;
	iLineNo = SafeAsciToInt(lpszLineNo);
	//strlwr((char*)lpszFileName);
	ConvertToWindowPath((char*) lpszFileName);
}

void* Rdb::FindBreakpointNodeById(int iBpId) {
	StdMapBreakPointIter iters = m_mapBreakPoints.begin();
	for (; iters != m_mapBreakPoints.end(); ++iters) {
		StdLstBreakPoint& lstBreakPoint = (*iters).second;
		StdLstBreakPointIter iter = lstBreakPoint.begin();
		for (; iter != lstBreakPoint.end(); ++iter) {
			SBreakPoint& stBP = (*iter);
			if (stBP.iId == iBpId) {
				return &stBP;
			}
		}
	}

	return NULL;
}

void Rdb::AppendTabsByAlignLen(int iStringLen, int iOneTabSpaces,
		int iAlignTabs, std::string& strBreakMsg) {
	int iTabCount = (iAlignTabs * iOneTabSpaces - iStringLen) / iOneTabSpaces
			+ (iStringLen % iOneTabSpaces + iOneTabSpaces - 1) / iOneTabSpaces;
	if (iTabCount <= 0) {
		iTabCount = 1;
	}
	for (int i = 0; i < iTabCount; ++i) {
		strBreakMsg += "\t";
	}
}

const char* Rdb::LuaExec(const char* lpszCondition, const char* lpszFunString) {
	char szBuf[32];
	m_strCommon = "";
	lua_getglobal(m_lpLuaState, lpszFunString);
	if (lua_isfunction(m_lpLuaState, -1)) {
		lua_pushstring(m_lpLuaState, lpszCondition);
		int iStatus = lua_pcall(m_lpLuaState, 1, 0, 0);
		if (iStatus == 0) {
			lua_getglobal(m_lpLuaState, "tqdb_exec_retval");
			if (lua_isboolean(m_lpLuaState, -1)) {
				if (lua_toboolean(m_lpLuaState, -1) != 0) {
					m_strCommon = "1";
				} else {
					m_strCommon = "0";
				}
			} else if (lua_isnumber(m_lpLuaState, -1)) {
				m_strCommon = lua_tostring(m_lpLuaState, -1);
			} else if (lua_isstring(m_lpLuaState, -1)) {
				m_strCommon = lua_tostring(m_lpLuaState, -1);
			} else if (lua_isuserdata(m_lpLuaState, -1)) {
				m_strCommon = "userdata: 0x";
				SafeSprintf(szBuf, sizeof(szBuf), "%08x",
						reinterpret_cast<long>(lua_topointer(m_lpLuaState, -1)));
				m_strCommon = m_strCommon + szBuf;
			} else if (lua_isfunction(m_lpLuaState, -1)) {
				m_strCommon = "function: 0x";
				SafeSprintf(szBuf, sizeof(szBuf), "%08x",
						reinterpret_cast<long>(lua_topointer(m_lpLuaState, -1)));
				m_strCommon = m_strCommon + szBuf;
			} else if (lua_iscfunction(m_lpLuaState, -1)) {
				m_strCommon = "cfunction: 0x";
				SafeSprintf(szBuf, sizeof(szBuf), "%08x",
						reinterpret_cast<long>(lua_topointer(m_lpLuaState, -1)));
				m_strCommon = m_strCommon + szBuf;
			}

			lua_pop(m_lpLuaState, 1);
		} else {
			lua_pop(m_lpLuaState, 1);
		}
	} else {
		lua_pop(m_lpLuaState, 1);
	}

	return m_strCommon.c_str();
}

bool Rdb::IsDigital(const char* lpszVal) {
	int iLen = strlen(lpszVal);
	for (int i = 0; i < iLen; ++i) {
		if (*(lpszVal + i) < '0' || *(lpszVal + i) > '9') {
			return false;
		}
	}

	return true;
}

int Rdb::GetCurStackFrame() {
	return m_iCurStackFrame;
}
