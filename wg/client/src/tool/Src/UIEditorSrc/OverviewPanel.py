#-*-coding:utf-8-*- 
import sys,os
import wx
import wx.lib.iewin as iewin
from MyShapePrint import *

page_html_p = r'''
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>ui edit</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<script language="JavaScript">
G_ID_ASCCOMP = function(a, b){return a.id - b.id;};
</script>

<script language="JavaScript">
  setlogtime=function(){};log=function(msg){};profile=function(flag,key){};
</script>

<script language="JavaScript">
image_base_url='./images/';
</script>

<script src="./js/jclass.js" type="text/javascript"></script>
<script src="./js/caller.js" type="text/javascript"></script>
<script src="./js/globalvar.js" type="text/javascript"></script>
<script src="./js/loader.js" type="text/javascript"></script>
$<scriptlist>
<link rel="stylesheet" type="text/css" href="./css/style_layers.css" />
<link rel="stylesheet" type="text/css" href="./css/gameui.css" />
<link rel="stylesheet" type="text/css" href="./css/game.css" />
</head>
<body>
 
<div id="size_div" name="size_div" class="size_div"></div>
<div id="scrollbar_div" name="scrollbar_div" class="scrollbar_div"><div class="scrollbar_div_con"></div></div>
<div id="g_body" class="g_body" ondragstart="return false;"></div>

<script language="JavaScript">
var PreGlobalPub = JClass.ex({
	_init : function(){
		this._windowResizer = WindowResizer.snew(this);
		this._imgr = null;
		this._gui = new UI(this);
	}
	,getImgr: function(){
		return this._imgr;
	}
	,getGUI: function(){
		return this._gui;
	}
	,getWinSizer: function(){
		return this._windowResizer;
	}
	,regEvent: function(eid, sid, self, fun) {
	}
	,sendEvent : function(e) {
	}
	,pendEvent : function(e) {
	}
	,regUpdater : function(self, fun, intervalMs, notImmUpdate) {
	}
	,unregUpdater : function(self, fun){
	}
});
var global_pub = PreGlobalPub.snew();
var UIPreViewDlg = JBaseDlg.ex({
	_getDlgCfg : function(){
		return {modal:true, title:'no title', pos:{x:0, y:0}, uicfg:$<dlg>};
	}
});
UIPreViewDlg.snew(global_pub).openDlg();
</script>
</body>
</html>
'''
		
class OverviewPanel(wx.Panel):
	def __init__(self, parent, divsTree, shapeEditor):
		wx.Panel.__init__(self, parent, size=(1,1))
		sizer = wx.BoxSizer(wx.VERTICAL)
		self.browser = iewin.IEHtmlWindow(self)
		sizer.Add(self.browser, 1, wx.EXPAND, 10)
		self.SetSizer(sizer)
		self.divsTree = divsTree
		self.shapeEditor = shapeEditor
		
	def LoadedDlgCfg(self):
		self.PreView()
		
	def PreView(self):
		currentContent = self.GetCurrentContentString()
		filename = self.divsTree.GetFileName()
		if filename == '' or currentContent == '':
			self.browser.LoadString("")
			return
		
		path = (os.path.abspath( os.path.dirname(filename) + '/../../')).replace('\\', '/')
		filename = 'uiedit.html'
		self.CreatePreHtml(path, filename, currentContent)
		self.browser.LoadUrl("file:///" + path + '/' +filename, iewin.NAV_NoHistory | iewin.NAV_NoReadFromCache | iewin.NAV_NoWriteToCache)
	
	def CreatePreHtml(self, path, filename, currentContent):
		scriptlist = ''
		list = self.LoadJsFilesList(path + '/js/scriptlists_uiedit.js')
		for item in list:
			scriptlist = scriptlist + '<script src="./%s" type="text/javascript"></script>\n'%item
		page_html = page_html_p.replace('$<scriptlist>', scriptlist).replace('$<dlg>', currentContent)
		
		f = open(path + '/' + filename, 'w')
		f.write(page_html)
		f.close()
		
	def LoadJsFilesList(self, jsFile):
		f = open(jsFile, 'r')
		s = f.read()
		f.close()
		
		s = s.replace('//', '#');
		ggc = {}
		llc = {}
		exec s in ggc, llc
		return llc.get('g_scriptlists')
		
	def GetCurrentContentString(self):
		c = self.GetCurrentContent()
		if c == None:
			return ''
		myPrint = MyPrint()
		myPrint.Print(None, c)
		s = myPrint.getClientStr()
		return s
		
	def GetCurrentContent(self):
		shape = self.shapeEditor.GetCurEditShape();
		if shape == None :
			return None
			
		outcfg = {}
		shape.WriteToConfig(outcfg)
		pydata = self.divsTree.GetItemPyData(shape.GetItem())
		if pydata['type'] != 1 :  # is not content
			return None
			
		return {'c_':outcfg}
