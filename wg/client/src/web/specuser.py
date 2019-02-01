# -*- coding: utf-8 -*-
spec_users = [
#{'user':'6E8A4F26FDD627126B11E489DD1DDFDB', 'msg':'逍遥王 您好！在最近的版本更新中您的游戏数据损坏，预计5月26号修复<br/>请加入我们的官方qq群210130823联系客服了解最近进展，谢谢您的理解和支持！'},
]

def find(userId):
	for node in spec_users:
		if node['user'] == userId:
			return node['msg']
	return ''