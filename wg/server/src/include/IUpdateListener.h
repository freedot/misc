#ifndef _I_UPDATE_LISTENER_H_
#define _I_UPDATE_LISTENER_H_

//tolua_begin

/** Interface of an object which need to update.
 */
class IUpdateListener {
public:

	/** Called if an update circle happened.
	 @param ulTimeMs
	 */
	virtual void OnUpdate(uint32 ulTimeMs) = 0;
};

//tolua_end

#endif // _I_UPDATE_LISTENER_H_
