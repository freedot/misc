#ifndef _I_LUAINTERFACECALLBACK_H_
#define _I_LUAINTERFACECALLBACK_H_
#include "userDataObject.h"

#define LUATOUSERTYPE(a,b,c) tolua_tousertype(a,b,c)
class ILuaInterfaceCallBack {
public:
	virtual void SetCallBack(const char* lpszFun,
			const UserDataObject& objUserData) = 0;
};

#endif // _I_LUAINTERFACECALLBACK_H_
