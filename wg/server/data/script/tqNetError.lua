TQERR = {
	OK={
		id=0, 
		needsend=false, 
		needlog=false, 
		msg='error code: 1001, 没有错误',
	},
	
	UNKNOWN={
		id=-1, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='error code: 1002, 通用未知错误',
	},
	
	CMD_NOTMATCH={
		id=-2, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='error code: 1003, 命令不符合',
	},
	
	STAMP_TIMEOUT={
		id=-3, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='error code: 1004, 过期的登录包',
	},
	
	INVALIDSIG={
		id=-4, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='error code: 1005, 非法签名',
	},
	
	INVALIDUSERDATA={
		id=-5, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='error code: 1006, 用户数据错误',
		logmsg='error code: 1006, 用户数据错误',
	},
	
	RELOGIN = {
		id=-6,
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='你的账号在别处已登录',
		logmsg='error code: 1007, 账号在别处已登录',
	},
	
	INVALIDCREATEROLE = {
		id=-7,
		needsend=true, 
		needlog=true, 
		needclose=false,
		msg='error code: 1008, 非法数据',
		logmsg='error code: 1008, 用户创建角色输入数据非法',
	},
	
	UNKNOWNCREATEROLE = {
		id=-8,
		needsend=true, 
		needlog=true, 
		needclose=false,
		msg='error code: 1009, 未知程序错误',
		logmsg='error code: 1009, 未知程序错误',
	},
	
	INVALIDHEROSTATE = {
		id=-9,
		needsend=true, 
		needlog=true, 
		needclose=false,
		msg='error code: 1010, 非法数据',
		logmsg='error code: 1010, 错误的英雄状态',
	},
	
	INVALIDHEROID = {
		id=-10,
		needsend=true, 
		needlog=true, 
		needclose=false,
		msg='error code: 1011, 非法数据',
		logmsg='error code: 1011, 错误的英雄ID',
	},
	
	DUPLICATEITEM = {
		id=-11,
		needsend=true, 
		needlog=true, 
		needclose=false,
		msg='error code: 1012, 非法数据',
		logmsg='error code: 1012, 道具复制问题发生',
	},
	
	DELFROMPKG = {
		id=-12,
		needsend=true, 
		needlog=true, 
		needclose=false,
		msg='error code: 1013, 未知程序错误',
		logmsg='error code: 1013, 从背包中删除道具失败',
	},
	FULLINTHISCITY = {
		id=-13,
		needsend=true, 
		needlog=true, 
		needclose=false,
		msg='该国家人数已爆满，请更国家城再尝试',
		logmsg='error code: 1014, 国家人数已满',
	},
	UNKNOWNHDR={
		id=-14, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='error code: 1015, 未知协议',
	},
	INVALIDUSERNAME={
		id=-15, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='error code: 1016, 非法用户名',
	},

	SVRNOTOPEN={
		id=-16, 
		needsend=true, 
		needlog=true, 
		needclose=true,
		msg='还未开服，请稍后再试！',
	},		
	
	LOCKEDUSER={
		id=-17, 
		needsend=true, 
		needlog=false,
		needclose=true,
		msg='账号被封，截止时间为',
	},	
}


function FormatErrorLog(player, err)
	return err.logmsg
end

_last__err_ = rinit(_last__err_, TQERR.OK)
_last__err_append_msg_ = ''
function setLastError(err, appenderrmsg)
	_last__err_ = err
	if appenderrmsg == nil then
		_last__err_append_msg_ = ''
	else
		_last__err_append_msg_ = appenderrmsg
	end
end

function getLastError()
	return _last__err_, _last__err_append_msg_
end

_last__err_str_ = rinit(_last__err_str_, '')
function setLastErrorStr(err)
	_last__err_str_ = err
end

function getLastErrorStr(err)
	return _last__err_str_
end




