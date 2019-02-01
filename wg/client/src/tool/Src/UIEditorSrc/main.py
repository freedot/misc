#-*-coding:utf-8-*- 
import wx
import wx.aui
import wx.html
from EditorPanel import EditorPanel
from OverviewPanel import OverviewPanel
from CodePanel import CodePanel
from DivsTree import DivsTree
from AttrPanel import AttrPanel
from ShapeTree import ShapeTree


G_APP_NAME = 'UI Editor'
G_APP_VER = '[v1.0]'


class MainFrame(wx.Frame):
	def __init__(self, parent, title):
		wx.Frame.__init__(self, parent, -1, title, size = (970, 720),
			style=wx.DEFAULT_FRAME_STYLE | wx.NO_FULL_REPAINT_ON_RESIZE)
		self.SetMinSize((640,480))
		
		pnl = wx.Panel(self)
		self.pnl = pnl
		self.mgr = wx.aui.AuiManager()
		self.mgr.SetManagedWindow(pnl)
		
		self.Centre(wx.BOTH)
		self.CreateStatusBar(1, wx.ST_SIZEGRIP)
		
		def EmptyHandler(evt): pass
		
		# build menu bar
		self.BuildMenuBar()
		
		# Create a TreeCtrl
		leftPanel = wx.Panel(pnl, style=wx.TAB_TRAVERSAL|wx.CLIP_CHILDREN)
		self.tree = DivsTree(leftPanel,self)
		self.RecreateTree()
		leftBox = wx.BoxSizer(wx.VERTICAL)
		leftBox.Add(self.tree, 1, wx.EXPAND)
		leftPanel.SetSizer(leftBox)
		
		
		# Create a shape TreeCtrl
		leftPanel2 = wx.Panel(pnl, style=wx.TAB_TRAVERSAL|wx.CLIP_CHILDREN)
		self.shapetree = ShapeTree(leftPanel2,self)
		leftBox2 = wx.BoxSizer(wx.VERTICAL)
		leftBox2.Add(self.shapetree, 1, wx.EXPAND)
		leftPanel2.SetSizer(leftBox2)
		
		
		#create a attrctrl
		attrpanel = wx.Panel(pnl, style=wx.TAB_TRAVERSAL|wx.CLIP_CHILDREN)
		self.attr = AttrPanel(attrpanel)
		attrBox = wx.BoxSizer(wx.VERTICAL)
		attrBox.Add(self.attr, 1, wx.EXPAND)
		attrpanel.SetSizer(attrBox)
		
		# Create a Notebook
		self.nb = wx.Notebook(pnl, -1, style=wx.CLIP_CHILDREN)
		self.nb.Bind(wx.EVT_NOTEBOOK_PAGE_CHANGED, self.OnPageChanged)

		# Add editor panel tab page
		self.editorPage = EditorPanel(self.nb, self, self.attr,self.tree)
		self.nb.AddPage(self.editorPage, 'Editor', imageId=-1)
		self.attr.SetEditor(self.editorPage.GetEditor())
		
		# Add source code tab page
		#self.codePage = CodePanel(self.nb, self)
		#self.nb.AddPage(self.codePage, 'source code', imageId=-1)
		
		# Add overview tab page
		panel = wx.Panel(self.nb, -1, style=wx.CLIP_CHILDREN)
		self.viewPage = OverviewPanel(panel, self.tree, self.editorPage.GetEditor())
		self.nb.AddPage(panel, 'Overview', imageId=-1)
		def OnOvrSize(evt, ovr=self.viewPage):
			ovr.SetSize(evt.GetSize())
		panel.Bind(wx.EVT_SIZE, OnOvrSize)
		panel.Bind(wx.EVT_ERASE_BACKGROUND, EmptyHandler)
		
		self.editorPage.SetListener(self.viewPage)
		
		# select initial items
		self.nb.SetSelection(0)
		
		self.mgr.AddPane(self.nb, wx.aui.AuiPaneInfo().CenterPane().Name("Notebook"))
		self.mgr.AddPane(leftPanel,
			wx.aui.AuiPaneInfo().
			Left().Layer(2).BestSize((240, -1)).
			MinSize((160, -1)).
			Floatable(False).FloatingSize((240, 700)).
			Caption("Dialog resource list").
			CloseButton(False).
			Name("UIItemTree"))
		self.mgr.AddPane(leftPanel2,
			wx.aui.AuiPaneInfo().
			Left().Layer(2).BestSize((240, -1)).
			MinSize((160, -1)).
			Floatable(False).FloatingSize((240, 700)).
			Caption("Shape children").
			CloseButton(False).
			Name("ShapeTree"))	
		self.mgr.AddPane(attrpanel,
			wx.aui.AuiPaneInfo().
			Right().Layer(2).BestSize((240, -1)).
			MinSize((160, -1)).
			Floatable(False).FloatingSize((240, 700)).
			Caption("UI item attr").
			CloseButton(False).
			Name("Itemattr"))
		self.mgr.Update()
		self.mgr.SetFlags(self.mgr.GetFlags() ^ wx.aui.AUI_MGR_TRANSPARENT_DRAG)
		
	def OnPageChanged(self, evt):
		if evt.GetSelection() == 1:
			self.viewPage.PreView()
		

	def BuildMenuBar(self):
		# Make a File menu
		self.mainmenu = wx.MenuBar()
		
		menu = wx.Menu()
		exitItem = wx.MenuItem(menu, -1, 'E&xit\tCtrl-Q', 'Get the heck outta here!')
		menu.AppendItem(exitItem)
		self.Bind(wx.EVT_MENU, self.OnFileExit, exitItem)
		wx.App.SetMacExitMenuItemId(exitItem.GetId())
		self.mainmenu.Append(menu, '&File')
	
		self.SetMenuBar(self.mainmenu)
	
	
	def GetEditorPanel(self):
		return self.editorPage
		
	
	def GetShapeTree(self):
		return self.shapetree
	
	
	def OnCloseMe(self, event):
		self.Close(True)


	def OnCloseWindow(self, event):
		self.Destroy()
		

	def OnIdle(self, event):
		pass
		

	def OnFileExit(self, *event):
		self.Close()

	def RecreateTree(self):
		self.tree.RecreateTree()
		
	def SetTitle(self, title):
		global G_APP_NAME
		global G_APP_VER
		if title == '':
			label = G_APP_NAME + ' ' +  G_APP_VER
		else:
			label = G_APP_NAME + ' ' +  G_APP_VER + ' <' + title + '>'
		self.SetLabel(label)


class MyApp(wx.App):
	def OnInit(self):
		mainFrame = MainFrame(None, '')
		mainFrame.Show()
		mainFrame.SetTitle('')
		return True


def main():
	app = MyApp(False)
	app.MainLoop()
	

if __name__ == '__main__':
	__name__ = 'Main'
	main()