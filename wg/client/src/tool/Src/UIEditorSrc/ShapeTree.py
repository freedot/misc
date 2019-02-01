import wx
import myimages


#---------------------------------------------------------------------------
class ShapeTree(wx.TreeCtrl):
	def __init__(self, parent, frame):
		wx.TreeCtrl.__init__(self, parent, style=wx.TR_DEFAULT_STYLE)
		self.frame = frame
		self.root = None
		self.Bind(wx.EVT_LEFT_DOWN , self.OnLeftDown)
		self.Bind(wx.EVT_TREE_ITEM_RIGHT_CLICK, self.OnRightClick)
		isz = (16,16)
		il = wx.ImageList(isz[0], isz[1])
		self.normalimgidx = il.Add(myimages.getshapenBitmap())
		self.selectimgidx = il.Add(myimages.getshapesBitmap())
		self.SetImageList(il)
		self.il = il
		
	def OnCompareItems(self, item1, item2):
		itemdata1 = self.GetItemPyData(item1);
		itemdata2 = self.GetItemPyData(item2);
		return itemdata1['zindex'] > itemdata2['zindex']

	def FindTreeItem(self,treeitem,shape):
		pyData = self.GetItemPyData(treeitem)
		if pyData['shape'] == shape:
			return treeitem
			
		cookie = 0
		(childitem,cookie) = self.GetFirstChild(treeitem)
		while childitem.IsOk():
			retitem = self.FindTreeItem(childitem,shape)
			if retitem != None :
				return retitem
			(childitem,cookie) = self.GetNextChild(treeitem, cookie)
		return None
		
	def SelectShape(self,shape):
		retitem = self.FindTreeItem(self.root,shape)
		if retitem != None :
			self.SelectItem(retitem)
		
	def AddChild(self, parentshape, childshape):
		retitem = self.FindTreeItem(self.root,parentshape)
		if retitem != None :
			zindex = self.GetChildrenCount(retitem)
			print 'zindex = ' + str(zindex)
			childitem = self.AppendItem(retitem,'shape')
			self.SetItemPyData(childitem, {'shape':childshape, 'zindex':zindex})
			self.SetItemImage(childitem, self.normalimgidx, wx.TreeItemIcon_Normal)
			self.SetItemImage(childitem, self.normalimgidx, wx.TreeItemIcon_Expanded)
			self.SetItemImage(childitem, self.selectimgidx, wx.TreeItemIcon_SelectedExpanded)
			self.SetItemImage(childitem, self.selectimgidx, wx.TreeItemIcon_Selected)			
			
		
	def DeleteChild(self, childshape):
		retitem = self.FindTreeItem(self.root,childshape)
		if retitem != None :
			self.Delete(retitem)
		
	def AppendItem(self, parent, text, image=-1, wnd=None):
		item = wx.TreeCtrl.AppendItem(self, parent, text, image=image)
		return item
		
	def GetMainFrame(self):
		return self.frame
		
	def RecreateTree(self,shape):
		self.Freeze()
		self.DeleteAllItems()
		if shape != None:
			self.root = self.AddRoot('rootshape')
			self.SetItemPyData(self.root, {'shape':shape})
			self.SetItemImage(self.root, self.normalimgidx, wx.TreeItemIcon_Normal)
			self.SetItemImage(self.root, self.normalimgidx, wx.TreeItemIcon_Expanded)
			self.SetItemImage(self.root, self.selectimgidx, wx.TreeItemIcon_Selected)			
			treeFont = self.GetFont()
			self.SetItemFont(self.root, treeFont)
			for c in shape.GetChildren():
				self.BuildTreeItem(self.root,c)
		self.Thaw()
		
	def BuildTreeItem(self,parentitem,shape):
		if shape == None:
			return
		zindex = self.GetChildrenCount(parentitem)
		print 'zindex = ' + str(zindex)
		childitem = self.AppendItem(parentitem,'shape')
		self.SetItemPyData(childitem, {'shape':shape, 'zindex':zindex})
		self.SetItemImage(childitem, self.normalimgidx, wx.TreeItemIcon_Normal)
		self.SetItemImage(childitem, self.normalimgidx, wx.TreeItemIcon_Expanded)
		self.SetItemImage(childitem, self.selectimgidx, wx.TreeItemIcon_Selected)
		for c in shape.GetChildren():
			self.BuildTreeItem(childitem,c)
		
	def OnLeftDown(self,event):
		pt = event.GetPosition();
		item, flags = self.HitTest(pt)
		if item:
			editor = self.frame.GetEditorPanel().GetEditor()
			pydata = self.GetItemPyData(item)
			if pydata != None and pydata['shape'] != None:
				editor.SelectOneShape(pydata['shape'])
				
		event.Skip()
		
	def OnRightClick(self, event):
		item = event.GetItem()
		if item:
			self.curselitem = item
			self.SelectItem(item)

			# only do this part the first time so the events are only bound once
			if not hasattr(self, "popupID1"):
				self.popupID1 = wx.NewId()
				self.popupID2 = wx.NewId()
				self.popupID3 = wx.NewId()
				self.popupID4 = wx.NewId()
				self.popupID5 = wx.NewId()
				self.Bind(wx.EVT_MENU, self.OnCmdAdd, id=self.popupID1)
				self.Bind(wx.EVT_MENU, self.OnCmdDel, id=self.popupID2)
				self.Bind(wx.EVT_MENU, self.OnCopy, id=self.popupID3)
				self.Bind(wx.EVT_MENU, self.OnPaste, id=self.popupID4)
				self.Bind(wx.EVT_MENU, self.OnActive, id=self.popupID5)

			# make a menu
			menu = wx.Menu()
			# add some items
			menu.Append(self.popupID1, "Add")
			menu.Append(self.popupID2, "Delete(del)")
			menu.Append(self.popupID3, "Copy(ctrl+c)")
			menu.Append(self.popupID4, "Paste(ctrl+v)")
			menu.Append(self.popupID5, "Active")

			self.PopupMenu(menu)
			menu.Destroy()
		event.Skip()
		
	def OnCmdAdd(self,event):
		self.frame.GetEditorPanel().AddShapeCmd()
		
	def OnCmdDel(self,event):
		self.frame.GetEditorPanel().GetEditor().DelShapeCmd()
		
	def OnCopy(self,event):
		self.frame.GetEditorPanel().GetEditor().CopyShapeCmd()
		
	def OnPaste(self,event):
		self.frame.GetEditorPanel().GetEditor().PasteShapeCmd()
		
	def OnActive(self,event):
		self.frame.GetEditorPanel().GetEditor().SetFocus()
