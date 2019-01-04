#include "IpHelper.h"

namespace Net {
const int EP_STRING_LEN = 3;

uint32 IpHelper::GetPTypeFromUrl(const char* urlAndPort) {
	if (urlAndPort == NULL)
		return EP_NONE;

	const char* headEnd = strstr(urlAndPort, "://");
	if (headEnd == NULL)
		return EP_NONE;

	int headLen = headEnd - urlAndPort;
	if (headLen != EP_STRING_LEN)
		return EP_NONE;

	if (strnicmp(urlAndPort, "tcp", EP_STRING_LEN) == 0) {
		return EP_TCP;
	} else if (strnicmp(urlAndPort, "udp", EP_STRING_LEN) == 0) {
		return EP_UDP;
	} else {
		return EP_NONE;
	}
}

uint32 IpHelper::GetIpFromUrl(const char* urlAndPort) {
	std::string url = GetIpStringFromUrl(urlAndPort);
	return ConvertUrlOrIpToLong(url.c_str());
}

ushort IpHelper::GetPortFromUrl(const char* urlAndPort) {
	if (urlAndPort == NULL)
		return 0;

	std::string url = urlAndPort;
	int pos = url.rfind(':');
	if (pos < 0)
		return 0;

	int portLen = url.length() - pos - 1;
	std::string port = url.substr(pos + 1, portLen);
	return (ushort) SafeAsciToInt(port.c_str());
}

uint32 IpHelper::ConvertUrlOrIpToLong(const char* urlOrIp) {
	if (!urlOrIp)
		return 0;

	uint32 ip = inet_addr(urlOrIp);
	if (ip != INADDR_NONE)
		return ip;

	hostent* hp = gethostbyname(urlOrIp);
	if (!hp)
		return 0;

	memcpy(&ip, hp->h_addr, hp->h_length);
	return ip;
}

std::string IpHelper::GetIpStringFromUrl(const char* urlAndPort) {
	if (urlAndPort == NULL)
		return "";

	std::string url = urlAndPort;
	int urlEndPos = url.rfind(":");
	if (urlEndPos < 0)
		return "";

	int urlStartPos = url.rfind("://", urlEndPos);
	if (urlStartPos < 0)
		urlStartPos = 0;
	else
		urlStartPos += 3;

	return url.substr(urlStartPos, urlEndPos-urlStartPos);
}

} /* namespace Net */

