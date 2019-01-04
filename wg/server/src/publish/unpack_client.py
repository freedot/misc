import os, tarfile

def safeMakeDir(path):
	try:
		os.mkdir(path)
	except Exception, e:
		pass	

def unpack():
	tar = tarfile.open("/home/ubuntu/tmp/client_pack.tar", "r:bz2")
	names = tar.getnames()
	for name in names:
		tar.extract(name,path="/home/ubuntu/web/")
	tar.close()	

if __name__ == '__main__':
	unpack()
