#ifndef _GUID_H
#define _GUID_H
#include <string.h>

struct TQGUID {
	unsigned int Data1;
	unsigned short Data2;
	unsigned short Data3;
	unsigned char Data4[8];

	bool operator ==(const TQGUID& stOther) const {
		return (memcmp(this, &stOther, sizeof(stOther)) == 0);
	}

	bool operator !=(const TQGUID& stOther) const {
		return (memcmp(this, &stOther, sizeof(stOther)) != 0);
	}

	bool operator <(const TQGUID& stOther) const {
		return (memcmp(this, &stOther, sizeof(stOther)) < 0);
	}

	bool operator >(const TQGUID& stOther) const {
		return (memcmp(this, &stOther, sizeof(stOther)) > 0);
	}
};

#endif //_GUID_H
