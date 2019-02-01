# -*- coding: iso-8859-1 -*-
#

import wx
import math

SEL_NONE = -1
SEL_INRECT = 0
SEL_LEFT = 1
SEL_TOP = 2
SEL_RIGHT = 3
SEL_BOTTOM = 4
SEL_LEFTTOP = 5
SEL_TOPRIGHT = 6
SEL_RIGHTBOTTOM = 7
SEL_BOTTOMLEFT = 8

STATE_NORMAL = 0x1
STATE_HOT = 0x2
STATE_SEL1 = 0x4
STATE_SEL2 = 0x8
STATE_DRAGGING = 0x10

KEY_CTRL = 0x1
KEY_SHIFT = 0x2

SCROLL_UNIT_PIXEL = 20
SCROLL_EXT_UNIT = 5

g_shapetree = None


#----------------------------------------------------------------------
class CommandHandler:
	#-----------------------------------
	def __init__(self,canvas):
		self.canvas = canvas
		self.docmds = []
		self.undocmds = []

	#-----------------------------------
	def Clear(self):
		self.docmds = []
		self.undocmds = []

	#-----------------------------------
	def HasDoCmd(self):
		return len(self.docmds) > 0

	#-----------------------------------
	def HasUndoCmd(self):
		return len(self.undocmds) > 0

	#-----------------------------------
	def Do(self,cmdobj):
		self.docmds.append(cmdobj)
		self.undocmds = []

	#-----------------------------------
	def Undo(self):
		if len(self.docmds) > 0 :
			cmdobj = self.docmds.pop()
			self.undocmds.append(cmdobj)
			if cmdobj['cmd'] == 'setpos':
				for i in range(len(cmdobj['shapes'])):
					s = cmdobj['shapes'][i]
					pos,size = cmdobj['olds'][i]
					s.SetPosition(pos[0],pos[1])
					s.SetSize(size[0],size[1])
				self.canvas.Refresh(False)
			elif cmdobj['cmd'] == 'delete':
				for s in cmdobj['shapes'] :
					if s[0] != None :
						s[0].AddChild(s[1])
				self.canvas.Refresh(False)
			elif cmdobj['cmd'] == 'add':
				parent = cmdobj['shapes'][0]
				child  = cmdobj['shapes'][1]
				if parent != None:
					parent.DeleteChild(child)
				self.canvas.Refresh(False)

	#-----------------------------------
	def Redo(self):
		if len(self.undocmds) > 0 :
			cmdobj = self.undocmds.pop()
			self.docmds.append(cmdobj)
			if cmdobj['cmd'] == 'setpos':
				for i in range(len(cmdobj['shapes'])):
					s = cmdobj['shapes'][i]
					pos,size = cmdobj['news'][i]
					s.SetPosition(pos[0],pos[1])
					s.SetSize(size[0],size[1])
				self.canvas.Refresh(False)
			elif cmdobj['cmd'] == 'delete':
				for s in cmdobj['shapes'] :
					if s[0] != None :
						s[0].DeleteChild(s[1])
				self.canvas.Refresh(False)
			elif cmdobj['cmd'] == 'add':
				parent = cmdobj['shapes'][0]
				child  = cmdobj['shapes'][1]
				if parent != None:
					parent.AddChild(child)
				self.canvas.Refresh(False)


#---------------------------------------------------------------------------
def CmpShapeByZIndex(shape0,shape1):
	z0= shape0.GetZIndex()
	z1 = shape1.GetZIndex()
	if z0 < z1 :
		return -1;
	else:
		return 1;

#---------------------------------------------------------------------------
def CmpShapeByPositionX(shape0,shape1):
	x0,_ = shape0.GetPosition()
	x1,_ = shape1.GetPosition()
	if x0 < x1 :
		return -1;
	else:
		return 1;

#---------------------------------------------------------------------------
def CmpShapeByPositionY(shape0,shape1):
	_,y0 = shape0.GetPosition()
	_,y1 = shape1.GetPosition()
	if y0 < y1 :
		return -1;
	else:
		return 1;

#---------------------------------------------------------------------------
def IsPntInRect(x,y,w,h,px,py):
	return ( px >= x and px < (x+w) and py >=y and py < (y+h) )

#---------------------------------------------------------------------------
class ShapeCanvas(wx.ScrolledWindow):
	#-----------------------------------
	def __init__(self, parent = None, attrpanel = None, frame = None, id = -1, pos = wx.DefaultPosition, size = wx.DefaultSize, style = wx.BORDER, name = "ShapeCanvas"):
		wx.ScrolledWindow.__init__(self, parent, id, pos, size, style, name)
		self.attrpanel = attrpanel
		self.frame = frame
		wx.EVT_PAINT(self, self.OnPaint)
		wx.EVT_MOUSE_EVENTS(self, self.OnMouseEvent)
		self.Bind(wx.EVT_KEY_DOWN, self.OnKeyPressed)
		self.Bind(wx.EVT_KEY_UP, self.OnKeyUp)
		self.Bind(wx.EVT_ERASE_BACKGROUND, self.OnEraseBackground)
		self.curselshapelist = []
		self.curselshape = None
		self.hotshape = None
		self.cureditshape = None
		self.isdragging = False
		self.startdragpos = [0,0]
		self.dragseltype = SEL_NONE
		self.cmdhdr = None
		self.SetBackgroundColour("LIGHT BLUE")
		self.oneMoveKeyTrunkStart = False
		self.oneMoveKeyTrunkCmdObj = None
		self.cmdhdr = CommandHandler(self)
		self.copiedshapes = [];
		
		self.delayUpdateAttrTimer = wx.Timer(self) 
		self.Bind(wx.EVT_TIMER, self.OnDelayUpdateAttrTimer, self.delayUpdateAttrTimer) 

		acceltbl = wx.AcceleratorTable([
			(wx.ACCEL_CTRL, ord('Z'), 20001), #MENU_UNDO
			(wx.ACCEL_CTRL, ord('Y'), 20002), #MENU_REDO
			(wx.ACCEL_CTRL, ord('C'), 20017), #MENU_COPY
			(wx.ACCEL_CTRL, ord('V'), 20018) #MENU_PASTE
			])
		self.SetAcceleratorTable(acceltbl)

		global g_shapetree
		g_shapetree = self.frame.GetShapeTree()

	def GetCurEditShape(self):
		return self.cureditshape;

	#-----------------------------------
	def UpdateWindow(self,flag):
		if self.cureditshape != None:
			x,y,w,h = self.cureditshape.GetDragRect()
			maxWidth  = 2*x + w
			maxHeight = 2*y + h
			pos = self.GetViewStart()
			self.SetScrollbars(SCROLL_UNIT_PIXEL, SCROLL_UNIT_PIXEL, maxWidth/SCROLL_UNIT_PIXEL+SCROLL_EXT_UNIT, maxHeight/SCROLL_UNIT_PIXEL+SCROLL_EXT_UNIT, pos[0], pos[1], False)
		self.Refresh(flag)

	#-----------------------------------
	def GetCommandHandler(self):
		return self.cmdhdr

	#-----------------------------------
	def SetEditShape(self,shape):
		self.cmdhdr.Clear()
		self.cureditshape = shape
		self.ClearState()
		self.UpdateWindow(False)
		global g_shapetree
		g_shapetree.RecreateTree(shape)

	#-----------------------------------
	def GetCurSelShape(self):
		return self.curselshape

	#-----------------------------------
	def GetCurSelShapeList(self):
		return self.curselshapelist

	#-----------------------------------
	def SetAttr(self,attrname, attrvalue):
		if self.curselshape != None and len(self.curselshapelist) == 1 :
			postypes = ['Left','Top','Width','Height']
			isposattr =attrname in postypes
			cmdobj = None
			if isposattr and self.cmdhdr != None:
				cmdobj = {'cmd':'setpos','shapes':[],'olds':[],'news':[]}
				cmdobj['shapes'].append(self.curselshape);
				cmdobj['olds'].append([self.curselshape.GetPosition(),self.curselshape.GetSize()]);

			self.curselshape.SetAttr(attrname, attrvalue)

			if isposattr and self.cmdhdr != None:
				cmdobj['news'].append([self.curselshape.GetPosition(),self.curselshape.GetSize()]);
				self.cmdhdr.Do(cmdobj);

			if attrname == 'Type':
				self.UpdateShapeAttr()
			self.UpdateWindow(False)

	#-----------------------------------
	def Align(self,atype):
		cshapes = self.CombineShape()
		if atype == 'la' or atype == 'ra' or atype == 'ta' or atype == 'ba' or atype == 'samew' or atype == 'sameh' or atype == 'samesize':
			if self.curselshape != None and len(cshapes) > 1 :
				x0,y0 = self.curselshape.GetPosition()
				w0,h0 = self.curselshape.GetSize()
				x1 = x0+w0
				y1 = y0+h0
				cmdobj = {'cmd':'setpos','shapes':[],'olds':[],'news':[]}
				for cs in cshapes:
					cmdobj['shapes'].append(cs);
					cmdobj['olds'].append([cs.GetPosition(),cs.GetSize()]);
					self.ClearShapeBitState(cs,STATE_DRAGGING)
					x,y = cs.GetPosition()
					w,h = cs.GetSize()
					if atype == 'la':
						x = x0
					elif atype == 'ra':
						x = x1 - w
					elif atype == 'ta':
						y = y0
					elif atype == 'ba':
						y = y1 - h
					elif atype == 'samew':
						w = w0
					elif atype == 'sameh':
						h = h0
					elif atype == 'samesize':
						w = w0
						h = h0
					cs.SetPosition(x,y)
					cs.SetSize(w,h)
					cs.SetDragEdge(0,0,0,0)
					cmdobj['news'].append([cs.GetPosition(),cs.GetSize()]);
				self.isdragging = False
				needupdate = True
				if self.cmdhdr != None and len(cshapes) > 0:
					self.cmdhdr.Do(cmdobj);
				self.UpdateWindow(False)
		elif atype == 'hcenter' or atype == 'vcenter':
			if len(cshapes) > 0:
				parent = cshapes[0].GetParent()
				if parent == None : return
				pw,ph = parent.GetSize()
				minx,miny,maxw,maxh = self.GetSelectBounder(cshapes)
				offx = (pw - maxw) / 2 - minx
				offy = (ph - maxh) / 2 - miny
				cmdobj = {'cmd':'setpos','shapes':[],'olds':[],'news':[]}
				for cs in cshapes:
					cmdobj['shapes'].append(cs);
					cmdobj['olds'].append([cs.GetPosition(),cs.GetSize()]);
					self.ClearShapeBitState(cs,STATE_DRAGGING)
					x,y = cs.GetPosition()
					w,h = cs.GetSize()
					if atype == 'hcenter':
						x = x + offx
					elif atype == 'vcenter':
						y = y + offy
					cs.SetPosition(x,y)
					cs.SetSize(w,h)
					cs.SetDragEdge(0,0,0,0)
					cmdobj['news'].append([cs.GetPosition(),cs.GetSize()]);
				self.isdragging = False
				needupdate = True
				if self.cmdhdr != None and len(cshapes) > 0:
					self.cmdhdr.Do(cmdobj);
				self.UpdateWindow(False)
		elif atype == 'hspace' or atype == 'vspace':
			if self.curselshape != None and len(cshapes) > 2 :
				minx,miny,maxw,maxh = self.GetSelectBounder(cshapes)
				totalw = totalh = 0
				for cs in cshapes :
					w,h = cs.GetSize()
					totalw = totalw + w
					totalh = totalh + h
				spacew = (maxw - totalw) / (len(cshapes) - 1)
				spaceh = (maxh - totalh) / (len(cshapes) - 1)
				startx = minx
				starty = miny

				#sort shape by x or y
				if atype == 'hspace':
					cshapes.sort(CmpShapeByPositionX);
				elif atype == 'vspace':
					cshapes.sort(CmpShapeByPositionY);

				cmdobj = {'cmd':'setpos','shapes':[],'olds':[],'news':[]}
				for cs in cshapes:
					cmdobj['shapes'].append(cs);
					cmdobj['olds'].append([cs.GetPosition(),cs.GetSize()]);
					self.ClearShapeBitState(cs,STATE_DRAGGING)
					x,y = cs.GetPosition()
					w,h = cs.GetSize()
					if atype == 'hspace':
						x = startx
						startx = startx + spacew + w
					elif atype == 'vspace':
						y = starty
						starty = starty + spaceh + h
					cs.SetPosition(x,y)
					cs.SetDragEdge(0,0,0,0)
					cmdobj['news'].append([cs.GetPosition(),cs.GetSize()]);

				self.isdragging = False
				needupdate = True
				if self.cmdhdr != None and len(cshapes) > 0:
					self.cmdhdr.Do(cmdobj);
				self.UpdateWindow(False)
		self.UpdateShapeAttr()

	#-----------------------------------
	def setSameAttr(self,t):
		attrnames = ['Type', 'Style', 'Position', 'Float', 'NormalClass', 'HotClass', 'PressClass', 'DisableClass', 'Spinstep', 'UIBack', 'BarColor']
		cshapes = self.CombineShape()
		if self.curselshape != None and len(cshapes) > 1 :
			for c in cshapes:
				for aname in attrnames:
					c.SetAttr(aname, self.curselshape.GetAttr(aname))

	#-----------------------------------
	def GetSelectBounder(self,cshapes):
		minx = miny = 100000
		maxx = maxy = -100000
		for cs in cshapes :
			x,y = cs.GetPosition()
			w,h = cs.GetSize()
			if x < minx :
				minx = x
			if y < miny :
				miny = y
			if (x+w) > maxx :
				maxx = x + w
			if (y+h) > maxy :
				maxy = y + h
		maxw = maxx - minx
		maxh = maxy - miny
		return minx, miny, maxw, maxh

	#-----------------------------------
	def GetXorRects(self,rect1,rect2):
		rects = []
		rects.append([0,0,rect2[2]+1,rect1[1]+1])
		rects.append([0,rect1[1],rect1[0]+1,rect1[3]+1])
		rects.append([0,rect1[1]+rect1[3],rect2[2]+1,2048])
		rects.append([rect1[0]+rect1[2],rect1[1],2048,rect1[3]+1])
		return rects

	#-----------------------------------
	def OnPaint(self, evt):
		dc = wx.PaintDC(self)
		self.PrepareDC(dc)
		if self.cureditshape != None:
			rect1 = [0,0,0,0]
			rect1[0],rect1[1],rect1[2],rect1[3] = self.cureditshape.GetDragRect()
			winsize = self.GetSize()
			pos = self.GetViewStart()
			winsize[0] = winsize[0] + (pos[0]+SCROLL_EXT_UNIT)*SCROLL_UNIT_PIXEL
			winsize[1] = winsize[1] + (pos[1]+SCROLL_EXT_UNIT)*SCROLL_UNIT_PIXEL
			rect2 = [0,0,winsize[0],winsize[1]]
			rects = self.GetXorRects(rect1, rect2);
			dc.SetBrush(wx.Brush(self.GetBackgroundColour(), wx.SOLID))
			dc.SetPen(wx.Pen(self.GetBackgroundColour(), 1, wx.SOLID))
			for rect in rects :
				dc.DrawRectangle(rect[0], rect[1], rect[2], rect[3])
		else:
			dc.SetBackground(wx.Brush(self.GetBackgroundColour(), wx.SOLID))
			dc.Clear()

		# draw cur edit shape
		if self.cureditshape != None:
			self.cureditshape.OnDraw(dc, 'solid')

		# draw cur sel shape
		if self.curselshape != None :
			self.curselshape.OnDraw(dc, 'dot')


	#-----------------------------------
	def ClearState(self):
		self.curselshapelist = []
		self.curselshape = None
		self.isdragging = False
		self.startdragpos = [0,0]
		self.dragseltype = SEL_NONE
		self.oneMoveKeyTrunkStart = False
		self.curselshape = None

	#-----------------------------------
	def UserAddShape(self,parent,shape):
		if parent == None:
			self.cmdhdr.Clear()
			self.ClearState()
			self.SetEditShape(shape)
		else:
			parent.AddChild(shape);

		if self.cmdhdr != None:
			cmdobj = {'cmd':'add','shapes':[parent,shape]}
			self.cmdhdr.Do(cmdobj);

		self.UpdateWindow(False)
		self.UpdateShapeAttr()
		
	def AddShapeCmd(self, shape):
		curselshape = self.GetCurSelShape()
		selshapelist = self.GetCurSelShapeList()
		if curselshape != None and len(selshapelist)  == 1:
			shape.SetSize(50,22)
			self.UserAddShape(curselshape, shape)
			
	def DelShapeCmd(self):
		self.UserDeleteCurSelShape()
		
	def CopyShapeCmd(self):
		selshapelist = self.GetCurSelShapeList()
		if len(selshapelist) == 0: return
		self.copiedshapes = [];
		for shape in selshapelist:
			self.copiedshapes.append(shape.clone())			
			
	def PasteShapeCmd(self):
		curselshape = self.GetCurSelShape()
		if curselshape == None : return
		for shape in self.copiedshapes:
			self.UserAddShape(curselshape, shape.clone())
		
	#-----------------------------------
	def UserDeleteCurSelShape(self):
		if self.curselshape != None :
			cshapes = self.CombineShape()
			cmdobj = {'cmd':'delete','shapes':[]}
			for cs in cshapes:
				parent = cs.GetParent();
				if parent != None:
					cmdobj['shapes'].append([parent,cs]);
					self.ClearShapeBitState(cs,STATE_SEL1)
					self.ClearShapeBitState(cs,STATE_SEL2)
					parent.DeleteChild(cs)
				'''
				else:
					dlg = wx.MessageDialog(self, 'È·ÈÏÉ¾³ýµ±Ç°Ñ¡ÖÐµÄshape?',
						'È·ÈÏÉ¾³ý',
						wx.YES_NO | wx.ICON_INFORMATION
					)
					if dlg.ShowModal() in [wx.ID_NO, wx.ID_CANCEL]:
						dlg.Destroy()
					else:
						dlg.Destroy()
						self.ClearShapeBitState(cs,STATE_SEL1)
						self.ClearShapeBitState(cs,STATE_SEL2)
						cmdobj['shapes'].append([None,cs]);
						self.DeleteShape(cs)
				'''
			self.ClearState()
			if self.cmdhdr != None and len(cmdobj['shapes']) > 0:
				self.cmdhdr.Do(cmdobj);

			if len(cshapes) > 0 :
				self.UpdateWindow(False)
		self.UpdateShapeAttr()

	#-----------------------------------
	def ClearShapeBitState(self,shape,bstate):
		state = shape.GetState()
		shape.SetState(state&(~bstate))

	#-----------------------------------
	def SetShapeBitState(self,shape,bstate):
		state = shape.GetState()
		shape.SetState(state|bstate)

	#-----------------------------------
	def ClearSelectList(self):
		for s in self.curselshapelist:
			self.ClearShapeBitState(s,STATE_SEL1)
			self.ClearShapeBitState(s,STATE_SEL2)
		self.curselshapelist = []

	#-----------------------------------
	def FindInSelectList(self,shape):
		for s in self.curselshapelist:
			if s == shape :
				return True
		return False

	#-----------------------------------
	def SelectOneShape(self,shape):
		self.ClearSelectList()
		self.dragseltype = SEL_INRECT
		self.curselshape = shape
		self.SetShapeBitState(self.curselshape,STATE_SEL1)
		self.curselshapelist.append(self.curselshape)
		self.UpdateShapeAttr()
		self.UpdateWindow(False)

	#-----------------------------------
	def OnSelectShape(self,evt,keys,hottype, hotshape):
		needupdate = True
		self.dragseltype = SEL_NONE
		if hottype == SEL_NONE or hotshape == None :
			self.ClearSelectList()
			self.curselshape = None
			self.UpdateShapeAttr()
			return needupdate;

		if (keys&KEY_CTRL) == KEY_CTRL:
			if self.FindInSelectList(hotshape) :
				self.ClearShapeBitState(hotshape,STATE_SEL1)
				self.ClearShapeBitState(hotshape,STATE_SEL2)
				self.curselshapelist.remove(hotshape)
				listlen = len(self.curselshapelist)
				if  listlen > 0 :
					self.curselshape = self.curselshapelist[listlen-1]
				else:
					self.curselshape = None
			else:
				self.dragseltype = hottype
				for s in self.curselshapelist:
					self.ClearShapeBitState(s,STATE_SEL1)
					self.SetShapeBitState(s,STATE_SEL2)
				self.curselshape = hotshape
				self.SetShapeBitState(self.curselshape,STATE_SEL1)
				self.curselshapelist.append(self.curselshape)
		else:
			if self.FindInSelectList(hotshape) and len(self.curselshapelist) > 1:
				self.dragseltype = SEL_INRECT
			else:
				self.ClearSelectList()
				self.dragseltype = hottype
				self.curselshape = hotshape
				self.SetShapeBitState(self.curselshape,STATE_SEL1)
				self.curselshapelist.append(self.curselshape)
				global g_shapetree
				g_shapetree.SelectShape(self.curselshape)

		self.UpdateShapeAttr()
		return needupdate
		
	def OnDelayUpdateAttrTimer(self, evt):
		if self.curselshape != None and len(self.curselshapelist) == 1 :
			self.attrpanel.SetAttrs(self.curselshape.GetAttrs())
		else:
			self.attrpanel.SetAttrs([])

	#-----------------------------------
	def UpdateShapeAttr(self):
		self.delayUpdateAttrTimer.Start(1, True)

	#-----------------------------------
	def CombineShape(self):
		cshapes = []
		for s in self.curselshapelist :
			findparent = False
			for ss in self.curselshapelist :
				parent = s.GetParent()
				while parent != None :
					if parent == ss :
						findparent = True
						break
					parent = parent.GetParent()
				if findparent :
					break
			if not findparent :
				cshapes.append(s)
		return cshapes

	#-----------------------------------
	def OnEraseBackground(self,event):
		pass

	#-----------------------------------
	def OnKeyPressed(self,evt):
		offx = 0
		offy = 0
		drt = 1
		keycode = evt.GetKeyCode()
		if evt.ShiftDown():
			drt = 10
		if keycode == wx.WXK_LEFT:
			offx = (-1)*drt
		elif keycode == wx.WXK_UP:
			offy = (-1)*drt
		elif keycode == wx.WXK_RIGHT:
			offx = drt
		elif keycode == wx.WXK_DOWN:
			offy = drt
		if offx != 0 or offy != 0 :
			cshapes2 = self.CombineShape()
			cshapes = []
			for cs in cshapes2:
				if cs.GetParent() != None :
					cshapes.append(cs)

			if len(cshapes) > 0 :
				if not self.oneMoveKeyTrunkStart :
					self.oneMoveKeyTrunkCmdObj = {'cmd':'setpos','shapes':[],'olds':[],'news':[]}
					for cs in cshapes:
						if cs.GetParent() != None :
							self.oneMoveKeyTrunkCmdObj['shapes'].append(cs);
							self.oneMoveKeyTrunkCmdObj['olds'].append([cs.GetPosition(),cs.GetSize()]);
					self.oneMoveKeyTrunkStart = True

			for cs in cshapes:
				self.ClearShapeBitState(cs,STATE_DRAGGING)
				x,y,w,h=cs.GetDragRect()
				cs.SetPosition(x+offx,y+offy)
				cs.SetSize(w,h)
				cs.SetDragEdge(0,0,0,0)

			if len(cshapes) > 0 :
				self.UpdateWindow(False)

		if keycode == wx.WXK_DELETE:
			self.UserDeleteCurSelShape()

	#-----------------------------------
	def OnKeyUp(self,evt):
		if self.oneMoveKeyTrunkStart :
			self.oneMoveKeyTrunkStart = False
			cshapes2 = self.CombineShape()
			cshapes = []
			for cs in cshapes2:
				if cs.GetParent() != None :
					cshapes.append(cs)

			for cs in cshapes:
				self.oneMoveKeyTrunkCmdObj['news'].append([cs.GetPosition(),cs.GetSize()]);

			if self.cmdhdr != None and len(cshapes) > 0 :
				self.cmdhdr.Do(self.oneMoveKeyTrunkCmdObj);
		self.UpdateShapeAttr()

	#-----------------------------------
	def OnMouseEvent(self, evt):
		if evt.ButtonDown():
			self.SetFocus()

		if self.cureditshape == None or self.oneMoveKeyTrunkStart :
			return

		dc = wx.ClientDC(self)
		self.PrepareDC(dc)
		x, y = evt.GetLogicalPosition(dc)
		hottype, hotshape = self.GetFromCurSelShape([x,y])
		if hottype == SEL_NONE:
			hottype, hotshape = self.cureditshape.GetShapeByPnt([x,y])

		keys = 0
		if evt.ShiftDown():
			keys |= KEY_SHIFT
		if evt.ControlDown():
			keys |= KEY_CTRL

		needupdate = False
		dragging = evt.Dragging()
		if dragging:
			if self.curselshape != None and self.dragseltype != SEL_NONE:
				drtx = x - self.startdragpos[0]
				drty = y - self.startdragpos[1]
				if self.dragseltype != SEL_INRECT:
					self.SetShapeBitState(self.curselshape,STATE_DRAGGING)

				if self.dragseltype == SEL_INRECT:
					cshapes = self.CombineShape()
					for cs in cshapes:
						self.SetShapeBitState(cs,STATE_DRAGGING)
						cs.SetDragEdge(drtx,drty,drtx,drty)
				elif self.dragseltype == SEL_LEFT:
					self.curselshape.SetDragEdge(drtx,0,0,0)
				elif self.dragseltype == SEL_TOP:
					self.curselshape.SetDragEdge(0,drty,0,0)
				elif self.dragseltype == SEL_RIGHT:
					self.curselshape.SetDragEdge(0,0,drtx,0)
				elif self.dragseltype == SEL_BOTTOM:
					self.curselshape.SetDragEdge(0,0,0,drty)
				elif self.dragseltype == SEL_LEFTTOP:
					self.curselshape.SetDragEdge(drtx,drty,0,0)
				elif self.dragseltype == SEL_TOPRIGHT:
					self.curselshape.SetDragEdge(0,drty,drtx,0)
				elif self.dragseltype == SEL_RIGHTBOTTOM:
					self.curselshape.SetDragEdge(0,0,drtx,drty)
				elif self.dragseltype == SEL_BOTTOMLEFT:
					self.curselshape.SetDragEdge(drtx,0,0,drty)

				self.isdragging = True
				needupdate = True
		else:
			if evt.LeftDown() :
				# change select shape
				try:
					self.CaptureMouse()
				except:
					pass
				needupdate = self.OnSelectShape(evt,keys,hottype,hotshape)
				self.startdragpos[0] = x
				self.startdragpos[1] = y
			elif evt.LeftUp() :
				try:
					self.ReleaseMouse()
				except:
					pass
				if self.isdragging and self.curselshape != None and self.dragseltype != SEL_NONE:
					cshapes = self.CombineShape()
					cmdobj = {'cmd':'setpos','shapes':[],'olds':[],'news':[]}
					for cs in cshapes:
						cmdobj['shapes'].append(cs);
						cmdobj['olds'].append([cs.GetPosition(),cs.GetSize()]);
						self.ClearShapeBitState(cs,STATE_DRAGGING)
						x,y,w,h=cs.GetDragRect()
						cs.SetPosition(x,y)
						cs.SetSize(w,h)
						cs.SetDragEdge(0,0,0,0)
						cmdobj['news'].append([cs.GetPosition(),cs.GetSize()]);
					self.isdragging = False
					needupdate = True
					if self.cmdhdr != None and len(cshapes) > 0:
						self.cmdhdr.Do(cmdobj);
				self.UpdateShapeAttr()
			elif evt.Moving():
				oldhotshape = self.hotshape
				if hottype != SEL_NONE :
					self.hotshape = hotshape
				else:
					self.hotshape = None
				if oldhotshape != self.hotshape:
					if oldhotshape != None:
						state =oldhotshape.GetState()
						oldhotshape.SetState(state&(~STATE_HOT))
					if self.hotshape != None:
						state =self.hotshape.GetState()
						self.hotshape.SetState(state|STATE_HOT)
					needupdate = True
			else:
				pass

		if needupdate :
			self.UpdateWindow(False)

	def GetFromCurSelShape(self, refpnt):
		if self.curselshape != None and len(self.curselshapelist) == 1 :
			rx = 0
			ry = 0
			parent = self.curselshape.GetParent()
			while parent != None :
				x, y = parent.GetPosition()
				rx = rx + x
				ry = ry + y
				parent = parent.GetParent()
			return self.curselshape.GetSelDragCorner([refpnt[0]-rx, refpnt[1]-ry])
		return SEL_NONE,None

#----------------------------------------------------------------------
class RectangleShape:
	#---------------------------------
	def __init__(self,canvas):
		self.parent = None
		self.canvas = canvas
		self.dottedPen = wx.Pen(wx.Colour(0, 0, 0), 1, wx.DOT)
		self.sel_w = 6
		self.sel_h = 6
		self.sel_s = 1
		self.children = []
		self.x = 10
		self.y = 10
		self.w = 100
		self.h = 100
		self.drag_l=0
		self.drag_t=0
		self.drag_r=0
		self.drag_b=0
		self.zindex=0
		self.state = STATE_NORMAL
		self.lockedge = [False,False,False,False]
		self.minsize = [2,2]
		self.selectrects = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
		self.Recalc()
		
	#---------------------------------
	def LockEdge(self,l,t,r,b):
		self.lockedge = [l,t,r,b]

	#---------------------------------
	def SetMinSize(self,w,h):
		self.minsize = [w,h]

	#---------------------------------
	def SetZIndex(self,zindex):
		self.zindex = zindex

	#---------------------------------
	def GetZIndex(self):
		return self.zindex;

	#---------------------------------
	def GetChildren(self):
		return self.children

	#---------------------------------
	def AddChild(self,child):
		child.SetParent(self)
		self.children.append(child)
		global g_shapetree
		g_shapetree.AddChild(self,child)

	#---------------------------------
	def DeleteChild(self,child):
		global g_shapetree
		g_shapetree.DeleteChild(child)
		self.children.remove(child)

	#---------------------------------
	def SetPosition(self,x,y):
		self.x = x
		self.y = y
		self.Recalc()

	#---------------------------------
	def SetDragEdge(self,l,t,r,b):
		if not self.lockedge[0]:
			self.drag_l=l
		if not self.lockedge[1]:
			self.drag_t=t
		if not self.lockedge[2]:
			self.drag_r=r
		if not self.lockedge[3]:
			self.drag_b=b

		if l != 0 and r != 0 and l == r :
			if self.lockedge[0] or self.lockedge[2] :
				self.drag_l = self.drag_r = 0

		if t!= 0 and b != 0 and t == b :
			if self.lockedge[1] or self.lockedge[2] :
				self.drag_t = self.drag_b = 0

	#---------------------------------
	def GetDragEdge(self):
		return self.drag_l,self.drag_t,self.drag_r,self.drag_b

	#---------------------------------
	def GetPosition(self):
		return self.x,self.y

	#---------------------------------
	def GetSize(self):
		return self.w, self.h

	#---------------------------------
	def SetSize(self,w,h):
		self.w = w
		self.h = h
		self.Recalc()

	#---------------------------------
	def SetParent(self,parent):
		self.parent = parent

	#---------------------------------
	def GetParent(self):
		return self.parent;

	#---------------------------------
	def Swap(self, shape1, shape2):
		idx1 = -1
		for i in range(0, len(self.children)) :
			if self.children[i] == shape1:
				idx1 = i
				break
		if idx1 == -1 :
			return

		idx2 = -1
		for i in range(0, len(self.children)) :
			if self.children[i] == shape2:
				idx2 = i
				break
		if idx2 == -1 :
			return

		tmp = self.children[idx1]
		self.children[idx1] = self.children[idx2]
		self.children[idx2] = tmp


	#---------------------------------
	def GetState(self):
		return self.state

	#---------------------------------
	def SetState(self,state):
		self.state = state

	#---------------------------------
	def GetShapeByPnt(self,refpnt):
		if not IsPntInRect(self.x,self.y,self.w,self.h,refpnt[0],refpnt[1]) :
			return SEL_NONE,None
		children = []
		for c in self.children:
			children.append(c)
		children.sort(CmpShapeByZIndex)
		for i in range(len(children), 0, -1):
			c = children[i-1]
			crefpnt = [refpnt[0]-self.x, refpnt[1]-self.y]
			type,shape = c.GetShapeByPnt(crefpnt)
			if type != SEL_NONE:
				return type,shape
		return SEL_INRECT,self
		'''
		if IsPntInRect(self.x,self.y,self.w,self.h,refpnt[0],refpnt[1]) :
			for c in self.children:
				crefpnt = [refpnt[0]-self.x, refpnt[1]-self.y]
				type,shape = c.GetShapeByPnt(crefpnt)
				if type != SEL_NONE:
					return type,shape
			return SEL_INRECT,self
		return SEL_NONE,None
		'''
	#---------------------------------
	def GetSelDragCorner(self, refpnt):
		if (self.state&STATE_SEL1) == STATE_SEL1 :
			idx = 0
			for s in self.selectrects :
				if IsPntInRect(s[0],s[1],self.sel_w,self.sel_h,refpnt[0],refpnt[1]) :
					return (idx+1),self
				idx = idx + 1
		return SEL_NONE,None

	#---------------------------------
	def OnDraw(self,dc,flag):
		offx, offy = self.GetOffset()
		if (self.state&STATE_DRAGGING) != STATE_DRAGGING : # draw rectangle
			if flag == 'solid':
				dc.SetPen(wx.BLACK_PEN)
				dc.SetBrush(wx.WHITE_BRUSH)
				dc.DrawRectangle(self.x+offx, self.y+offy, self.w, self.h)
			else :
				dc.SetPen(self.dottedPen)
				dc.SetBrush(wx.WHITE_BRUSH)
				dc.DrawLine(offx+self.x,offy+self.y,offx+self.x+self.w-1,offy+self.y)
				dc.DrawLine(offx+self.x+self.w-1,offy+self.y, offx+self.x+self.w-1,offy+self.y+self.h-1)
				dc.DrawLine(offx+self.x+self.w-1,offy+self.y+self.h-1, offx+self.x,offy+self.y+self.h-1)
				dc.DrawLine(offx+self.x,offy+self.y,offx+self.x,offy+self.y+self.h-1)

			# draw select block
			if (self.state&STATE_SEL1) == STATE_SEL1  or (self.state&STATE_SEL2) == STATE_SEL2 :
				if (self.state&STATE_SEL1) == STATE_SEL1 :
					dc.SetPen(wx.BLACK_PEN)
					dc.SetBrush(wx.BLACK_BRUSH)
				elif (self.state&STATE_SEL2) == STATE_SEL2 :
					dc.SetPen(wx.BLACK_PEN)
					dc.SetBrush(wx.WHITE_BRUSH)
				for r in self.selectrects:
					dc.DrawRectangle(r[0]+offx, r[1]+offy, self.sel_w, self.sel_h)

			if (self.state&STATE_HOT) == STATE_HOT : #draw hot
				dc.SetPen(wx.GREEN_PEN)
				dc.SetBrush(wx.WHITE_BRUSH)
				dc.DrawLine(offx+self.x,offy+self.y,offx+self.x+self.w,offy+self.y+self.h)
				dc.DrawLine(offx+self.x+self.w,offy+self.y,offx+self.x,offy+self.y+self.h)
		else: # draw drag
			dc.SetPen(self.dottedPen)
			dc.SetBrush(wx.WHITE_BRUSH)
			x,y,w,h=self.GetDragRect()
			dc.DrawRectangle(x+offx,y+offy,w,h)

		# draw children , order by zindex
		children = []
		for c in self.children:
			children.append(c)
		children.sort(CmpShapeByZIndex)
		for c in children:
			c.OnDraw(dc, flag)

	#---------------------------------
	def GetDragRect(self):
		x0 = self.x+self.drag_l
		y0 = self.y+self.drag_t
		x1 = self.x+self.w+self.drag_r
		y1 = self.y+self.h+self.drag_b
		if (x0+self.minsize[0]) >= x1 :
			if self.drag_l != 0:
				x0 = x1-self.minsize[0]
			elif self.drag_r != 0:
				x1 = x0 + self.minsize[0]
		if (y0+self.minsize[1]) >= y1:
			if self.drag_t != 0:
				y0 = y1-self.minsize[1]
			elif self.drag_b != 0:
				y1 = y0 + self.minsize[1]
		return x0,y0,(x1-x0),(y1-y0)

	#---------------------------------
	def GetOffset(self):
		x = 0
		y = 0
		parent = self.GetParent()
		while parent != None :
			px,py=parent.GetPosition()
			l,t,r,b=parent.GetDragEdge()
			x = x + px + l
			y = y + py + t
			parent = parent.GetParent()
		return x,y

	#---------------------------------
	def GetAttrs(self):
		pass

	#---------------------------------
	def SetAttr(self, attrname, attrvalue):
		pass

	#---------------------------------
	def Recalc(self):
		# left
		x = self.x - self.sel_s - self.sel_w
		y = self.y + self.h/2 - self.sel_h/2
		self.selectrects[0][0] = x
		self.selectrects[0][1] = y

		#top
		x = self.x + self.w/2 - self.sel_w/2
		y = self.y -self.sel_s - self.sel_h
		self.selectrects[1][0] = x
		self.selectrects[1][1] = y

		#right
		x = self.x + self.w + self.sel_s
		y = self.y + self.h/2 - self.sel_h/2
		self.selectrects[2][0] = x
		self.selectrects[2][1] = y

		#bottom
		x = self.x + self.w/2 - self.sel_w/2
		y = self.y + self.h + self.sel_s
		self.selectrects[3][0] = x
		self.selectrects[3][1] = y

		# left top
		x = self.x - self.sel_s - self.sel_w
		y = self.y - self.sel_s - self.sel_h
		self.selectrects[4][0] = x
		self.selectrects[4][1] = y

		# right top
		x = self.x + self.w + self.sel_s
		y = self.y - self.sel_s - self.sel_h
		self.selectrects[5][0] = x
		self.selectrects[5][1] = y

		# right bottom
		x = self.x + self.w + self.sel_s
		y = self.y + self.h + self.sel_s
		self.selectrects[6][0] = x
		self.selectrects[6][1] = y

		# left bottom
		x = self.x - self.sel_s - self.sel_w
		y = self.y + self.h + self.sel_s
		self.selectrects[7][0] = x
		self.selectrects[7][1] = y
