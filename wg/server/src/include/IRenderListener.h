#ifndef _I_RENDER_LISTENER_H_
#define _I_RENDER_LISTENER_H_

/** Interface of an object which is renderable.
 */
class IRenderListener {
public:

	/** Called if an render circle happened.
	 */
	virtual void OnRender() = 0;
};

#endif // _I_RENDER_LISTENER_H_
