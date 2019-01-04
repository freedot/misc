#ifndef _DLLLOADER_H_
#define _DLLLOADER_H_
#include "commhead.h"

class DllLoader {
public:
	DllLoader() {
		m_inst = NULL;
	}

	virtual ~DllLoader() {
		UnLoad();
	}

	/** 装载动态库
	 @param name
	 需要装载的动态库路径
	 @return
	 返回true或false
	 */
	bool Load(const char* name) {
		m_dllName = name;
		m_inst = (DYNLIB_HANDLE) DYNLIB_LOAD( m_dllName.c_str() );
		return (m_inst != NULL);
	}

	/** 卸载动态库
	 */
	void UnLoad() {
		if (m_inst != NULL) {
			DYNLIB_UNLOAD(m_inst);
		}
	}

	/** 获得动态库的名称
	 */
	const char* GetName(void) const {
		return m_dllName.c_str();
	}

	/** 返回指定的symbol函数地址入口
	 @param funName
	 函数名
	 @returns
	 如果成功返回该函数的地址
	 @par
	 如果失败则返回<b>NULL</b>.
	 */
	void* GetSymbol(const char* funName) const throw () {
		return (void*) DYNLIB_GETSYM( m_inst, funName );
	}

protected:
	std::string m_dllName;
	DYNLIB_HANDLE m_inst;
};

#endif // _DLLLOADER_H_
