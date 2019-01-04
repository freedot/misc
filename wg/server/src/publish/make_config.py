# -*- coding: utf-8 -*-
#====
msg_config_res = {
	'default' : r'''<?xml version="1.0" encoding="UTF-8"?>
<Default>
  <ServerPath value="ComMessager.exe" />
  <HostPort value="35345" />
  <ShareMemSize value="1024" />
  <SendPipe bufsize="1048576" />
  <RecvPipe bufsize="1048576" />
</Default>''',
	
	'node' : r'''
  <Node>
    <OwnerName value="gamesvr%05d" />
    <Id value="%d"/>
    <HostIp value="127.0.0.1:1122" />
  </Node>
  <Node>
    <OwnerName value="connect%05d" />
    <Id value="%d"/>
    <HostIp value="127.0.0.1:1122" />
  </Node>''',

	'link' : r'''
  <Link>
    <From value="gamesvr%05d" />
    <To value="connect%05d" />
    <SendPipe bufsize="1048576" sharememkey="%05d"/>
    <RecvPipe bufsize="1048576" sharememkey="%05d"/>
  </Link>''',
}

#====
connect_comm_config_res = r'''<?xml version="1.0" encoding="UTF-8"?>
<!-- 日志输出目录 -->
<Log type="string" value="data/log/connect%05d" />

<!-- 该服务器节点当前的名称,该名称是当前服务器的唯一标识 -->
<ServerName type="string" value="connect%05d" />

<!-- 设置等待IOEvent的最大个数 -->
<IOEventMaxCount type="int" value="10" />

<!-- 设置等待IOEvent的超时，单位是毫秒 -->
<WaitIOEventTimeOutMs type="int" value="1" />

<!-- 设置在单轮循环中可处理messager中包个数最大值 -->
<MessagerMaxCount type="int" value="10" />

<!-- 设置主socket的绑定端口 (8000 + zoneid) -->
<HostBindPort type="int" value="%d" />

<!-- 设置主socket的监听缓冲个数 -->
<ListenNumber type="int" value="5" />

<!-- 设置主socket的发送缓冲区最大长度 -->
<HostSocketSendMaxLen type="int" value="1024" />

<!-- 设置客户端socket的接收缓冲区最大长度 -->
<ClientSocketRecvMaxLen type="int" value="10240" />

<!-- 设置客户端socket的发送缓冲区最大长度 -->
<ClientSocketSendMaxLen type="int" value="102400" />

<!-- 设置接收messager的缓冲区最大长度 -->
<MessageBufferMaxSize type="int" value="1024" />

<!-- 容许连接的最大客户端数 -->
<ClientMaxSocketCount type="int" value="%d" />

<!-- 该短连接的保持时长，单位是秒 -->
<ClientActiveSec type="int" value="60" />

<!-- 读取每次循环等待的时间间隔，单位微秒-->
<SleepUs type="int" value="1000" />
'''

#====
connect_sys_config_res = r'''<?xml version="1.0" encoding="UTF-8"?>
<SysConfig>
	<DynReg>
		<Dyn regname="ILogSys" path="./libLogSys" uuid="{4312CD49-3210-4cd6-B83B-A7BA0530347C}"/>
		<Dyn regname="IFileManager" path="./libFileSys" uuid="{6179660C-1AA3-49c2-BF70-3A7521CD5352}"/>
		<Dyn regname="IEventSys" path="./libEventSys" uuid="{04E37DAE-9D02-40db-91CA-306D01AB624E}"/>
		<Dyn regname="IUpdateSys" path="./libUpdateSys" uuid="{0E1694FD-2AA4-4d07-BCB7-1BECC71CB058}"/>
		<Dyn regname="IScriptSys" path="./libScriptSys" uuid="{ECC0929B-11DC-4175-BCE9-E9AED369DBE1}"/>
		<Dyn regname="ITime" path="./libTimeSys" uuid="{0206A677-529E-4264-9F07-F91C10AEBB87}"/>
		<Dyn regname="ITimerQueue" path="./libTimeSys" uuid="{7292645E-9B07-4c76-926B-332D18F40577}"/>
		<Dyn regname="ITimerQueueEx" path="./libTimeSys" uuid="{2292646E-1B07-4175-826C-222D18F40577}"/>
		
		<Dyn regname="" path="./libEventSys" uuid="{C962C784-4C24-45db-BE06-493EDF8FAA27}" desc="IUID_IEVENTHANDLER"/>
	</DynReg>
	
	<ListenerReg>
		<Event>
		</Event>
		
		<Update>
			<Listener name="IScriptSys"/>
		</Update>
		
	</ListenerReg>
	
	<ScriptModuleReg>
	</ScriptModuleReg>
	
</SysConfig>
'''

#====
gamesvr_comm_config_res = r'''<?xml version="1.0" encoding="UTF-8"?>

<!-- 日志输出目录 -->
<Log type="string" value="log/gamesvr%05d" />

<!-- 该服务器节点当前的名称,该名称是当前服务器的唯一标识 -->
<ServerName type="string" value="gamesvr%05d" />

<!-- 设置在单轮循环中可处理messager中包个数最大值 -->
<MessagerMaxCount type="int" value="10" />

<!-- 设置接收messager的缓冲区最大长度 -->
<MessageBufferMaxSize type="int" value="1024" />

<!-- 容许连接的最大客户端数 -->
<ClientMaxSocketCount type="int" value="%d" />

<!-- 该短连接的保持时长，单位是秒 -->
<ClientActiveSec type="int" value="60" />

<!-- 读取每次循环等待的时间间隔，单位微秒-->
<SleepUs type="int" value="1000" />
'''

#====
gamesvr_db_config_res = r'''<?xml version="1.0" encoding="UTF-8"?>
<!-- 加密算法的类型 -->
<EncryptType type="int" value="1" />
<!-- db的主机ip -->
<DBHostIp type="string" value="%s" />
<!-- db的主机port -->
<DBHostPort type="int" value="3306" />
<!-- 登录db的主机的用户名 -->
<DBUsername type="string" value="root" />
<!-- 登录db的主机的密码-->
<DBPassword type="string" value="%s" />
<!-- db的库文件-->
<Database type="string" value="zone%05d" />
<!-- db中的字符集 -->
<DBCharacterSet type="string" value="utf8" />
<!-- 线id -->
<ZoneId type="int" value="%d" />
'''

#====
gamesvr_sys_config_res = r'''<?xml version="1.0" encoding="UTF-8"?>
<SysConfig>
	<Script path="script/com/?.lua;script/?.lua" root="root"/>
	
	<DynReg>
		<Dyn regname="ILogSys" path="./libLogSys" uuid="{4312CD49-3210-4cd6-B83B-A7BA0530347C}"/>
		<Dyn regname="IDatabase" path="./libDatabase" uuid="{4BCC118B-60F9-4e52-9361-655A0ACD8E89}"/>
		<Dyn regname="IFileManager" path="./libFileSys" uuid="{6179660C-1AA3-49c2-BF70-3A7521CD5352}"/>
		<Dyn regname="IEventSys" path="./libEventSys" uuid="{04E37DAE-9D02-40db-91CA-306D01AB624E}"/>
		<Dyn regname="IUpdateSys" path="./libUpdateSys" uuid="{0E1694FD-2AA4-4d07-BCB7-1BECC71CB058}"/>
		<Dyn regname="IScriptSys" path="./libScriptSys" uuid="{ECC0929B-11DC-4175-BCE9-E9AED369DBE1}"/>
		<Dyn regname="ITime" path="./libTimeSys" uuid="{0206A677-529E-4264-9F07-F91C10AEBB87}"/>
		<Dyn regname="ITimerQueue" path="./libTimeSys" uuid="{7292645E-9B07-4c76-926B-332D18F40577}"/>
		<Dyn regname="ITimerQueueEx" path="./libTimeSys" uuid="{2292646E-1B07-4175-826C-222D18F40577}"/>
		<Dyn regname="IDynSMWebSvr" path="./libGameScript" uuid="{AA8A7BA0-0265-457d-AA3E-8F33AA002873}" desc="IUID_ISM_WEB_SVR"/>
		
		<Dyn regname="" path="./libEventSys" uuid="{C962C784-4C24-45db-BE06-493EDF8FAA27}" desc="IUID_IEVENTHANDLER"/>
		<Dyn regname="" path="./libScriptCom" uuid="{DCC0925B-32DC-31AB-AAC9-E9AED36990E1}" desc="IUID_ISMCOM"/>
		<Dyn regname="" path="./libScriptDebuger" uuid="{87DFBE31-1D48-4171-B43C-EEF292173DE4}" desc="IUID_ISMDBG"/>
	</DynReg>
	
	<ListenerReg>
		<Event>
			<Listener name="IDynSMWebSvr"/>
		</Event>
		
		<Update>
			<Listener name="IScriptSys"/>
			<Listener name="ITimerQueue"/>
			<Listener name="ITimerQueueEx"/>
		</Update>
		
	</ListenerReg>
	
	<ScriptModuleReg>
		<Module uuid="{87DFBE31-1D48-4171-B43C-EEF292173DE4}" flag="CREATE" desc="IUID_ISMDBG"/>
		<Module uuid="{DCC0925B-32DC-31AB-AAC9-E9AED36990E1}" flag="CREATE" desc="IUID_ISMCOM"/>
		<Module uuid="{AA8A7BA0-0265-457d-AA3E-8F33AA002873}" name="IDynSMWebSvr" flag="GET" desc="IUID_ISM_WEB_SVR"/>
	</ScriptModuleReg>
	
</SysConfig>
'''

#====
gamesvr_svr_config_res = r'''-- 服务器杂项配置 （由运营同事配置）
res_svr_mics_cfg = {
	svrOpenTime=10000000, -- 开服时间
	payZoneId=%d, 
}

res_mapview = {200,200,400,400}
'''


#======================================
import os, sys, codecs

def safeMakeDir(path):
	try:
		os.mkdir(path)
	except Exception, e:
		pass	
	
def makeMsgConfig(zoneids):
	s = msg_config_res['default']
	s += '\n\n<Nodes>'
	for node in zoneids :
		zoneid = node['id']
		s += msg_config_res['node']%(zoneid, zoneid*2-1, zoneid, zoneid*2)
	s += '\n</Nodes>'
	
	s += '\n\n<Links>'
	for node in zoneids :
		zoneid = node['id']
		s += msg_config_res['link']%(zoneid, zoneid, 100000+(zoneid*2-1), 100000+zoneid*2)
	s += '\n</Links>'
	return s
	
def makeConnectCommConfigs(zoneids):
	ss = {}
	for node in zoneids :
		zoneid = node['id']
		maxcount = node['maxcount']
		s = connect_comm_config_res%(zoneid, zoneid, 8000 + zoneid, maxcount)
		ss[zoneid] = s
	return ss
	
def makeGameCommConfigs(zoneids):
	ss = {}
	for node in zoneids :
		zoneid = node['id']
		maxcount = node['maxcount']
		s = gamesvr_comm_config_res%(zoneid, zoneid, maxcount )
		ss[zoneid] = s
	return ss
	
def makeGameDBConfigs(zoneids):
	ss = {}
	for node in zoneids :
		zoneid = node['id']
		s = gamesvr_db_config_res%(node['dbip'], node['dbpsw'], zoneid, zoneid )
		ss[zoneid] = s
	return ss
	
def makeGameSvrConfigs(zoneids):
	ss = {}
	for node in zoneids :
		zoneid = node['id']
		s = gamesvr_svr_config_res%( zoneid )
		ss[zoneid] = s
	return ss
	
def writefile(filename, s):
	f = open(filename, 'w')
	f.write(codecs.BOM_UTF8)
	f.write(s)
	f.close()
	
def makeSvrConfig(despath, zoneids, svrname, sys_config_res, commss, dbss, svrss):
	safeMakeDir(despath + 'config/' + svrname)
	writefile(despath + 'config/' + svrname + '/sys_config.xml', sys_config_res )
	os.chdir(despath + 'config/' + svrname)
	for zoneid in commss :
		zonefolder = despath + 'config/' + svrname + '/' + svrname + '%05d'%zoneid
		safeMakeDir(zonefolder)
		writefile(zonefolder + '/comm_config.xml', commss[zoneid] )
		if dbss != None:
			writefile(zonefolder + '/db_config.xml', dbss[zoneid] )
		if svrss != None:
			writefile(zonefolder + '/cfg.lua', svrss[zoneid] )
	
def main():
	if len(sys.argv) != 3: 
		print "args error! need like:"
		print "python make_config.py /home/ubuntu/game/data/ [{'id':1,'maxcount':2000,'dbip':'10.66.105.177','dbpsw':'xxxx'}]"
		print "python make_config.py <desfolder,must empty> <zoneid list>\n"
		return
		
	despath = sys.argv[1]
	if despath[-1] != '/' : despath += '/'
	print sys.argv[2]
	zoneids = eval(sys.argv[2])
	print zoneids
		
	os.chdir(despath)
	safeMakeDir('config')
	writefile(despath + 'config/msg_config.xml', makeMsgConfig(zoneids) )
	
	makeSvrConfig(despath, zoneids, 'connect', connect_sys_config_res, makeConnectCommConfigs(zoneids), None, None)
	makeSvrConfig(despath, zoneids, 'gamesvr', gamesvr_sys_config_res, makeGameCommConfigs(zoneids), makeGameDBConfigs(zoneids), makeGameSvrConfigs(zoneids))

	print 'make config ok!'
main()