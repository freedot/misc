# -*- coding:cp936 -*-
import sys, codecs, re, os
reload(sys)
sys.setdefaultencoding('utf-8')

class FileUtil:
	@staticmethod
	def findFiles(basepath, ext=''):
		rfiles = []
		for root, dirs, files in os.walk(basepath):
			for file in files:
				if ext != '' and re.search(r'\.' + ext + r'$', file) == None: continue
				rfiles.append(root + os.sep + file)
		return rfiles
	@staticmethod
	def ReadFileLines(filePath,encoding="utf_8_sig"):
		try:
			with codecs.open(filePath,"r",encoding) as f:
				return f.read().split('\n')
		except:
			with codecs.open(filePath,"r","gbk") as f:
				return f.read().split('\n')
	@staticmethod
	def WriteFile(filePath,u,encoding="utf_8_sig"):
		with codecs.open(filePath,"w",encoding) as f:
			f.write(u)

class Checker:
	patt_c =  re.compile(r'[^:\.\w]{1}(\w+)\s*\(')
	patt_c1 =  re.compile(r'\s*function\s*(\w+)\s*\(')
	def check(self, line):
		pass
		
cnt = 0
class SingleCallChecker(Checker):
	def check(self, line):
		funname = ''
		m = Checker.patt_c.search(line)
		if m == None:  
			return 
		funname = m.group(1).strip(' \t')
		if self._check(line, funname) :
			return
				
		global cnt
		cnt = cnt + 1
		
		print line
		
	def _check(self, line, funname):
		if funname == 'for' \
			or funname == 'if' \
			or funname == 'elseif' \
			or funname == 'return' \
			or funname == 'function' \
			or funname == 'getLastErrorStr' \
			or funname == 'getmetatable' \
			or funname == 'ipairs' \
			or funname == 'assertEQ' \
			or funname == 'getLastSql_t' \
			or funname == 'isNotInclude' \
			or funname == 'clearLastSql_t' \
			or funname == 'getSendMsgCnt_t' \
			or funname == 'LOG' \
			or funname == 'assert' \
			or funname == 'assertListEQ' \
			or funname == 'toJIONString' \
			or funname == 'type' \
			or funname == 'getSendMsg_t' \
			or funname == 'assertFloatEQ' \
			or funname == 'getSql_t' \
			or funname == 'GET_LOG' \
			or funname == 'tostring' \
			or funname == 'Studios' \
			or funname == 'assertListEQ' \
			or funname == 'toLUAString' \
			or funname == 'Copyright' \
			or funname == 'print' \
			or funname == 'clearSendMsg_t' \
			or funname == 'error' \
			or funname == 'assertStrRepeatCount' \
			or funname == 'unpack' \
			or funname == 'setmetatable' \
			or funname == 'Brown' \
			or funname == 'tonumber' \
			or funname == 'dofile' \
			or funname == 'loadstring' \
			or funname == 'chars' \
			or funname == 'log' \
			or funname == 'pairs' \
			or funname == 'new' \
			or funname == 'NewEID' \
			or funname == 'eval' \
			or funname == 'setLastError' \
			or funname == 'getLastError' \
			or funname == 'setLastErrorStr' \
			or funname == 'getLastErrorStr' \
			or funname == 'RawItemEx' \
			or funname == 'PPrintTable' \
			or funname == 'myclass' \
			or funname == 'myclass' \
			or funname == 'LuaItemEx' \
			or funname == 'IsDebug' \
			or funname == 'and' \
			or funname == 'rinit' \
			or funname == 'MapCppSet' \
			or funname == 'floatEQ' \
			or funname == 'while' \
			or funname == 'or' \
			or funname == 'LOGEX' \
			or funname == '__toCommString' \
			or funname[-7:] == '_t_main' \
			or funname[0:4] == 'res_' \
			or funname == 'require' :
			return True
			
		m = Checker.patt_c1.match(line)
		if m != None:
			return True
			
		return False
			
class Parser:
	def __init__(self):
		self.handlers = [
			SingleCallChecker()
		]
		
	def parse(self, file):
		global cnt
		lastcnt = cnt
		lines = FileUtil.ReadFileLines(file)
		for line in lines:
			for hander in self.handlers:
				hander.check(line)
		return cnt > lastcnt

def main():
	exsfiles = {
		r'E:\MyWork\TqGame\trunk\data\script\json.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\math_ex.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\root.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\serverStartChecker.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\sleep.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\string_ex.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\timer.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqActivityValHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqActTerraceHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqActTowerHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqActTowerRank.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqAllianceHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqAlliances.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqArmyCampActorsGetter.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqArmyContainer.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqArmyMgr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqArmyPlayerGetter.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqAutoBuildsHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqBaseCmdHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqBlueDiamondHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqBriefPlayer.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqBuildResHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCampActorInfoSetterForDebug.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCDKeyHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqChatHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCityDefHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCityManager.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqClientCfgHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCltLogHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCollector.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCreateRoleHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqDBConn.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqDealResult32WanHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqCampActorInfoSetterForDebug.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqEffector.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqExchangeHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqExpeditionTimerHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqExpend.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFarmResHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFieldCollector.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFieldHeroMgr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFieldLevelRefresher.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFieldPlayer.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFightHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFightRefStateHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFightResult.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFightStateRepository.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqFriendHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqGameApp.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqGameRoot.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqGMHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqHero.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqHeroAttrHelper.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqHeroResHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqHeroWear.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqItemHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqItemOpHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqMailMgr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqMilitaryHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqNewcomerHelperHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqOpenSvrAct.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqOsGmHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqOtherPlayerInfoHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqOutFieldHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqOwnerFieldPlayer.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqPaymentHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqPkgHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqPlayerPackage.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqPlayers.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqPlayerTask.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqResultBuyHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqRoleBaseHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqRoleStateHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqSelfFieldHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqSendRewardHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqServerActEffect.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqShopHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqState.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqStateCityHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqXmlAssist.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqGuiAssist.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqSearch.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqReadXmlAssist.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqLoadTqFontConfig.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqLoadFontConfig.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqLoadSkins.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqHandleGuiRes.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\testunit.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqDesktop.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqNetPkg.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqBaseClass.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqClassLex.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqClass_test.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqUtil.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\com\tqRequireEx.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqTaskHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqWorldBossDlgHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqYellowDiamondHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqWUtil.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqTradingAreaHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqTaskFinisher.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqTowerHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqTimerHdr.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqTowerPlayer.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqUseItemHandler.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqUtfString.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqTradingArea.lua':True
		,r'E:\MyWork\TqGame\trunk\data\script\tqStrategyHandler.lua':True
	}
	files = FileUtil.findFiles(r'E:\MyWork\TqGame\trunk\data\script', 'lua')
	for fname in files:
		tsfile = fname
		if fname[-6:] !=  '_t.lua' and not exsfiles.get(fname, False)  :
			if Parser().parse(fname) :
				print fname
	print 'complele! fotal file:', len(files), cnt
	
def test():
	Parser().parse(r'.\test.lua')
			
if __name__ == '__main__':
	main()
	#test()