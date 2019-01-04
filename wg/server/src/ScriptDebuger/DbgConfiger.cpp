#include "DbgConfiger.h"
#include <tinyxml.h>
#include <IpHelper.h>

DbgConfiger::DbgConfiger() :
		m_bSetTrackInStart(false) {

}

bool DbgConfiger::Load(const char* lpszFileName) {
	TiXmlDocument objDoc(lpszFileName);
	objDoc.LoadFile();
	if (objDoc.Error()
			&& objDoc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		std::cerr << "load configer " << lpszFileName << " failed!" << std::endl;
		return false;
	}

	TiXmlNode* lpNode = NULL;
	TiXmlElement* lpElement = NULL;
	lpNode = objDoc.FirstChild("DbgConfig");
	if (lpNode != NULL) {
		TiXmlNode* lpIpsNode = lpNode->FirstChild("ValidIps");
		if (lpIpsNode != NULL) {
			TiXmlNode* lpIpNode = lpIpsNode->FirstChild("ip");
			while (lpIpNode != NULL) {
				lpElement = lpIpNode->ToElement();
				const char* lpszIp = lpElement->Attribute("value");
				if (lpszIp != NULL) {
					uint32 ulIp = Net::IpHelper::ConvertUrlOrIpToLong(lpszIp);
					m_setVaildIps.insert(ulIp);
				}
				lpIpNode = lpIpNode->NextSibling();
			}
		}

		TiXmlNode* lpIsStart = lpNode->FirstChild("SetTrackInStart");
		if (lpIsStart != NULL) {
			lpElement = lpIsStart->ToElement();
			const char* lpszVal = lpElement->Attribute("value");
			if (lpszVal != NULL && strstr(lpszVal, "True") != NULL) {
				m_bSetTrackInStart = true;
			}
		}
	}

	return true;
}

bool DbgConfiger::IsValidIp(uint32 lIp) {
	return (m_setVaildIps.find(lIp) != m_setVaildIps.end());
}

bool DbgConfiger::IsSetTrackInStart() {
	return m_bSetTrackInStart;
}
