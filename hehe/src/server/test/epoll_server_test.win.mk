all:
  gcc -D_WINDOWS_ -g .\epoll_server_test.c ..\3rd\winsys\epoll.c ..\libs\epoll_server.c -lws2_32 -o epoll_server_test.exe 
