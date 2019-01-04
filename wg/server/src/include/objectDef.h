#ifndef _OBJECT_DEF_H
#define _OBJECT_DEF_H
#include "typedef.h"

/// 最大的索引号
const uint32 MAX_OBJECT_IDX = 0xfffff;
const uint32 OBJECT_IDX_MASK = 0xfffff;

/// 最大的流水序列号
const uint32 MAX_OBJECT_SEQ = 0xfff;
const uint32 OBJECT_SEQ_SHIFT = 20;
const object_id OBJECT_SEQ_MASK = ((object_id) 0xfff) << OBJECT_SEQ_SHIFT;
inline uint16 NEXT_OBJ_SEQ(uint16 seq){
	return (++seq)%MAX_OBJECT_SEQ;
}

/// 仿真对象类型开始值
const object_id SIMOBJ_START_TYPE = 0x000;
/// 最大的仿真对象类型
const object_id MAX_SIMOBJ_TYPE = 0xfff;
const object_id OBJECT_TYPE_SHIFT = 32;
const object_id OBJECT_TYPE_MASK = ((object_id) MAX_SIMOBJ_TYPE)
		<< OBJECT_TYPE_SHIFT;

/// 获取仿真对象的类别
#define GETSIMOBJTYPE(ID) ((ushort)(((ID)&OBJECT_TYPE_MASK)>>OBJECT_TYPE_SHIFT))

/// 获取当前仿真对象的流水序列号
#define GETSIMOBJSEQ(ID) ((ushort)(((ID)&OBJECT_SEQ_MASK)>>OBJECT_SEQ_SHIFT))

/// 获取仿真对象的下标索引号
#define GETSIMOBJINDEX(ID) ((uint32)((ID)&OBJECT_IDX_MASK))

/// 创建一个仿真对象ID
#define MAKESIMOBJID(IDX, TYPE, SEQ) (object_id)(((((object_id)(SEQ))<<OBJECT_SEQ_SHIFT)&OBJECT_SEQ_MASK)|((((object_id)(TYPE))<<OBJECT_TYPE_SHIFT)&OBJECT_TYPE_MASK)|(((object_id)(IDX))&OBJECT_IDX_MASK))

/// 非法的仿真对象ID

const object_id SIMOBJ_INVALID_ID = 0x5AEFFFFFFFFFLL;

#endif //_OBJECT_DEF_H
