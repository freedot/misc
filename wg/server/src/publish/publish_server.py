import os, sys, shutil, tarfile, glob
import find

def copys(srcFmt, des):
	for fname in glob.glob(srcFmt):
		shutil.copy(fname, des)
def safeMakeDir(path):
	try:
		os.mkdir(path)
	except Exception, e:
		pass	

# config
svn_tool = 'svn'

'''
tmp_base_path = '/home/ubuntu/tmp/'
work_base_path = '/home/ubuntu/work/'
game_base_path = '/home/ubuntu/game/'
game_proxy_path = '/home/ubuntu/proxy/'

work_data_path = work_base_path + 'data/'
work_svr_path = work_base_path + 'svr/'
work_bin_path = work_base_path + 'bin/'
pkg_maker = work_bin_path + 'PkgMaker.exe'
pkgexclude_file = work_base_path + 'svr/publish/pkgexclude.txt'
work_proxy_path = work_base_path + 'svr/ProxySvr/'

game_data_path = game_base_path + 'data/'
game_bin_path = game_base_path + 'bin/'

'''

tmp_base_path = '/mydata/game/tmp/'
work_base_path = '/mydata/game/work/'
game_base_path = '/mydata/game/game/'
game_proxy_path = '/mydata/game/proxy/'

work_data_path = work_base_path + 'data/'
work_svr_path = work_base_path + 'src/'
work_bin_path = work_base_path + 'bin/'
pkg_maker = work_bin_path + 'PkgMaker.exe'
pkgexclude_file = work_base_path + 'src/publish/pkgexclude.txt'
work_proxy_path = work_base_path + 'src/ProxySvr/'

game_data_path = game_base_path + 'data/'
game_bin_path = game_base_path + 'bin/'



def updateAllScript():
	svn_up_cmd = svn_tool + ' up ' + work_data_path
	os.system( svn_up_cmd )
	svn_up_cmd = svn_tool + ' up ' + work_svr_path
	os.system( svn_up_cmd )

def makeStuffDataAndPack():
	# pkg step
	print '--publish server luascript--'
	updateAllScript()
	
	pkg_cmd = pkg_maker + ' -p ' + work_data_path + ' ' + work_data_path + ' ' + (game_data_path + 'stuff.dat') + ' ' + pkgexclude_file
	os.system( pkg_cmd )
	copys(work_data_path + 'script/res/*.lua', game_data_path + 'script/res/')
	
	print '--publish proxy server --'
	copys(work_proxy_path + '*.py', game_proxy_path)
	copys(work_proxy_path + 'qqsdk/*.py', game_proxy_path+'qqsdk/')

	print '--publish server dll exe--'
	#copys(work_bin_path + '*.dll', game_bin_path )
	copys(work_bin_path + '*.so', game_bin_path )
	#copys(work_bin_path + '*.xml', game_bin_path )
	copys(work_bin_path + '*.exe', game_bin_path )

	print '--tar pack.tar--'
	tar = tarfile.open(tmp_base_path + "pack.tar", "w")
	tar.add(game_data_path + 'stuff.dat')
	for name in find.find('*.*', game_bin_path): tar.add(name)
	for name in find.find('*.*', game_proxy_path): tar.add(name)
	for name in find.find('*.*', game_data_path + 'script/res/'): tar.add(name)
	tar.close()	

def copyAllScriptsAndPack():
	print '--publish server all luascript files--'
	updateAllScript()
	
	copys(work_data_path + 'script/*.lua', game_data_path + 'script/')	
	
	safeMakeDir(game_data_path + 'script/res/')
	safeMakeDir(game_data_path + 'script/com/')
	safeMakeDir(game_data_path + 'script/npctalks/')
	
	copys(work_data_path + 'script/res/*.lua', game_data_path + 'script/res/')
	copys(work_data_path + 'script/com/*.lua', game_data_path + 'script/com/')
	copys(work_data_path + 'script/npctalks/*.lua', game_data_path + 'script/npctalks/')
	os.chdir( game_data_path )
	os.system('rm ' + game_data_path + 'stuff.dat')
	
	os.system('rm ' + tmp_base_path + 'pack.tar')
	tar = tarfile.open(tmp_base_path + "pack.tar", "w")
	tar.add(game_data_path + 'stuff.dat')
	for name in find.find('*.*', game_bin_path): tar.add(name)
	for name in find.find('*.*', game_proxy_path): tar.add(name)
	for name in find.find('*.*', game_data_path + 'script/'): tar.add(name)
	tar.close()
	
def copyPartScriptsAndPack(files):
	updateAllScript()
	
	copys(work_data_path + 'script/*.lua', game_data_path + 'script/')
	
	safeMakeDir(game_data_path + 'script/res/')
	safeMakeDir(game_data_path + 'script/com/')
	safeMakeDir(game_data_path + 'script/npctalks/')
	
	copys(work_data_path + 'script/res/*.lua', game_data_path + 'script/res/')
	copys(work_data_path + 'script/com/*.lua', game_data_path + 'script/com/')
	copys(work_data_path + 'script/npctalks/*.lua', game_data_path + 'script/npctalks/')
	
	print '--tar part_pack.tar--'
	tar = tarfile.open(tmp_base_path + "part_pack.tar", "w")
	for file in files :
		fullfile = game_data_path + 'script/' + file
		tar.add(fullfile)
	tar.close()
	
def publish(option):
	if option.get('all_scripts', False) :
		copyAllScriptsAndPack()
	elif option.get('part_scripts', False) :
		copyPartScriptsAndPack(option.get('files', []))
	else:
		makeStuffDataAndPack()

if __name__ == '__main__':
	option = {}
	if len(sys.argv) == 2 and sys.argv[1] == 'help':
		print '-----------------------------------------------------------------------'
		print 'publish_server @@@this is pack stuff.dat'
		print 'publish_server all_scripts @@@this is pack all scripts'
		print 'publish_server part_scripts script1 script2 @@@this is pack all scripts'
		print ''
	elif len(sys.argv) == 2 and sys.argv[1] == 'all_scripts' :
		option[sys.argv[1]] = True
		publish(option)
	elif len(sys.argv) > 2 and sys.argv[1] == 'part_scripts' :
		option[sys.argv[1]] = True
		option['files'] = []
		for i in range(2, len(sys.argv) ):
			option['files'].append(sys.argv[i])
		publish(option)
	else:
		publish(option)




