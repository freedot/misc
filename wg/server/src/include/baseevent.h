#ifndef _BASE_EVENT_H_
#define _BASE_EVENT_H_
#include "eventtype.h"
#include "userDataObject.h"

//tolua_begin
struct SBaseEvent {
	/// event type
	EEventType eventType;

	SBaseEvent() :
			eventType(EET_UNKNOWN) {
	}
	virtual ~SBaseEvent(){}
	/** get struct size */
	virtual int GetSize() = 0;
};

/** Struct for holding event data.
 */
struct SEvent {
public:
	/// 产生该事件的对象id及type
	object_id id;
	/// 事件数据对象
	SBaseEvent* eventData;
	/// 用户数据
	UserDataObject userData;

public:
	/** 构造函数 */
	SEvent() :
			id(-1), eventData(NULL), bSkiped(false), bUpParent(true) {
	}
	/** 构造函数 */
	SEvent(SBaseEvent* baseEvent) :
			id(-1), eventData(baseEvent), bSkiped(false), bUpParent(true) {
	}

	/** 返回是否忽略平级后续事件处理器的处理 */
	bool IsSkiped() {
		return bSkiped;
	}

	/** 返回是否忽略父级事件处理器的处理 */
	bool IsUpParent() {
		return bUpParent;
	}

	/** 设置是否忽略平级后续事件处理器的处理
	 @param bSkiped 是否忽略标志 */
	void Skip(bool bSkiped) {
		this->bSkiped = bSkiped;
		if (this->bSkiped) {
			UpParent(false);
		}
	}

	/** 设置是否忽略父级事件处理器的处理
	 @param bSkiped
	 是否忽略标志 */
	void UpParent(bool bFlag) {
		this->bUpParent = bFlag;
	}

	//tolua_end
private:
	/// 是否忽略平级后续事件处理器的处理
	bool bSkiped;
	/// 是否忽略父级事件处理器的处理
	bool bUpParent;
	//tolua_begin
};

//tolua_end

#endif // _BASE_EVENT_H_
