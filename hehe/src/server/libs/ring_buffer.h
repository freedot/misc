/**
  ringbuffer 环形数据队列（无锁）
  实现两个线程间的数据传送
  可以在创建时传入共享内存，实现两个进程间的数据传送。
  使用时要确保写入端只有一个线程操作，读取端也只有一个线程操作
*/
#ifndef RINGBUFFER_H
#define RINGBUFFER_H
#include <stdint.h>
#include <stdbool.h>

enum {
  rb_ok = 0,
  rb_err_lesssize = -1,
  rb_err_sizenomatch = -2,
  rb_err_add_largesize = -3,
  rb_err_add_busy = -4,
  rb_err_get_largesize = -5  
};
typedef void *ringbuffer_handle;

/** 返回buffer需要存储私有信息的字节数 */
int32_t ringbuffer_paddingsize();
/** user_heap可以为空，当user_heap不为空时，user_heap_size=buf_size + ringbuffer_paddingsize() */
ringbuffer_handle ringbuffer_create(uint32_t buf_size, void *user_heap, uint32_t user_heap_size, int32_t addtimeoutMs, int* result);
/** 释放队列 */
void ringbuffer_release(ringbuffer_handle handle);

/** 必须用ringbuffer_commit提交才生效, 返回 data_size / 0 */
int ringbuffer_add(ringbuffer_handle handle, void *data, uint32_t data_size);
/** 将前面所有adddata的数据提交生效 */
void ringbuffer_commit(ringbuffer_handle handle);
/** 将前面所有adddata的数据回退 */
void ringbuffer_revert(ringbuffer_handle handle);
/** ringbuffer_adddata 和 ringbuffer_commit的组合，数据立即, 返回 data_size / 0 */
int ringbuffer_push(ringbuffer_handle handle, void *data, uint32_t data_size);

/** 从队列尾部获取指定大小的数据, 不做弹出操作, 返回 outdata / NULL */
void* ringbuffer_get(ringbuffer_handle handle, void* outdata, uint32_t data_size, int* result);
/** 从队列尾部弹出指定大小的数据, 返回 outdata / NULL */
void* ringbuffer_pop(ringbuffer_handle handle, void* outdata, uint32_t data_size, int* result);

/** 判断队列当前是否为空 */
bool ringbuffer_isempty(ringbuffer_handle handle);

#endif