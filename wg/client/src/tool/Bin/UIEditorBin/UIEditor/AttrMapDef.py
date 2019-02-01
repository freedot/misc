import  wx
import  wx.grid as gridlib

#=============================== widgettype ===========================
g_widgettypes = [
	['CommWidget',0],
	['CommBtn',1],
	['List',2],
	['Numinput',3],
	['CommLabel',4],
	['CommValue',5],
	['Image',6],
	['CheckBox',7],
	['RadioBox',8],
	['SpinInput',9],
	['Input',10],
	['DropList',11],
	['TabCtrlBar',12],
	['TabContainer',13],
	['TabPage',14],
	['AreaInput',15],
	['Tree',16],
	['ProgressBar',17],
	['CommLabel',18],
	['CommValue',19],
	['CommHeadCol',20],
	['PageNavigate',21],
]
g_widgettypes_map = {}
for type in g_widgettypes:
	g_widgettypes_map[type[0]] = type[1]
g_widgettypes_rev_map = {}
for type in g_widgettypes:
	g_widgettypes_rev_map[type[1]] = type[0]
g_widgettypes_str = ''
for type in g_widgettypes:
	if g_widgettypes_str != '':
		g_widgettypes_str = g_widgettypes_str + ','
	g_widgettypes_str = g_widgettypes_str + type[0]
#-----------------------------------------------------------------------------------------


#=============================== widgetstyle ===========================
g_widgetstyle = [
	['Autoscroll',0x1],
	['CheckRadio',0x2],
	['CheckButton',0x4],
	['SpinButton',0x8],
	['InputReadOnly',0x10],
	['AutoWidth',0x20],
	['AutoHeight',0x40],
	['IgnoreLeftTop',0x80],
	['ProgShowVal',0x100],
	['ProgShowPer',0x200],
	['ZeroLeftTop',0x400],
	['CancelFirstClick',0x800],
	['v_middle',0x1000],
	['v_top',0x2000],
	['v_bottom',0x4000],
	['h_left',0x8000],
	['h_center',0x10000],
	['h_right',0x20000],
	['PagenavigateEdgebtn',0x40000],
]
g_widgetstyle_map = {}
for style in g_widgetstyle:
	g_widgetstyle_map[style[0]] = style[1]
g_widgetstyle_str = ''
for style in g_widgetstyle:
	if g_widgetstyle_str != '':
		g_widgetstyle_str = g_widgetstyle_str + ','
	g_widgetstyle_str = g_widgetstyle_str + style[0]
#-----------------------------------------------------------------------------------------


g_vaildlistmap = {
	'CommWidget':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','HotClass','PressClass','DisableClass','Defaultvalue','Tooltip', 'CanSelect'],
	'CommBtn':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ButtonId','ButtonText','ZIndex','UIBack','Tooltip'],
	'List':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','Template','OtherTempl','ListCount','ZIndex','NormalClass','HotClass','PressClass','Tooltip', 'CanSelect'],
	'Numinput':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','Nummin','Nummax','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'Image':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'CheckBox':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','CheckId','CheckText','UIBack','Defaultvalue','Tooltip', 'CanSelect'],
	'RadioBox':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','RadioId','RadioText','ZIndex','UIBack','Defaultvalue','Tooltip', 'CanSelect'],
	'SpinInput':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','Nummin','Nummax','Spinstep','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'Input':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'DropList':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','Template','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'TabCtrlBar':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','TabTempList','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','UIBack','Tooltip', 'CanSelect'],
	'TabContainer':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','TabTempList','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'TabPage':['Type','Style','Position','Float','ItemName','TabBtnName','Left','Top','Width','Height','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'AreaInput':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','HotClass','PressClass','Defaultvalue','Tooltip', 'CanSelect'],
	'Tree':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','HotClass','PressClass', 'CanSelect'],
	'ProgressBar':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','UIBack','BarColor','Tooltip', 'CanSelect'],
	'CommLabel':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','Defaultvalue','Tooltip', 'CanSelect'],
	'CommValue':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','Defaultvalue','Tooltip', 'CanSelect'],
	'CommHeadCol':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','Defaultvalue','Tooltip', 'CanSelect'],
	'PageNavigate':['Type','Style','Position','Float','ItemName','Left','Top','Width','Height','ZIndex','NormalClass','Defaultvalue','Tooltip', 'CanSelect'],
}

g_maxattrrows = 21
GRID_VALUE_MULTICHOICE  = 'multichoice'
g_attrmaps = {
	'Type':gridlib.GRID_VALUE_CHOICE + ':' + g_widgettypes_str,
	'Style':GRID_VALUE_MULTICHOICE + ':' + g_widgetstyle_str,
	'Position':gridlib.GRID_VALUE_CHOICE + ':absolute,relative',
	'Float':gridlib.GRID_VALUE_CHOICE + ':none,left,right',
	'ItemName':gridlib.GRID_VALUE_STRING,
	'Left':gridlib.GRID_VALUE_NUMBER,
	'Top':gridlib.GRID_VALUE_NUMBER,
	'Width':gridlib.GRID_VALUE_NUMBER,
	'Height':gridlib.GRID_VALUE_NUMBER,
	'ZIndex':gridlib.GRID_VALUE_NUMBER,
	'Template':gridlib.GRID_VALUE_NUMBER,
	'OtherTempl':gridlib.GRID_VALUE_STRING,
	'ListCount':gridlib.GRID_VALUE_NUMBER,
	'NormalClass':gridlib.GRID_VALUE_STRING,
	'HotClass':gridlib.GRID_VALUE_STRING,
	'PressClass':gridlib.GRID_VALUE_STRING,
	'DisableClass':gridlib.GRID_VALUE_STRING,
	'Defaultvalue':gridlib.GRID_VALUE_STRING,
	'Spinstep':gridlib.GRID_VALUE_NUMBER,
	'Nummin':gridlib.GRID_VALUE_NUMBER,
	'Nummax':gridlib.GRID_VALUE_NUMBER,
	'Tooltip':gridlib.GRID_VALUE_STRING,
	
	'ButtonId':gridlib.GRID_VALUE_NUMBER,
	'ButtonText':gridlib.GRID_VALUE_STRING,
	
	'RadioId':gridlib.GRID_VALUE_NUMBER,
	'RadioText':gridlib.GRID_VALUE_STRING,
	
	'CheckId':gridlib.GRID_VALUE_NUMBER,
	'CheckText':gridlib.GRID_VALUE_STRING,
		
	'TabTempList':gridlib.GRID_VALUE_STRING,
	'TabBtnName':gridlib.GRID_VALUE_STRING,
	
	'UIBack':gridlib.GRID_VALUE_STRING,
	'BarColor':gridlib.GRID_VALUE_STRING,
	'CanSelect':gridlib.GRID_VALUE_CHOICE + ':none,false,true',
}

g_io_attr_encode_map = {
	'Type':'a',
	'Style':'b',
	'Position':'c',
	'Float':'d',
	'ItemName':'e',
	'Left':'f',
	'Top':'g',
	'Width':'h',
	'Height':'i',
	'ZIndex':'j',
	'Template':'k',
	'ListCount':'l',
	'NormalClass':'m',
	'HotClass':'n',
	'PressClass':'o',
	'Defaultvalue':'p',
	'Spinstep':'q',
	'Nummin':'r',
	'Nummax':'s',
	'Tooltip':'t',
	
	'ButtonId':'u',
	'ButtonText':'w',
	
	'RadioId':'aa',
	'RadioText':'ad',
	
	'CheckId':'ae',
	'CheckText':'af',
		
	'TabTempList':'ag',
	'TabBtnName':'ah',
	'OtherTempl':'ai',
	
	'UIBack':'aj',
	'DisableClass':'ak',
	'BarColor':'al',
	'CanSelect':'cs',
}
g_io_attr_decode_map = {}
for k in g_io_attr_encode_map:
	g_io_attr_decode_map[g_io_attr_encode_map[k]] = k

def GetAttrInValue(key, param, parent):
	if key == 'Type':
		value = g_widgettypes_rev_map.get(param)
		if value == None :
			return g_widgettypes[0][0]
		else:
			return value
	elif key == 'Style':
		value  = ''
		for s in g_widgetstyle:
			if (param&s[1]) == s[1] :
				if value != '':
					value  = value + ','
				value = value + s[0]
		return value
	elif key == 'Left' or key == 'Top':
		if parent == None:
			return 10
	elif key == 'Position':
		if param == 0:
			return 'absolute'
		elif param == 1:
			return 'relative'
	elif key == 'Float':
		if param == 0:
			return 'none'
		elif param == 1:
			return 'left'
		elif param == 2:
			return 'right'
	elif key == 'Spinstep':
		if param == 0:
			return 1
	elif key == 'TabTempList':
		value  = ''
		for p in param:
			if value != '':
				value  = value + ','
			value = value + str(p)
		return value
	elif key == 'CanSelect':
		if param == 0:
			return 'none'
		elif param == 1:
			return 'false'
		elif param == 2:
			return 'true'
	return param

	#'Nummin':'r',
	#'Nummax':'s',

def GetAttrOutValue(key, param,parent):
	if key == 'Type':
		return g_widgettypes_map[param]
	elif key == 'Style':
		slist = param.split(',')
		value = 0
		for sl in slist :
			bvalue = g_widgetstyle_map.get(sl)
			if bvalue == None :
				return None
			value = value | bvalue
		return value
	elif key == 'Position':
		if param == 'absolute' or param == '':
			return None
		if param == 'relative':
			return 1
	elif key == 'Float':
		if param == 'none' or param == '':
			return None
		if param == 'left':
			return 1
		elif param == 'right':
			return 2
	elif key == 'ItemName':
		if param == '':
			return None
	elif key == 'NormalClass' or key == 'HotClass' or key == 'PressClass' or key == 'DisableClass':
		if param == '':
			return None
	elif key == 'Defaultvalue':
		if param == '':
			return None
	elif key == 'ZIndex':
		if param == 0:
			return None
	elif key == 'Tooltip':
		if param == '':
			return None
	elif key == 'Left' or key == 'Top':
		if parent == None:
			return None
	elif key == 'Spinstep':
		if param == 0 or param == None or param == '':
			return 1
	elif key == 'ButtonId':
		if param == 0:
			return None
	elif key == 'ButtonText':
		if param == '':
			return None
	elif key == 'RadioText':
		if param == '':
			return None
	elif key == 'CheckText':
		if param == '':
			return None
	elif key == 'Template':
		if param == '':
			return 0
	elif key == 'ListCount':
		if param == 0:
			return None
	elif key == 'Nummin':
		if param == -0x7fffffff :
			return None
	elif key == 'Nummax':
		if param == 0x7fffffff :
			return None
	elif key == 'TabTempList':
		if param == '':
			return None
		else:
			ls = param.split(',')
			ils = []
			for l in ls:
				ils.append(int(l))
			return ils
	elif key == 'OtherTempl':
		if param == '':
			return None
	elif key == 'UIBack':
		if param == '':
			return None
	elif key == 'BarColor':
		if param == '':
			return None
	elif key == 'CanSelect':
		if param == 'none' or param == '':
			return None
		if param == 'false':
			return 1
		if param == 'true':
			return 2
	return param
