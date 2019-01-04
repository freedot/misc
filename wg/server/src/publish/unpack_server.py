import os, tarfile, glob, shutil

basepath = '/mydata/game/'

def safeMakeDir(path):
	try:
		os.mkdir(path)
	except Exception, e:
		pass	
		
def safeRmtree(path):
	try:
		shutil.rmtree(path)
	except Exception, e:
		pass	

def unpack():
	# remove outtime script *.lua
	for file in glob.glob(basepath + 'game/data/script/*.lua'): os.remove(file)
	safeRmtree(basepath + 'game/data/script/com')
	safeRmtree(basepath + 'game/data/script/npctalks')
	
	tar = tarfile.open(basepath + 'tmp/pack.tar')
	names = tar.getnames()
	for name in names:
		tar.extract(name,path="/")
	tar.close()	
	
	safeMakeDir(basepath + 'proxy/log')
	safeMakeDir(basepath + 'game/data/log')

if __name__ == '__main__':
	unpack()
