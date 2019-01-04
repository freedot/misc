#ifndef _IFILEMANAGER_H_
#define _IFILEMANAGER_H_
#include "IInterface.h"

// {6179660C-1AA3-49c2-BF70-3A7521CD5352}
static const TQGUID IUID_IFILEMANAGER = { 0x6179660c, 0x1aa3, 0x49c2, { 0xbf,
		0x70, 0x3a, 0x75, 0x21, 0xcd, 0x53, 0x52 } };

namespace IO {
//tolua_begin

/** 文件类型标志 */
enum EFileFlag {
	/// 包中的文件
	FLAG_FILE_PACKAGE = 1,
	/// 非包中的文件
	FLAG_FILE_RAW = 2,
};

/** 文件管理器接口,目前支持UTF8
 */
class IFileManager: public IInterface {
public:
	/**设置自然散落的读取优先级别最高,即先读自然散落的文件，不存在时再读pkg中的
	 * 默认模式下是先读取pkg中的文件
	 */
	virtual void SetNatureFileImportant() = 0;

	/** 在管理器中添加一个包
	 @param packageName
	 包的路径名称
	 @return
	 返回true或false
	 */
	virtual bool AddPackage(const char* packageName) = 0;

	/** 打开一个文件
	 @param fileName
	 打开的文件名称
	 @param mod
	 打开的模式
	 @return
	 返回文件对象或NULL
	 */
	virtual IFile* OpenFile(const char* fileName, const char* mod) = 0;

	/** 关闭文件,同时负责释放该文件对象
	 @param file
	 文件对象指针的指针
	 */
	virtual void Close(IFile** file) = 0;

	/** 判断一个文件是否存在
	 @param pathName
	 要查找的文件路径名
	 @param flags
	 文件的类型标志
	 @return
	 返回true表示存在
	 */
	virtual bool IsFileExist(const char* pathName,
			unsigned int flags/*=FLAG_FILE_PACKAGE|FLAG_FILE_RAW*/) = 0;

	/** 获得一个文件的修改时间
	 */
	virtual uint32 GetFileModifyTime(const char* pathName) = 0;

	/** 设置工作目录
	 @param pathName
	 当前工作目录
	 */
	virtual void SetWorkPath(const char* pathName) = 0;
};

//tolua_end
}

#endif // _IFILEMANAGER_H_
