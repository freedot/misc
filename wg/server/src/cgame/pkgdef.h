#ifndef _PKG_DEF_H_
#define _PKG_DEF_H_ 

const ushort CUR_VER			= 1;


#define GETIDX_FROM_ROLEID(roleid) (ulong)(roleid&0xffffffff)
#define MAKE_ROLEID(zoneid, tableid, idx) \
	((((uint64)zoneid)<<48)&0xffff000000000000)|((((uint64)tableid)<<32)&0xffff00000000)|(((uint64)idx)&0xffffffff)

const ulong MAX_BUILDED_CNT		= 6;
const ulong MAX_BUILDING_CNT	= 16;
const ulong MAX_CITY_CNT		= 64;
const ulong MAX_KEY_LEN			= 16;

const ulong MAX_TABLE_COUNT		= 1;

const ulong MAX_SERVER_NAME_LEN	= 256;
const ulong MAX_ZONEGROUP_LEN	= 256;
const ulong MAX_SERVER_URL_LEN	= 1024;

const ulong MAX_ONLINE_ROLE		= 10000;
const ulong MIN_REG_ROLE		= 1000;

const ulong MAX_ZONEACTIVE_CNT	= 1024;

const ulong MAX_MAP_WIDTH		= 800;
const ulong MAX_MAP_HEIGHT		= 800;

const ulong MAX_CITYNAME_LEN	= 22;
const ulong MAX_ROLENAME_LEN	= 22;
const ulong MAX_USERNAME_LEN	= 22;
const ulong MAX_ALLINAME_LEN	= 22;


const ulong MAX_SQL_LEN			= 2097152;


#endif // _PKG_DEF_H_