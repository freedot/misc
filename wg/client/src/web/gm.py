
gm_userIds = [
	{'gm':'6E8A4F26FDD627126B11E489DD1DDFDB', 'spy':''}, #380323186
	{'gm':'6190F7F71C2D746008B88F292BCA72B2', 'spy':''}, #53121923
	{'gm':'CE2F20B2F0C241E5C47939074902F2A9', 'spy':''}, #xiaowei
	{'gm':'bill825', 'spy':''},
]

def isGm(userId):
	for node in gm_userIds:
		if node['gm'] == userId:
			return True
	return False
	
def spyUserId(userId):
	for node in gm_userIds:
		if node['gm'] == userId and node['spy'] != '':
			return node['spy']
	return userId
