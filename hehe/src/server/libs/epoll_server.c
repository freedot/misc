#include "epoll_server.h"

#if _WINDOWS_
 static int init_net()  {
   WSADATA wsd;  
   int ret = WSAStartup(MAKEWORD(2,2), &wsd);  
   if (ret != 0) return ret;
   epoll_startup();
   return 0;
 }
 static void release_net() {
   WSACleanup(); 
 }
#else
 static int init_net()  {return 0;}
 static void release_net() {}
#endif

int start_server(struct server_cfg *cfg, struct server_callback *callback) {
  int ret = -1;
  int svr_fd;
  int clt_fd;
  int epoll_fd;
  int nfds;
  int i;  
  int reuse_addr = 1;
  int sin_size;
  struct epoll_event ev;
  struct epoll_event *pev;
  struct epoll_event *events;
  struct sockaddr_in svr_addr;
  struct sockaddr_in clt_addr;
  
  if ( init_net() < 0) {
    perror("init net");
    return ret;
  }
  
  svr_fd = socket(PF_INET, SOCK_STREAM, 0);
  if (svr_fd < 0) {
    perror("create socket");
    goto end;  
  }
  setsockopt(svr_fd, SOL_SOCKET, SO_REUSEADDR, (char*)(&reuse_addr), sizeof(reuse_addr));
  
  memset(&svr_addr, 0, sizeof(svr_addr));
  svr_addr.sin_family = AF_INET;
  svr_addr.sin_addr.s_addr = INADDR_ANY;
  svr_addr.sin_port = htons(cfg->port);
  if (bind(svr_fd, (struct sockaddr *)&svr_addr, sizeof(struct sockaddr)) < 0 ) {     
    perror("bind");   
    goto end;
  }
  
  listen(svr_fd, cfg->listen_backlog);
  
  if (!(events = (struct epoll_event *)malloc(cfg->epoll_max_events * sizeof(struct epoll_event)))) {
		perror("malloc epoll events");
    goto end;
	}
  
  epoll_fd = epoll_create(cfg->epoll_max_events);
  if(epoll_fd == 0) {
    perror("epoll_create failed");  
    goto end;
  }
  
  ev.events = EPOLLIN;  
  ev.data.fd = svr_fd;  
  if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, svr_fd, &ev) < 0) {  
    perror("epll_ctl reg svr_fd");  
    goto end;
  }
  
  while (cfg->run) {
    nfds = epoll_wait(epoll_fd, events, cfg->epoll_max_events, cfg->epoll_wait_timeout);
    if (RB_UNLIKELY(nfds < 0)) {
      perror("start epoll_wait failed");  
      continue;
    }
    for (i=0; i<nfds; i++) {
      pev = events + i;
      if (RB_UNLIKELY(pev->data.fd == svr_fd)) {
        sin_size=sizeof(struct sockaddr_in);
        if (RB_UNLIKELY((clt_fd = accept(svr_fd, (struct sockaddr *)&clt_addr, &sin_size)) < 0)) {
          perror("accept client_sockfd failed");
          continue;
        }
        pev->events = EPOLLIN;  
        pev->data.fd = clt_fd;  
        callback->on_new(pev);
        if (RB_UNLIKELY(epoll_ctl(epoll_fd, EPOLL_CTL_ADD, clt_fd, pev) < 0)) {
          perror("epoll_ctl:client register failed");
          continue;
        }
      }
      else {
        callback->on_recv(pev);
      }
    }
    callback->on_update();
  }
  ret = 0;
  
end:
  callback->on_destory();
  if (events != NULL) free(events);
  if (svr_fd > 0) close(svr_fd);
  release_net();
  return ret;
}