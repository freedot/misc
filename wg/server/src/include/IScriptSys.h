#ifndef _I_SCRIPTSYS_H_
#define _I_SCRIPTSYS_H_
#include "IGameSys.h"
#include "IUpdateListener.h"

extern "C" _TQ_EXPORT void *l_alloc(void *ud, void *ptr, size_t osize,
		size_t nsize);

// {ECC0929B-11DC-4175-BCE9-E9AED369DBE1}
static const TQGUID IUID_ISCRIPTSYS = { 0xecc0929b, 0x11dc, 0x4175, { 0xbc,
		0xe9, 0xe9, 0xae, 0xd3, 0x69, 0xdb, 0xe1 } };

// {DCC0925B-32DC-31AB-AAC9-E9AED36990E1}
static const TQGUID IUID_ISMCOM = { 0xdcc0925b, 0x32dc, 0x31ab, { 0xaa, 0xc9,
		0xe9, 0xae, 0xd3, 0x69, 0x90, 0xe1 } };

// {49C092A0-74BE-56DD-BBC9-E9CCD36990CB}
static const TQGUID IUID_ISMCLT = { 0x49c092a0, 0x74BE, 0x56dd, { 0xbb, 0xc9,
		0xe9, 0xcc, 0xd3, 0x69, 0x90, 0xcb } };

// {AA8A7BA0-0265-457d-AA3E-8F33AA002873}
static const TQGUID IUID_ISM_WEB_SVR = { 0xaa8a7ba0, 0x265, 0x457d, { 0xaa,
		0x3e, 0x8f, 0x33, 0xaa, 0x0, 0x28, 0x73 } };

// {87DFBE31-1D48-4171-B43C-EEF292173DE4}
static const TQGUID IUID_ISMDBG = { 0x87dfbe31, 0x1d48, 0x4171, { 0xb4, 0x3c,
		0xee, 0xf2, 0x92, 0x17, 0x3d, 0xe4 } };

namespace Script {
/** 脚本模块接口
 在该模块中实现新的脚本接口导出，以动态库的形式提供给
 IScriptSys::AddScriptModule来状态初始化
 */
class IScriptSys;
class IScriptModule: public IInterface {
public:
	/** 初始化脚本运行环境
	 @param lpScriptSys
	 脚本系统
	 @param lpScriptEnv
	 当前脚本的全局运行环境
	 @return
	 返回true表示初始化成功
	 */
	virtual bool InitScriptEnvironment(IScriptSys* lpScriptSys,
			void* lpScriptEnv) = 0;
};

/** 脚本系统接口
 */
class IScriptSys //tolua_export
		: public IInterface
{ //tolua_export
public:
	//tolua_begin
	/** 清空已加载的文件缓冲
	 */
	virtual void ClearLoaded() = 0;
	//tolua_end

	/** 向脚本系统添加一个脚本模块
	 @param lpScriptModule
	 脚本模块的对象指针
	 @return
	 返回true或false
	 */
	virtual bool AddScriptModule(const IScriptModule* lpScriptModule) = 0;

	/** 添加一个脚本运行的系统目录,在脚本运行时,会尝试从该路径查找
	 一个被导入的脚本文件是否存在,例如python的import,lua的require
	 @param lpszPath
	 将要设置的系统路径
	 */
	virtual void AddSysPath(const char* lpszPath) = 0;

	/** 装载并运行一个脚本文件
	 @param lpszName
	 脚本文件路径名
	 @return
	 返回true或false
	 */
	virtual bool RunScriptFromFile(const char* lpszName) = 0;

	/** 装载一个脚本文件
	 @param lpszName
	 脚本文件路径名
	 @return
	 返回0表示成功
	 */
	virtual int LoadScriptFromFile(const char* lpszName) = 0;

	/** 只运行一段脚本
	 @param lpScriptString
	 脚本语句数据指针
	 */
	virtual int RunScriptString(const char* lpScriptString) = 0;

	/** 获得最后一次脚本运行的错误
	 */
	virtual const char* GetLastError() const = 0;
}; //tolua_export

}// end Script namespace

#endif // _I_SCRIPTSYS_H_

