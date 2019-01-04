/*
 * Messager.cpp
 *
 *  Created on: 2013-2-27
 *      Author: Administrator
 */

#include "Messager.h"
#include <./tinyxml/tinyxml.h>

namespace Net {
const char* c_szComMessagerShareMem = "_Com_Messager_server_";
const int c_iComMessagerShareMem = 4096;

//-------------------------------------------------------------------------------------------------------
Messager::Messager() :
		m_ulFromId(0), m_bRecvBegin(false) {
}

//-------------------------------------------------------------------------------------------------------
Messager::~Messager() {
	StdMapPipeIter recvIter = m_mapRecvPipes.begin();
	for (; recvIter != m_mapRecvPipes.end(); ++recvIter) {
		SafeDelete((*recvIter).second);
	}

	StdMapPipeIter sendIter = m_mapSendPipes.begin();
	for (; sendIter != m_mapSendPipes.end(); ++sendIter) {
		SafeDelete((*sendIter).second);
	}
}

//-------------------------------------------------------------------------------------------------------
bool Messager::LoadConfig(const char* lpszConfig) {
	TiXmlNode* lpNode = NULL;
	TiXmlNode* lpChildNode = NULL;
	TiXmlNode* lpGrandChildNode = NULL;
	TiXmlElement* lpElement = NULL;
	int iVal = 0;

	TiXmlDocument objDoc(lpszConfig);
	objDoc.LoadFile();
	if (objDoc.Error()
			&& objDoc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		std::cerr << "Load messager configure xml file failed!" << std::endl;
		return false;
	}

	// read default value
	lpNode = objDoc.FirstChild("Default");
	if (lpNode != NULL) {
		lpChildNode = lpNode->FirstChild("ServerPath");
		if (lpChildNode != NULL) {
			lpElement = lpChildNode->ToElement();
			const char* lpszVal = lpElement->Attribute("value");
			if (lpszVal != NULL) {
				m_stDefaultVal.strServerPath = lpszVal;
			}
		}

		lpChildNode = lpNode->FirstChild("HostPort");
		if (lpChildNode != NULL) {
			lpElement = lpChildNode->ToElement();
			lpElement->Attribute("value", &iVal);
			m_stDefaultVal.usHostPort = iVal;
		}

		lpChildNode = lpNode->FirstChild("SendPipe");
		if (lpChildNode != NULL) {
			lpElement = lpChildNode->ToElement();
			lpElement->Attribute("bufsize", &iVal);
			m_stDefaultVal.iSendBufSize = iVal;
		}

		lpChildNode = lpNode->FirstChild("RecvPipe");
		if (lpChildNode != NULL) {
			lpElement = lpChildNode->ToElement();
			lpElement->Attribute("bufsize", &iVal);
			m_stDefaultVal.iRecvBufSize = iVal;
		}
	}

	// read node list
	lpNode = objDoc.FirstChild("Nodes");
	if (lpNode != NULL) {
		lpChildNode = lpNode->FirstChild("Node");
		while (lpChildNode != NULL) {
			SMessagerNode stNode;

			lpGrandChildNode = lpChildNode->FirstChild("Id");
			if (lpGrandChildNode != NULL) {
				lpElement = lpGrandChildNode->ToElement();
				lpElement->Attribute("value", &iVal);
				stNode.ulId = iVal;
			}

			lpGrandChildNode = lpChildNode->FirstChild("OwnerName");
			if (lpGrandChildNode != NULL) {
				lpElement = lpGrandChildNode->ToElement();
				const char* lpszVal = lpElement->Attribute("value");
				if (lpszVal != NULL) {
					stNode.szName = lpszVal;
				}
			}

			lpGrandChildNode = lpChildNode->FirstChild("HostIp");
			if (lpGrandChildNode != NULL) {
				lpElement = lpGrandChildNode->ToElement();
				const char* lpszVal = lpElement->Attribute("value");
				if (lpszVal != NULL) {
					stNode.lIp = inet_addr(lpszVal);
				}
			}

			stNode.usPort = m_stDefaultVal.usHostPort;
			m_mapMsgNodes[stNode.ulId] = stNode;
			m_mapMsgNameNodes[stNode.szName] = stNode.ulId;

			lpChildNode = lpChildNode->NextSibling();
		}
	}

	// read link list
	lpNode = objDoc.FirstChild("Links");
	if (lpNode != NULL) {
		lpChildNode = lpNode->FirstChild("Link");
		while (lpChildNode != NULL) {
			SMessagerLink stLink;
			uint32 ulFrom;
			uint32 ulTo;
			lpGrandChildNode = lpChildNode->FirstChild("From");
			if (lpGrandChildNode != NULL) {
				lpElement = lpGrandChildNode->ToElement();
				const char* lpszFrom = lpElement->Attribute("value");
				if (lpszFrom == NULL) {
					assert(false);
					return false;
				}
				ulFrom = GetSvrIdByName(lpszFrom);
			}

			lpGrandChildNode = lpChildNode->FirstChild("To");
			if (lpGrandChildNode != NULL) {
				lpElement = lpGrandChildNode->ToElement();
				const char* lpszTo = lpElement->Attribute("value");
				if (lpszTo == NULL) {
					assert(false);
					return false;
				}
				ulTo = GetSvrIdByName(lpszTo);
			}

			lpGrandChildNode = lpChildNode->FirstChild("SendPipe");
			if (lpGrandChildNode != NULL) {
				lpElement = lpGrandChildNode->ToElement();
				lpElement->Attribute("bufsize", &iVal);
				stLink.iRecvBufSize = iVal;
				const char* lpSendKey = lpElement->Attribute("sharememkey");
				assert(lpSendKey!=NULL);
				if (lpSendKey == NULL) {
					return false;
				}
				stLink.strSendKey = lpSendKey;
			}

			lpGrandChildNode = lpChildNode->FirstChild("RecvPipe");
			if (lpGrandChildNode != NULL) {
				lpElement = lpGrandChildNode->ToElement();
				lpElement->Attribute("bufsize", &iVal);
				stLink.iSendBufSize = iVal;
				const char* lpRecvKey = lpElement->Attribute("sharememkey");
				assert(lpRecvKey!=NULL);
				if (lpRecvKey == NULL) {
					return false;
				}
				stLink.strRecvKey = lpRecvKey;
			}

			m_mapMsgLinks[MAKEPIPEID(ulFrom,ulTo) ] = stLink;

			m_mapLinkToSvrs[ulFrom].insert(ulTo);
			m_mapLinkToSvrs[ulTo].insert(ulFrom);

			lpChildNode = lpChildNode->NextSibling();
		}
	}

	return true;
}

//-------------------------------------------------------------------------------------------------------
bool Messager::Connect(const char* lpszFromSvr, const char* lpszToSvr) {
	assert(lpszFromSvr!=NULL);
	assert(lpszToSvr!=NULL);
	if (lpszFromSvr == NULL || lpszToSvr == NULL) {
		return false;
	}

	if (strcmp(lpszToSvr, "*") == 0) {
		uint32 ulFromId = GetSvrIdByName(lpszFromSvr);
		if (ulFromId == INVALID_SVRID) {
			return false;
		}

		if (m_mapLinkToSvrs.find(ulFromId) == m_mapLinkToSvrs.end()) {
			return false;
		}

		StdSetToSvrs& setToSvrs = m_mapLinkToSvrs[ulFromId];
		StdSetToSvrsIter iter = setToSvrs.begin();
		for (; iter != setToSvrs.end(); ++iter) {
			const char* lpszToSvrName = GetSvrNameById((*iter));
			if (lpszToSvrName == NULL) {
				return false;
			}

			if (!InnerConnectOne(lpszFromSvr, lpszToSvrName)) {
				return false;
			}
		}
	} else {
		return InnerConnectOne(lpszFromSvr, lpszToSvr);
	}

	return true;
}

//-------------------------------------------------------------------------------------------------------
bool Messager::InnerConnectOne(const char* lpszFromUrl, const char* lpszToUrl) {
	// find the from and to messager node
	bool bFindFrom = false;
	bool bFindTo = false;
	StdMapMsgNodeIter fromIter;
	StdMapMsgNodeIter toIter;
	StdMapMsgNodeIter iter = m_mapMsgNodes.begin();
	for (; iter != m_mapMsgNodes.end(); ++iter) {
		if (!bFindFrom
				&& strcmp((*iter).second.szName.c_str(), lpszFromUrl) == 0) {
			bFindFrom = true;
			fromIter = iter;
		}

		if (!bFindTo && strcmp((*iter).second.szName.c_str(), lpszToUrl) == 0) {
			bFindTo = true;
			toIter = iter;
		}

		if (bFindFrom && bFindTo) {
			break;
		}
	}

	if (!bFindFrom || !bFindTo) {
		std::cerr << "not find the messager node in config file!" << std::endl;
		return false;
	}

	SMessagerNode& stFromNode = (*fromIter).second;
	SMessagerNode& stToNode = (*toIter).second;

	m_ulFromId = stFromNode.ulId;

	int iSendBufSize = m_stDefaultVal.iSendBufSize;
	int iRecvBufSize = m_stDefaultVal.iRecvBufSize;

	// find linknode in link list
	uint64 uiSendId = MAKEPIPEID(stFromNode.ulId, stToNode.ulId);
	uint64 uiRecvId = MAKEPIPEID(stToNode.ulId, stFromNode.ulId);
	std::string strSendKey;
	std::string strRecvKey;

	StdMapLinkIter linkIter = m_mapMsgLinks.find(uiSendId);
	if (linkIter != m_mapMsgLinks.end()) {
		iSendBufSize = (*linkIter).second.iSendBufSize;
		iRecvBufSize = (*linkIter).second.iRecvBufSize;
		strSendKey = (*linkIter).second.strSendKey;
		strRecvKey = (*linkIter).second.strRecvKey;
	} else {
		linkIter = m_mapMsgLinks.find(uiRecvId);
		if (linkIter != m_mapMsgLinks.end()) {
			// reverse value
			iSendBufSize = (*linkIter).second.iRecvBufSize;
			iRecvBufSize = (*linkIter).second.iSendBufSize;
			strSendKey = (*linkIter).second.strRecvKey;
			strRecvKey = (*linkIter).second.strSendKey;
		} else {
			assert(false);
			return false;
		}
	}

	// create send pipe
	IO::Pipe* lpSendPipe = new IO::Pipe;
	m_mapSendPipes[uiSendId] = lpSendPipe;
	if (!lpSendPipe->Init(strSendKey.c_str(), iSendBufSize,
			IO::PIPE_NOT_LOCK)) {
		std::cerr << "init the send pipe:" << strSendKey << " failed!"
				<< std::endl;
		return false;
	}

	// create recv pipe
	IO::Pipe* lpRecvPipe = new IO::Pipe;
	m_mapRecvPipes[uiRecvId] = lpRecvPipe;
	if (!lpRecvPipe->Init(strRecvKey.c_str(), iRecvBufSize,
			IO::PIPE_NOT_LOCK)) {
		std::cerr << "init the send pipe:" << strRecvKey << " failed!"
				<< std::endl;
		return false;
	}

	return true;
}

//-------------------------------------------------------------------------------------------------------
int Messager::Recv(uint32& ulFromSvrId, void* lpBuf, int32 lBufLen) {
	// 参数合法性检查
	assert(lpBuf != NULL);
	assert(lBufLen > 0);
	if (lpBuf == NULL || lBufLen <= 0) {
		return -1;
	}

	// 初始化管道接收使用的游标对象
	if (!m_bRecvBegin) {
		m_iterCurRecv = m_mapRecvPipes.begin();
		m_bRecvBegin = true;
	}

	// 以下代码是要实现一个类似于环形队列访问的机制
	// 确保是每次recv都是从上次已访问过节点开始
	// 直到找到非空的为止。
	if (m_mapRecvPipes.empty()) {
		return 0;
	}

	// 如果已经读到数据尾部,则需要跳到头部
	StdMapPipeIter iterLast = m_iterCurRecv;
	if (m_iterCurRecv == m_mapRecvPipes.end()) {
		m_iterCurRecv = m_mapRecvPipes.begin();
	}

	// 开始循环读取
	while (true) {
		// 从当前管道中取数据
		IO::Pipe* lpPipe = (*m_iterCurRecv).second;
		ulFromSvrId = GETFROMSVRID((*m_iterCurRecv).first);
		++m_iterCurRecv;
		if (m_iterCurRecv == m_mapRecvPipes.end()) {
			m_iterCurRecv = m_mapRecvPipes.begin();
		}

		int iRecvBufLen = lBufLen;
		int iRt = lpPipe->Pop(iRecvBufLen, (char*) lpBuf);
		if (iRt == IO::TQ_IO_ERR_PIPE_EMPTY) {
			if (m_iterCurRecv == iterLast) {
				break;
			}
			continue;
		}

		// 输入buf的长度不够
		if (iRt == IO::TQ_IO_ERR_PIPE_RECVBUF_LEN_LESS) {
			return -2;
		}

		return iRecvBufLen;
	}

	return 0;
}

//-------------------------------------------------------------------------------------------------------
int Messager::Send(uint32 ulToSvrId, const void* lpBuf, int32 lBufLen) {
	uint64 ulId = MAKEPIPEID(m_ulFromId, ulToSvrId);
	int32 lTimes = 0;
	StdMapPipeIter iter = m_mapSendPipes.find(ulId);
	if (iter != m_mapSendPipes.end()) {
		IO::Pipe* lpPipe = (*iter).second;
#ifdef DEBUG
		//std::clog << "The send pipe name:" << lpPipe->GetName() << std::endl;
#endif
		while (lpPipe->Push(lBufLen, (const char *) lpBuf)
				== IO::TQ_IO_ERR_PIPE_FULL) {
			if ((++lTimes) > 1000) {
				lTimes = 0;
				std::cerr << "The " << m_ulFromId << " to " << ulToSvrId
						<< " send pipe is blocked!" << std::endl;
			}
			tq_sleep(1);

		}
	}

	return 0;
}

//-------------------------------------------------------------------------------------------------------
int Messager::SendHead(uint32 ulToSvrId, int32 lBufLen) {
	uint64 ulId = MAKEPIPEID(m_ulFromId, ulToSvrId);
	int32 lTimes = 0;
	StdMapPipeIter iter = m_mapSendPipes.find(ulId);
	if (iter != m_mapSendPipes.end()) {
		IO::Pipe* lpPipe = (*iter).second;
#ifdef DEBUG
		//std::clog << "The send pipe name:" << lpPipe->GetName() << std::endl;
#endif
		while (lpPipe->PushHead(lBufLen) == IO::TQ_IO_ERR_PIPE_FULL) {
			if ((++lTimes) > 10000) {
				lTimes = 0;
				std::cerr << "The " << m_ulFromId << " to " << ulToSvrId
						<< " send pipe is blocked!" << std::endl;
			}
			tq_sleep(1);
		}
	}

	return 0;
}

//-------------------------------------------------------------------------------------------------------
void Messager::SendData(uint32 ulToSvrId, const void* lpBuf, int32 lBufLen) {
	uint64 ulId = MAKEPIPEID(m_ulFromId, ulToSvrId);
	StdMapPipeIter iter = m_mapSendPipes.find(ulId);
	if (iter != m_mapSendPipes.end()) {
		IO::Pipe* lpPipe = (*iter).second;
		lpPipe->PushData(lBufLen, (const char *) lpBuf);
	}
}

//-------------------------------------------------------------------------------------------------------
uint32 Messager::GetSvrIdByName(const char* lpszSvrName) {
	StdMapMsgNameNodeIter iter = m_mapMsgNameNodes.find(lpszSvrName);
	if (iter != m_mapMsgNameNodes.end()) {
		return (*iter).second;
	}
	return INVALID_SVRID;
}

//-------------------------------------------------------------------------------------------------------
uint32 Messager::GetRandomToSvrIdByType(uchar ucSvrType) {
	uint32 ulFindSvrId = INVALID_SVRID;
	StdMapToSvrsIter iter = m_mapLinkToSvrs.find(m_ulFromId);
	if (iter != m_mapLinkToSvrs.end()) {
		StdSetToSvrs& setToSvrs = (*iter).second;
		const int32 c_lMaxCount = 1024;
		uint32 aulSvrs[c_lMaxCount];
		int32 lPos = 0;
		StdSetToSvrsIter setIter = setToSvrs.begin();
		for (; setIter != setToSvrs.end() && lPos < c_lMaxCount; ++setIter) {
			uint32 ulSvrId = (*setIter);
			if (GETSVRTYPE(ulSvrId) == ucSvrType) {
				aulSvrs[lPos++] = ulSvrId;
			}
		}

		if (lPos > 0) {
			ulFindSvrId = aulSvrs[rand() % lPos];
		}
	}

	return ulFindSvrId;
}

//-------------------------------------------------------------------------------------------------------
uint32 Messager::GetToSvrIdByIndex(int iIndex) {
	uint32 ulFindSvrId = INVALID_SVRID;
	return ulFindSvrId;
}

//-------------------------------------------------------------------------------------------------------
const char* Messager::GetSvrNameById(uint32 ulSvrId) {
	StdMapMsgNodeIter iter = m_mapMsgNodes.find(ulSvrId);
	if (iter != m_mapMsgNodes.end()) {
		return (*iter).second.szName.c_str();
	}
	return NULL;
}

} //end namespace Net
