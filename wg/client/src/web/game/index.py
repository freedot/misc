# -*- coding: utf-8 -*-
import sys, os
sys.path.append(os.path.dirname(__file__))
sys.path.append(os.path.dirname(__file__) + r'/..')
import comm_config

html_res = {
'main_frame' : r'''
<!DOCTYPE html>
<html>
<head>
<title>...</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="custom.css" rel="stylesheet" type="text/css">
</head>
<body class="index">
  <div id="dlg-overlayer" style="opacity: 0.5; z-index: 198; position: absolute; width: 100%; height: 100px; top: 0px; left: 0px; background-color: rgb(0, 0, 0); display:none;"></div>
  <div class="wrapper">
    ${login}
    <div class="content clearfix">
      <div class="layout-m">
        <div class="layout-l"> <!-- 左边的面板 -->
          ${startgame}
          <a id="btnReSelect" class="btn-link btn-servers" href="''' + comm_config.bbs_res['newerhelp_url'] + '''" target="_top">新手指南</a>
          <a class="btn-link btn-cdkey" href="''' + comm_config.bbs_res['cdk_url'] + '''" target="_blank">CDK兑换</a>
          <a class="btn-link btn-xs" href="''' + comm_config.bbs_res['bbs_url'] + '''" target="_blank">玩家论坛</a>
          <a class="btn-link btn-wb" href="''' + comm_config.bbs_res['bug_url'] + '''" target="_blank">BUG建议</a>
        </div>

        <div class="layout-c">
          <div class="mod-news">
            <div id="tabs" class="tab" style="background:url(http://mat1.gtimg.com/gamezone/playgame/zl/images/btnhead.jpg)">  <!-- 公告顶部图片 -->
            </div> 
            <div id="boxes" class="boxes">
              <div>
                ${newslist}
              </div>
            </div>
          </div>

          <div class="mod-pic"> <!-- 底端的三张图片 -->
            ${piclist}
          </div>

        </div>
      </div>
      <div class="layout-r"> <!-- 右边的内容 -->
        ${act}
        ${enterplat}
      </div>
    </div>
  </div>
</body>
</html>
'''

,'login' : r'''
<div class="header">  <!-- 登录信息 -->
  <div class="qq-info">
    <div id="login-box" style="display: block;">
      <a href="javascript:openRegDlg();" style="width: 45px;">[注册]</a><a href="javascript:openLoginDlg();" style="width: 45px;">[登录]</a><span>${user}</span>
    </div>
  </div>
</div>
<script>
function openLoginDlg(){
	closeGuestSelectDlg();
	window.parent.openLoginDlg();
}
function openRegDlg(){
	closeGuestSelectDlg();
	window.parent.openRegDlg();
}
</script>
'''

,'logout' : r'''
<div class="header">  <!-- 登录信息 -->
  <div class="qq-info">
    <div id="logout-box" style="display: block;">
      <a target="_top" href="${plat_base_url}/logout.py?act=index">[退出]</a><span>${user}</span>
    </div>
  </div>
</div>
'''

,'startgame':r'''
<div class="btn-link start-box">
  <a class="btn-server btn-start" href="#" onclick="javascript:onClickStartGame()" id="startgame_btn"></a><!-- 开始游戏按钮 -->
  <div class="serverinfo">
  ${serverinfo}
  </div>
  <div id='serverlist' class='serverlist-panel'>
    <div class="lastservertitle" style="display:${show_serverlist_last};">最近登录</div>
    ${serverlist_last}
    <div class="pservertitle">推荐大区</div>
    ${serverlist_recommend}
    <div class="allservertitle">所有大区</div>
    ${serverlist_all}
  </div>  
</div>
<div class="dialog", id="guest-select-dlg">
<div class="guest-select-dlg">
  <div><a href="#" onclick="javascript:onEnterGame('startgame_btn2')" id="startgame_btn2">游客登录</a></div>
  <div><a href="#" onclick="javascript:openLoginDlg()" >登录</a></div>
  <div><a href="#" onclick="javascript:openRegDlg()" >注册</a></div>
</div>
</div>
<script>
var g_lastServerListShow = false;
function toggleServersList(){
	if (g_lastServerListShow ) {
		closeServersList();
		g_lastServerListShow = false;
	} else {
		openServersList();
	}
}

function openServersList(){
	var panel = document.getElementById('serverlist');
	panel.style.display = 'block';
}

function closeServersList(){
	var panel = document.getElementById('serverlist');
	panel.style.display = 'none';
}
closeServersList();

function enterServerItem(elem){
	elem.className = 'item-hot';
}

function outServerItem(elem){
	elem.className = 'item';
}

var g_serverId = '${lastserverid}';
var g_isguest = ${isguest};
function onSelectServer(serverId){
	closeServersList();
	g_serverId = serverId;
	setServerItem('', serverId);
}

function setServerItem(itemFlag, serverId){
	var svrInfo = findServerInfoById(serverId);
	if ( svrInfo == null ) return;
	
	var flags = [];
	if ( svrInfo.fulflag ) flags.splice(0, 0, 'flag_full'); 
	if ( svrInfo.recommendflag ) flags.splice(0, 0, 'flag_recommend'); 
	if ( svrInfo.newflag ) flags.splice(0, 0, 'flag_new'); 
	for ( var i=0; i<3; ++i ) {
		document.getElementById('svr' + itemFlag + '_flag_' + (i+1) ).className = flags[i] ? flags[i] : 'flag_empty';
	}
	var states = ['state_gray', 'state_green', 'state_yellow', 'state_red'];
	document.getElementById('svr' + itemFlag + '_state').className = states[svrInfo.state];
	document.getElementById('svr' + itemFlag + '_name').innerHTML = svrInfo.name;
}
setServerItem('', g_serverId);

function findServerInfoById(serverId){
	var svrlist = getAllServerList();
	for ( var i=0; i<svrlist.length; ++i ) {
		var svr = svrlist[i];
		if ( svr.id == parseInt(serverId) ) return svr;
	}
	return null;
}

function onClickStartGame(){
	if ( g_isguest ) {
		openGuestSelectDlg();
	} else {
		onEnterGame('startgame_btn');
	}
	return false;
}

function openGuestSelectDlg(){
	var dlg = document.getElementById('guest-select-dlg');
	dlg.style.display = 'block';
	var overlayer = document.getElementById('dlg-overlayer');
	overlayer.style.display = 'block';
	overlayer.style.height = document.body.scrollHeight + 'px';
}

function closeGuestSelectDlg(){
	var dlg = document.getElementById('guest-select-dlg');
	dlg.style.display = 'none';
	var overlayer = document.getElementById('dlg-overlayer');
	overlayer.style.display = 'none';
}
closeGuestSelectDlg();

function onEnterGame(btnId){
	closeGuestSelectDlg();
	var url = "${startgameurl}" + "&serverid=" + g_serverId;
	document.getElementById(btnId).href = url;
	document.getElementById(btnId).target = '_blank';
	return false;
}

function getAllServerList(){
	return ${allservers};
}

function isServerListShow(){
	var panel = document.getElementById('serverlist');
	return panel.style.display == 'block';
}

document.onclick = function(){
	g_lastServerListShow = isServerListShow();
	closeServersList();
};
</script>
'''

,'entergame':r'../game/login.py?data=${data}'

,'serverinfo' : r'''
<div class="space_left"></div>
<div id="svr_flag_3" class="flag_empty"></div><!-- 推荐标志 -->
<div class="space_mid"></div>
<div id="svr_flag_2" class="flag_full"></div><!-- 推荐标志 -->
<div class="space_mid"></div>
<div id="svr_flag_1" class="flag_new"></div><!-- 新服标志 -->
<div class="space_mid"></div>
<div id="svr_state" class="state_yellow"></div><!-- 是否顺畅 -->
<div class="space_mid"></div>
<div id="svr_name" class="name">name</div><!-- 大区名 -->
<div class="space_mid"></div>
<div class="dropbtn"><a href="javascript:toggleServersList()">选择区</a></div>
'''

,'serverlistitemrow' : r'''
<div class="serverinfo item-line">
  ${serverlistitem1}
  <div class="space_mid"></div>
  ${serverlistitem2}
</div>
'''

,'serverlistitem' : r'''
  <div class="item" onclick="javascript:onSelectServer('${serverId}');" onmouseover="javascript:enterServerItem(this);" onmouseout="javascript:outServerItem(this);" >
    <div class="${flag_3}"></div><!-- 推荐标志 -->
    <div class="space_mid"></div>
    <div class="${flag_2}"></div><!-- 推荐标志 -->
    <div class="space_mid"></div>
    <div class="${flag_1}"></div><!-- 新服标志 -->
    <div class="space_mid"></div>
    <div class="${state}"></div><!-- 是否顺畅 -->
    <div class="space_mid"></div>
    <div class="name">${name}</div><!-- 大区名 -->  
  </div>
'''

,'newslist' : r'''
<div style="padding-left:10px;padding-top:25px;" class="sc" id="content_list">
  <table width="95%" border="0" cellpadding="0" cellspacing="0">
   ${newslistitems}
  </table>
</div>
'''

,'newslistitem' : r'''
<tr>
  <td width="15"></td>
  <td height="24" style="padding-left:3px"><a target="_blank" href="${href}">${title}</a></td>
  <td width="60" align="left" style="color:#FAC26F; font-size:12px;">${date}</td>
</tr>
'''

,'piclist' : r'''
<a class="first" href="''' + comm_config.bbs_res['help_url'] + '''" target="_blank"><img src="./images/p1.jpg" width="148" height="146" alt="'''+ comm_config.gamename + '''游戏介绍"></a> 
<a href="''' + comm_config.bbs_res['guide_url'] + '''" target="_blank"><img src="./images/guide.jpg" width="148" height="146" alt="新手指南高手进阶"></a> 
<a href="''' + comm_config.bbs_res['cs_url'] + '''" target="_blank"><img src="./images/fuli.jpg" width="148" height="146" alt="玩家投诉"></a>
'''

,'act' : r'''
<div class="mod-act">
  <div class="t"></div>
  <div class="c">活动公告</div>
  <div class="f">  <!-- 领取礼包按钮 -->
  查看详情
  </div>
</div>
'''

,'enterplat' : r'''
<div class="mod-act">
  <div class="f">
    <a href="${plat_base_url}/index.py" target="_blank" class="btn-iwan"></a>
  </div>
</div>
'''
}

#-----------------------------------------------------------------------------------------------------------------------#
from mod_python import util
import re,md5,time
import math
import pprint
import db
from mybase64 import *
from register import *

Register.reg('ServerDirDB', db.ServerDirDB())
Register.reg('LastLoginDB', db.LastLoginDB())
Register.reg('NewsDB', db.NewsDB())

class ServerList:
	def __init__(self, user):
		self._user = user
	
	def getLastServers(self):
		Register.get('LastLoginDB').connect()
		ids = Register.get('LastLoginDB').getLastServerIds(self._user)
		Register.get('LastLoginDB').close()
		
		Register.get('ServerDirDB').connect()
		results = Register.get('ServerDirDB').selectServersByIds(ids)
		list = self._makeServerList(results)
		Register.get('ServerDirDB').close()
		return list
		
	def getRecommendServers(self):
		Register.get('ServerDirDB').connect()
		results = Register.get('ServerDirDB').selectRecommendServers()
		list = self._makeServerList(results)
		Register.get('ServerDirDB').close()
		return list
		
	def getAllServers(self):
		Register.get('ServerDirDB').connect()
		results = Register.get('ServerDirDB').selectAllServers()
		list = self._makeServerList(results)
		Register.get('ServerDirDB').close()
		return list
		
	def _makeServerList(self, results):
		list = []
		for row in results:    
			list.append({'id':str(row[0]), 'name':row[1].encode('utf-8'), 'state':int(row[2]), 'recommendflag':int(row[3]), 'fulflag':int(row[4]), 'newflag':int(row[5])})
		return list
		
class NewsList:
	def getNewsList(self):
		Register.get('NewsDB').connect()
		results = Register.get('NewsDB').getNewsList()
		list = self._makeList(results)
		Register.get('NewsDB').close()
		return list
		
	def _makeList(self, results):
		list = []
		for row in results:
			list.append({'url':comm_config.bbs_res['base_url']+'?mod=viewthread&tid=' + str(row[0]), 'title':row[1], 'time':row[2]})
		return list
		
class ServerListHtmlMaker:
	def make(self, user, html):
		self._serverList = ServerList(user)
		html = html.replace('${lastserverid}', self._getLastServerId())
		html = html.replace('${allservers}', pprint.pformat(self._serverList.getAllServers()) )
		html = self._makeLastServers(html)
		html = self._makeRecommendServers(html)
		html = self._makeAllServers(html)
		return html
		
	def _getLastServerId(self):
		servers = self._serverList.getLastServers()
		if len(servers) > 0 : 
			return servers[0]['id']
		
		servers = self._serverList.getRecommendServers()
		if len(servers) > 0 : 
			return servers[0]['id']
		
		return '1'
		
	def _makeLastServers(self, html):
		return self._makeServers(html, self._serverList.getLastServers(), '${serverlist_last}', '${show_serverlist_last}')
		
	def _makeRecommendServers(self, html):
		return self._makeServers(html, self._serverList.getRecommendServers(), '${serverlist_recommend}', '')
		
	def _makeAllServers(self, html):
		return self._makeServers(html, self._serverList.getAllServers(), '${serverlist_all}', '')
		
	def _makeServers(self, html, servers, tmpl, showOrHideTitle):
		cols = 2
		rows = int ( math.ceil(len(servers)/float(cols)) )
		serverlist = ''
		for row in range( rows ):
			serverlistitemrow = html_res['serverlistitemrow']
			for col in range(cols):
				index = row*cols + col
				if index >= len(servers) : 
					serverlistitemrow = serverlistitemrow.replace('${serverlistitem' + str(col + 1)+'}', '')
					break
				serveritem = self._makeServerItem(servers[index])
				serverlistitemrow = serverlistitemrow.replace('${serverlistitem' + str(col + 1)+'}', serveritem)
			serverlist = serverlist + serverlistitemrow
		if showOrHideTitle != '':
			if serverlist == '' :
				html = html.replace(showOrHideTitle, 'none')
			else:
				html = html.replace(showOrHideTitle, 'block')
		return html.replace(tmpl, serverlist)
		
	def _makeServerItem(self, server):
		serveritem = html_res['serverlistitem'].replace('${serverId}', server['id'])
		serveritem = self._makeItemFlag(serveritem, server)
		states = ['state_gray', 'state_green', 'state_yellow', 'state_red']
		serveritem = serveritem.replace('${state}', states[server['state']])
		serveritem = serveritem.replace('${name}', server['name'])
		return serveritem
		
	def _makeItemFlag(self, serveritem, server):
		flags = []
		if server['fulflag'] == 1 : flags.insert(0, 'flag_full'); 
		if server['recommendflag'] == 1 : flags.insert(0, 'flag_recommend'); 
		if server['newflag'] == 1 : flags.insert(0, 'flag_new'); 
		for i in range(3):
			if i >= len(flags):
				serveritem = serveritem.replace('${flag_' + str(i+1) + '}', 'flag_empty')
			else:
				serveritem = serveritem.replace('${flag_' + str(i+1) + '}', flags[i])
		return serveritem
		
class NewsHtmlMaker:
	def make(self, html):
		self._newsList = NewsList()
		html = html.replace('${newslist}', html_res['newslist'].replace('${newslistitems}', self._makeNewsList()) )
		return html
		
	def _makeNewsList(self):
		return self._makeList(self._newsList.getNewsList(), 'newslistitem', True)

	def _makeList(self, newsList, tmpl, hasDate):
		lists = ''
		for news in newsList:
			item = html_res[tmpl].replace('${href}', news['url'] )
			item = item.replace('${title}', news['title'])
			if hasDate : item = item.replace('${date}', time.strftime("%m月%d日", time.localtime(news['time'])))
			lists = lists + item
		return lists
		
class ActHtmlMaker:
	def make(self, html):
		return html.replace('${act}', html_res['act'] )

class HtmlPrinter:
	def __init__(self, session):
		self._session = session
		self._guest = '*Guest*'
		self._serverList = None
	
	def printHtml(self):
		self._session.getReq().content_type = 'text/html;charset=UTF-8;'
		html = html_res['main_frame'].replace('${login}', self._makeLogin())
		html = html.replace('${startgame}', self._makeStartUrl())
		html = self._makeNewsList(html)
		html = self._makeActList(html)
		html = html.replace('${piclist}', html_res['piclist'])
		html = html.replace('${enterplat}', html_res['enterplat'])
		
		html = html.replace('${plat_base_url}', comm_config.plat_base_url)
		self._session.getReq().write(html)
		
	def _makeLogin(self):
		tmpl = html_res['logout']
		if self._isGuest() :
			tmpl = html_res['login'];
		return tmpl.replace('${user}', self._session.getUser())
		
	def _makeStartUrl(self):
		stime = str(int(time.time()))
		isadult = '1'
		s = self._session.getUser() + isadult + stime + comm_config.keys['game']
		flag = md5.new(s).hexdigest().lower()
		data = "username=%s&time=%s&isadult=%s&flag=%s"%(self._session.getUser(), stime, isadult, flag)
		entergame = html_res['entergame'].replace('${data}', safe_b64encode(data))
		html = html_res['startgame'].replace( '${startgameurl}', entergame)
		
		html = html.replace('${serverinfo}', html_res['serverinfo'])
		html = ServerListHtmlMaker().make(self._session.getUser(), html)
		if self._isGuest() :
			html = html.replace('${isguest}', 'true')
		else:
			html = html.replace('${isguest}', 'false')
		return html
		
	def _makeNewsList(self, html):
		return NewsHtmlMaker().make(html)
		
	def _makeActList(self, html):
		return ActHtmlMaker().make(html)
		
	def _isGuest(self):
		return self._guest == self._session.getUser()
	
class MySession:
	def __init__(self, req):
		self._req = req
		self._req.add_common_vars()
		self._htmlPrinter = HtmlPrinter(self)
		
	def handle(self):
		if not self._parseArgs() :
			return 'error code : 1001'
			
		if not self._checkValid():
			return 'error code : 1002'
			
		self._htmlPrinter.printHtml()
		return ''
		
	def getReq(self):
		return self._req
		
	def getUser(self):
		return self._user
		
	def _parseArgs(self):
		fields = util.FieldStorage(self._req)
		self._user = str(fields.getfirst('user', ''))
		self._stamp = str(fields.getfirst('stamp', ''))
		try:
			self._stampTime = int(self._stamp)
		except Exception, e:
			self._stampTime = 0
		self._sign = str(fields.getfirst('sign', ''))
		return True
		
	def _checkValid(self):
		s = self._user + self._stamp + comm_config.keys['game']
		sign = md5.new(s).hexdigest().lower()
		if time.time() - self._stampTime > 30*60 :
			return False
		return self._sign == sign
	
def index(req):
	return MySession(req).handle()
