#include "User.h"
#include "Defines.h"

const char* g_validchars =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";

User::User() {
	m_iodata = 0;
	m_socket = 0;
	m_ip = 0;
	m_state = USER_STATE_INIT;
	m_activetime = 0;
	m_reconnUserid = 0;
	strncpy((char*) m_userkey, "fheurdh6537aj1HG", USE_KEY_LEN);
	m_isTmp = false;
	m_handler = NULL;
	m_wsVer = 0;
	CreateRandCltKey();
}

User::~User() {
}

void User::CreateRandCltKey() {
	int validCharsLen = strlen(g_validchars);
	for (int i = 0; i < CLT_KEY_LEN - 1; i++) {
		char c = g_validchars[rand() % validCharsLen];
		m_cltKey[i] = c;
	}
	m_cltKey[CLT_KEY_LEN - 1] = '\0';
}

IConnectHandler* User::GetHandler() {
	return m_handler;
}

void User::SetHandler(CONNECT_HANDLER hdrType) {
	IConnectHandler* handler = NULL;
	if (hdrType == HANDLER_FLASH) {
		handler = &m_flashHander;
	} else if (hdrType == HANDLER_TGW) {
		handler = &m_tgwHander;
	} else if (hdrType == HANDLER_WS) {
		handler = &m_wsHandler;
	}
	m_handler = handler;
}

const uchar* User::GetUserKey() {
	return m_userkey;
}

const char* User::GetCltKey() {
	return m_cltKey;
}

int User::GetSocket() {
	return m_socket;
}

void User::SetSocket(int socket) {
	m_socket = socket;
}

bool User::IsTmp() {
	return m_isTmp;
}

void User::SetTmp() {
	m_isTmp = true;
}

int User::GetState() {
	return m_state;
}

void User::SetState(int state) {
	m_state = state;
}

void User::SendUserIdAndCltKeyToClient() {
	char msg[128] = { 0 };
	SafeSprintf(msg, sizeof(msg), NETCMD_SETCLTKEY_S, NETCMD_SETCLTKEY,
			this->getId(), this->GetCltKey());
	SendMsg(msg);
}

void User::SendReconnectedOkToClient() {
	char msg[128] = { 0 };
	SafeSprintf(msg, sizeof(msg), NETCMD_S, NETCMD_RECONNECTED_OK);
	SendMsg(msg);
}

int32 User::GetIp() {
	return m_ip;
}

void User::SetIp(int32 ip) {
	m_ip = ip;
}

void User::SetActiveTime(int32 curtime) {
	if (IsTmp() || IsWillClose())
		return;
	m_activetime = curtime;
}

bool User::IsCrossTimeout(int32 curtime) {
	if (GetState() == USER_STATE_FLASH_HEAD
			&& (curtime - m_activetime) > USER_CROSS_ACTIVE_TIME_S) {
		return true;
	}
	return false;
}

bool User::IsLoginTimeout(int32 curtime) {
	if (GetState() == USER_STATE_LOGINING
			&& (curtime - m_activetime) > USER_LOGINING_ACTIVE_TIME_S) {
		return true;
	}
	return false;
}

bool User::IsInGameTimeout(int32 curtime) {
	if (GetState() == USER_STATE_GAMEIN
			&& (curtime - m_activetime) > USER_INGAME_ACTIVE_TIME_S) {
		return true;
	}
	return false;
}

bool User::IsWillCloseTimeout(int32 curtime) {
	if (IsWillClose()
			&& (curtime - m_activetime) > USER_WILLCLOSE_ACTIVE_TIME_S) {
		return true;
	}
	return false;
}

bool User::IsActive(int32 curtime) {
	if (IsLoginTimeout(curtime) || IsCrossTimeout(curtime)
			|| IsInGameTimeout(curtime) || IsWillCloseTimeout(curtime)) {
		return false;
	}
	return true;
}

bool User::IsWillClose() {
	return GetState() == USER_STATE_WILLCLOSE;
}

bool User::IsInGame() {
	return GetState() == USER_STATE_GAMEIN;
}

void User::CloseSocket() {
	if (m_socket != -1) {
		Net::Socket socket;
		socket.Attach(m_socket);
		socket.Close();
		m_socket = -1;
	}
}

bool User::SendMsg(const char* msg) {
	if (GetWSVer() == 0) {
		return SendCommMsg(msg);
	} else if (GetWSVer() == C_WS_V1) {
		return SendWSMsgV1(msg);
	} else if (GetWSVer() == C_WS_V2) {
		return SendWSMsgV2(msg);
	} else {
		return false;
	}
}

void User::SendWSVersion() {
	if (GetWSVer() == C_WS_V1) {
		// send ws frame start
		uchar sflag = 0x00;
		SendRawMsg((const char*) (&sflag), sizeof(sflag));
		SendRawMsg("1", 1);
		// send ws frame end
		uchar eflag = 0xFF;
		SendRawMsg((const char*) (&eflag), sizeof(eflag));
	} else if (GetWSVer() == C_WS_V2) {
		// send ws frame
		uchar flag = 0x81;
		SendRawMsg((const char*) (&flag), sizeof(flag));
		uchar len = 1;
		SendRawMsg((const char*) (&len), sizeof(len));
		SendRawMsg("2", 1);
	}
}

bool User::SendCommMsg(const char* msg) {
	char outmsg[65535];
	uint32 outmsglen = sizeof(outmsg);
	if (!((ConnectHandler*) GetHandler())->EncryptPkg(msg, outmsg, outmsglen))
		return false;
	uint32 omlen = htonl(outmsglen);
	SendRawMsg((const char*) (&omlen), sizeof(outmsglen));
	SendRawMsg(outmsg, (outmsglen & 0xffffff));
	return true;
}

bool User::SendWSMsgV1(const char* msg) {
	char outmsg[65535];
	uint32 outmsglen = sizeof(outmsg);
	if (!((ConnectHandler*) GetHandler())->EncryptPkg(msg, outmsg, outmsglen))
		return false;

	// send ws frame start
	uchar sflag = 0x00;
	SendRawMsg((const char*) (&sflag), sizeof(sflag));

	uint32 omlen = htonl(outmsglen);
	char outmsg2[65535 * 2];
	int len = m_combuf.ConvertBinaryToString((const char*) (&omlen), outmsg2,
			sizeof(outmsglen), sizeof(outmsg2));
	SendRawMsg((const char *) outmsg2, len);
	len = m_combuf.ConvertBinaryToString((const char*) outmsg, outmsg2,
			outmsglen & 0xffffff, sizeof(outmsg2));
	SendRawMsg((const char *) outmsg2, len);

	// send ws frame end
	uchar eflag = 0xFF;
	SendRawMsg((const char*) (&eflag), sizeof(eflag));

	return true;
}

bool User::SendWSMsgV2(const char* msg) {
	char outmsg[65535];
	uint32 outmsglen = sizeof(outmsg);
	if (!((ConnectHandler*) GetHandler())->EncryptPkg(msg, outmsg, outmsglen))
		return false;

	// send ws frame
	uchar flag = 0x82;
	SendRawMsg((const char*) (&flag), sizeof(flag));
	uint32 data_length = 4 + (outmsglen & 0xffffff);
	if (data_length <= 125) {
		uchar len = (uchar) data_length;
		SendRawMsg((const char*) (&len), sizeof(len));
	} else {
		uchar mflag = 126;
		SendRawMsg((const char*) (&mflag), sizeof(mflag));
		ushort len = ntohs((ushort) data_length);
		SendRawMsg((const char*) (&len), sizeof(len));
	}

	uint32 omlen = htonl(outmsglen);
	SendRawMsg((const char*) (&omlen), sizeof(outmsglen));
	SendRawMsg(outmsg, (outmsglen & 0xffffff));
	return true;
}

void User::SendRawMsg(const char* msg, int msglen) {
	if (m_socket < 0)
		return;
	Net::Socket socket;
	socket.Attach(m_socket);

	int sendLen = 0;
	while (true) {
#if defined(WIN32)
		int ret = socket.Send((char*) (msg + sendLen), (msglen - sendLen));
#else
		int ret = socket.Write((const char*) (msg + sendLen), (msglen - sendLen));
#endif // WIN32
		if (ret < 0) {
			if (errno == EAGAIN || errno == EWOULDBLOCK) {
				tq_sleep(1);
				continue;
			}
			std::cerr << "errno:" << errno << std::endl;
			std::cerr << "send msg failed, will close this user" << std::endl;
			CloseSocket();
			break;
		}

		sendLen += ret;
		if (sendLen == msglen) {
			break;
		}

		tq_sleep(1);
	}
}

CombineBuf* User::GetCombineBuf() {
	return &m_combuf;
}

void User::SetUserKey(uchar* key) {
	memcpy(m_userkey, key, USE_KEY_LEN);
}

void User::SetWillReconnUser(object_id id) {
	m_reconnUserid = id;
}

object_id User::GetWillReconnUser() {
	return m_reconnUserid;
}

void User::SetWSVer(uchar ver) {
	m_wsVer = ver;
}

uchar User::GetWSVer() {
	return m_wsVer;
}
