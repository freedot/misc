#ifndef _TQ_MESSAGERCMD_H_
#define _TQ_MESSAGERCMD_H_
#include "commhead.h"

static const int32 MSG_TRANSFER = 0;
static const int32 MSG_NOTIFY = 1;
static const int32 MSG_SETUSERKEY = 2;

//tolua_begin
enum EMsgCmd {
	MSG_CMD_USEREXIT_SC, // 是由gamesvr通知前端svr的消息
	MSG_CMD_USERLOGINOK_SC, // 是由gamesvr通知前端svr的消息
	MSG_CMD_USEREXIT_CS, // 是由前端svr通知gamesvr的消息
};
//tolua_end

struct MsgNotify {
	int32 type;
	object_id userid;
	int32 cmd;
};

struct MsgSetUserKey {
	int32 type;
	object_id userid;
	char key[16];
};

#endif //_TQ_MESSAGERCMD_H_
