# -*- coding:utf-8 -*- 
# https://github.com/v8/v8/wiki/Debugging%20Protocol
# https://github.com/buggerjs/bugger-v8-client/blob/master/PROTOCOL.md
# 
import sys, os, re, socket, threading, time, errno
import socket, errno, select, time
import json

class FileUtil:
	@staticmethod
	def findFiles(basepath, ext):
		files = []
		for root, dirs, files in os.walk(basepath):
			for file in files:
				if re.search(r'\.' + ext + r'$', file) == None: continue
				files.append(root + os.sep + file)
		return files
	@staticmethod
	def getFileLines(fileName):
		f = open(fileName)
		lines = []
		if f != None:
			lines = f.readlines()
			f.close()
		return len(lines)
	@staticmethod
	def getFileSize(fileName):
		f = open(fileName)
		data = ''
		if f != None:
			data = f.read()
			f.close()
		return len(data)

def log(s):
	f = open(r'f:\uts\uts_tool\log.txt', 'a')
	if f != None:
		f.write(s)
		f.close()
	print s

def makeCmd():
	cmd = 'node.exe '
	for i in range(1, len(sys.argv)):
		cmd = cmd + sys.argv[i]
		cmd = cmd + ' '
	return cmd
	
class SimpleQueue:
	def __init__(self):
		self._arr = []
	def push(self, data):
		if data != None:
			self._arr.insert(0, data)
	def pop(self):
		if len(self._arr) > 0: self._arr.pop()
	def top(self):
		if len(self._arr) == 0: return None
		return self._arr[0]
	def back(self):
		if len(self._arr) == 0: return None
		return self._arr[len(self._arr)-1]
	def at(self, index):
		if index >= len(self._arr) or index < 0: return None
		return self._arr[index]
	def count(self):
		return len(self._arr)
	def clear(self):
		self._arr = []
		
class EmptySocket:
	def is_active(self):
		return False
	def close(self):
		pass
class TimeoutSocket:
	def __init__(self, s, timeout):
		if s != None:
			self._sock = s
			self._connected = True
		else:
			self._sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
			self._connected = False
		self._sock.setblocking(False)
		self._sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR  , 1)
		self._timeout = timeout
		self._last_connect_time = 0.0;

	def __getattr__(self, key):
		return getattr(self._sock, key)

	def get_timeout(self):
		return self._timeout

	def set_timeout(self, timeout=None):
		self._timeout = timeout
		
	def is_connected(self):
		return self._connected
		
	def is_active(self):
		return self._sock != None and self._connected

	def connect(self, addrport):
		if time.time() - self._last_connect_time < 2.0:
			return
		self._last_connect_time = time.time()
		try:
			self._sock.connect(addrport)
		except Exception, e:
			if e.args[0] != errno.EAGAIN and e.args[0] != errno.EWOULDBLOCK:
				raise
		r,w,e = select.select([], [self._sock], [], self._timeout)
		if w:
			self._connected = True
			
	def bind(self, address):
		self._sock.bind(address)
	
	def listen(self, num):
		self._sock.listen(num)
			
	def accept(self):
		r,w,e = select.select([self._sock], [], [self._sock], self._timeout)
		if r and (self._sock in r):
			clientsock, clientaddress = self._sock.accept()
			tclientsock = self.__class__(clientsock, self._timeout)
			return (tclientsock, clientaddress)
		else:
			return (None, None)
		
	def send(self, data, flags=0):
		sock = self._sock
		r,w,e = select.select([],[sock],[], self._timeout)
		if not w:
			return 0
		try:
			return sock.send(data, flags)
		except Exception, e:
			if e.args[0] != errno.EAGAIN and e.args[0] != errno.EWOULDBLOCK:
				raise

	def recv(self, bufsize, flags=0):
		sock = self._sock
		r,w,e = select.select([sock], [], [], self._timeout)
		if not r:
			return None
		try:
			return sock.recv(bufsize, flags)
		except Exception, e:
			if e.args[0] != errno.EAGAIN and e.args[0] != errno.EWOULDBLOCK:
				raise

	def close(self):
		if self._sock != None:
			self._sock.close()
			self._sock = None
	
class ResponseCmd:
	def make(self):
		return None
	
class ScriptsResponseCmd(ResponseCmd):
	def __init__(self, basepath, seq, request_seq):
		self.cmdpattern = '{"seq":<$seq>,"request_seq":<$request_seq>,"type":"response","command":"scripts","success":true,"body":[<$handlelist>],"refs":[],"running":false}'
		self.handleitem = '{"handle":<$handle>,"type":"script","name":"<$name>","id":<$id>,"lineOffset":0,"columnOffset":0,"lineCount":<$lineCount>,"sourceStart":"","sourceLength":<$sourceLength>,"scriptType":2,"compilationType":0,"context":{"ref":0},"text":"<$name> (lines: <$lineCount>)"}'
		self.basepath = basepath
		self.seq = seq
		self.request_seq = request_seq
	def make(self):
		handleId = 1
		scriptId = 1
		handlelist = ''
		files = FileUtil.findFiles(self.basepath, 'ss')
		for fname in files:
			if handlelist != '':
				handlelist = handlelist + ','
			item = self.handleitem.replace(
				'<$handle>', str(handleId)).replace(
				'<$name>', fname).replace(
				'<$id>', str(scriptId)).replace(
				'<$lineCount>', str(FileUtil.getFileLines(fname))).replace(
				'<$sourceLength>', str(FileUtil.getFileSize(fname)))
			handlelist = handlelist + item
			handleId = handleId + 1
			scriptId = scriptId + 1
		cmd = self.cmdpattern.replace(
			'<$seq>', str(self.seq)).replace(
			'<$request_seq>', str(self.request_seq)).replace(
			'<$handlelist>', handlelist)
		return cmd
		
class BacktraceResponseCmd(ResponseCmd):
	def __init__(self, seq, request_seq):
		self.cmdpattern = '{"seq":<$seq>,"request_seq":<$request_seq>,"type":"response","command":"backtrace","success":true,"body":{"fromFrame":<$fromFrame>,"toFrame":<$toFrame>,"totalFrames":<$totalFrames>,"frames":[<$frames>],"refs":[],"running":false}'
		self.frameitem = '{"type":"frame","index":<$index>,"receiver":{"ref":-1,"type":"","className":""},"func":{"ref":-1,"type":"function","name":"","inferredName":"","scriptId":<$scriptId>},' \
			+ '"script":{"ref":-1},"constructCall":false,"atReturn":false,"debuggerFrame":false,"arguments":[<$arguments>],"locals":[<$locals>],"position":-1,"line":<$line>,"column":<$column>,"sourceLineText":"","scopes":[],"text":""}'
		self.varitem = '{"name":"<$name>","value":{"ref":-1,"type":"<$type>","value":<$value>}}'
		self.seq = seq
		self.request_seq = request_seq
	def make(self):
		return self.makeEmpty()
		
	def makeEmpty(self):
		cmd = self.cmdpattern.replace(
			'<$seq>', str(self.seq)).replace(
			'<$request_seq>', str(self.request_seq)).replace(
			'<$fromFrame>', '0').replace(
			'<$toFrame>', '0').replace(
			'<$totalFrames>', '0').replace(
			'<$frames>', '')
		return cmd

	
class SetbreakpointResponseCmd(ResponseCmd):
	def __init__(self, seq, request_seq, request_cmd):
		self.cmdpattern = '{"seq":<$seq>,"request_seq":<$request_seq>,"type":"response","command":"setbreakpoint","success":true,"body":{"type":"scriptId","breakpoint":<$breakpoint>,"script_id":<$scriptId>,"line":<$line>,"column":0,"actual_locations":[]},"refs":[],"running":false}'
		self.seq = seq
		self.request_seq = request_seq
		self.request_cmd = request_cmd
	def make(self):
		cmd = self.cmdpattern.replace(
			'<$seq>', str(self.seq)).replace(
			'<$request_seq>', str(self.request_seq)).replace(
			'<$fromFrame>', '0').replace(
			'<$toFrame>', '0').replace(
			'<$totalFrames>', '0').replace(
			'<$frames>', '')
		return cmd
	
class ChangebreakpointResponseCmd(ResponseCmd):
	pass
	
class ClearbreakpointResponseCmd(ResponseCmd):
	pass
	
class SetexceptionbreakResponseCmd(ResponseCmd):
	pass
	
class ContinueResponseCmd(ResponseCmd):
	pass
	
class SetvariablevalueResponseCmd(ResponseCmd):
	pass
	
class SetvariablevalueResponseCmd(ResponseCmd):
	pass
	
class ScopeResponseCmd(ResponseCmd):
	pass

class ScopesResponseCmd(ResponseCmd):
	pass
	
class FrameResponseCmd(ResponseCmd):
	pass
	
class LookupResponseCmd(ResponseCmd):
	pass
	
class EvaluateResponseCmd(ResponseCmd):
	pass
	
class BreakEventCmd:
	pass
	
class RequestCmd:
	pass
class SetbreakpointRequestCmd(RequestCmd):
	pass
	
class RequestHandler:
	def __init__(self, basePath, to_server_message, to_client_message):
		self.base_path = basePath
		self.to_server_message = to_server_message
		self.to_client_message = to_client_message
		
	def createEmptyPkg(self):
		return {'data':'', 'datalen':0, 'pkghead':'', 'headok':True, 'dataok':True, 'fulldata':'', 'sendpos':0}
	
class ScriptsRequestHandler(RequestHandler):
	def handle(self, seq, cmd):
		responseCmd = ScriptsResponseCmd(self.base_path, seq, cmd['seq'])
		scmd = responseCmd.make()
		pkg = self.createEmptyPkg()
		pkg['data'] = scmd
		pkg['datalen'] = len(pkg['data'])
		pkg['pkghead'] = 'Content-Length: %d\r\n\r\n'%pkg['datalen']
		pkg['fulldata'] = pkg['pkghead'] + pkg['data']
		self.to_client_message.push(pkg)
		
class BacktraceRequestHandler(RequestHandler):
	def handle(self, seq, cmd):
		responseCmd = BacktraceResponseCmd(seq, cmd['seq'])
		scmd = responseCmd.make()
		pkg = self.createEmptyPkg()
		pkg['data'] = scmd
		pkg['datalen'] = len(pkg['data'])
		pkg['pkghead'] = 'Content-Length: %d\r\n\r\n'%pkg['datalen']
		pkg['fulldata'] = pkg['pkghead'] + pkg['data']
		self.to_client_message.push(pkg)
	
class NotifyHandler:
	pass
	
				
class DebugCommandHandler:
	def __init__(self, to_server_message, to_client_message):
		self.from_client_pkg = self.createEmptyPkg()
		self.to_server_message = to_server_message
		self.to_client_message = to_client_message
		self.to_server_breakpoints = SimpleQueue()
		self.seq = 0
		self.requestHandlers = {}
		self.requestHandlers['scripts'] = ScriptsRequestHandler('',to_server_message,to_client_message)
		self.requestHandlers['backtrace'] = BacktraceRequestHandler('',to_server_message,to_client_message)
		
	def getBreakpoints(self):
		return self.to_server_breakpoints
		
	def onConnectedMainServer(self):
		pass
	
	def onDisconnectedFromMainServer(self):
		self.to_server_message.clear()
		self.to_client_message.clear()
		
		continueEvent = '{"seq":%d,"type":"event","event":"break","body":{"invocationText":"","sourceLine":0,"sourceColumn":0,"sourceLineText":"","script":{"id":0,"name":"","lineOffset":0,"columnOffset":0,"lineCount":0},"breakpoints":[]}}'%self.newSeq()
		self.sendCommandToClient(continueEvent);
		
	def onClientConnected(self):
		self.clear()
		self.clearSeq()
		self.sendCommandToServer('{"seq":-1,"type":"request","command":"connect"}')
		
	def onClientDisconnected(self):
		self.clear()
		self.sendCommandToServer('{"seq":-1,"type":"request","command":"disconnect"}')
		
	def onRectFromMainServer(self, data):
		self.combinePkg(self.to_client_message, data)
		pkg = self.to_client_message.top()
		if pkg != None and pkg['dataok'] and pkg['datalen'] > 0:
			self.replaceServerSeqByLocal(pkg)
		
	def onRectFromClient(self, data):
		self.combinePkg(self.to_server_message, data)
		self.saveBreakpointsCmd()
		self.onHandleFromClientCmd()
			
	def onHandleFromClientCmd(self):
		pkg = self.to_server_message.top()
		if not pkg['dataok'] or pkg['data'] == '': 
			return
		cmd = json.loads(pkg['data'])
		handler = self.requestHandlers.get(cmd['command'], None)
		if handler == None:
			return
		handler.handle(self.newSeq(), cmd)
			
	def saveBreakpointsCmd(self):
		pkg = self.to_server_message.top()
		if not pkg['dataok'] or pkg['data'] == '': 
			return
		
		cmd = json.loads(pkg['data'])
		if cmd['command'] != 'setbreakpoint' \
			and cmd['command'] != 'changebreakpoint' \
			and cmd['command'] != 'clearbreakpoint' \
			and cmd['command'] != 'setexceptionbreak':
			return
		lastSavePkg = self.to_server_breakpoints.top()
		if lastSavePkg != None and lastSavePkg['cmd']['seq'] >= cmd['seq']:
			return
		
		pkg['cmd'] = cmd
		self.to_server_breakpoints.push(pkg);
		
	def combinePkg(self, queue, data):
		while data != '':
			pkg = queue.top()
			if pkg == None or pkg['dataok'] == True:
				pkg = self.createEmptyPkg()
			if not pkg['headok']:
				data = self.combindPkgHead(pkg, data)
			elif not pkg['dataok']:
				data = self.combindPkgData(pkg, data)
			if queue.top() != pkg:
				queue.push(pkg)
				
	def combindPkgHead(self, pkg, data):
		dataLenPattern = re.compile(r'Content-Length: (\d+)')
		endToken = '\r\n\r\n'
		pkghead = pkg['pkghead'] + data
		endPos = pkghead.find(endToken)
		if endPos < 0:
			pkg['pkghead'] = pkghead
			if len(pkg['pkghead']) > 4096:
				raise Exception, 'error head, too long'
			data = ''
		else:
			endPos = endPos + len(endToken)
			pkg['pkghead'] = pkghead[0:endPos]
			pkg['headok'] = True
			# get data len
			match = dataLenPattern.search(pkg['pkghead'])
			if match and match.group(1) :
				pkg['datalen'] = int(match.group(1))
			else:
				raise Exception, 'error head, not find data len field'
			if pkg['datalen'] == 0:
				pkg['dataok'] = True
			data = pkghead[endPos:]
		return data
		
	def combindPkgData(self, pkg, data):
		pkgdata = pkg['data'] + data
		if len(pkgdata) >= pkg['datalen'] :
			pkg['dataok'] = True
			pkg['data'] = pkgdata[0:pkg['datalen']]
			pkg['fulldata'] = pkg['pkghead'] + pkg['data']
			data = pkgdata[pkg['datalen']:]
		else:
			pkg['data'] = pkgdata
			data = ''
		return data
		
	def sendCommandToServer(self, data):
		self.sendCommand(self.to_server_message, data)
		
	def sendCommandToClient(self, data):
		self.sendCommand(self.to_client_message, data)
		
	def sendCommand(self, queue, data):
		pkg = self.createEmptyPkg()
		pkg['data'] = data
		pkg['datalen'] = len(pkg['data'])
		pkg['pkghead'] = 'Content-Length: %d\r\n\r\n'%pkg['datalen']
		pkg['fulldata'] = pkg['pkghead'] + pkg['data']
		pkg['headok'] = True
		pkg['dataok'] = True
		queue.push(pkg)
		
	def clear(self):
		self.to_server_message.clear()
		self.to_client_message.clear()
		self.to_server_breakpoints.clear()
		
	def replaceServerSeqByLocal(self, pkg):
		pkg['data'] = re.sub(r'"seq":(\d+),', '"seq":%d,'%self.newSeq(), pkg['data'])
		pkg['datalen'] = len(pkg['data'])
		pkg['pkghead'] = re.sub(r'Content-Length: (\d+)', 'Content-Length: %d'%pkg['datalen'], pkg['pkghead'])
		pkg['fulldata'] = pkg['pkghead'] + pkg['data']
		
	def newSeq(self):
		self.seq = self.seq + 1
		return self.seq
		
	def clearSeq(self):
		self.seq = 0
		
	def createEmptyPkg(self):
		return {'data':'', 'datalen':0, 'pkghead':'', 'headok':False, 'dataok':False, 'cmd':None, 'fulldata':'', 'sendpos':0}
		
class AgentServer(threading.Thread):
	def __init__(self):
		threading.Thread.__init__(self)
		self.thread_stop = False
		
		self.timeout = 0.002
		self.agent_svr_sock = TimeoutSocket(None, self.timeout)
		self.agent_svr_sock.bind(('127.0.0.1',5858))
		self.agent_svr_sock.listen(1)
		self.to_mainsvr_sock = TimeoutSocket(None, self.timeout)
		self.client_sock = EmptySocket()
		
		self.to_server_message = SimpleQueue()
		self.to_client_message = SimpleQueue()
		self.cmd_handler = DebugCommandHandler(self.to_server_message, self.to_client_message)
		
	def connectMainServer(self):
		try:
			if not self.to_mainsvr_sock.is_connected():
				self.to_mainsvr_sock.connect(("127.0.0.1",8686))
			if self.to_mainsvr_sock.is_active():
				self.cmd_handler.onConnectedMainServer()
		except Exception, e:
			self.to_mainsvr_sock.close()
			self.to_mainsvr_sock = TimeoutSocket(None, self.timeout)
			
	def acceptClient(self):
		client_sock, addr = self.agent_svr_sock.accept()
		if client_sock != None:
			if self.client_sock.is_active():
				self.client_sock.close()
			self.client_sock = client_sock
			self.cmd_handler.onClientConnected()
			
	def recvFromServer(self):
		try:
			if not self.to_mainsvr_sock.is_active(): 
				return None
			data = self.to_mainsvr_sock.recv(1024)
			if data == '': data = None
			if data != None:
				self.cmd_handler.onRectFromMainServer(data)
			return data
		except Exception, e:
			self.to_mainsvr_sock.close()
			self.to_mainsvr_sock = TimeoutSocket(None, self.timeout)
			self.cmd_handler.onDisconnectedFromMainServer()
			return None
			
	def sendToServer(self, pkg):
		try:
			if pkg == None:
				return False
			if not self.to_mainsvr_sock.is_active() :
				return False
			return self.sendPkg(self.to_mainsvr_sock, pkg)
		except Exception, e:
			self.to_mainsvr_sock.close()
			self.to_mainsvr_sock = TimeoutSocket(None, self.timeout)
			self.cmd_handler.onDisconnectedFromMainServer()
			return False
				
	def recvFromClient(self):
		try: 
			if not self.client_sock.is_active(): 
				return None
			data = self.client_sock.recv(1024)
			if data == '': data = None
			if data != None:
				self.cmd_handler.onRectFromClient(data)
			return data
		except Exception, e:
			self.client_sock.close()
			self.cmd_handler.onClientDisconnected()
			return None
			
	def sendToClient(self, pkg):
		try: 
			if pkg == None:
				return False
			if not self.client_sock.is_active() :
				return False
			return self.sendPkg(self.client_sock, pkg)
		except Exception, e:
			self.client_sock.close()
			self.cmd_handler.onClientDisconnected()
			return False
			
	def sendPkg(self, sock, pkg):
		if not pkg['dataok']:
			return False
		pkg['sendpos'] = pkg['sendpos'] + sock.send(pkg['fulldata'][pkg['sendpos']:])
		return pkg['sendpos'] == len(pkg['fulldata'])

	def run(self):
		print 'start agent server ...'
		while not self.thread_stop:
			self.connectMainServer()
			self.acceptClient()

			self.recvFromClient()
			self.recvFromServer()
			
			if self.sendToClient(self.to_client_message.back()) :
				self.to_client_message.pop()

			if self.sendToServer(self.to_server_message.back()) :
				self.to_server_message.pop()
			
			time.sleep(self.timeout)
				
		self.agent_svr_sock.close()
		self.to_mainsvr_sock.close()
		self.client_sock.close()

	def stop(self):  
		self.thread_stop = True
	
g_port = 8686
def parseCmd(cmd):
	p = re.compile(r'^node\.exe\s+--debug-brk=(\d+)\s([\w:\\\/\.]+)', re.M)
	arr = p.findall(cmd)
	if ( len(arr) == 0 ): return False
	port = arr[0][0]
	
	AgentServer().start()
	return True

def main(cmd):
	try:
		cmd = makeCmd()
		parseCmd(cmd)
		
	except Exception,ex: 
		print Exception, ex
	
if __name__ == '__main__':
	cmd = r'node.exe --debug-brk=8686 E:\cocos\test4\NodejsConsoleApp1\NodejsConsoleApp1\app.js'
	main(cmd)
