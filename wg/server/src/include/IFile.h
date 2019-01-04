#ifndef _IFILE_H_
#define _IFILE_H_
#include "IInterface.h"


namespace IO {
//tolua_begin

/** 文件接口,目前支持UTF8
 */
class IFile: public IInterface {
public:
	/** 打开文件
	 @param fileName
	 打开的文件名称
	 @param mod
	 打开的模式
	 @return
	 返回true或false
	 */
	virtual bool Open() = 0;

	/** 获得当前文件的长度
	 */
	virtual int GetLength() = 0;

	/** 读一段数据
	 @param buf
	 存放数据的缓存区
	 @param size
	 一个记录块的大小
	 @param count
	 读取记录块的个数
	 @return
	 返回实际读取的个数
	 */
	virtual int Read(void* buf, int size, int count) = 0;

	/** 写一段数据
	 @param buf
	 数据缓存区
	 @param size
	 一个记录块的大小
	 @param count
	 读取记录块的个数
	 @return
	 返回实际写入的个数
	 */
	virtual int Write(void* buf, int size, int count) = 0;

	/** 写入一格式字符串
	 @param fmt
	 格式串
	 @param ...
	 可变参数列表
	 @return
	 返回实际写入的字符个数或出错的负数
	 */
	virtual int Print(const char* fmt, ...) = 0;

	/** 定位文件的游标位置
	 @param offset
	 相对于起始点的偏移量
	 @param origin
	 起始点位置,可以是SEEK_SET,SEEK_CUR,SEEK_END
	 @return
	 如果返回0表示成功
	 */
	virtual int Seek(long offset, int origin) = 0;

	/** 获取当前文件游标的位置
	 @return
	 返回当前文件游标位置
	 */
	virtual int Tell(void) = 0;

	/** 获取当前文件游标是否处于结尾
	 @return
	 如果返回为非零值表示是文件结尾
	 */
	virtual int Eof(void) = 0;

	/** 关闭当前文件
	 */
	virtual void Close(void) = 0;

	/** 获取文件类型（内部使用）
	 */
	virtual int GetType() = 0;
};
//tolua_end

}

#endif // _IFILE_H_
