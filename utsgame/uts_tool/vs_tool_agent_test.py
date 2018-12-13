import vs_tool_agent

class MockTimeoutSocket:
	def __init__(self, s, timeout):
		pass
	def __getattr__(self, key):
		pass
	def get_timeout(self):
		return 0
	def set_timeout(self, timeout=None):
		pass
	def is_connected(self):
		return True
	def is_active(self):
		return True
	def connect(self, addrport):
		pass	
	def bind(self, address):
		pass
	def listen(self, num):
		pass	
	def accept(self):
		pass
	def send(self, data, flags=0):
		pass
	def recv(self, bufsize, flags=0):
		pass
	def close(self):
		pass
		
class MockFileUtil:
	@staticmethod
	def findFiles(basepath, ext):
		return ['main.ss', r'module\mod1.ss', r'module\mod2.ss']
	@staticmethod
	def getFileLines(fileName):
		if fileName == 'main.ss' :
			return 10
		elif fileName == 'module\mod1.ss' :
			return 20
		elif fileName == 'module\mod2.ss' :
			return 30
	@staticmethod
	def getFileSize(fileName):
		if fileName == 'main.ss' :
			return 100
		elif fileName == 'module\mod1.ss' :
			return 200
		elif fileName == 'module\mod2.ss' :
			return 300
vs_tool_agent.FileUtil = MockFileUtil
		
def test_SimpleQueue():
	pass

def test_DebugCommandHandler_combinePkg(caller, messagequeue):
	caller( 'Type: connect\r\n')
	assert(messagequeue.top()['datalen'] == 0)
	assert(messagequeue.top()['pkghead'] == 'Type: connect\r\n')
	assert(messagequeue.top()['dataok'] == False)
	assert(messagequeue.top()['headok'] == False)
	assert(messagequeue.top()['sendpos'] == 0)
	assert(messagequeue.top()['data'] == '')
	
	caller( 'V8-Version: 3.14.5.9\r\n')
	assert(messagequeue.top()['pkghead'] == 'Type: connect\r\nV8-Version: 3.14.5.9\r\n')
	
	caller( 'Content-Length: 0\r\n')
	assert(messagequeue.top()['pkghead'] == 'Type: connect\r\nV8-Version: 3.14.5.9\r\nContent-Length: 0\r\n')
	
	caller( 'Protocol-Version: 1\r\n\r\n')
	assert(messagequeue.top()['headok'] == True)
	assert(messagequeue.top()['data'] == '')
	assert(messagequeue.top()['datalen'] == 0)
	assert(messagequeue.top()['dataok'] == True)
	
	caller( 'Content-Length: 115\r\n\r\n{"command":"backtrace","seq":1,"type":"request","arguments":{"fromFrame":0,"toFrame":2147483647,"inlineRefs":true}}')
	assert(messagequeue.top()['datalen'] == 115)
	assert(messagequeue.top()['pkghead'] == 'Content-Length: 115\r\n\r\n')
	assert(messagequeue.top()['dataok'] == True)
	assert(messagequeue.top()['headok'] == True)
	assert(messagequeue.top()['sendpos'] == 0)
	assert(messagequeue.top()['data'] == '{"command":"backtrace","seq":1,"type":"request","arguments":{"fromFrame":0,"toFrame":2147483647,"inlineRefs":true}}')
	
	assert(messagequeue.count() == 2)
	
	caller( 'Content-Length: 3')
	caller( '1\r\n\r\n{"command":"backtrace","seq":3}Content-Le')
	assert(messagequeue.at(1)['datalen'] == 31)
	assert(messagequeue.at(1)['pkghead'] == 'Content-Length: 31\r\n\r\n')
	assert(messagequeue.at(1)['dataok'] == True)
	assert(messagequeue.at(1)['headok'] == True)
	assert(messagequeue.at(1)['sendpos'] == 0)
	assert(messagequeue.at(1)['data'] == '{"command":"backtrace","seq":3}')
	
	assert(messagequeue.count() == 4)
	
	caller( 'ngth: 31\r\n')
	caller( '\r\n{"command":"backtrace","seq":4}')
	assert(messagequeue.top()['datalen'] == 31)
	assert(messagequeue.top()['pkghead'] == 'Content-Length: 31\r\n\r\n')
	assert(messagequeue.top()['dataok'] == True)
	assert(messagequeue.top()['headok'] == True)
	assert(messagequeue.top()['sendpos'] == 0)
	assert(messagequeue.top()['data'] == '{"command":"backtrace","seq":4}')
	
	assert(messagequeue.count() == 4)
	
	caller( 'Content-Length: 31\r\n\r\n{"command":"backtrace",')
	caller( '"seq":5}')
	assert(messagequeue.top()['datalen'] == 31)
	assert(messagequeue.top()['pkghead'] == 'Content-Length: 31\r\n\r\n')
	assert(messagequeue.top()['dataok'] == True)
	assert(messagequeue.top()['headok'] == True)
	assert(messagequeue.top()['sendpos'] == 0)
	assert(messagequeue.top()['data'] == '{"command":"backtrace","seq":5}')
	
	assert(messagequeue.count() == 5)
	
	caller( 'Content-Length: 31\r\n\r\n{"command":"backtrace",')
	caller( '"seq":6}Content-Length: 31\r\n')
	caller( '\r\n{"command":"backtrace",')
	caller( '"seq":7}')
	assert(messagequeue.at(1)['datalen'] == 31)
	assert(messagequeue.at(1)['pkghead'] == 'Content-Length: 31\r\n\r\n')
	assert(messagequeue.at(1)['dataok'] == True)
	assert(messagequeue.at(1)['headok'] == True)
	assert(messagequeue.at(1)['sendpos'] == 0)
	assert(messagequeue.at(1)['data'] == '{"command":"backtrace","seq":6}')
	
	assert(messagequeue.top()['datalen'] == 31)
	assert(messagequeue.top()['pkghead'] == 'Content-Length: 31\r\n\r\n')
	assert(messagequeue.top()['dataok'] == True)
	assert(messagequeue.top()['headok'] == True)
	assert(messagequeue.top()['sendpos'] == 0)
	assert(messagequeue.top()['data'] == '{"command":"backtrace","seq":7}')
	
	assert(messagequeue.top()['fulldata'] == 'Content-Length: 31\r\n\r\n{"command":"backtrace","seq":7}')
	
	assert(messagequeue.count() == 7)
	
	#error pkg head
	try:
		caller( 'Content-Length-error: 31\r\n\r\n')
		assert ( False )
	except Exception, e:
		assert (str(e)=='error head, not find data len field')
	
	try:
		caller( ('1'*(4096+1) ))
		assert ( False )
	except Exception, e:
		assert (str(e)=='error head, too long')

def test_DebugCommandHandler_onRectFromMainServer():
	to_server_message = vs_tool_agent.SimpleQueue()
	to_client_message = vs_tool_agent.SimpleQueue()
	dh = vs_tool_agent.DebugCommandHandler(to_server_message, to_client_message)
	test_DebugCommandHandler_combinePkg(dh.onRectFromMainServer, to_client_message)
	
	assert ( False, 'filter already sended to client cmd by request_seq!' )
	assert ( False, 'is client reconnected need clear saved request_seq!' )
	
def test_DebugCommandHandler_onRectFromClient():
	to_server_message = vs_tool_agent.SimpleQueue()
	to_client_message = vs_tool_agent.SimpleQueue()
	dh = vs_tool_agent.DebugCommandHandler(to_server_message, to_client_message)
	test_DebugCommandHandler_combinePkg(dh.onRectFromClient, to_server_message)
	
	# save client breakpoint
	to_server_message.clear()
	to_client_message.clear()
	dh.getBreakpoints().clear()
	breakpoints = 'Content-Length: 116\r\n\r\n{"command":"setbreakpoint","seq":1,"type":"request","arguments":{"line":4,"column":0,"type":"scriptId",'
	dh.onRectFromClient(breakpoints)
	assert ( dh.getBreakpoints().count() == 0 )
	dh.onRectFromClient('"target":33}}')
	assert ( dh.getBreakpoints().count() == 1 )
	breakpoints = 'Content-Length: 116\r\n\r\n{"command":"setbreakpoint","seq":1,"type":"request","arguments":{"line":4,"column":0,"type":"scriptId","target":33}}'
	dh.onRectFromClient(breakpoints)
	assert ( dh.getBreakpoints().count() == 1 )
	continues = 'Content-Length: 64\r\n\r\n{"command":"continue","seq":2,"type":"request","arguments":null}'
	dh.onRectFromClient(continues)
	assert ( dh.getBreakpoints().count() == 1 )
	
	breakpoints = 'Content-Length: 38\r\n\r\n{"command":"changebreakpoint","seq":3}'
	dh.onRectFromClient(breakpoints)
	assert ( dh.getBreakpoints().count() == 2 )
	
	breakpoints = 'Content-Length: 37\r\n\r\n{"command":"clearbreakpoint","seq":4}'
	dh.onRectFromClient(breakpoints)
	assert ( dh.getBreakpoints().count() == 3 )
	
	breakpoints = 'Content-Length: 39\r\n\r\n{"command":"setexceptionbreak","seq":5}'
	dh.onRectFromClient(breakpoints)
	assert ( dh.getBreakpoints().count() == 4 )
	
	# not connected to main server
	to_server_message.clear()
	to_client_message.clear()
	dh.getBreakpoints().clear()
	dh.clearSeq()
	
	#   scripts
	cmds = 'Content-Length: 82\r\n\r\n{"command":"scripts","seq":1,"type":"request","arguments":{"includeSource":false}}'
	dh.onRectFromClient(cmds)
	assert (to_server_message.count() == 1)
	assert (to_client_message.count() == 1)
	responsecmds = 'Content-Length: 801\r\n\r\n' \
		+ '{"seq":1,"request_seq":1,"type":"response","command":"scripts","success":true,' \
		+ '"body":[{"handle":1,"type":"script","name":"main.ss","id":1,"lineOffset":0,"columnOffset":0,"lineCount":10,"sourceStart":"","sourceLength":100,"scriptType":2,"compilationType":0,"context":{"ref":0},"text":"main.ss (lines: 10)"}' \
		+ ',{"handle":2,"type":"script","name":"module\\mod1.ss","id":2,"lineOffset":0,"columnOffset":0,"lineCount":20,"sourceStart":"","sourceLength":200,"scriptType":2,"compilationType":0,"context":{"ref":0},"text":"module\\mod1.ss (lines: 20)"}' \
		+ ',{"handle":3,"type":"script","name":"module\\mod2.ss","id":3,"lineOffset":0,"columnOffset":0,"lineCount":30,"sourceStart":"","sourceLength":300,"scriptType":2,"compilationType":0,"context":{"ref":0},"text":"module\\mod2.ss (lines: 30)"}' \
		+ ']' \
		+ ',"refs":[]' \
		+ ',"running":false}'
	assert ( to_client_message.top()['fulldata'] == responsecmds )
	
	#   return empty backtrace when not connect main server
	cmds = 'Content-Length: 115\r\n\r\n{"command":"backtrace","seq":2,"type":"request","arguments":{"fromFrame":0,"toFrame":2147483647,"inlineRefs":true}}'
	dh.onRectFromClient(cmds)
	assert (to_server_message.count() == 2)
	assert (to_client_message.count() == 2)
	responsecmds = 'Content-Length: 168\r\n\r\n' + '''{"seq":2,"request_seq":2,"type":"response","command":"backtrace","success":true,"body":{"fromFrame":0,"toFrame":0,"totalFrames":0,"frames":[],"refs":[],"running":false}'''
	assert (  to_client_message.top()['fulldata'] == responsecmds )
	
	#   return breakpoint set ok
	cmds = 'Content-Length: 116\r\n\r\n{"command":"setbreakpoint","seq":3,"type":"request","arguments":{"line":10,"column":2,"type":"scriptId","target":2}}'
	dh.onRectFromClient(cmds)
	assert (to_server_message.count() == 3)
	assert (to_client_message.count() == 3)
	responsecmds = 'Content-Length: 209\r\n\r\n{"seq":3,"request_seq":3,"type":"response","command":"setbreakpoint","success":true,"body":{"type":"scriptId","breakpoint":1,"script_id":2,"line":10,"column":2,"actual_locations":[]},"refs":[],"running":false}'
	assert (  to_client_message.top()['fulldata'] == responsecmds )
	
	# connected to main server
	
	
	# disconnected to main server
	
	
	assert ( False, 'recv client cmd must reponse when not connect main server' )
	
def test_DebugCommandHandler_onClientConnected():
	to_server_message = vs_tool_agent.SimpleQueue()
	to_client_message = vs_tool_agent.SimpleQueue()
	dh = vs_tool_agent.DebugCommandHandler(to_server_message, to_client_message)
	
	breakpoints = 'Content-Length: 116\r\n\r\n{"command":"setbreakpoint","seq":1,"type":"request","arguments":{"line":4,"column":0,"type":"scriptId","target":33}}'
	dh.onRectFromClient(breakpoints)
	assert ( to_server_message.count() == 1 )
	assert ( dh.getBreakpoints().count() == 1 )
	
	breakpoints = 'Content-Length: 84\r\n\r\n{"seq":1,"request_seq":1,"type":"response","command":"setbreakpoint","success":true}'
	dh.onRectFromMainServer(breakpoints)
	assert ( to_server_message.count() == 1 )
	assert ( to_client_message.count() == 1 )
	assert ( dh.getBreakpoints().count() == 1 )
	
	breakpoints = 'Content-Length: 85\r\n\r\n{"seq":1,"request_seq":1,"type":"response","command":"setbreakpoint","success":false}'
	dh.onRectFromMainServer(breakpoints)
	assert ( to_server_message.count() == 1 )
	assert ( to_client_message.count() == 2 )
	assert ( dh.getBreakpoints().count() == 1 )
	assert ( to_client_message.top()['fulldata'] == 'Content-Length: 85\r\n\r\n{"seq":2,"request_seq":1,"type":"response","command":"setbreakpoint","success":false}' )
	
	dh.onClientConnected()
	assert ( to_client_message.count() == 0 )
	assert ( dh.getBreakpoints().count() == 0 )
	assert ( to_server_message.count() == 1 )
	assert ( to_server_message.top()['data'] == '{"seq":-1,"type":"request","command":"connect"}' )
	assert ( to_server_message.top()['datalen'] == len( to_server_message.top()['data'] ) )
	assert ( to_server_message.top()['pkghead'] == 'Content-Length: 47\r\n\r\n' )
	assert ( to_server_message.top()['headok'] == True )
	assert ( to_server_message.top()['dataok'] == True )
	assert ( to_server_message.top()['sendpos'] == 0 )
	assert ( to_server_message.top()['fulldata'] == 'Content-Length: 47\r\n\r\n{"seq":-1,"type":"request","command":"connect"}' )
	
	breakpoints = 'Content-Length: 85\r\n\r\n{"seq":1,"request_seq":1,"type":"response","command":"setbreakpoint","success":false}'
	dh.onRectFromMainServer(breakpoints)
	assert ( to_client_message.count() == 1 )
	assert ( to_client_message.top()['fulldata'] == breakpoints ), 'reset server to client seq'
	
def test_DebugCommandHandler_onClientDisconnected():
	to_server_message = vs_tool_agent.SimpleQueue()
	to_client_message = vs_tool_agent.SimpleQueue()
	dh = vs_tool_agent.DebugCommandHandler(to_server_message, to_client_message)
	
	breakpoints = 'Content-Length: 116\r\n\r\n{"command":"setbreakpoint","seq":1,"type":"request","arguments":{"line":4,"column":0,"type":"scriptId","target":33}}'
	dh.onRectFromClient(breakpoints)
	assert ( to_server_message.count() == 1 )
	assert ( dh.getBreakpoints().count() == 1 )
	
	breakpoints = 'Content-Length: 84\r\n\r\n{"seq":1,"request_seq":1,"type":"response","command":"setbreakpoint","success":true}'
	dh.onRectFromMainServer(breakpoints)
	assert ( to_server_message.count() == 1 )
	assert ( to_client_message.count() == 1 )
	assert ( dh.getBreakpoints().count() == 1 )
	
	dh.onClientDisconnected()
	assert ( to_client_message.count() == 0 )
	assert ( dh.getBreakpoints().count() == 0 )
	assert ( to_server_message.count() == 1 )
	assert ( to_server_message.top()['fulldata'] == 'Content-Length: 50\r\n\r\n{"seq":-1,"type":"request","command":"disconnect"}' )
	
def test_DebugCommandHandler_onConnectedMainServer():
	pass
	'''
	assert ( False, 'clear client to server messagequeue' )
	assert ( False, 'send connect server' )
	assert ( False, 'send dh.getBreakpoints() cmd to main server' )
	assert ( False, 'onDisconnectedFromMainServer onConnectedMainServer onRectFromMainServer filter already send to client request_seq pkg' )
	assert ( False, 'when main server find agent server connected, and recv connect cmd, attach debug' )
	'''
	
def test_DebugCommandHandler_onDisconnectedFromMainServer():
	to_server_message = vs_tool_agent.SimpleQueue()
	to_client_message = vs_tool_agent.SimpleQueue()
	dh = vs_tool_agent.DebugCommandHandler(to_server_message, to_client_message)
	
	breakpoints = 'Content-Length: 116\r\n\r\n{"command":"setbreakpoint","seq":1,"type":"request","arguments":{"line":4,"column":0,"type":"scriptId","target":33}}'
	dh.onRectFromClient(breakpoints)
	
	breakpoints = 'Content-Length: 84\r\n\r\n{"seq":1,"request_seq":2,"type":"response","command":"setbreakpoint","success":true}'
	dh.onRectFromMainServer(breakpoints)
	
	assert ( to_server_message.count() == 1 )
	assert ( to_client_message.count() == 1 )
	assert ( dh.getBreakpoints().count() == 1 )
	
	dh.onDisconnectedFromMainServer()
	assert ( to_server_message.count() == 0 )
	assert ( dh.getBreakpoints().count() == 1 )

	assert ( to_client_message.count() == 1 )	
	continues = '{"seq":2,"type":"event","event":"break","body":{"invocationText":"","sourceLine":0,"sourceColumn":0,"sourceLineText":"","script":{"id":0,"name":"","lineOffset":0,"columnOffset":0,"lineCount":0},"breakpoints":[]}}'
	assert ( to_client_message.top()['fulldata'] == 'Content-Length: 212\r\n\r\n' + continues)

	breakevents = 'Content-Length: 214\r\n\r\n{"seq":20,"type":"event","event":"break","body":{"invocationText":"","sourceLine":0,"sourceColumn":0,"sourceLineText":"","script":{"id":0,"name":"","lineOffset":0,"columnOffset":0,"lineCount":0},"breakpoints":[2]}}'	
	expectbreakevents_head = 'Content-Length: 213\r\n\r\n'	
	expectbreakevents_data = '{"seq":3,"type":"event","event":"break","body":{"invocationText":"","sourceLine":0,"sourceColumn":0,"sourceLineText":"","script":{"id":0,"name":"","lineOffset":0,"columnOffset":0,"lineCount":0},"breakpoints":[2]}}'	
	dh.onRectFromMainServer(breakevents) 
	assert ( to_client_message.count() == 2 )
	# not clear server seq
	assert ( to_client_message.top()['fulldata'] == expectbreakevents_head + expectbreakevents_data)
	assert ( to_client_message.top()['pkghead'] == expectbreakevents_head)
	assert ( to_client_message.top()['data'] == expectbreakevents_data)
	assert ( to_client_message.top()['datalen'] == 213)
	
	assert ( False, 'save allready send to client request_seq for filter' ) # ----
	assert ( False, 'when main server find agent server disconnected, clear all debug breakpoints, and continue , and unattach' )
	
def test_():
	TimeoutSocket = MockTimeoutSocket
	
	
if __name__ == '__main__':
	test_SimpleQueue()
	test_DebugCommandHandler_onRectFromMainServer()
	test_DebugCommandHandler_onRectFromClient()
	test_DebugCommandHandler_onClientConnected()
	test_DebugCommandHandler_onClientDisconnected()
	test_DebugCommandHandler_onConnectedMainServer()
	test_DebugCommandHandler_onDisconnectedFromMainServer()
	print 'test cases all passed!'