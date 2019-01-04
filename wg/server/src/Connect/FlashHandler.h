/*
 * FlashHandler.h
 *
 *  Created on: 2014-8-5
 *      Author: qujianbiao
 */

#ifndef FLASHHANDLER_H_
#define FLASHHANDLER_H_
#include "ConnectHandler.h"

class FlashHandler : public ConnectHandler{
public:
	FlashHandler();
	virtual ~FlashHandler();

private:
	virtual USER_STATE GetShakeState();
	virtual char* ShakeHandle(char* recvBuf, int& recvLen);

private:
	char* HandleInCheckCrossState(char* recvBuf, int& recvLen);
	void ResponseClientCrossOk();
};

#endif /* FLASHHANDLER_H_ */
