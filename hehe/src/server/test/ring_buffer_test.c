#include "../libs/ring_buffer.h"
#include <stdio.h>
#include <stdlib.h>

#if _WINDOWS_
 #include <Windows.h>
 #include <process.h>
 #define usleep(x) SleepEx((x)/1000, 0)
 #define msleep(x) SleepEx((x), 0)
#else
 #include <unistd.h>
 #define msleep(x) usleep((x)*1000)
#endif

void ASSERT(bool b, const char* msg) {
  if (!b) {
    printf("*test failed:%s\n", msg);
  }
}

void test_create_small_size() {
  int result = 0;
  ringbuffer_handle rb = ringbuffer_create(8, NULL, 0, 0, &result);
  ASSERT(rb == NULL && result == rb_err_lesssize, "check when small len");
  ringbuffer_release(rb);
  
  rb = ringbuffer_create(16, NULL, 0, 0, &result);
  ASSERT(rb != NULL && result== rb_ok, "check when enough len");
  ringbuffer_release(rb);
  
  printf(".");
}

void test_create_user_heap_nomatch_size() {
  int result = 0;
  int buf_size = 32;
  int user_heap_size = ringbuffer_paddingsize() + buf_size;
  void* user_heap = malloc(user_heap_size);
  
  ringbuffer_handle rb = ringbuffer_create(buf_size, user_heap, user_heap_size, 0, &result);
  ASSERT(rb != NULL && rb == user_heap && result == rb_ok, "check when match size");
  ringbuffer_release(rb);
  
  rb = ringbuffer_create(buf_size - 1, user_heap, user_heap_size, 0, &result);
  ASSERT(rb == NULL && result == rb_err_sizenomatch, "check when no match size");
  ringbuffer_release(rb);
  
  rb = ringbuffer_create(buf_size + 1, user_heap, user_heap_size, 0, &result);
  ASSERT(rb == NULL && result == rb_err_sizenomatch, "check when no match size");
  ringbuffer_release(rb);
  
  free(user_heap);
  
  printf(".");
}

void test_user_heap() {
  int result = 0;
  int buf_size = 16;
  int user_heap_size = ringbuffer_paddingsize() + buf_size;
  void* user_heap = malloc(user_heap_size);
  
  ringbuffer_handle rb = ringbuffer_create(buf_size, user_heap, user_heap_size, 0, &result);
  ASSERT(rb != NULL && rb == user_heap && result == rb_ok, "check when match size");
  ringbuffer_release(rb);
}

void test_adddata_commit() {
  int result = 0;
  int32_t a;
  ringbuffer_handle rb = ringbuffer_create(32, NULL, 0, 0, &result);
  
  a = 1;
  ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(ringbuffer_isempty(rb), "not effect");
  a = 2;
  ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(ringbuffer_isempty(rb), "not effect");
  
  ringbuffer_commit(rb);
  ASSERT(!ringbuffer_isempty(rb), "not effect");
  
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(a == 1, "a==1");
  
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(a == 2, "a==2");
  ASSERT(ringbuffer_isempty(rb), "is empty"); 
  
  printf(".");
}

void test_adddata_revert() {
  int result = 0;
  int32_t a;
  ringbuffer_handle rb = ringbuffer_create(32, NULL, 0, 0, &result);
  
  a = 1;
  ringbuffer_add(rb, &a, sizeof(a));
  a = 2;
  ringbuffer_add(rb, &a, sizeof(a));
  ringbuffer_revert(rb); // revert
  a = 3;
  ringbuffer_add(rb, &a, sizeof(a));
  ringbuffer_commit(rb);
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(a == 3, "a==3");
  ASSERT(ringbuffer_isempty(rb), "is empty"); 
  
  printf(".");
}

void test_pushdata() {
  int result = 0;
  int32_t a;
  ringbuffer_handle rb = ringbuffer_create(16, NULL, 0, 0, &result);
  a = 1;
  ringbuffer_push(rb, &a, sizeof(a));
  
  a = 0;
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(a == 1, "a==1");
  
  printf(".");
}

void test_adddata_commit_wrap() {
  int result = 0;
  int32_t a;
  ringbuffer_handle rb = ringbuffer_create(17, NULL, 0, 0, &result);
  
  a = 1;
  ringbuffer_add(rb, &a, sizeof(a));
  a = 2;
  ringbuffer_add(rb, &a, sizeof(a));
  a = 3;
  ringbuffer_add(rb, &a, sizeof(a));
  a = 4;
  ringbuffer_add(rb, &a, sizeof(a));
  ringbuffer_commit(rb);
  
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(ringbuffer_isempty(rb), "is empty");
  
  a = 5;
  ringbuffer_add(rb, &a, sizeof(a));  // is wrap write
  ringbuffer_commit(rb);
  ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(a == 5, "a==5");
  ASSERT(ringbuffer_isempty(rb), "is empty");
  
  printf(".");
}

void test_adddata_busy() {
  int result = 0;
  int32_t a;
  int32_t r;
  ringbuffer_handle rb = ringbuffer_create(16, NULL, 0, 0, &result);
  a = 1;
  r = ringbuffer_add(rb, &a, sizeof(a));
  r = ringbuffer_add(rb, &a, sizeof(a));
  r = ringbuffer_add(rb, &a, sizeof(a));
  r = ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(r == sizeof(a), "ok");
  ringbuffer_commit(rb);
  
  r = ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(r == rb_err_add_busy, "is busy");
  
  printf(".");
}

void test_get_data() {
  int result = 0;
  int32_t a;
  ringbuffer_handle rb = ringbuffer_create(32, NULL, 0, 0, &result);
  a = 1;
  ringbuffer_add(rb, &a, sizeof(a));
  ringbuffer_commit(rb);
  a = 0;
  ringbuffer_get(rb, &a, sizeof(a), &result);
  ASSERT(a == 1, "a==1");
  ASSERT(!ringbuffer_isempty(rb), "is not empty"); 
  printf(".");
}

void test_adddata_add_largeadd() {
  int result = 0;
  int32_t a;
  int rt;
  ringbuffer_handle rb = ringbuffer_create(16, NULL, 0, 0, &result);
  a = 1;
  rt = ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(rt == sizeof(a), "==4");
  rt = ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(rt == sizeof(a), "==4");
  rt = ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(rt == sizeof(a), "==4");
  rt = ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(rt == sizeof(a), "==4");
  rt = ringbuffer_add(rb, &a, sizeof(a));
  ASSERT(rt == rb_err_add_largesize, "add too large data");
  printf(".");
}

void test_adddata_pop_largepop() {
  int result = 0;
  int32_t a;
  int16_t b;
  void* rt;
  ringbuffer_handle rb = ringbuffer_create(16, NULL, 0, 0, &result);
  rt = ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(rt == NULL, "rt==NULL");
  ringbuffer_add(rb, &a, sizeof(a));
  rt = ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(rt == NULL && result == rb_err_get_largesize , "rt==NULL");
  
  ringbuffer_commit(rb);
  rt = ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(rt == &a , "rt==&a");
  
  b = 1;
  ringbuffer_add(rb, &b, sizeof(b));
  ringbuffer_commit(rb);
  rt = ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(rt == NULL && result == rb_err_get_largesize , "rt==NULL");
  
  b = 2;
  ringbuffer_add(rb, &b, sizeof(b));
  ringbuffer_commit(rb);
  rt = ringbuffer_pop(rb, &a, sizeof(a), &result);
  ASSERT(rt == &a && result == rb_ok , "rt==&a");
  printf(".");
}

int main(int argc, char * argv[]) {
  test_create_small_size();
  test_create_user_heap_nomatch_size();
  test_adddata_commit();
  test_adddata_revert();
  test_pushdata();
  test_adddata_commit_wrap();
  test_adddata_busy();
  test_get_data();
  test_adddata_add_largeadd();
  test_adddata_pop_largepop();
  return 0;
}