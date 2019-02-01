# -*- coding: iso-8859-1 -*-
#
import Shape as sae
from AttrMapDef import *


class MyShape(sae.RectangleShape):
	def __init__(self,canvas):
		sae.RectangleShape.__init__(self,canvas)
		self.attrs =[
			{'tag':'Type',			'value':'CommWidget', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'Style',			'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'Position',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'Float',			'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- item name
			{'tag':'ItemName',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- position and size
			{'tag':'Left',			'value':0, 'type':'int', 'get':self._GetAttr, 'set':self._SetAttr, 'IsReadOnly':self._IsReadOnly },
			{'tag':'Top',			'value':0, 'type':'int', 'get':self._GetAttr, 'set':self._SetAttr, 'IsReadOnly':self._IsReadOnly },
			{'tag':'Width',			'value':0, 'type':'int', 'get':self._GetAttr, 'set':self._SetAttr, 'IsReadOnly':self._IsReadOnly },
			{'tag':'Height',		'value':0, 'type':'int', 'get':self._GetAttr, 'set':self._SetAttr, 'IsReadOnly':self._IsReadOnly },

			#-- zIndex
			{'tag':'ZIndex',		'value':0, 'type':'int', 'get':self._GetAttr, 'set':self._SetAttr, 'IsReadOnly':self._IsReadOnly },

			#-- list
			{'tag':'Template',		'value':0, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'ListCount',		'value':0, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'OtherTempl',	'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- all class: normal, hot, press
			{'tag':'NormalClass',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'HotClass',			'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'PressClass',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'DisableClass',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- defaultvalue ( for input, numinput, spininput, image, checkbox, radiogroup, commlabel,  commvalue )
			{'tag':'Defaultvalue',	'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- numinput and spininput
			{'tag':'Spinstep',			'value':1, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'Nummin',			'value':-0x7fffffff, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'Nummax',			'value':0x7fffffff, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},

			#-- tooltip
			{'tag':'Tooltip',			'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- button
			{'tag':'ButtonId',		'value':0, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'ButtonText',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- radiobox
			{'tag':'RadioId',		'value':0, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'RadioText',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- checkbox
			{'tag':'CheckId',		'value':0, 'type':'int','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'CheckText',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			#-- tabpanel
			{'tag':'TabTempList',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			{'tag':'TabBtnName',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			{'tag':'UIBack',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},

			{'tag':'BarColor',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
			
			{'tag':'CanSelect',		'value':'', 'type':'string','get':None, 'set':None, 'IsReadOnly':None},
		]
		self.paths = None

	#---------------------------------
	def SetItem(self,item):
		self.item = item

	#---------------------------------
	def GetItem(self):
		return self.item

	#---------------------------------
	def GetAttrs(self):
		retattrs = []
		for attr in self.attrs:
			tag = attr['tag']
			value = attr['value']
			if attr['get'] :
				value = attr['get'](tag)
			IsReadOnly = False
			if attr['IsReadOnly'] :
				IsReadOnly =  attr['IsReadOnly'](tag)
			retattrs.append([tag,value,IsReadOnly])
		return retattrs

	#---------------------------------
	def GetAttr(self, attrname):
		for attr in self.attrs :
			tag = attr['tag']
			if tag == attrname:
				if attr['get'] :
					return attr['get'] (tag)
				else:
					return attr['value']
		return None

	#---------------------------------
	def SetAttr(self, attrname, attrvalue):
		for attr in self.attrs :
			tag = attr['tag']
			if tag == attrname:
				value = 0
				if attr['type']  == 'int':
					value = int(attrvalue)
				else:
					value = attrvalue

				if attr['set'] :
					attr['set'] (tag, value)
				else:
					attr['value'] = value
				break

		postypes = ['Left','Top','Width','Height']
		isposattr =attrname in postypes
		if isposattr :
			x,y,w,h=self.GetDragRect()
			self.SetPosition(x,y)
			self.SetSize(w,h)
			self.SetDragEdge(0,0,0,0)

	#---------------------------------
	def SetAttrEx(self, attrname, attrvalue):
		for attr in self.attrs :
			tag = attr['tag']
			if tag == attrname:
				value = attrvalue
				if attr['set'] :
					attr['set'] (tag, value, True)
				else:
					attr['value'] = value
				break

	#---------------------------------
	def _GetAttr(self,attrname):
		if attrname == 'Left':
			return self.x
		elif attrname == 'Top':
			return self.y
		elif attrname == 'Width':
			return self.w
		elif attrname == 'Height':
			return self.h
		elif attrname == 'ZIndex':
			return self.zindex
		return 0

	#---------------------------------
	def _SetAttr(self,attrname,attrvalue,initflag=False):
		if attrname == 'Left':
			if not initflag :
				self.SetDragEdge(attrvalue-self.x,0,0,0)
			else:
				self.x = attrvalue
				self.Recalc()
		elif attrname == 'Top':
			if not initflag :
				self.SetDragEdge(0,attrvalue-self.y,0,0)
			else:
				self.y = attrvalue
				self.Recalc()
		elif attrname == 'Width':
			if not initflag :
				self.SetDragEdge(0,0,attrvalue-self.w,0)
			else:
				self.w = attrvalue
				self.Recalc()
		elif attrname == 'Height':
			if not initflag :
				self.SetDragEdge(0,0,0,attrvalue-self.h)
			else:
				self.h = attrvalue
				self.Recalc()
		elif attrname == 'ZIndex':
			self.zindex = attrvalue

	#---------------------------------
	def _IsReadOnly(self,attrname):
		if attrname == 'Left':
			return self.lockedge[0]
		elif attrname == 'Top':
			return self.lockedge[1]
		elif attrname == 'Width':
			return self.lockedge[2]
		elif attrname == 'Height':
			return self.lockedge[3]
		return False

	#---------------------------------
	def ReadFromConfig(self, cfgin):
		for k in cfgin:
			if k != 'z' :
				key = g_io_attr_decode_map[k]
				value = GetAttrInValue(key,cfgin[k],self.parent)
				self.SetAttrEx(key,value)
			else:
				for sc in cfgin['z']:
					shape = MyShape(self.canvas)
					shape.SetPosition(0,0)
					shape.SetSize(0,0)
					self.AddChild(shape)
					shape.ReadFromConfig(sc)

	#---------------------------------
	def WriteToConfig(self, cfgout):
		curattrs = self.GetAttrs()
		if curattrs[0][0] != 'Type' :
			return
		vaildlist = g_vaildlistmap[curattrs[0][1]]
		for attr in curattrs:
			value = GetAttrOutValue(attr[0],attr[1],self.parent)
			if (attr[0] in vaildlist) and value != None:
				cfgout[g_io_attr_encode_map[attr[0]]] = value
		if len(self.children) > 0 :
			cfgout['z'] = []
			for c in self.children:
				scfgout = {}
				c.WriteToConfig(scfgout)
				cfgout['z'].append(scfgout)
