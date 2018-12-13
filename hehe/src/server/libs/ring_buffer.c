#include "ring_buffer.h"
#include <stdio.h>
#include <stdlib.h>

//#define RB_NOT_CHECK_ARG

#if _WINDOWS_
 #include <Windows.h>
 #define usleep(x) SleepEx((x)/1000, 0)
 #define msleep(x) SleepEx((x), 0)
#else
 #include <unistd.h>
 #define msleep(x) usleep((x)*1000)
#endif

#define private
#define MIN_SIZE 16
#define SPLITBYTE 1
#define ATOMIC_SET(val, a) (*(a)) = (val)

#define RB_LIKELY(x) __builtin_expect(!!(x), 1)
#define RB_UNLIKELY(x) __builtin_expect(!!(x), 0)
#define left_size(rb) (((rb)->readpos - (rb)->writingpos - SPLITBYTE + (rb)->size) % (rb)->size)
#define commited_size(rb) (((rb)->writepos - (rb)->readpos + (rb)->size) % (rb)->size)
#define added_size(rb) (((rb)->writingpos - (rb)->writepos + (rb)->size) % (rb)->size)
#define move_readpos(rb, data_size) (ATOMIC_SET(((rb)->readpos + (data_size)) % (rb)->size, &(rb)->readpos))
#define move_writtingpos(rb, data_size) (ATOMIC_SET(((rb)->writingpos + (data_size)) % (rb)->size, &(rb)->writingpos))
#define is_read_wrap(rb, data_size) RB_UNLIKELY(((rb)->readpos + (data_size)) > (rb)->size)
#define is_write_wrap(rb, data_size) RB_UNLIKELY(((rb)->writingpos + (data_size)) > (rb)->size)

typedef struct {
  int32_t size;
  int32_t readpos;
  int32_t writepos;
  int32_t writingpos;
  int32_t addtimeoutMs;
  bool udata;
  char *buf;
} ringbuffer;

private void write_data(ringbuffer *rb, void *data, int size) {
  int part1_size, part2_size;
  if (is_write_wrap(rb, size)){
		part1_size = rb->size - rb->writingpos;
    memcpy(rb->buf + rb->writingpos, data, part1_size);
		part2_size = size - part1_size;
		memcpy(rb->buf, (char*)data + part1_size, part2_size);
	}
	else {
		memcpy(rb->buf + rb->writingpos, data, size);
	}
}

int32_t ringbuffer_paddingsize() {
  return sizeof(ringbuffer) + SPLITBYTE;
}

void *ringbuffer_create(uint32_t buf_size, void *user_heap, uint32_t user_heap_size, int32_t addtimeoutMs, int *result) {
  char *p = NULL;
  bool udata = (user_heap != NULL);
  *result = rb_ok;
  if (buf_size < MIN_SIZE) {
    *result = rb_err_lesssize;
    return NULL;
  }
  if (udata && (buf_size + ringbuffer_paddingsize()) != user_heap_size) {
    *result = rb_err_sizenomatch;
    return NULL;
  }
  p = udata ? (char *)user_heap : (char *)malloc(ringbuffer_paddingsize() + buf_size);
  ringbuffer *rb = (ringbuffer *)p;
  rb->readpos = rb->writepos = rb->writingpos = 0;
  rb->size = buf_size + SPLITBYTE;
  rb->addtimeoutMs = addtimeoutMs;
  rb->udata = udata;
  rb->buf = p + sizeof(ringbuffer);
  return rb;
}

void ringbuffer_release(ringbuffer_handle handle) {
  ringbuffer *rb = (ringbuffer *)handle;
  if (rb && !rb->udata) free(rb);
}

int ringbuffer_add(ringbuffer_handle handle, void *data, uint32_t data_size) {
  uint32_t trytimes = 0;
  ringbuffer *rb = (ringbuffer *)handle;
#ifndef RB_NOT_CHECK_ARG  
  if (RB_UNLIKELY((added_size(rb) + data_size) > (rb->size - SPLITBYTE))) {
    return rb_err_add_largesize;
  }
#endif
  while (RB_UNLIKELY(data_size > left_size(rb))) {
    if (trytimes == rb->addtimeoutMs) return rb_err_add_busy;
    msleep(1); trytimes++; 
  }
  write_data(rb, data, data_size);
  move_writtingpos(rb, data_size);
  return data_size;
}

void ringbuffer_commit(ringbuffer_handle handle){
  ringbuffer *rb = (ringbuffer *)handle;
  ATOMIC_SET(rb->writingpos, &rb->writepos);
}

void ringbuffer_revert(ringbuffer_handle handle) {
  ringbuffer *rb = (ringbuffer *)handle;
  ATOMIC_SET(rb->writepos, &rb->writingpos);
}

int ringbuffer_push(ringbuffer_handle handle, void *data, uint32_t data_size) {
  int rt = ringbuffer_add(handle, data, data_size);
  if (RB_LIKELY(rt > 0)) ringbuffer_commit(handle);
  return rt;
}

void* ringbuffer_get(ringbuffer_handle handle, void* outdata, uint32_t data_size, int* result) {
  int part1_size, part2_size;
  ringbuffer* rb = (ringbuffer*)handle;
  *result = rb_ok;
#ifndef RB_NOT_CHECK_ARG
  if (RB_UNLIKELY(commited_size(rb) < data_size)) {
    *result = rb_err_get_largesize;
    return NULL;
  }
#endif
  if (is_read_wrap(rb, data_size)) {
    part1_size = rb->size - rb->readpos;
    memcpy(outdata, rb->buf + rb->readpos, part1_size);
    part2_size = data_size - part1_size;
    memcpy((char*)outdata + part1_size, rb->buf, part2_size);
  }
  else {
    memcpy(outdata, rb->buf + rb->readpos, data_size);
  }
  return outdata;
}

void* ringbuffer_pop(ringbuffer_handle handle, void* outdata, uint32_t data_size, int* result) {
  ringbuffer* rb = (ringbuffer*)handle;
  void* rt = ringbuffer_get(rb, outdata, data_size, result);
#ifndef RB_NOT_CHECK_ARG
  if (RB_UNLIKELY(rt == NULL)) return NULL;
#endif
  move_readpos(rb, data_size);
  return rt;
}

bool ringbuffer_isempty(ringbuffer_handle handle) {
  return ((ringbuffer *)handle)->readpos == ((ringbuffer *)handle)->writepos;
}
