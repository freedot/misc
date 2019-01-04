#ifndef _TQ_PROCESSARGS_H_
#define _TQ_PROCESSARGS_H_

class ProcessArgs {
public:
	ProcessArgs(int argc, char* argv[], const char* optstring);
	virtual ~ProcessArgs();

public:
	bool HasArg(char cKey);
	const char* GetParam(char cKey);

private:
	int Getopt(int argc, char* argv[], const char* optstring);

private:
	/// global argument pointer
	char* m_lpOptarg;
	/// global argv index
	int m_iOptind;
	/// 解析出来的参数
	std::map<char, std::string> m_mapArgs;
};

//-----------------------------------------------------------------------------------------
inline ProcessArgs::ProcessArgs(int argc, char* argv[], const char* optstring) :
		m_lpOptarg(NULL), m_iOptind(0) {
	int c;
	while (EOF != (c = Getopt(argc, argv, optstring))) {
		if (c != '?') {
			if (m_lpOptarg == NULL)
				m_mapArgs[c] = "";
			else
				m_mapArgs[c] = m_lpOptarg;
		}
	}
}

//-----------------------------------------------------------------------------------------
inline ProcessArgs::~ProcessArgs() {
}

//-----------------------------------------------------------------------------------------
inline bool ProcessArgs::HasArg(char cKey) {
	return (m_mapArgs.find(cKey) != m_mapArgs.end());
}

//-----------------------------------------------------------------------------------------
inline const char* ProcessArgs::GetParam(char cKey) {
	std::map<char, std::string>::iterator iter = m_mapArgs.find(cKey);
	if (iter != m_mapArgs.end()) {
		return (*iter).second.c_str();
	}
	return "";
}

//-----------------------------------------------------------------------------------------
inline int ProcessArgs::Getopt(int argc, char* argv[], const char* optstring) {
	static char *next = NULL;
	if (m_iOptind == 0)
		next = NULL;

	m_lpOptarg = NULL;

	if (next == NULL || *next == '\0') {
		if (m_iOptind == 0)
			m_iOptind++;

		if (m_iOptind >= argc || argv[m_iOptind][0] != '-'
				|| argv[m_iOptind][1] == '\0') {
			m_lpOptarg = NULL;
			if (m_iOptind < argc)
				m_lpOptarg = argv[m_iOptind];
			return EOF;
		}

		if (strcmp(argv[m_iOptind], "--") == 0) {
			m_iOptind++;
			m_lpOptarg = NULL;
			if (m_iOptind < argc)
				m_lpOptarg = argv[m_iOptind];
			return EOF;
		}

		next = argv[m_iOptind];
		next++;		// skip past -
		m_iOptind++;
	}

	char c = *next++;
	char *cp = tq_strchr(optstring, c);

	if (cp == NULL || c == ':')
		return '?';

	cp++;
	if (*cp == ':') {
		if (*next != '\0') {
			m_lpOptarg = next;
			next = NULL;
		} else if (m_iOptind < argc) {
			m_lpOptarg = argv[m_iOptind];
			m_iOptind++;
		} else {
			return '?';
		}
	}

	return c;
}

#endif // _TQ_PROCESSARGS_H_
