#-*- coding:utf-8 -*-  
import threading
import daemon
from GameSvrServer import *
from AssistServer import *
from qqsdk import *
import config
from G import *

class GameSvrServerThread(threading.Thread):
	def run(self):
		print '  start game server'
		G.getGameServer().serve_forever()
		
class AssistThread(threading.Thread):
	def run(self):
		print '  start assist server'
		openApi = OpenAPIV3(config.appId, decrypt(config.appKey, config.commKey), config.qqIpLists)
		G.getAssistServer().setOpenApi(openApi)
		G.getAssistServer().serve_forever()
		
class ProxySvr:
	def _createServers(self):
		G.setGameServer(GameSvrServer(config.gameServerAddr))
		G.setAssistServer(AssistServer())
	
	def start(self):
		print 'start proxy server ... '
		self._createServers()
		GameSvrServerThread().start()
		AssistThread().start()
		
if __name__ == '__main__':
	daemon.createDaemon()
	ProxySvr().start()
