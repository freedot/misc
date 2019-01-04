#ifndef _FILEPKG_H__
#define _FILEPKG_H__

#pragma pack(push, 1)
struct PkgFileHead {
	uint32 ver;
	uint32 filecount;
};

struct PkgFileInfo {
	uint32 ver;
	char filename[33];
	uint32 offset;
	uint32 len;
	uint32 factlen;
};
#pragma pack(pop)
static uchar c_xors[] = {0x12,0x4,0x14,0x99,0x41,0x88,0xf1,0x31,0x19,0xea,0x22,0x51,0x61,0x98,0x71,0xc1};

#endif //_FILEPKG_H__
