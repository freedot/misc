all:
  gcc -D_WINDOWS_ -g .\ring_buffer_test.c ..\libs\ring_buffer.c -o ring_buffer_test.exe 
