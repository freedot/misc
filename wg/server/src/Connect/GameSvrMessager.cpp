/*
 * GameSvrMessager.cpp
 *
 *  Created on: 2014-8-6
 *      Author: qujianbiao
 */

#include "GameSvrMessager.h"

GameSvrMessager::GameSvrMessager() :
		m_objContainer(NULL), m_messager(NULL), m_gameSvrId(0) {
}

GameSvrMessager::~GameSvrMessager() {
}

void GameSvrMessager::SetObjContainer(ObjContainer<User>* container) {
	m_objContainer = container;
}

void GameSvrMessager::SetMessager(Net::Messager* messager) {
	m_messager = messager;
}

void GameSvrMessager::SetGameSvrId(int gameSvrId) {
	m_gameSvrId = gameSvrId;
}

void GameSvrMessager::OnMsgFromGameSvr(char* msg) {
	int32 type = GetMessagerType(msg);
	if (type == MSG_TRANSFER) {
		OnMsgTransfer(msg + sizeof(type));
	} else if (type == MSG_NOTIFY) {
		OnMsgNotify(msg);
	} else if (type == MSG_SETUSERKEY) {
		OnMsgSetUserKey(msg);
	}
}

void GameSvrMessager::OnMsgTransfer(char* msg) {
	object_id id = *((object_id *) msg);
	User* user = m_objContainer->getById(id);
	if (user == NULL) {
		SendUserExitMsgToGameSvr(id);
		return;
	}

	msg += sizeof(id);
	if (!user->SendMsg(msg)) {
		assert(false);
		std::cerr << "transfer message error!" << std::endl;
	}
}

void GameSvrMessager::OnMsgNotify(char* msg) {
	MsgNotify* lpNotify = (MsgNotify*) msg;
	if (lpNotify->cmd == MSG_CMD_USEREXIT_SC) {
		OnMsgCmdUserExit(lpNotify);
	} else if (lpNotify->cmd == MSG_CMD_USERLOGINOK_SC) {
		OnMsgCmdUserLoginOk(lpNotify);
	}
}

void GameSvrMessager::OnMsgSetUserKey(char* msg) {
	MsgSetUserKey* userkey = (MsgSetUserKey*) msg;
	User* user = m_objContainer->getById(userkey->userid);
	if (user) {
		user->SetUserKey((uchar*) (userkey->key));
	}
}

void GameSvrMessager::OnMsgCmdUserExit(MsgNotify* lpNotify) {
	User* user = m_objContainer->getById(lpNotify->userid);
	if (user) {
		user->SetState(USER_STATE_WILLCLOSE);
	}
}

void GameSvrMessager::OnMsgCmdUserLoginOk(MsgNotify* lpNotify) {
	User* user = m_objContainer->getById(lpNotify->userid);
	if (user) {
		user->SendUserIdAndCltKeyToClient();
		user->SetState(USER_STATE_GAMEIN);
	}
}

void GameSvrMessager::SendUserExitMsgToGameSvr(object_id id) {
	MsgNotify notify;
	notify.type = MSG_NOTIFY;
	notify.userid = id;
	notify.cmd = MSG_CMD_USEREXIT_CS;
	m_messager->Send(m_gameSvrId, &notify, sizeof(notify));
}

int32 GameSvrMessager::GetMessagerType(char* msg) {
	return *((int32 *) msg);
}

