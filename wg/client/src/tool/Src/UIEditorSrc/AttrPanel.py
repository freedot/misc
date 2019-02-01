import  wx
import  wx.grid as gridlib
from AttrMapDef import *

#---------------------------------------------------------------------------
class MultiChoice(wx.PopupTransientWindow):
	def __init__(self, parent, style,choicelist,cursellist,row,col):
		wx.PopupTransientWindow.__init__(self, parent, style)
		self.SetBackgroundColour("#FFFFFF")
		lb = wx.CheckListBox(self, -1, (0, 0), wx.DefaultSize, choicelist)
		#lb.SetSelection(0)
		self.lb = lb
		self.choicelist = choicelist
		self.parent = parent
		self.row = row
		self.col = col
		
		idx = 0
		for c in choicelist :
			self.lb.Check(idx, (c in cursellist))
			idx = idx + 1
			
		self.Bind(wx.EVT_CHECKLISTBOX, self.OnEvtCheckListBox, lb)
		
		sz = lb.GetBestSize()
		self.SetSize( (sz.width, sz.height) )
		
	def SetValue(self):
		values = ''
		for i in range(self.lb.GetCount()):
			if self.lb.IsChecked(i):
				if values != '':
					values = values + ','
				values = values + self.choicelist[i]
		self.parent.SetCellValue(self.row, self.col, values)
		self.parent.CellChange(self.row, self.col)

	def ProcessLeftDown(self, evt):
		evt.Skip()
		return False

	def OnDismiss(self):
		pass
		
	def OnEvtCheckListBox(self,event):
		index = event.GetSelection()
		self.lb.SetSelection(index)
		self.SetValue()
		
#---------------------------------------------------------------------------
class CustomDataTable(gridlib.PyGridTableBase):
	def __init__(self):
		gridlib.PyGridTableBase.__init__(self)
		self.colLabels = ['Attr', 'Value']
		global g_maxattrrows
		self.dataTypes = []
		self.data = []
		for i in range(g_maxattrrows):
			self.dataTypes.append([gridlib.GRID_VALUE_STRING,gridlib.GRID_VALUE_STRING])
			self.data.append(['',''])
		
	def SetAttrs(self, attrs):
		global g_attrmaps
		self.dataTypes = []
		self.data = []
		for attr in attrs:
			self.data.append([attr[0],attr[1]])
			self.dataTypes.append([gridlib.GRID_VALUE_STRING,g_attrmaps[attr[0]]])
	
	#--------------------------------------------------
	def GetAttrs(self):
		return self.data
		
	#--------------------------------------------------
	def GetAttrType(self,attrname):
		return g_attrmaps[attrname]
			
	#--------------------------------------------------
	# required methods for the wxPyGridTableBase interface
	def GetNumberRows(self):
		return len(self.data)

	def GetNumberCols(self):
		return len(self.data[0])

	def IsEmptyCell(self, row, col):
		try:
			return not self.data[row][col]
		except IndexError:
			return True

	# Get/Set values in the table.  The Python version of these
	# methods can handle any data-type, (as long as the Editor and
	# Renderer understands the type too,) not just strings as in the
	# C++ version.
	def GetValue(self, row, col):
		try:
			return self.data[row][col]
		except IndexError:
			return ''

	def SetValue(self, row, col, value):
		def innerSetValue(row, col, value):
			try:
				if col == 1:
					self.data[row][col] = value
			except IndexError:
				# add a new row
				self.data.append([''] * self.GetNumberCols())
				innerSetValue(row, col, value)

				# tell the grid we've added a row
				msg = gridlib.GridTableMessage(self,            # The table
					gridlib.GRIDTABLE_NOTIFY_ROWS_APPENDED, # what we did to it
					1                                       # how many
					)

				self.GetView().ProcessTableMessage(msg)
		innerSetValue(row, col, value) 

	#--------------------------------------------------
	# Some optional methods

	# Called when the grid needs to display labels
	def GetColLabelValue(self, col):
		return self.colLabels[col]

	# Called to determine the kind of editor/renderer to use by
	# default, doesn't necessarily have to be the same type used
	# natively by the editor/renderer if they know how to convert.
	def GetTypeName(self, row, col):
		if row < len(self.dataTypes):
			return self.dataTypes[row][col]
		else:
			if col == 0:
				return gridlib.GRID_VALUE_STRING
			else:
				return gridlib.GRID_VALUE_NUMBER

	# Called to determine how the data can be fetched and stored by the
	# editor and renderer.  This allows you to enforce some type-safety
	# in the grid.
	def CanGetValueAs(self, row, col, typeName):
		if row < len(self.dataTypes):
			colType = self.dataTypes[row][col].split(':')[0]
			if typeName == colType:
				return True
			else:
				return False
		else:
			return False

	def CanSetValueAs(self, row, col, typeName):
		return self.CanGetValueAs(row, col, typeName)


#---------------------------------------------------------------------------
class AttrPanel(gridlib.Grid):
	def __init__(self, parent):
		gridlib.Grid.__init__(self, parent, -1)
		self.attrtable = CustomDataTable()
		self.shapeeditor = None

		# The second parameter means that the grid is to take ownership of the
		# table and will destroy it when done.  Otherwise you would need to keep
		# a reference to it and call it's Destroy method later.
		self.SetTable(self.attrtable, True)

		self.SetRowLabelSize(0)
		self.SetMargins(0,0)
		self.AutoSizeColumns(False)
		
		global g_maxattrrows
		for idx in range(g_maxattrrows):
			self.SetReadOnly(idx, 0, True)
			self.SetCellTextColour(idx,0,wx.Colour(0, 0, 0))
			self.SetCellBackgroundColour(idx,0,wx.Colour(230, 230, 230))			
			self.SetReadOnly(idx, 1, True)
		
		gridlib.EVT_GRID_CELL_LEFT_DCLICK(self, self.OnLeftDClick)
		self.Bind(gridlib.EVT_GRID_CELL_CHANGE, self.OnCellChange)
		self.Bind(gridlib.EVT_GRID_CELL_LEFT_CLICK, self.OnLeftCellClick)
		self.Bind(wx.EVT_SIZE, self.OnSize)
		
	def SetEditor(self, editor):
		self.shapeeditor = editor
		
	def SetAttrs(self,pattrs):
		global g_maxattrrows
		global g_vaildlistmap
		attrlen = len(pattrs)
		attrs = []
		if attrlen > 0 :
			vaildlist = g_vaildlistmap[pattrs[0][1]]
			for attr in pattrs:
				if attr[0] in vaildlist :
					attrs.append(attr)
		attrlen = len(attrs)
		self.attrtable.SetAttrs(attrs)
		self.Refresh();
		for idx in range(attrlen) :
			attrreadonly = attrs[idx][2]
			self.SetReadOnly(idx, 0, True)
		
			self.SetReadOnly(idx, 1, attrreadonly)
			if attrreadonly :
				self.SetCellTextColour(idx,1,wx.Colour(128, 128, 128))
			else:
				self.SetCellTextColour(idx,1,wx.Colour(0, 0, 0))
			
		if attrlen < g_maxattrrows :
			for idx in range(attrlen,g_maxattrrows):
				self.SetReadOnly(idx, 0, True)
				self.SetReadOnly(idx, 1, True)
				self.SetCellTextColour(idx,1,wx.Colour(0, 0, 0))
				
	def GetAttrs(self):
		pass
		
	def CellChange(self, row, col):
		value =  self.GetCellValue(row, col)
		attrs = self.attrtable.GetAttrs()
		attrname = attrs[row][0]
		self.shapeeditor.SetAttr(attrname,value)
		
	def OnCellChange(self,evt):
		row = evt.GetRow()
		col = evt.GetCol()
		self.CellChange(row,col)
		
	# I do this because I don't like the default behaviour of not starting the
	# cell editor on double clicks, but only a second click.
	def OnLeftDClick(self, evt):
		if self.CanEnableCellControl():
			self.EnableCellEditControl()
			
	def OnLeftCellClick(self,evt):
		evt.Skip()
		row = evt.GetRow()
		col = evt.GetCol()
		value =  self.GetCellValue(row, col)
		attrs = self.attrtable.GetAttrs()
		if row >= len(attrs) :
			return
		attrname = attrs[row][0]
		attrtype = self.attrtable.GetAttrType(attrname)
		coltype = attrtype.split(':')[0]
		if coltype == GRID_VALUE_MULTICHOICE and col == 1:
			curvalues = attrs[row][1].split(',')
			choicelist = attrtype.split(':')[1].split(',')
			win = MultiChoice(self,wx.NO_BORDER,choicelist,curvalues,row,col)
			pos =  self.ClientToScreen( evt.GetPosition())
			win.Position(pos, (0,0))
			win.Popup()
			
	def OnSize(self,evt):
		col_0_w = 70
		size = evt.GetSize()
		self.SetColSize(0, col_0_w)
		col_1_w = size[0]-col_0_w-8
		if col_1_w < 80 :
			col_1_w = 80
		self.SetColSize(0, col_0_w)
		self.SetColSize(1, col_1_w)
		evt.Skip()
