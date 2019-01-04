#include "LuaXml.h"
#include <commhead.h>
#include <safefun.h>
//----------------------------------------------------------------------------------------------------
void LuaXmlParseNode(lua_State* lpLuaState, TiXmlNode* lpNode) {
	if (lpNode == NULL || lpLuaState == NULL) {
		return;
	}

	// resize stack if neccessary
	luaL_checkstack(lpLuaState, 10, "ParseXmlFile : recursion too deep");

	TiXmlElement* lpElem = lpNode->ToElement();
	if (lpElem != NULL) {
		// element name
		lua_pushstring(lpLuaState, "name");
		lua_pushstring(lpLuaState, lpElem->Value());
		lua_settable(lpLuaState, -3);

		// parse attributes
		TiXmlAttribute* lpAttr = lpElem->FirstAttribute();
		if (lpAttr != NULL) {
			lua_pushstring(lpLuaState, "attr");
			lua_newtable(lpLuaState);
			for (; lpAttr; lpAttr = lpAttr->Next()) {
				lua_pushstring(lpLuaState, lpAttr->Name());
				lua_pushstring(lpLuaState, lpAttr->Value());
				lua_settable(lpLuaState, -3);

			}
			lua_settable(lpLuaState, -3);
		}
	}

	// children
	TiXmlNode* lpChild = lpNode->FirstChild();
	if (lpChild != NULL) {
		int iChildCount = 0;
		for (; lpChild; lpChild = lpChild->NextSibling()) {
			switch (lpChild->Type()) {
			case TiXmlNode::DOCUMENT:
				break;
			case TiXmlNode::ELEMENT:
				// normal element, parse recursive
				lua_newtable(lpLuaState);
				LuaXmlParseNode(lpLuaState, lpChild);
				lua_rawseti(lpLuaState, -2, ++iChildCount);
				break;
			case TiXmlNode::COMMENT:
				break;
			case TiXmlNode::TEXT:
				// plaintext, push raw
				lua_pushstring(lpLuaState, lpChild->Value());
				lua_rawseti(lpLuaState, -2, ++iChildCount);
				break;
			case TiXmlNode::DECLARATION:
				break;
			case TiXmlNode::UNKNOWN:
				break;
			};
		}
		lua_pushstring(lpLuaState, "n");
		lua_pushnumber(lpLuaState, iChildCount);
		lua_settable(lpLuaState, -3);
	}
}

//----------------------------------------------------------------------------------------------------
int ParseXmlFile(lua_State* lpLuaState) {
	const char* lpszFileName = luaL_checkstring(lpLuaState,1);
	TiXmlDocument doc(lpszFileName);
	doc.LoadFile();
	if (doc.Error() && doc.ErrorId() == TiXmlBase::TIXML_ERROR_OPENING_FILE) {
		lua_pushnil(lpLuaState);
		return 1;
	}

	lua_newtable(lpLuaState);
	LuaXmlParseNode(lpLuaState, &doc);
	return 1;
}

//----------------------------------------------------------------------------------------------------
int GetTableFieldToNumber(lua_State* lpLuaState, const char* lpszKey) {
	int iResult = 0;
	lua_pushstring(lpLuaState, lpszKey);
	lua_gettable(lpLuaState, -2); /* get background[key] */
	if (lua_isnumber(lpLuaState, -1)) {
		iResult = (int) lua_tonumber(lpLuaState, -1);
	}
	lua_pop(lpLuaState, 1);
	return iResult;
}

//----------------------------------------------------------------------------------------------------
const char* GetTableFieldToString(lua_State* lpLuaState, const char* lpszKey) {
	const char* lpszRet = NULL;
	lua_pushstring(lpLuaState, lpszKey);
	lua_gettable(lpLuaState, -2); /* get background[key] */
	if (lua_isstring(lpLuaState, -1)) {
		lpszRet = lua_tostring(lpLuaState, -1);
	}
	lua_pop(lpLuaState, 1);
	return lpszRet;
}

//----------------------------------------------------------------------------------------------------
void LuaXmlInsertAttr(lua_State* lpLuaState, TiXmlElement* lpElement) {
	if (lpElement == NULL || lpLuaState == NULL) {
		return;
	}

	lua_pushnil(lpLuaState); /* first key */
	while (lua_next(lpLuaState, -2) != 0) {
		int iKeyType = lua_type(lpLuaState, -2);
		int iValType = lua_type(lpLuaState, -1);
		if (iKeyType == LUA_TSTRING && iValType == LUA_TSTRING) {
			const char* lpszKey = lua_tostring(lpLuaState, -2);
			const char* lpszVal = lua_tostring(lpLuaState, -1);
			if (lpszVal != NULL && lpszKey != NULL) {
				lpElement->SetAttribute(lpszKey, lpszVal);
			}
		}

		/* removes 'value'; keeps 'key' for next iteration */
		lua_pop(lpLuaState, 1);
	}
}

//----------------------------------------------------------------------------------------------------
void LuaXmlInsertNode(lua_State* lpLuaState, TiXmlNode* lpNode) {
	if (lpNode == NULL || lpLuaState == NULL) {
		return;
	}

	// 获得name
	const char* lpszName = GetTableFieldToString(lpLuaState, "name");
	if (lpszName == NULL) {
		return;
	}

	TiXmlElement stElement(lpszName);

	// 获得attr列表
	lua_pushstring(lpLuaState, "attr");
	lua_gettable(lpLuaState, -2);
	if (lua_istable(lpLuaState, -1)) {
		LuaXmlInsertAttr(lpLuaState, &stElement);
	}
	lua_pop(lpLuaState, 1);

	int iCount = GetTableFieldToNumber(lpLuaState, "n");
	for (int i = 1; i <= iCount; ++i) {
		lua_rawgeti(lpLuaState, -1, i);
		LuaXmlInsertNode(lpLuaState, &stElement);
		lua_pop(lpLuaState, 1);
	}

	lpNode->InsertEndChild(stElement);
}

//----------------------------------------------------------------------------------------------------
/**
 @param szfilename
 @param szHeadComment
 @param luaTable
 */
int SaveXmlFile(lua_State* lpLuaState) {
	const char* lpszFileName = luaL_checkstring(lpLuaState,1);
	if (lpszFileName == NULL) {
		return 0;
	}

	const char* lpszHeadComment = luaL_checkstring(lpLuaState,2);
	if (lpszHeadComment == NULL) {
		return 0;
	}

	if (!lua_istable(lpLuaState, 3)) {
		return 0;
	}

	// 建立一个XML文件
	TiXmlDocument xmlDoc(lpszFileName);
	TiXmlDeclaration stDeclaration("1.0", "UTF-8", "");
	xmlDoc.InsertEndChild(stDeclaration);
	unsigned char szBuf[256];
	szBuf[0] = 0xef;
	szBuf[1] = 0xbb;
	szBuf[2] = 0xbf;
	char* lpszBuf = (char*) (szBuf + 3);
	SafeSprintf(lpszBuf, sizeof(szBuf) - 3, "<!-- %s -->", lpszHeadComment);
	xmlDoc.Parse((char*) (szBuf));

	lua_pushvalue(lpLuaState, 3);
	int iCount = GetTableFieldToNumber(lpLuaState, "n");
	for (int i = 1; i <= iCount; ++i) {
		lua_rawgeti(lpLuaState, -1, i);
		LuaXmlInsertNode(lpLuaState, &xmlDoc);
		lua_pop(lpLuaState, 1);
	}
	lua_pop(lpLuaState, 1);

	xmlDoc.Print();
	xmlDoc.SaveFile();
	return 0;
}
