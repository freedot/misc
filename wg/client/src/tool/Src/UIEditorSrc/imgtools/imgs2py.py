import os
import sys
import glob


def img2py(imgpath,outname,first):
	if first :
		os.system('img2py.py ' + imgpath + ' ' + outname)
	else:
		os.system('img2py.py -a ' + imgpath + ' ' + outname)

def main(args=None):
	if not args:
		args = sys.argv[1:]
	basepath = args[0]
	outname = args[1]
	bmplist = glob.glob(basepath+'/*.bmp')
	pnglist = glob.glob(basepath+'/*.png')
	icolist = glob.glob(basepath+'/*.ico')
	first = True
	for imgpath in bmplist : 
		img2py(imgpath, outname,first)
		first = False
	for imgpath in pnglist : 
		img2py(imgpath, outname,first)
		first = False
	for imgpath in icolist : 
		img2py(imgpath, outname,first)
		first = False

if __name__ == "__main__":
	main(sys.argv[1:])
