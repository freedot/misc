#-*-coding:utf-8-*- 

import wx
import Shape as sae

from myimages import *

import os

import  wx

#---------------------------------------------------------------------------
wildcard = "Js (*.js)|*.js|"

import sys
try:
	dirName = os.path.dirname(os.path.abspath(__file__))
except:
	dirName = os.path.dirname(os.path.abspath(sys.argv[0]))

bitmapDir = os.path.join(dirName, 'bitmaps')
sys.path.append(os.path.split(dirName)[0])

try:
	from agw import flatmenu as FM
	from agw.artmanager import ArtManager, RendererBase, DCSaver
	from agw.fmresources import ControlFocus, ControlPressed
	from agw.fmresources import FM_OPT_SHOW_CUSTOMIZE, FM_OPT_SHOW_TOOLBAR, FM_OPT_MINIBAR
except ImportError: # if it's not there locally, try the wxPython lib.
	import wx.lib.agw.flatmenu as FM
	from wx.lib.agw.artmanager import ArtManager, RendererBase, DCSaver
	from wx.lib.agw.fmresources import ControlFocus, ControlPressed
	from wx.lib.agw.fmresources import FM_OPT_SHOW_CUSTOMIZE, FM_OPT_SHOW_TOOLBAR, FM_OPT_MINIBAR

MENU_SAVE = wx.NewId()
MENU_SAVEAS  = wx.NewId()
MENU_OPEN = wx.NewId()
MENU_FIRST = 19999
MENU_ADDDIALOG = 19999
MENU_ADDSHAPE = 20000
MENU_UNDO = 20001
MENU_REDO = 20002
MENU_LEFTALIGN = 20003
MENU_RIGHTALIGN = 20004
MENU_TOPALIGN = 20005
MENU_BOTTOMALIGN = 20006
MENU_VCENTERALIGN = 20007
MENU_HCENTERALIGN = 20008
MENU_SAMEWIDTH = 20009
MENU_SAMEHEIGHT = 20010
MENU_SAMESIZE = 20011
MENU_HSAMESPACE= 20012
MENU_VSAMESPACE= 20013
MENU_MOVEUP=20014
MENU_MOVEDOWN=20015
MENU_SAMEATTR=20016
MENU_COPY=20017
MENU_PASTE=20018
MENU_LAST = 20018


from MyShape import *

#----------------------------------------------------------------------
class EditorPanel(wx.Panel):
	def __init__(self, parent, frame, attrpanel,treeview):
		wx.Panel.__init__(self, parent, size=(1,1))
		self.frame = frame
		self.attrpanel = attrpanel
		self.treeview = treeview
		self.listener = None

		# create mini toolbar
		self.CreateToolbar()
		self.editor = sae.ShapeCanvas(self,self.attrpanel,self.frame)

		self.box = wx.BoxSizer(wx.VERTICAL)
		self.box.Add(self.toolbar, 0, wx.EXPAND)
		self.box.Add(wx.StaticLine(self), 0, wx.EXPAND)
		self.pathtext = wx.TextCtrl(self, -1, "", size=(80,-1))
		self.box.Add(self.pathtext, 0, wx.EXPAND)
		self.box.Add(self.editor, 1, wx.EXPAND)
		self.pathtext.SetEditable(False)

		self.box.Fit(self)
		self.SetSizer(self.box)

		self.Bind(wx.EVT_ERASE_BACKGROUND, self.OnEraseBackground)

		acceltbl = wx.AcceleratorTable([
			(wx.ACCEL_CTRL, ord('S'), MENU_SAVE),
			])
		self.SetAcceleratorTable(acceltbl)
		
	def SetListener(self, listener):
		self.listener = listener

	#-----------------------------------
	def GetEditor(self):
		return self.editor

	#-----------------------------------
	def CreateToolbar(self):
		self.toolbar = FM.FlatMenuBar(self, wx.ID_ANY, 16, 6, options = FM_OPT_SHOW_TOOLBAR|FM_OPT_MINIBAR)
		openFileBmp = getopenBitmap() #wx.Bitmap(os.path.join(bitmapDir, "open.bmp"), wx.BITMAP_TYPE_BMP)
		saveFileBmp =  getsaveBitmap() #wx.Bitmap(os.path.join(bitmapDir, "save.bmp"), wx.BITMAP_TYPE_BMP)
		saveasFileBmp =  getsaveasBitmap() #wx.Bitmap(os.path.join(bitmapDir, "saveas.bmp"), wx.BITMAP_TYPE_BMP)
		undoBmp  =  getundoBitmap() #wx.Bitmap(os.path.join(bitmapDir, "undo.bmp"), wx.BITMAP_TYPE_BMP)
		redoBmp  = getredoBitmap() #wx.Bitmap(os.path.join(bitmapDir, "redo.bmp"), wx.BITMAP_TYPE_BMP)
		lalignBmp  = getleftalignBitmap() #wx.Bitmap(os.path.join(bitmapDir, "leftalign.bmp"), wx.BITMAP_TYPE_BMP)
		ralignBmp  = getrightalignBitmap() #wx.Bitmap(os.path.join(bitmapDir, "rightalign.bmp"), wx.BITMAP_TYPE_BMP)
		talignBmp  = gettopalignBitmap() #wx.Bitmap(os.path.join(bitmapDir, "topalign.bmp"), wx.BITMAP_TYPE_BMP)
		balignBmp  = getbottomalignBitmap() #wx.Bitmap(os.path.join(bitmapDir, "bottomalign.bmp"), wx.BITMAP_TYPE_BMP)
		vcenterBmp  = getvcenteralignBitmap() #wx.Bitmap(os.path.join(bitmapDir, "vcenteralign.bmp"), wx.BITMAP_TYPE_BMP)
		hcenterBmp  = gethcenteralignBitmap() #wx.Bitmap(os.path.join(bitmapDir, "hcenteralign.bmp"), wx.BITMAP_TYPE_BMP)
		samewBmp  = getsamewBitmap() #wx.Bitmap(os.path.join(bitmapDir, "samew.bmp"), wx.BITMAP_TYPE_BMP)
		samehBmp  = getsamehBitmap() #wx.Bitmap(os.path.join(bitmapDir, "sameh.bmp"), wx.BITMAP_TYPE_BMP)
		samesizeBmp  = getsamesizeBitmap() #wx.Bitmap(os.path.join(bitmapDir, "samesize.bmp"), wx.BITMAP_TYPE_BMP)
		sameattrBmp  = getsameattrBitmap() #wx.Bitmap(os.path.join(bitmapDir, "samesize.bmp"), wx.BITMAP_TYPE_BMP)
		heqBmp  = getheqBitmap() #wx.Bitmap(os.path.join(bitmapDir, "heq.bmp"), wx.BITMAP_TYPE_BMP)
		veqBmp  = getveqBitmap() #wx.Bitmap(os.path.join(bitmapDir, "veq.bmp"), wx.BITMAP_TYPE_BMP)
		addShapeBmp = getaddshapeBitmap() #wx.Bitmap(os.path.join(bitmapDir, "addshape.bmp"), wx.BITMAP_TYPE_BMP)
		upNodeBmp = getupBitmap() #wx.Bitmap(os.path.join(bitmapDir, "addshape.bmp"), wx.BITMAP_TYPE_BMP)
		downNodeBmp = getdownBitmap() #wx.Bitmap(os.path.join(bitmapDir, "addshape.bmp"), wx.BITMAP_TYPE_BMP)
		copyBmp = getcopyBitmap()
		pasteBmp = getpasteBitmap()

		self.toolbar.AddTool(MENU_OPEN, "open file", openFileBmp)
		self.toolbar.AddTool(MENU_SAVE, "save file", saveFileBmp)
		self.toolbar.AddTool(MENU_SAVEAS, "save as file", saveasFileBmp)
		self.toolbar.AddSeparator()
		#self.toolbar.AddTool(MENU_ADDDIALOG, "add new dialog", addDialogBmp)
		self.toolbar.AddTool(MENU_ADDSHAPE, "add new shape", addShapeBmp)
		self.toolbar.AddSeparator()
		self.toolbar.AddTool(MENU_UNDO, "undo", undoBmp)
		self.toolbar.AddTool(MENU_REDO, "redo", redoBmp)
		self.toolbar.AddSeparator()
		self.toolbar.AddTool(MENU_COPY, "copy", copyBmp)
		self.toolbar.AddTool(MENU_PASTE, "paste", pasteBmp)
		self.toolbar.AddSeparator()
		self.toolbar.AddTool(MENU_LEFTALIGN, "left align", lalignBmp)
		self.toolbar.AddTool(MENU_RIGHTALIGN, "right align", ralignBmp)
		self.toolbar.AddTool(MENU_TOPALIGN, "top align", talignBmp)
		self.toolbar.AddTool(MENU_BOTTOMALIGN, "bottom align", balignBmp)
		self.toolbar.AddTool(MENU_HCENTERALIGN, "horizontal center align", hcenterBmp)
		self.toolbar.AddTool(MENU_VCENTERALIGN, "vertical center align", vcenterBmp)
		self.toolbar.AddTool(MENU_SAMEWIDTH, "set same width", samewBmp)
		self.toolbar.AddTool(MENU_SAMEHEIGHT, "set same height", samehBmp)
		self.toolbar.AddTool(MENU_SAMESIZE, "set same size", samesizeBmp)
		self.toolbar.AddTool(MENU_HSAMESPACE, "set horizontal same space", heqBmp)
		self.toolbar.AddTool(MENU_VSAMESPACE, "set vertical same space", veqBmp)
		self.toolbar.AddTool(MENU_SAMEATTR, "set same attr (style)", sameattrBmp)
		self.toolbar.AddSeparator()
		self.toolbar.AddTool(MENU_MOVEUP, "move child up", upNodeBmp)
		self.toolbar.AddTool(MENU_MOVEDOWN, "move child down", downNodeBmp)

		self.Bind(FM.EVT_FLAT_MENU_SELECTED, self.OnMenuCmd)
		self.Bind(wx.EVT_UPDATE_UI, self.OnMenuCmdUI, id=MENU_FIRST, id2=MENU_LAST)
		
	def AddShapeCmd(self):
		self.editor.AddShapeCmd(MyShape(self.editor))
			
	#-----------------------------------
	def OnMenuCmd(self, event):
		'''
		elif cmdid == MENU_ADDDIALOG:
			dlg = MyShape(self.editor)
			dlg.LockEdge(True,True,False,False)
			dlg.SetSize(100,100)
			self.editor.UserAddShape(None, dlg)
		'''
		cmdid = event.GetId()
		if cmdid == MENU_OPEN:
			self.OnOpenFile()
		elif cmdid == MENU_SAVE:
			self.OnSaveFile()
		elif cmdid == MENU_SAVEAS:
			self.OnSaveAsFile()
		elif cmdid == MENU_ADDSHAPE:
			self.AddShapeCmd()
			'''
			curselshape = self.editor.GetCurSelShape()
			selshapelist = self.editor.GetCurSelShapeList()
			if curselshape != None and len(selshapelist)  == 1:
				shape = MyShape(self.editor)
				shape.SetSize(50,22)
				self.editor.UserAddShape(curselshape, shape)
			'''
		elif cmdid == MENU_UNDO:
			cmdhdr = self.editor.GetCommandHandler()
			cmdhdr.Undo()
		elif cmdid == MENU_REDO:
			cmdhdr = self.editor.GetCommandHandler()
			cmdhdr.Redo()
		elif cmdid == MENU_COPY:
			self.editor.CopyShapeCmd()
		elif cmdid == MENU_PASTE:
			self.editor.PasteShapeCmd()
		elif cmdid == MENU_LEFTALIGN:
			self.editor.Align('la')
		elif cmdid == MENU_RIGHTALIGN:
			self.editor.Align('ra')
		elif cmdid == MENU_TOPALIGN:
			self.editor.Align('ta')
		elif cmdid == MENU_BOTTOMALIGN:
			self.editor.Align('ba')
		elif cmdid == MENU_VCENTERALIGN:
			self.editor.Align('vcenter')
		elif cmdid == MENU_HCENTERALIGN:
			self.editor.Align('hcenter')
		elif cmdid == MENU_SAMEWIDTH:
			self.editor.Align('samew')
		elif cmdid == MENU_SAMEHEIGHT:
			self.editor.Align('sameh')
		elif cmdid == MENU_SAMESIZE:
			self.editor.Align('samesize')
		elif cmdid == MENU_SAMEATTR:
			self.editor.setSameAttr('style')
		elif cmdid == MENU_HSAMESPACE:
			self.editor.Align('hspace')
		elif cmdid == MENU_VSAMESPACE:
			self.editor.Align('vspace')
		elif cmdid == MENU_MOVEUP:
			self.MoveChildUp()
		elif cmdid == MENU_MOVEDOWN:
			self.MoveChildDown()

	#-----------------------------------
	def MoveChildUp(self):
		shapeTree = self.frame.GetShapeTree()
		selitem = shapeTree.GetSelection()
		if selitem != None:
			parent = shapeTree.GetItemParent(selitem)
			previtem = shapeTree.GetPrevSibling(selitem)
			if previtem != None:
				self.SwapShapeTreeItem(parent, selitem, previtem)
				shapeTree.SortChildren(parent);

	#-----------------------------------
	def MoveChildDown(self):
		shapeTree = self.frame.GetShapeTree()
		selitem = shapeTree.GetSelection()
		if selitem != None:
			parent = shapeTree.GetItemParent(selitem)
			nextitem = shapeTree.GetNextSibling(selitem)
			if nextitem != None:
				self.SwapShapeTreeItem(parent, selitem, nextitem)
				shapeTree.SortChildren(parent);

	#-----------------------------------
	def SwapShapeTreeItem(self, treeparent, treeitem1, treeitem2):
		shapeTree = self.frame.GetShapeTree()
		pydata1 = shapeTree.GetItemPyData(treeitem1)
		pydata2 = shapeTree.GetItemPyData(treeitem2)
		shape1 = pydata1['shape']
		shape2 = pydata2['shape']
		tmp = pydata1['zindex']
		pydata1['zindex'] = pydata2['zindex']
		pydata2['zindex'] = tmp

		shapeparent = shape1.GetParent()
		shapeparent.Swap(shape1,shape2);

	#-----------------------------------
	def OnMenuCmdUI(self, event):
		cmdid = event.GetId()
		if cmdid == MENU_UNDO:
			cmdhdr = self.editor.GetCommandHandler()
			event.Enable(cmdhdr.HasDoCmd())
		elif cmdid == MENU_REDO:
			cmdhdr = self.editor.GetCommandHandler()
			event.Enable(cmdhdr.HasUndoCmd())
		elif cmdid == MENU_LEFTALIGN:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_RIGHTALIGN:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_TOPALIGN:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_BOTTOMALIGN:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_VCENTERALIGN:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 0)
		elif cmdid == MENU_HCENTERALIGN:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 0)
		elif cmdid == MENU_SAMEWIDTH:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_SAMEHEIGHT:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_SAMESIZE:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_SAMEATTR:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 1)
		elif cmdid == MENU_HSAMESPACE:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 2)
		elif cmdid == MENU_VSAMESPACE:
			cshapes = self.editor.CombineShape()
			event.Enable(len(cshapes) > 2)
		elif cmdid == MENU_MOVEUP :
			event.Enable(True)
		elif  cmdid == MENU_MOVEDOWN:
			event.Enable(True)

	#-----------------------------------
	def OnEraseBackground(self,event):
		pass

	#-----------------------------------
	def OnOpenFile(self):
		# load default file and dir
		defdir, deffile = self.treeview.GetDefaultDirInfo();
		dlg = wx.FileDialog(
			self, message="Choose a file",
			defaultDir=defdir,
			defaultFile=deffile,
			wildcard=wildcard,
			style=wx.OPEN | wx.CHANGE_DIR # | wx.MULTIPLE
		)

		if dlg.ShowModal() == wx.ID_OK:
			paths = dlg.GetPaths()
			for path in paths:
				self.treeview.OpenFile(path)
		dlg.Destroy()

	#-----------------------------------
	def LoadDlgCfg(self,content,item):
		dlg = MyShape(self.editor)
		dlg.SetItem(item)
		dlg.LockEdge(True,True,False,False)
		self.editor.UserAddShape(None, dlg)
		dlg.ReadFromConfig(content)
		self.editor.UpdateWindow(False)
		self.editor.UpdateShapeAttr()

		itempaths = []
		parent = item
		while parent.IsOk():
			itemtext = self.treeview.GetItemText(parent)
			itempaths.append(itemtext)
			parent = self.treeview.GetItemParent(parent)
		itempaths.reverse()
		itempath = ''
		for p in itempaths:
			if itempath != '':
				itempath = itempath + '.'
			itempath = itempath + p
		self.SetPathShow(itempath)

		shapeTree = self.frame.GetShapeTree()
		shapeTree.RecreateTree(dlg)
		if self.listener != None:
			self.listener.LoadedDlgCfg()

	def SetPathShow(self,path):
		self.pathtext.SetValue(path)

	#-----------------------------------
	def OnSaveFile(self):
		shape = self.editor.GetCurEditShape();
		if shape != None :
			outcfg = {}
			shape.WriteToConfig(outcfg)
			self.treeview.SaveContent(shape.GetItem(),outcfg)
		self.treeview.SaveFile()

	def OnSaveAsFile(self):
		shape = self.editor.GetCurEditShape();
		if shape != None :
			outcfg = {}
			shape.WriteToConfig(outcfg)
			self.treeview.SaveContent(shape.GetItem(),outcfg)
		self.treeview.SaveAsFile()
