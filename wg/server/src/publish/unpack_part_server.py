import os, tarfile, glob, shutil

def unpack():
	tar = tarfile.open("/home/ubuntu/tmp/part_pack.tar")
	names = tar.getnames()
	for name in names:
		tar.extract(name,path="/")
	tar.close()	

if __name__ == '__main__':
	unpack()
