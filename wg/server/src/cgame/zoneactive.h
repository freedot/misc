#ifndef _ZONE_ACTIVE_H_
#define _ZONE_ACTIVE_H_
#include <pkgBits.h>
#include <pkgBase.h>


struct SLoginsList : public SPkgBase
{
	ushort usTotal;
	ushort ausZones[MAX_ZONEACTIVE_CNT];

	SLoginsList():usTotal(0){}
	
	int Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer)
	{
		E_UINT16(usTotal, 1);
		E_ARRAY_UINT16(ausZones, usTotal, MAX_ZONEACTIVE_CNT, 1);
		return iPos;
	}
	
	int Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer)
	{
		D_UINT16(usTotal, 1);
		D_ARRAY_UINT16(ausZones, usTotal, MAX_ZONEACTIVE_CNT, 1);
		return iPos;
	}
};


#endif // _ZONE_ACTIVE_H_
