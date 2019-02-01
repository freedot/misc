#-*-coding:utf-8-*- 
import wx
import pprint
import os
import codecs
import time
from MyShapePrint import *
wildcard2 = "Js (*.js)|*.js|"

__last_profiler_time = 0
def profiler ( msg ):
	global __last_profiler_time
	if __last_profiler_time == 0 :
		__last_profiler_time = time.time()
	print '%s [%f]'%(msg, time.time() - __last_profiler_time)
	__last_profiler_time = time.time()
	

def MyPrint_Check( d, sout ):
	if type(d) == DICT_TYPE :
		sout.write('{')
		comma = ''
		for k in d :
			sout.write(comma)
			sout.write('\''+k+'\':')
			MyPrint_Check(d.get(k), sout)
			comma = ','
		sout.write('}')
	elif type(d) == LIST_TYPE :
		sout.write('[')
		comma = ''
		for k in d :
			sout.write(comma)
			MyPrint_Check(k, sout)
			comma = ','
		sout.write(']')
	elif type(d) == STR_TYPE or type(d) == USTR_TYPE:
		sout.write('\''+d+'\'')
	elif type(d) == INT_TYPE :
		sout.write(str(d))
	elif type(d) == FLOAT_TYPE :
		sout.write('%.4f'%(d))


class NewItemDialog(wx.Dialog):
	def __init__(
		self, parent, ID, title, size=wx.DefaultSize, pos=wx.DefaultPosition, 
		style=wx.DEFAULT_DIALOG_STYLE,
		useMetal=False,
		):

		pre = wx.PreDialog()
		pre.SetExtraStyle(wx.DIALOG_EX_CONTEXTHELP)
		pre.Create(parent, ID, title, pos, size, style)
		self.PostCreate(pre)

		if 'wxMac' in wx.PlatformInfo and useMetal:
			self.SetExtraStyle(wx.DIALOG_EX_METAL)

		sizer = wx.BoxSizer(wx.VERTICAL)

		label = wx.StaticText(self, -1, "Add new item")
		sizer.Add(label, 0, wx.ALIGN_CENTRE|wx.ALL, 5)

		box = wx.BoxSizer(wx.HORIZONTAL)

		label = wx.StaticText(self, -1, "name:")
		box.Add(label, 0, wx.ALIGN_CENTRE|wx.ALL, 5)

		self.text = wx.TextCtrl(self, -1, "", size=(80,-1))
		box.Add(self.text, 1, wx.ALIGN_CENTRE|wx.ALL, 5)

		sizer.Add(box, 0, wx.GROW|wx.ALIGN_CENTER_VERTICAL|wx.ALL, 5)
		
		radioList = ['common', 'content', 'template', 'templateitem']
		self.typerb = wx.RadioBox(
			self, -1, "select item type", wx.DefaultPosition, wx.DefaultSize,
			radioList, 4, wx.RA_SPECIFY_COLS
			)

		self.Bind(wx.EVT_RADIOBOX, self.OnRadioBox, self.typerb)
		sizer.Add(self.typerb, 0, wx.GROW|wx.ALIGN_CENTER_VERTICAL|wx.ALL, 5)

		line = wx.StaticLine(self, -1, size=(20,-1), style=wx.LI_HORIZONTAL)
		sizer.Add(line, 0, wx.GROW|wx.ALIGN_CENTER_VERTICAL|wx.RIGHT|wx.TOP, 5)

		btnsizer = wx.StdDialogButtonSizer()

		if wx.Platform != "__WXMSW__":
			btn = wx.ContextHelpButton(self)
			btnsizer.AddButton(btn)
		
		btn = wx.Button(self, wx.ID_OK)
		btn.SetHelpText("The OK button completes the dialog")
		btn.SetDefault()
		btnsizer.AddButton(btn)
		
		self.types = [0,1,2,3]
		
		self.curtype = 0

		btn = wx.Button(self, wx.ID_CANCEL)
		btn.SetHelpText("The Cancel button cancels the dialog. (Cool, huh?)")
		btnsizer.AddButton(btn)
		btnsizer.Realize()

		sizer.Add(btnsizer, 0, wx.ALIGN_CENTER_VERTICAL|wx.ALL, 5)

		self.SetSizer(sizer)
		sizer.Fit(self)
		
	def SetVailedTypes(self,types):
		self.types = types;
		for type in self.types:
			self.typerb.SetSelection(type)
			self.text.SetEditable(type == 0)
			self.curtype = type
			if type== 0:
				self.text.SetBackgroundColour(wx.WHITE)
			else:
				self.text.SetBackgroundColour(wx.Colour(200, 200, 200))
			break
		
	def OnRadioBox(self,event):
		id = event.GetInt()
		if not ( id in self.types ):
			for type in self.types:
				self.typerb.SetSelection(type)
				self.curtype = type
				break
			event.Skip()
			return
		self.text.SetEditable(id == 0)
		if id == 0:
			self.text.SetBackgroundColour(wx.WHITE)
		else:
			self.text.SetBackgroundColour(wx.Colour(200, 200, 200))
		self.curtype = id
		event.Skip()
		
	def GetCurType(self):
		return self.curtype
		
	def GetName(self):
		return self.text.GetValue()
		

class MyOutStream:
	def __init__(self):
		self.out = ''
		
	def get(self):
		return self.out
		
	def write(self,s):
		self.out = self.out + s

#---------------------------------------------------------------------------
class AnalysisFile:
	def __init__(self,treeView):
		self.rui = None
		self.treeView = treeView
		self.root = None
		self.filename = 'Noname.js'
		self.isopen = False
		self.rootname = 'uicfg'
		self.rundir = ''
		
	def GetFileName(self):
		if self.isopen :
			return self.filename
		else:
			return ''
		
	def GetDefaultDirInfo(self):
		if self.rundir == '' :
			self.rundir = os.getcwd()
		defdir = self.rundir
		deffile = ''
		ggc = {}
		llc = {}
		try:
			execfile(self.rundir+'/tmp.ini',ggc,llc)
			config = llc.get('config')
			if config != None:
				defdir = config['dir']
				deffile = config['file']
		except:
			print 'no find tmp.ini file!'
		return defdir, deffile
		
	def SaveDefaultDirInfo(self):
		if self.rundir != '' :
			findidx1 = self.filename.rfind('/')
			findidx2 = self.filename.rfind('\\')
			findidx = max(findidx1,findidx2)
			sdir = self.filename[0:findidx]
			sfile = self.filename[findidx+1:]
			tmpout = MyOutStream()
			config = {'dir':sdir,'file':sfile}
			pprint.pprint(config,tmpout,1,256)
			outstr = 'config='+tmpout.get()
			f = open(self.rundir+'/tmp.ini','w')
			print(outstr);
			f.write(codecs.BOM_UTF8)
			f.write(outstr)
			f.close()
		
	def RecreateTree(self):
		self.treeView.Freeze()
		self.treeView.DeleteAllItems()
		self.root = self.treeView.AddRoot(self.rootname)
		self.treeView.SetItemImage(self.root, 0)
		self.treeView.SetItemPyData(self.root, {'type':0})
		treeFont = self.treeView.GetFont()
		self.treeView.SetItemFont(self.root, treeFont)
		self.treeView.Thaw()
		
	def GetRoot(self):
		return self.root
		
	def ResetRUI(self,rui,item):
		pydata = self.treeView.GetItemPyData(item)
		itemtext = self.treeView.GetItemText(item)
		if pydata['type'] == 0:
			rui[itemtext] = {}
			cookie = 0
			(childitem,cookie) = self.treeView.GetFirstChild(item)
			while childitem.IsOk():
				self.ResetRUI(rui[itemtext],childitem)
				(childitem,cookie) = self.treeView.GetNextChild(item, cookie)
		elif pydata['type'] == 1:
			rui['c_'] = pydata['content']
		elif pydata['type'] == 2:
			rui['t_'] = []
			cookie = 0
			(childitem,cookie) = self.treeView.GetFirstChild(item)
			while childitem.IsOk():
				self.ResetRUI(rui['t_'],childitem)
				(childitem,cookie) = self.treeView.GetNextChild(item, cookie)
		elif pydata['type'] == 3:
			rui.append(pydata['content'])
		
	def SaveFile(self, saveas):
		if not self.isopen or saveas:
			dlg = wx.FileDialog(
				self.treeView.GetMainFrame(), message="Save file as ...", defaultDir=os.getcwd(), 
				defaultFile="", wildcard=wildcard2, style=wx.SAVE
				)
			if dlg.ShowModal() == wx.ID_OK:
				self.filename = dlg.GetPath()
				dlg.Destroy()
			else:
				dlg.Destroy()
				return 
			self.isopen = True
		profiler('start...')
		
		self.rui = {}
		cookie = 0
		(childitem,cookie) = self.treeView.GetFirstChild(self.root)
		while childitem.IsOk():
			self.ResetRUI(self.rui,childitem)
			(childitem,cookie) = self.treeView.GetNextChild(self.root, cookie)
		profiler('trav tree')
		
		#-- 数据测试使用
		#testOut = MyOutStream()
		#MyPrint_Check(self.rui, testOut);
		#outstr = self.rootname+'='+testOut.get()+';'
		#f = open(self.filename[0:-3] + '_test.js', 'w')
		#f.write(codecs.BOM_UTF8)
		#f.write(outstr)
		#f.close()
		#profiler('write1')
		
		print 'saledlg:', self.rui['shop']['saledlg']
		
		
		myPrint = MyPrint()
		myPrint.Print(None, self.rui)
		profiler('pprint')
		
		outstr = self.rootname+'='+myPrint.getEditStr()+';'
		f = open(self.filename, 'w')
		f.write(codecs.BOM_UTF8)
		f.write(outstr)
		f.close()
		profiler('write1')
		
		outstr = self.rootname+'='+myPrint.getClientStr()+';'
		f = open(self.filename[0:-3] + '_cls.js', 'w')
		f.write(codecs.BOM_UTF8)
		f.write(outstr)
		f.close()
		profiler('write2')
		
		self.treeView.GetMainFrame().SetTitle(self.filename)
		self.SaveDefaultDirInfo()
		
	def OpenFile(self,filename):
		self.filename = filename
		ggc = {}
		llc = {}
		execfile(filename,ggc,llc)
		self.rui = llc.get(self.rootname)
		if self.rui == None:
			return
		self.InitTree()
		self.isopen = True
		self.treeView.GetMainFrame().SetTitle(self.filename)
		
	def GetContent(self,itempaths):
		curnode = self.rui
		for p in itempaths:
			curnode = curnode[p]
		return curnode
		
	def SaveContent(self, item, content):
		if item != None and content != None:
			pydata = self.treeView.GetItemPyData(item)
			if pydata['type'] == 1 or pydata['type'] == 3:
				pydata['content'] = content
				self.treeView.SetItemPyData(item, pydata)
			
	def InitTree(self):
		self.treeView.Freeze()
		self.treeView.DeleteAllItems()
		self.root = self.treeView.AddRoot(self.rootname)
		self.treeView.SetItemImage(self.root, 0)
		self.treeView.SetItemPyData(self.root, {'type':0})
		treeFont = self.treeView.GetFont()
		self.treeView.SetItemFont(self.root, treeFont)
		self.Analysis(self.rui,self.root)
		self.treeView.Thaw()
		
	def Analysis(self,innodes,itemparent):
		for k in innodes:
			if k == 'c_':
				zindex = self.treeView.GetChildrenCount(itemparent)
				childitem = self.treeView.AppendItem(itemparent,'content')
				self.treeView.SetItemPyData(childitem, {'type':1, 'zindex':zindex, 'content':innodes[k]})
			elif k == 't_':
				zindex = self.treeView.GetChildrenCount(itemparent)
				childitem = self.treeView.AppendItem(itemparent,'template')
				self.treeView.SetItemPyData(childitem, {'type':2, 'zindex':zindex})
				for kk in range(len(innodes[k])):
					zindex = self.treeView.GetChildrenCount(childitem)
					subchilditem = self.treeView.AppendItem(childitem,'templ('+str(kk)+')')
					self.treeView.SetItemPyData(subchilditem, {'type':3, 'zindex':zindex, 'content':innodes[k][kk]})
			else:
				zindex = self.treeView.GetChildrenCount(itemparent)
				childitem = self.treeView.AppendItem(itemparent,k)
				self.treeView.SetItemPyData(childitem, {'type':0, 'zindex':zindex})
				self.Analysis(innodes[k],childitem)
			

#---------------------------------------------------------------------------
class DivsTree(wx.TreeCtrl):
	def __init__(self, parent, frame):
		wx.TreeCtrl.__init__(self, parent, style=wx.TR_DEFAULT_STYLE|wx.TR_HAS_VARIABLE_ROW_HEIGHT)
		self.frame = frame
		self.analysis = AnalysisFile(self)
		self.Bind(wx.EVT_LEFT_DCLICK, self.OnLeftDClick)
		self.Bind(wx.EVT_TREE_ITEM_RIGHT_CLICK, self.OnRightUp)
		self.Bind(wx.EVT_TIMER, self.OnTimer)
		self.t1 = wx.Timer(self)
		self.t1.Start(1000)
		
	def GetFileName(self):
		return self.analysis.GetFileName()
		
	def OnCompareItems(self, item1, item2):
		itemdata1 = self.GetItemPyData(item1);
		itemdata2 = self.GetItemPyData(item2);
		print itemdata1['zindex'] 
		return itemdata1['zindex'] < itemdata2['zindex']
		
	def GetMainFrame(self):
		return self.frame
		
	def GetDefaultDirInfo(self):
		return self.analysis.GetDefaultDirInfo()
		
	def RecreateTree(self):
		self.analysis.RecreateTree()
		
	def OpenFile(self,filename):
		self.frame.SetStatusText("")
		self.analysis.OpenFile(filename)
		self.frame.GetEditorPanel().GetEditor().SetEditShape(None)
		
	def SaveFile(self):
		self.frame.SetStatusText("save file ...")
		self.analysis.SaveFile(False)
		self.frame.SetStatusText("save file ok!")
		
	def SaveAsFile(self):
		self.frame.SetStatusText("save file ...")
		self.analysis.SaveFile(True)
		self.frame.SetStatusText("save file ok!")

	def SaveContent(self, item, content):
		self.analysis.SaveContent(item, content)

	def AppendItem(self, parent, text, image=-1, wnd=None):
		item = wx.TreeCtrl.AppendItem(self, parent, text, image=image)
		return item
		
	def OnLeftDClick(self, event):
		pt = event.GetPosition();
		item, flags = self.HitTest(pt)
		if item:
			itemtext = self.GetItemText(item)
			pydata = self.GetItemPyData(item)
			if pydata['type'] == 1 or pydata['type'] == 3:
				editor = self.frame.GetEditorPanel()
				editor.LoadDlgCfg(pydata['content'],item)
				self.frame.GetEditorPanel().GetEditor().GetCommandHandler().Clear()
				
			#if parent.IsOk():
			#self.SortChildren(parent)
		event.Skip()
		
	def OnRightUp(self, event):
		item = event.GetItem()
		#item, flags = self.HitTest(pt)
		if item:
			self.curselitem = item
			self.SelectItem(item)

			# only do this part the first time so the events are only bound once
			if not hasattr(self, "popupID1"):
				self.popupID1 = wx.NewId()
				self.popupID2 = wx.NewId()
				self.popupID3 = wx.NewId()
				self.Bind(wx.EVT_MENU, self.OnCmdAdd, id=self.popupID1)
				self.Bind(wx.EVT_MENU, self.OnCmdDel, id=self.popupID2)
				self.Bind(wx.EVT_MENU, self.OnCmdRename, id=self.popupID3)

			# make a menu
			menu = wx.Menu()
			# add some items
			menu.Append(self.popupID1, "Add")
			menu.Append(self.popupID2, "Delete")
			menu.Append(self.popupID3, "Rename")

			self.PopupMenu(menu)
			menu.Destroy()
			
		event.Skip()
		
	def NewUIItemCfg(self):
		return {'a': 0, 'f': 10, 'g': 10, 'h': 100, 'i': 100}
		
	def OnCmdAdd(self,event):
		pydata = self.GetItemPyData(self.curselitem)
		itemtext = self.GetItemText(self.curselitem)
		if pydata['type'] == 1 or pydata['type'] == 3: # content, templateitem
			return
		types = [0,1,2,3]
		if pydata['type'] == 0 or pydata['type'] == 1:
			types = [0,1,2]
		elif pydata['type'] == 2:
			types = [3]
		dlg = NewItemDialog(self, -1, "Add new item", size=(350, 200),
			 #style=wx.CAPTION | wx.SYSTEM_MENU | wx.THICK_FRAME,
			 style=wx.DEFAULT_DIALOG_STYLE, # & ~wx.CLOSE_BOX,
			 useMetal=False,
			 )
		dlg.CenterOnScreen()
		dlg.SetVailedTypes(types)

		# this does not return until the dialog is closed.
		if dlg.ShowModal() == wx.ID_OK:
			type = dlg.GetCurType()
			if type == 0 :
				name = dlg.GetName()
				if name != '':
					zindex = self.GetChildrenCount(self.curselitem)
					childitem = self.AppendItem(self.curselitem,name)
					self.SetItemPyData(childitem, {'type':0, 'zindex':zindex})
			elif type == 1:
				zindex = self.GetChildrenCount(self.curselitem)
				childitem = self.AppendItem(self.curselitem,'content')
				self.SetItemPyData(childitem, {'type':1, 'zindex':zindex, 'content':self.NewUIItemCfg()})
			elif type == 2:
				zindex = self.GetChildrenCount(self.curselitem)
				childitem = self.AppendItem(self.curselitem,'template')
				self.SetItemPyData(childitem, {'type':2, 'zindex':zindex})
			elif type == 3:
				idx = self.GetChildrenCount(self.curselitem)
				childitem = self.AppendItem(self.curselitem,'templ('+str(idx)+')')
				self.SetItemPyData(childitem, {'type':3, 'zindex':idx, 'content':self.NewUIItemCfg()})
		dlg.Destroy()
		
	def OnCmdDel(self,event):
		dlg = wx.MessageDialog(self, "delete it?", "Are you sure?",
			wx.YES_NO | wx.NO_DEFAULT| wx.ICON_EXCLAMATION)
		result = dlg.ShowModal()
		if result == wx.ID_NO:
			return
		dlg.Destroy()
		
		# reset current edit shape
		curshape = self.frame.GetEditorPanel().GetEditor().GetCurEditShape()
		if curshape != None:
			item = curshape.GetItem()
			parent = item
			while parent.IsOk():
				if self.curselitem == parent:
					self.frame.GetEditorPanel().GetEditor().SetEditShape(None)
					break
				parent = self.GetItemParent(parent)
				
		pydata = self.GetItemPyData(self.curselitem)
		if pydata['type'] == 3:
			parent = self.GetItemParent(self.curselitem)
			self.Delete(self.curselitem)
			# rename template item 
			idx = 0
			cookie = 0
			(childitem,cookie) = self.GetFirstChild(parent)
			while childitem.IsOk():
				self.SetItemText(childitem,'templ('+str(idx)+')')
				(childitem,cookie) = self.GetNextChild(parent, cookie)
				idx = idx + 1
		else:
			self.Delete(self.curselitem)
		self.frame.GetEditorPanel().SetPathShow('')
		
	def OnCmdRename(self,event):
		pydata = self.GetItemPyData(self.curselitem)
		itemtext = self.GetItemText(self.curselitem)
		if pydata['type'] == 1 or pydata['type'] == 2 :
			return
			
		dlg = wx.TextEntryDialog(self, 'input new name', 'rename', 'Python')
		dlg.SetValue(itemtext)
		if dlg.ShowModal() == wx.ID_OK:
			newname = dlg.GetValue()
			if newname != '' :
				self.SetItemText(self.curselitem,newname)
		dlg.Destroy()
		
	def OnTimer(self, evt):
		self.frame.SetStatusText("")

