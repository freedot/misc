#include <commhead.h>
#include "DbgServer.h"
#include "DbgConfiger.h"
#include <algorithm>

DbgServer::DbgServer() :
		m_bQuiting(true), m_lpRecvBuf(NULL), m_iRecvLen(0), m_iPackageLen(0) {
}

DbgServer::~DbgServer() {

}

void DbgServer::Start() {
	m_bQuiting = false;
	TQCREATETHREAD(0, TcpRecvThread, this);
}

void DbgServer::Stop() {
	m_bQuiting = true;
}

void DbgServer::CloseClient() {
	// 清空发送队列
	m_queSendMsg.clear();
	m_iRecvLen = 0;
	m_iPackageLen = 0;

	m_objCltSocket.Close();
	m_queRecvMsg.push_back("clear#");
	m_queRecvMsg.push_back("sysquit#");
}

void DbgServer::CloseServer() {
	CloseClient();
	m_objHostSocket.Close();
}

bool DbgServer::IsRecvMsgEmpty() {
	return m_queRecvMsg.empty();
}

const char* DbgServer::RecvMsgTop() {
	return m_queRecvMsg.front().c_str();
}

void DbgServer::PopRecvMsg() {
	m_queRecvMsg.pop_front();
}

void DbgServer::PushSendMsg(const char* lpszMsg) {
	if (lpszMsg != NULL) {
		m_queSendMsg.push_back(lpszMsg);
	}
}

THREADRET THREADAPI TcpRecvThread(void* param) {
	DbgServer* lpThis = (DbgServer*) param;
	if (!lpThis->m_objHostSocket.CreateSocket(AF_INET, SOCK_STREAM, 0, 0)) {
		return THREADRET_ERR;
	}

	if (!lpThis->m_objHostSocket.Bind(c_serverPort)) {
		lpThis->m_objHostSocket.Close();
		std::cerr << "bind " << c_serverPort << " port for remote rdb failed!" << std::endl;
		return THREADRET_ERR;
	}

	lpThis->m_objHostSocket.SetListenNumber(1);
	lpThis->m_objHostSocket.SetNonBlocking();

	lpThis->m_lpRecvBuf = new char[c_recvbuffer_size + 1];
	lpThis->m_iRecvLen = 0;
	lpThis->m_iPackageLen = 0;

	while (!lpThis->m_bQuiting) {
		if (lpThis->m_objCltSocket.GetHandle() == -1) {
			// 接受客户端的连接
			sockaddr_in stClientAddr;
			int iAddrLen = sizeof(stClientAddr);
			int iCltSocket = lpThis->m_objHostSocket.Accept(
					(sockaddr*) &stClientAddr, &iAddrLen, 50);
			if (iCltSocket <= 0) {
				continue;
			}

			// 是否在可信的IP列表中
			lpThis->m_objCltSocket.Attach(iCltSocket);
			if (!DbgConfiger::Instance()->IsValidIp(
					stClientAddr.sin_addr.s_addr)) {
				lpThis->m_objCltSocket.Close();
				continue;
			}
		} else {
			if (lpThis->m_iPackageLen == 0) {
				// 获得包长
				ushort usPackLen;
				int iRecvLen = lpThis->m_objCltSocket.Recv((char*) &usPackLen,
						sizeof(ushort), 50);
				if (iRecvLen < 0
						|| (iRecvLen > 0 && iRecvLen != sizeof(usPackLen))) {
					lpThis->CloseClient();
					continue;
				}

				if (iRecvLen == sizeof(usPackLen)) {
					lpThis->m_iPackageLen = (int) ntohs(usPackLen);
					if (lpThis->m_iPackageLen >= c_recvbuffer_size) {
						lpThis->CloseClient();
						continue;
					}
				}
			} else {
				// 获得包体
				int iRecvLen = lpThis->m_objCltSocket.Recv(
						lpThis->m_lpRecvBuf + lpThis->m_iRecvLen,
						lpThis->m_iPackageLen - lpThis->m_iRecvLen, 50);
				if (iRecvLen < 0) {
					lpThis->CloseClient();
					continue;
				}

				lpThis->m_iRecvLen += iRecvLen;
				if (lpThis->m_iRecvLen == lpThis->m_iPackageLen) {
					lpThis->m_lpRecvBuf[lpThis->m_iRecvLen] = '\0';
					lpThis->m_queRecvMsg.push_back(lpThis->m_lpRecvBuf);
					lpThis->m_iRecvLen = 0;
					lpThis->m_iPackageLen = 0;
				}
			}

			// 处理向client端发送的消息
			while (!lpThis->m_queSendMsg.empty()) {
				std::string& strMsg = lpThis->m_queSendMsg.front();

				// 发送包长
				ushort usPkgLen = std::min<int>(strMsg.length(),
						c_sendbuffer_size);
				ushort usPkgLenNet = htons(usPkgLen);
				if (lpThis->m_objCltSocket.Send((char*) &usPkgLenNet,
						sizeof(usPkgLenNet)) < 0) {
					lpThis->m_queSendMsg.pop_front();
					lpThis->CloseClient();
					break;
				}

				// 发送包体
				if (lpThis->m_objCltSocket.Send((char*) strMsg.c_str(),
						usPkgLen) < 0) {
					lpThis->m_queSendMsg.pop_front();
					lpThis->CloseClient();
					break;
				}

				lpThis->m_queSendMsg.pop_front();
			}
		}
	}

	lpThis->CloseServer();
	SafeDeleteArray(lpThis->m_lpRecvBuf);
	return THREADRET_OK;
}
