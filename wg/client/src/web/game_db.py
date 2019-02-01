# -*- coding: utf-8 -*-
import MySQLdb

g_dbs = {
	'1' : {'host':'127.0.0.1', 'port':3306, 'user':'root', 'passwd':'123', 'db':'zone00001'}
}


class GameDB:
	def __init__(self):
		self._canUse = False
		
	def connect(self, serverId):
		db = g_dbs[ str(serverId) ]
		self._conn = MySQLdb.connect(host=db['host'], port=db['port'], user=db['user'], passwd=db['passwd'], db=db['db'], charset='utf8')
		
	def close(self):
		self._conn.close()
		
	def createGuestUser(self):
		guestUser = '*Guest*%.11d'%(self._allocNewId())
		self._saveGuestToDB(guestUser)
		return guestUser
		
	def getMapName(self, userName):
		if self._canUse :
			guestName = userName
			cur = self._conn.cursor()
			n=cur.execute("select guestName from guestsmap where userName='%s';"%(userName))  
			row = cur.fetchone()
			if row != None: guestName = row[0].encode('utf-8')
			return guestName
		else:
			return userName
		
	def isBinded(self, user):
		cur=self._conn.cursor()  
		n=cur.execute("select * from guestsmap where userName='%s';"%(user) )  
		row = cur.fetchone()
		return row != None
		
	def isInGame(self, user):
		cur=self._conn.cursor()  
		n=cur.execute("select id from roles where uname='%s';"%(user) )  
		row = cur.fetchone()
		return row != None
		
	def isGuestExit(self, guest):
		cur=self._conn.cursor()  
		n=cur.execute("select id from guests where guestName='%s';"%(guest) )  
		row = cur.fetchone()
		return row != None
		
	def bindGuestName(self, user, guest):
		self._deleteGuest(guest)
		self._bind(user, guest)
		
	def _allocNewId(self):
		cur=self._conn.cursor()  
		n=cur.execute("select id from guests order by id desc limit 1;")  
		row = cur.fetchone()
		id = 1
		if row != None : id = row[0] + 1
		return id
		
	def _saveGuestToDB(self, guestUser):
		cur = self._conn.cursor()  
		cur.execute("insert into guests value('', '" + guestUser + "');" )
		self._conn.commit()
		
	def _deleteGuest(self, guest):
		cur = self._conn.cursor()  
		cur.execute("delete from guests where guestName='%s';"%(guest) )
		self._conn.commit()
		
	def _bind(self, user, guest):
		cur = self._conn.cursor()  
		cur.execute("insert into guestsmap value('" + user + "', '" + guest + "');" )
		self._conn.commit()
