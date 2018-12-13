#ifndef EPOLL_SERVER_H
#define EPOLL_SERVER_H

#include <stdio.h>     
#include <stdlib.h>  
#include <string.h>
#include <stdbool.h>

#if _WINDOWS_
 #include "../3rd/winsys/epoll.h"
 #include<winsock2.h>
 #define close(x) closesocket(x)
#else
 #include "sys/epoll.h"
#endif

struct server_cfg {
  bool run;
  int port;
  int listen_backlog;
  int epoll_max_events;
  int epoll_wait_timeout;
};

struct server_callback {
  void (*on_new)(struct epoll_event *ev);
  void (*on_recv)(struct epoll_event *ev);
  void (*on_update)();
  void (*on_destory)();
};

int start_server(struct server_cfg *cfg, struct server_callback *callback);

#endif //EPOLL_SERVER_H