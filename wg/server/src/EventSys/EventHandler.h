/*
 * EventHandler.h
 *
 *  Created on: 2013-3-7
 *      Author: qujianbiao
 */

#ifndef EVENTHANDLER_H_
#define EVENTHANDLER_H_
#include <IEventHandler.h>
#include <fixAlloc.h>
#include <ptrList.h>
#include <userDataObject.h>
#include <map>

class EventHandler: public IEventHandler {
DECLARE_TQINTERFACE()DECLARE_DEFAULT_EVENTLISTENER()
	DECLARE_DEFAULT_RENDERLISTENER()
	DECLARE_DEFAULT_UPDATELISTENER()

public:
	bool Init(int iInitNodeCount, EEventHandlerFlag eFlag);
	TQHANDLE Register(object_id lObjFromId, object_id lObjToId,
			EEventType eEventType, const DelegationEvent& objCallback,
			const UserDataObject* lpUserData);
	void UnRegister(TQHANDLE hHandle);
	bool GetEvtHandlerEnabled();
	const IEventHandler* GetNextHandler() const;
	const IEventHandler* GetPreviousHandler() const;
	void ProcessEvent(SEvent& stEvent);
	void SetEvtHandlerEnabled(bool bEnabled);
	void SetNextHandler(const IEventHandler* lpHandler);
	void SetPreviousHandler(const IEventHandler* lpHandler);

	bool OnOneTimeInit();
	void OnOneTimeRelease();

public:
	EventHandler();
	virtual ~EventHandler();

public:
	struct SRegCallBackNode;
	typedef PtrList<SRegCallBackNode> TqLstCallBack;
	typedef TqLstCallBack::Iterator TqLstCallBackIter;

	/** 回调注册节点结构 */
	struct SRegCallBackNode {
		/// 感兴趣的对象起始ID
		object_id lObjFromId;
		/// 感兴趣的对象结束ID
		object_id lObjToId;
		/// 处理该事件的回调函数
		DelegationEvent objCallback;
		/// 用户数据
		UserDataObject userData;
		/// 该节点所处的链表指针
		TqLstCallBack* lpList;
		/// 该节点的事件类型
		int iEventType;
		/** 构造函数 */
		SRegCallBackNode() :
				lObjFromId(0), lObjToId(0), lpList(NULL), iEventType(0) {
		}
		/** 拷贝构造函数 */
		SRegCallBackNode(const SRegCallBackNode& other) {
			lObjFromId = other.lObjFromId;
			lObjToId = other.lObjToId;
			objCallback = other.objCallback;
			userData = other.userData;
			lpList = other.lpList;
			iEventType = other.iEventType;
		}
		/** 重载==操作号 */
		bool operator ==(const SRegCallBackNode& stOther) const {
			return (lObjFromId == stOther.lObjFromId
					&& lObjToId == stOther.lObjToId
					&& objCallback == stOther.objCallback
					&& userData == stOther.userData);
		}
	};

	/// 其中map<key, >中的key是lEventId
	typedef std::map<int32, TqLstCallBack*> StdMapCallBack;
	typedef StdMapCallBack::iterator StdMapCallBackIter;

private:
	/** 判断一个id是否存于两个id的范围内
	 @param lFromId
	 区间的起始id
	 @param lToId
	 区间的末尾id
	 @param lCurId
	 要检验的id
	 @return
	 返回true表示lCurId在[lFromId,lToId]区间内
	 */
	bool InObjectIdRange(object_id lFromId, object_id lToId, object_id lCurId);

	/** 调整Id
	 @param lFromId
	 区间的起始id
	 @param lToId
	 区间的末尾id
	 */
	bool AdjustFromToId(object_id& lFromId, object_id& lToId);

	/**  释放事件队列节点
	 */
	void ReleaseListNodes(TqLstCallBack* lpList);

private:
	/// 事件回调map
	StdMapCallBack m_mapCallBacks;
	/// 标识当前的处理器是否可用
	bool m_bEnable;
	/// 当前处理器的上一处理器兄弟指针
	IEventHandler* m_lpPreviousHandler;
	/// 当前处理器的下一处理器兄弟指针
	IEventHandler* m_lpNextHandler;

private:
	/// 事件节点分配器
	static FixAlloc<SRegCallBackNode> sm_objRegCallbackNodeAlloc;
	/// 事件节点分配器是否被初始化标志
	static bool sm_bInitAlloc;
	/// 事件队列分配器
	static FixAlloc<TqLstCallBack> sm_objCallbackListAlloc;
};

#endif /* EVENTHANDLER_H_ */
