#include "../libs/epoll_server.h"

void on_new(struct epoll_event *ev) {
  printf("new\n");
}

void on_recv(struct epoll_event *ev) {
  printf("recv\n");
}

void on_update() {
  printf("update\n");
}

void on_destory() {
  printf("destory\n");
}

struct server_cfg cfg;
struct server_callback callback;

int main(int argc, char * argv[]) {
  cfg.run = true;
  cfg.port = 8000;
  cfg.listen_backlog = 5;
  cfg.epoll_max_events = 10;
  cfg.epoll_wait_timeout = 1000;
  
  callback.on_new = on_new;
  callback.on_recv = on_recv;
  callback.on_update = on_update;
  callback.on_destory = on_destory;
  
  start_server(&cfg, &callback);
  
  return 0;
}