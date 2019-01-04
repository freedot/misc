/*
 * defines.h
 *
 *  Created on: 2015-9-10
 *      Author: qujianbiao
 */

#ifndef DEFINES_H_
#define DEFINES_H_

static const int EUCT_USER = 0xf0;

static const int USER_LOGINING_ACTIVE_TIME_S = 10;
static const int USER_CROSS_ACTIVE_TIME_S = 5;
static const int USER_INGAME_ACTIVE_TIME_S = 60;
static const int USER_WILLCLOSE_ACTIVE_TIME_S = 5;

static const int NETCMD_RECONN = 4;
static const int NETCMD_SETCLTKEY = 5; // 设置客户端的key，id，为重连用
static const int NETCMD_RECONNECTED_OK = 6; // 重连成功
static const int NETCMD_FULL_ROLES = 202;

#define NETCMD_SETCLTKEY_S "{cmd:%d,userId:%I64d,cltKey:'%s'}"
#define NETCMD_S  "{cmd:%d}"

#endif /* DEFINES_H_ */
