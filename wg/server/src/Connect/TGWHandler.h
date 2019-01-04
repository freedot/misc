/*
 * TGWHandler.h
 *
 *  Created on: 2014-8-5
 *      Author: qujianbiao
 */

#ifndef TGWHANDLER_H_
#define TGWHANDLER_H_
#include "ConnectHandler.h"

class TGWHandler : public ConnectHandler{
public:
	TGWHandler();
	virtual ~TGWHandler();

private:
	virtual USER_STATE GetShakeState();
	virtual char* ShakeHandle(char* recvBuf, int& recvLen);

private:
	char* SkipTGWHead(char* recvBuf, int& recvLen);
};

#endif /* TGWHANDLER_H_ */
