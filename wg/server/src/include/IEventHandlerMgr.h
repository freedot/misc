#ifndef _I_EVENT_HANDLER_MGR_H_
#define _I_EVENT_HANDLER_MGR_H_
#include "IEventHandler.h"

/** Interface of an object which can handle events.
 */
class IEventHandlerMgr {
public:
	/** 返回当前栈顶的事件处理器对象
	 */
	virtual const IEventHandler* GetTopEventHandler() const = 0;

	/** Removes and returns the top-most event handler on the event handler stack.
	 @param bDeleteHandler
	 If this is true, the handler will be deleted after it is removed. The default value is false.
	 */
	virtual const IEventHandler* PopEventHandler(bool bDeleteHandler) = 0;

	/** Pushes this event handler onto the event stack for the window.
	 @remarks
	 An event handler is an object that is capable of processing the events sent to a window.
	 By default, the window is its own event handler, but an application may wish to substitute another,
	 for example to allow central implementation of event-handling for a variety of different window classes.
	 @see IGuiBaseWnd::PushEventHandler allows an application to set up a chain of event handlers,
	 where an event not handled by one event handler is handed to the next one in the chain.
	 Use @see IGuiBaseWnd::PopEventHandler to remove the event handler.
	 @param lpEvtHandler
	 Specifies the handler to be pushed.
	 */
	virtual void PushEventHandler(const IEventHandler* lpEvtHandler) = 0;

	/** Find the given handler in the windows event handler chain and remove (but not delete) it from it.
	 @param lpEvtHandler
	 The event handler to remove, must be non NULL and must be present in this windows event handlers chain
	 @return
	 Returns true if it was found and FALSE otherwise
	 (this also results in an assert failure so this function
	 should only be called when the handler is supposed to be there).
	 */
	virtual bool RemoveEventHandler(IEventHandler* lpEvtHandler) = 0;
};

/** 申明一个接口的定义
 */
#define DECLARE_IEVENTHANDLERMGR() \
		public: \
		const IEventHandler* GetTopEventHandler() const{\
			return m_lpEvtHandler;\
		}\
		\
		const IEventHandler* PopEventHandler(bool bDeleteHandler){\
			IEventHandler* lpEvtHandler = m_lpEvtHandler;\
			if ( lpEvtHandler != NULL )\
			{\
				m_lpEvtHandler = const_cast<IEventHandler*>(lpEvtHandler->GetNextHandler());\
				if ( m_lpEvtHandler )\
				{\
					m_lpEvtHandler->SetPreviousHandler(NULL);\
				}\
				lpEvtHandler->SetNextHandler(NULL);\
				lpEvtHandler->SetPreviousHandler(NULL);\
				if ( bDeleteHandler )\
				{\
					assert(false);\
				}\
			}\
			return lpEvtHandler; \
		}\
		\
		\
		void PushEventHandler(const IEventHandler* lpEvtHandler){\
			if ( lpEvtHandler == NULL )\
			{\
				assert(false);\
				return;\
			}\
			\
			if ( m_lpEvtHandler )\
			{\
				m_lpEvtHandler->SetPreviousHandler(lpEvtHandler);\
			}\
			\
			const_cast<IEventHandler*>(lpEvtHandler)->SetNextHandler(m_lpEvtHandler);\
			m_lpEvtHandler = const_cast<IEventHandler*>(lpEvtHandler);\
			m_lpEvtHandler->SetPreviousHandler(NULL);\
		}\
		\
		\
		bool RemoveEventHandler(IEventHandler* lpEvtHandler){\
			if ( lpEvtHandler == NULL )\
			{\
				assert(false);\
				return false;\
			}\
			\
			IEventHandler* lpIter = m_lpEvtHandler;\
			while ( lpIter )\
			{\
				if ( lpIter == lpEvtHandler )\
				{\
					if ( lpEvtHandler == m_lpEvtHandler )\
					{\
						m_lpEvtHandler = const_cast<IEventHandler*>(m_lpEvtHandler->GetNextHandler());\
						if ( m_lpEvtHandler )\
						{\
							m_lpEvtHandler->SetPreviousHandler(NULL);\
						}\
					}\
					else\
					{\
						IEventHandler* lpPrevHandler = const_cast<IEventHandler*>(lpEvtHandler->GetPreviousHandler());\
						lpPrevHandler->SetNextHandler(lpEvtHandler->GetNextHandler());\
						if ( lpEvtHandler->GetNextHandler() )\
						{\
							IEventHandler* lpNextHandler = const_cast<IEventHandler*>(lpEvtHandler->GetNextHandler());\
							lpNextHandler->SetPreviousHandler(lpEvtHandler->GetPreviousHandler());\
						}\
					}\
					\
					lpIter->SetPreviousHandler(NULL);\
					lpIter->SetNextHandler(NULL);\
					return true;\
				}\
				\
				lpIter = const_cast<IEventHandler*>(lpIter->GetNextHandler());\
			}\
			\
			assert(false);\
			return false;\
		}\
		\
		protected: \
		IEventHandler* m_lpEvtHandler;\
		public: 

#define INIT_IEVENTHANDLERMGR() \
		m_lpEvtHandler = NULL;

#endif // _I_EVENT_HANDLER_MGR_H_
