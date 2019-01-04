/*
 * Messager.h
 *
 *  Created on: 2013-2-27
 *      Author: Administrator
 */

#ifndef MESSAGER_H_
#define MESSAGER_H_

#include <commhead.h>
#include <pipe.h>
#include <map>
#include <set>

namespace Net {

/** 非法的服务器ID定义 */
#define INVALID_SVRID 0xffffffff
/** 通过一个起点服务器ID和终点服务器ID组合一个管道ID */
#define MAKEPIPEID(ulFromId, ulToId) (uint64)(((uint64)(ulFromId) << 32) | (uint64)(ulToId))
/** 从管道ID中获得起点服务器ID */
#define GETFROMSVRID(PIPEID) (uint32)(((PIPEID)>>32)&0xffffffff)
/** 从管道ID中获得终点服务器ID */
#define GETTOSVRID(PIPEID) (uint32)((PIPEID)&0xffffffff)
/** 获取服务器类型 */
#define GETSVRTYPE(SVRID) (uchar)(((SVRID)>>24)&0xff)

extern const char* c_szComMessagerShareMem;
extern const int c_iComMessagerShareMem;

#pragma pack(push, 1)
struct SMessagerReg {
	/// 起点服务器ID
	uint32 ulFromId;
	/// 终点服务器ID
	uint32 ulToId;
	/// 起点服务器IP
	int32 lFromIp;
	/// 起点服务器中messager服务器所开的端口
	ushort usFromPort;
	/// 终点服务器IP
	int32 lToIp;
	/// 终点服务器中messager服务器所开的端口
	ushort usToPort;
	/// 发送管道的大小
	int iSendBufSize;
	/// 接收管道的大小
	int iRecvBufSize;
	/// 发送管道key值
	char szSendKey[32];
	/// 接收管道key值
	char szRecvKey[32];
};
#pragma pack(pop)

/** 服务器间消息传输的公用组件
 */
class Messager {
public:
	/** 装载配置文件
	 @param lpszConfig
	 配置文件路径名
	 @return
	 返回true或false
	 */
	bool LoadConfig(const char* lpszConfig);

	/** 在两个服务器间建立连接
	 @remark
	 需要建立连接的这两个服务间必须是可连接的,即在Config中是有信任配置的
	 @param lpszFromSvr
	 需要连接的起点服务器名称
	 @param lpszToSvr
	 需要连接的终点服务器名称,
	 这里的名称如果是"*",则将连接所有在Config中配置的,有信任关系的
	 @return
	 返回true或false
	 */
	bool Connect(const char* lpszFromSvr, const char* lpszToSvr);

	/** 从指向lpszFromSvr的接收管道列表中接收一个messager数据包
	 @remark
	 在Recv中有个内部索引状态标志,每次调用Recv都会从该索引状态标志为起点找到
	 相应的接收管道进行接收数据,然后将内部索引状态标志改为刚已接收的下个位置
	 @param ulFromSvrId [O]
	 已接收到的数据包的源server的ID
	 @param lpBuf
	 存放接收到的数据的缓冲区
	 @param lplBufLen [I/O]
	 传入缓冲区的最大长度,返回实际接收到数据的字节数
	 @return
	 返回实际接收到数据的字节数
	 */
	int Recv(uint32& ulFromSvrId, void* lpBuf, int32 lBufLen);

	/** 向指定的服务器id发送数据包
	 @param ulToSvrId
	 目的服务器id
	 @param lpBuf
	 存放将要发送的数据缓冲区
	 @param lBufLen
	 将要发送的数据缓冲区的字节数
	 @return
	 返回实际发送的数据字节数
	 */
	int Send(uint32 ulToSvrId, const void* lpBuf, int32 lBufLen);

	int SendHead(uint32 ulToSvrId, int32 lBufLen);
	void SendData(uint32 ulToSvrId, const void* lpBuf, int32 lBufLen);

	/** 通过服务器名获得服务器对应的ID
	 @param lpszSvrName
	 服务器唯一表示名称
	 @return
	 返回该服务器对应的ID或INVALID_SVRID
	 */
	uint32 GetSvrIdByName(const char* lpszSvrName);

	/** 通过服务器ID获得服务器名
	 @param ulSvrId
	 服务器ID
	 @return
	 返回该服务器名或NULL
	 */
	const char* GetSvrNameById(uint32 ulSvrId);

	/** 通过服务器的类型，随机获得一个从当前起点指向的终点服务器id
	 @param ucSvrType
	 服务器的类型
	 @return
	 返回要获得的服务器ID
	 */
	uint32 GetRandomToSvrIdByType(uchar ucSvrType);

	/** 通过索引号获得一个从当前起点指向的终点服务器id
	 @param iIndex
	 索引号
	 @return
	 返回要获得的服务器ID
	 */
	uint32 GetToSvrIdByIndex(int iIndex);

public:
	/** 构造函数 */
	Messager();
	/** 析构函数 */
	~Messager();

private:
	/** 处理服务器间连接的内部函数,供@see Connect调用
	 @param lpszFromSvr
	 需要连接的起点服务器名称
	 @param lpszToSvr
	 需要连接的终点服务器名称,
	 @return
	 返回true或false
	 */
	bool InnerConnectOne(const char* lpszFromUrl, const char* lpszToUrl);

private:
	/** default config value */
	struct SDefaultVal {
		/// Messager服务器的文件地址
		std::string strServerPath;
		/// Messager服务器默认的端口号
		ushort usHostPort;
		/// 默认发送管道的大小
		int iSendBufSize;
		/// 默认接收管道的大小
		int iRecvBufSize;
	};

	/** messager node config struct*/
	struct SMessagerNode {
		/// 服务器节点ID
		uint32 ulId;
		/// 服务器节点名称
		std::string szName;
		/// 服务器节点IP
		int32 lIp;
		/// 服务器节点端口
		ushort usPort;
	};
	typedef std::map<uint32, SMessagerNode> StdMapMsgNode;
	typedef StdMapMsgNode::iterator StdMapMsgNodeIter;

	/** messager name map struct*/
	typedef std::map<std::string, uint32> StdMapMsgNameNode;
	typedef StdMapMsgNameNode::iterator StdMapMsgNameNodeIter;

	struct SMessagerLink {
		/// 送法管道的大小
		int iSendBufSize;
		/// 发送管道对应的共享内存key
		std::string strSendKey;
		/// 接收管道的大小
		int iRecvBufSize;
		/// 接收管道对应的共享内存key
		std::string strRecvKey;
	};
	/// this map key be combined of MAKEPIPEID(ulFromId,usToId)
	typedef std::map<uint64, SMessagerLink> StdMapLink;
	typedef StdMapLink::iterator StdMapLinkIter;

	/// this map key be combined of MAKEPIPEID(ulFromId,ulToId)
	typedef std::map<uint64, IO::Pipe*> StdMapPipe;
	typedef StdMapPipe::iterator StdMapPipeIter;

	typedef std::set<uint32> StdSetToSvrs;
	typedef StdSetToSvrs::iterator StdSetToSvrsIter;
	/// 该map的key是fromsvrid, 内容是与它有连接关系的tosvrid的列表
	typedef std::map<uint32, StdSetToSvrs> StdMapToSvrs;
	typedef StdMapToSvrs::iterator StdMapToSvrsIter;

private:
	/// 对传输管道一种默认的设置
	SDefaultVal m_stDefaultVal;
	/// 服务器节点map
	StdMapMsgNode m_mapMsgNodes;
	/// 服务器节点名称和id的map
	StdMapMsgNameNode m_mapMsgNameNodes;
	/// 服务器节点连接关系map<key(fromid,toid), node>
	StdMapLink m_mapMsgLinks;
	/// 服务器节点连接关系map<key(fromid), toid>
	StdMapToSvrs m_mapLinkToSvrs;
	/// 发送管道的map<key(fromid,toid), pipe>
	StdMapPipe m_mapSendPipes;
	/// 接收管道的map<key(fromid,toid), pipe>
	StdMapPipe m_mapRecvPipes;

	/// from pipe id
	uint32 m_ulFromId;

	/// 是否可以接收
	bool m_bRecvBegin;
	/// current recv iter
	StdMapPipeIter m_iterCurRecv;
};

} //end namespace Net

#endif /* MESSAGER_H_ */
