#ifndef _RDB_H__
#define _RDB_H__
#include <singleton.h>
#include <string>
#include <list>
#include <vector>
#include <map>
#include "DbgHelper.h"

extern "C" {
#include <lua/lua.h>
#include <lua/lauxlib.h>
}

typedef std::vector<char*> StdVctVar;
class Rdb: public Singleton<Rdb> {
	DECLARE_SINGLETON(Rdb);
	friend void MyHookCallback(lua_State *L, lua_Debug *ar);

public:
	void SetState(lua_State* lpLuaState);
	bool HandleCommand(char* lpszMsg);
	int GetCurStackFrame();

public:
	virtual ~Rdb();

protected:
	bool DoCommand(const char* lpszPreFlag, const char* lpszCmd, StdVctVar& vctVar, const char* lpszLine);
	void SetTrace();
	void SetBasePath(const char* lpszBasePath);
	void UserLine(lua_Debug *ar);
	void UserCall(lua_Debug *ar);
	void UserReturn(lua_Debug *ar);
	void UserTailReturn(lua_Debug *ar);
	void DispatchLine(lua_Debug *ar);
	void DispatchCall(lua_Debug *ar);
	void DispatchReturn(lua_Debug *ar);
	void DispatchTailReturn(lua_Debug *ar);
	bool IsStopHere(lua_Debug *ar);
	bool IsBreakHere(lua_Debug *ar);
	void MainLoop(lua_Debug *ar);
	void SetContinue();
	void SetStep();
	void SetNext();
	void SetReturn();
	int SetBreak(const char* lpFilePath, int iLineNo, bool bTemp, const char* lpszCondition);
	void SendStackTrace();
	void DoBreak(StdVctVar& vctVar, bool bTemp);
	void DoClear(StdVctVar& vctVar);
	void DoDown(StdVctVar& vctVar);
	void DoUp(StdVctVar& vctVar);
	const char* DoPrint(StdVctVar& vctVar);
	const char* DoWhatis(StdVctVar& vctVar);
	const char* DoArgs(StdVctVar& vctVar);
	const char* DoExec(StdVctVar& vctVar);
	void DoJump(StdVctVar& vctVar);
	void DoDisable(StdVctVar& vctVar);
	void DoEnable(StdVctVar& vctVar);
	void DoIgnore(StdVctVar& vctVar);
	void DoCondition(StdVctVar& vctVar);
	void DoHelp(StdVctVar& vctVar);

protected:
	int GetInfo(int iLevel, const char* option, lua_Debug* ar);
	lua_State* GetThread(lua_State *L, int *arg);
	void MakeFullPath(char* lpszFullPath,
			int iBufLen,
			const char* lpszBasePath,
			const char* lpszFileName);
	void MakeClientFullPath(const char* fullPath, char* clientFullPath, int pathLen);
	void RemoveUpDot(char* path);
	void ConvertToLinuxPath(char* lpszPath);
	void ConvertToWindowPath(char* lpszPath);

	void Step(lua_Debug *ar);
	void Forget(lua_Debug *ar);
	void Interaction(lua_Debug *ar);
	void SendCurpos();
	void DisableCurPos();
	void ClearDebugInfo();
	void SplitFileInfo(const char* lpszFileFnameNo, char* & lpszFileName, int& iLineNo);
	void* FindBreakpointNodeById(int iBpId);
	void AppendTabsByAlignLen(int iStringLen, int iOneTabSpaces, int iAlignTabs, std::string& strBreakMsg);
	const char* LuaExec(const char* lpszCondition, const char* lpszFunString);
	bool IsDigital(const char* lpszVal);
	void GotoStack(int iStackFrame);

private:
	Rdb();

private:
	struct SBreakPoint
	{
		int iId;
		int iType;
		int iLine;
		std::string strCondition;
		std::string strFilePath;
		int iIgnoreCount;
		bool bTemporary;
		bool bEnable;
		SBreakPoint():
		iId(0),
		iType(0),
		iLine(0),
		iIgnoreCount(0),
		bTemporary(false),
		bEnable(true)
		{}
	};

	typedef std::list<SBreakPoint> StdLstBreakPoint;
	typedef StdLstBreakPoint::iterator StdLstBreakPointIter;

	typedef std::map<std::string, StdLstBreakPoint> StdMapBreakPoint;
	typedef StdMapBreakPoint::iterator StdMapBreakPointIter;

private:
	std::string m_strPreFlag;
	std::string m_strSendMsg;
	std::string m_strBasePath;
	std::string m_strClientBasePath;
	lua_State* m_lpLuaState;
	StdMapBreakPoint m_mapBreakPoints;
	bool m_bPreExec;
	int m_iStackLevel;
	int m_iStepLevel;
	int m_iLastFNameNo;
	int m_iCurStackFrame;
	std::string m_strCurFName;
	std::string m_strBreakMsg;
	std::string m_strBreakPointMsg;
	int m_iLastBreakId;
	bool m_bStepOver;
	bool m_bStepInto;
	std::vector<char*> m_vctVar;
	std::string m_strCommon;
	DbgHelper m_objHelper;
};

#endif // _RDB_H__
