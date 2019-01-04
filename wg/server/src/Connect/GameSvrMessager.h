/*
 * GameSvrMessager.h
 *
 *  Created on: 2014-8-6
 *      Author: qujianbiao
 */

#ifndef GAMESVRMESSAGER_H_
#define GAMESVRMESSAGER_H_
#include <commhead.h>
#include <serverApp.h>
#include <messagerCmd.h>
#include <ObjContainer.h>
#include "User.h"


class GameSvrMessager {
public:
	void SetObjContainer(ObjContainer<User>* container);
	void SetMessager(Net::Messager* messager);
	void SetGameSvrId(int gameSvrId);
	void OnMsgFromGameSvr(char* msg);
	void SendUserExitMsgToGameSvr(object_id id);

public:
	GameSvrMessager();
	virtual ~GameSvrMessager();

private:
	void OnMsgTransfer(char* msg);
	void OnMsgNotify(char* msg);
	void OnMsgSetUserKey(char* msg);
	void OnMsgCmdUserExit(MsgNotify* lpNotify);
	void OnMsgCmdUserLoginOk(MsgNotify* lpNotify);
	int32 GetMessagerType(char* msg);

private:
	ObjContainer<User>* m_objContainer;
	Net::Messager* m_messager;
	int m_gameSvrId;
};

#endif /* GAMESVRMESSAGER_H_ */
