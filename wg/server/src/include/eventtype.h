#ifndef _EVENT_TYPE_H_
#define _EVENT_TYPE_H_

//tolua_begin

/** Enumeration for all event types there are.
 */
enum EEventType {
	/// unknown event type
	EET_UNKNOWN = 0,

	/// log event start
	EET_LOG_EVENT_FIRST = 0X2FFFFF,

	/// High log level, warnings, errors and important information texts are printed out.
	EET_LOG_INFORMATION,

	/// Default log level, warnings and errors are printed out
	EET_LOG_WARNING,

	/// Low log level, only errors are printed into the log
	EET_LOG_ERROR,

	/// log event end
	EET_LOG_EVENT_LAST,

	/// net event start.
	EET_NET_EVENT_FIRST = 0X3FFFFF,

	/// net event end.
	EET_NET_EVENT_LAST = 0X4FFFFE,

	/// A user event with user data.
	EET_USER_EVENT_FIRST = 0X4FFFFF,
};

//tolua_end

#endif // _EVENT_TYPE_H_
