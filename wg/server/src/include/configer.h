#ifndef _CONFIGER_H__
#define _CONFIGER_H__
#include <string>
#include <set>
#include <map>
#include <tinyxml.h>

struct SScript {
	std::vector<std::string> vctPaths;
	std::string strRoot;
};

/** 注册节点结构 */
struct SRegInterface {
	/// 动态库路径名称
	std::string strPath;
	/// 在IGameSys中注册的名称
	std::string strRegName;
	/// 接口的唯一标示
	TQGUID IGUID;

	/** 构造函数 */
	SRegInterface() {
		memset(&IGUID, 0, sizeof(TQGUID));
	}
};
typedef std::map<TQGUID, SRegInterface> StdMapRegInterface;
typedef StdMapRegInterface::iterator StdMapRegIter;

/** 脚本模块接口 */
struct SScriptModuleNode {
	/// 在IGameSys中注册的名称
	std::string strName;
	/// 获得模块的标志
	std::string strFlag;
};

typedef std::map<TQGUID, SScriptModuleNode> StdMapRegScriptModule;
typedef StdMapRegScriptModule::iterator StdMapRegScriptModuleIter;

struct SLoadDyn {
	std::map<std::string, SRegInterface> mapRegs;
	std::vector<std::string> vctEventListeners;
	std::vector<std::string> vctUpdateListeners;
	std::vector<std::string> vctRenderListeners;
	StdMapRegScriptModule mapScriptModules;
};

struct SConfig {
	std::string strLogFile;
	SScript stScript;
	SLoadDyn stLoadDyn;
	StdMapRegInterface mapRegs;

	/** 构造函数 */
	SConfig();

	/** 析构函数 */
	virtual ~SConfig();

	/** 装载系统相关的配置文件
	 @param lpszFile
	 配置文件路径 */
	bool LoadSysConfig(const char* lpszFile);
};

//----------------------------------------------------------------------------------------
inline SConfig::SConfig() {
}

//----------------------------------------------------------------------------------------
inline SConfig::~SConfig() {
}

//----------------------------------------------------------------------------------------
inline bool SConfig::LoadSysConfig(const char* lpszFile) {
	TiXmlDocument objDoc(lpszFile);
	objDoc.LoadFile();
	if (objDoc.Error()
			&& objDoc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		std::cerr << "Load configure xml file " << lpszFile << " failed!"
				<< std::endl;
		return false;
	}

	TiXmlNode* lpNode = NULL;
	TiXmlElement* lpElement = NULL;
	lpNode = objDoc.FirstChild("SysConfig");
	if (lpNode != NULL) {
		TiXmlNode* lpScriptNode = lpNode->FirstChild("Script");
		if (lpScriptNode != NULL) {
			lpElement = lpScriptNode->ToElement();
			const char* lpszPaths = lpElement->Attribute("path");
			if (lpszPaths != NULL) {
				char* lpszPath = strtok((char*) lpszPaths, ";");
				while (lpszPath) {
					this->stScript.vctPaths.push_back(lpszPath);
					lpszPath = strtok(NULL, ";");
				}
			}

			const char* lpszRoot = lpElement->Attribute("root");
			if (lpszRoot != NULL) {
				this->stScript.strRoot = lpszRoot;
			}
		}

		TiXmlNode* lpDynReg = lpNode->FirstChild("DynReg");
		if (lpDynReg != NULL) {
			TiXmlElement* lpElement = NULL;
			TiXmlNode* lpDyn = lpDynReg->FirstChild("Dyn");
			while (lpDyn != NULL) {
				lpElement = lpDyn->ToElement();
				const char* lpszRegName = lpElement->Attribute("regname");
				const char* lpszPath = lpElement->Attribute("path");
				const char* lpszUUID = lpElement->Attribute("uuid");
				if (lpszPath == NULL || lpszUUID == NULL) {
					assert(false);
					return false;
				}

				TQGUID IGUID = SafeAsciToUUID(lpszUUID);
				SRegInterface& stReg = this->mapRegs[IGUID];
				stReg.strPath = lpszPath;
				if (lpszRegName != NULL) {
					stReg.strRegName = lpszRegName;
				}
				stReg.IGUID = IGUID;

				lpDyn = lpDyn->NextSibling();
			}
		}

		TiXmlNode* lpListenerReg = lpNode->FirstChild("ListenerReg");
		if (lpListenerReg != NULL) {
			TiXmlNode* lpEventListener = lpListenerReg->FirstChild("Event");
			if (lpEventListener != NULL) {
				TiXmlNode* lpListener = lpEventListener->FirstChild("Listener");
				while (lpListener != NULL) {
					lpElement = lpListener->ToElement();
					const char* lpszName = lpElement->Attribute("name");
					if (lpszName != NULL) {
						this->stLoadDyn.vctEventListeners.push_back(lpszName);
					}
					lpListener = lpListener->NextSibling();
				}
			}

			TiXmlNode* lpUpdateListener = lpListenerReg->FirstChild("Update");
			if (lpUpdateListener != NULL) {
				TiXmlNode* lpListener = lpUpdateListener->FirstChild(
						"Listener");
				while (lpListener != NULL) {
					lpElement = lpListener->ToElement();
					const char* lpszName = lpElement->Attribute("name");
					if (lpszName != NULL) {
						this->stLoadDyn.vctUpdateListeners.push_back(lpszName);
					}
					lpListener = lpListener->NextSibling();
				}
			}

			TiXmlNode* lpRenderListener = lpListenerReg->FirstChild("Render");
			if (lpRenderListener != NULL) {
				TiXmlNode* lpListener = lpRenderListener->FirstChild(
						"Listener");
				while (lpListener != NULL) {
					lpElement = lpListener->ToElement();
					const char* lpszName = lpElement->Attribute("name");
					if (lpszName != NULL) {
						this->stLoadDyn.vctRenderListeners.push_back(lpszName);
					}
					lpListener = lpListener->NextSibling();
				}
			}
		}

		TiXmlNode* lpScriptModule = lpNode->FirstChild("ScriptModuleReg");
		if (lpScriptModule != NULL) {
			TiXmlNode* lpModule = lpScriptModule->FirstChild("Module");
			while (lpModule != NULL) {
				lpElement = lpModule->ToElement();
				const char* lpszUUID = lpElement->Attribute("uuid");
				if (lpszUUID != NULL) {
					TQGUID IGUID = SafeAsciToUUID(lpszUUID);
					SScriptModuleNode stNode;
					const char* lpszName = lpElement->Attribute("name");
					if (lpszName != NULL) {
						stNode.strName = lpszName;
					}
					const char* lpszFlag = lpElement->Attribute("flag");
					if (lpszFlag != NULL) {
						stNode.strFlag = lpszFlag;
					}
					this->stLoadDyn.mapScriptModules[IGUID] = stNode;
				}

				lpModule = lpModule->NextSibling();
			}
		}
	}
	return true;
}

#endif // _CONFIGER_H__
