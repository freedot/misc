'''
. create res/res_images.js file
. create with image version *.css in dst folder
. copy images to dst folder
. create zone_config.py to dst folder ( append fact image_base_url, is_debug=False )
'''
import find, re, svn, filesVerMgr, hashutil, dictfile, shutil, os
from publish_setcfg import *

image_src_path = os.path.join(src_base_path, 'images/')
res_images_path = os.path.join(src_base_path, 'js/res/res_images.js')
to_css_path = os.path.join(to_base_path, 'css')
to_image_path = os.path.join(to_base_path, 'images')
src_css_py = os.path.join(src_base_path, 'css.py')
src_zone_config_py = os.path.join(src_base_path, 'zone_config.py')
to_zone_config_py = os.path.join(to_base_path, 'zone_config.py')


def findFiles(basepath, ext=''):
	rfiles = []
	for root, dirs, files in os.walk(basepath):
		for file in files:
			if ext != '' and re.search(r'\.' + ext + r'$', file) == None: continue
			rfiles.append(root + os.sep + file)
	return rfiles

def makeFolders(des):
	des = des.replace('\\', '/')
	paths = des.split('/')
	paths.pop() # pop file
	curp = ''
	for p in paths :
		curp = curp + p + '/'
		if not os.path.exists(curp): 
			os.makedirs(curp)
		

def loadCSSList():
	return dictfile.load(src_css_py, 'css_list')

def getShortImagePath(fullPath):
	return fullPath[ len(image_src_path) : ]

def collectImageFiles():
	return find.find(image_src_path,  re.compile('.*\.(gif|jpg|png|cur|ani|mp3|wav|ogg|wma)$'))
	
def checkImageFilesHasUpperCase(imageFiles):
	has = False
	for fullPath in imageFiles :
		shortPath = getShortImagePath(fullPath)
		isLowerCase = (shortPath == shortPath.lower())
		if isLowerCase : 
			continue
		has = True
		print '* error<has upper case image fileName>: ' + fullPath
	return has
	
def createImageFilesVersion(imageFiles):
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	for fullPath in imageFiles :
		shortPath = getShortImagePath(fullPath)
		verMgr.add(image_src_path, shortPath)
	verMgr.save()
		
def createResImageJsFile(imageFiles): # -> res_images.js
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	images_dict = {}
	for fullPath in imageFiles :
		shortPath = getShortImagePath(fullPath)
		nameKey = str(hashutil.hashString(shortPath))
		ver = verMgr.getVer(shortPath)
		if images_dict.get(nameKey, None) == None: # 'key': {'v':'1'}
			images_dict[nameKey] = {'v' : str(ver)}
		else: # when hash key conflict, need record detail shortPath:ver pairs 'key':{'v':1, 'bar.gif': '1','top.gif': '2' }
			images_dict[nameKey][shortPath] = str(ver)
	dictfile.save(res_images_path, images_dict, 'res_images')
	svn.commit(res_images_path)
	
def createCSSFileWithImageVerToDstFolder():
	print 'image_base_url = ', image_base_url
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	# convert url(../images/xx.xx) -> url(../images/xx.xx?v=xx)
	p = re.compile(r'url\s*\([^\)]*\)')
	p2 = re.compile(r'images/([^\)\s?\'\"]*)')
	def urlrepl (match):
		g = match.group()
		img = p2.search(g).group(1).lower()
		ver = verMgr.getVer(img)
		return 'url(\'' + image_base_url + img + '?v=' + str(ver) + '\')'
		
	# convert xx.xx.AlphaImageLoader(src='./images/xx.xx') -> xx.xx.AlphaImageLoader(src='./images/xx.xx?v=xx')
	pex = re.compile(r'AlphaImageLoader\s*\([^\)]*\)')
	def urlreplex (match):
		g = match.group()
		img = p2.search(g).group(1).lower()
		ver = verMgr.getVer(img)
		return 'AlphaImageLoader(src=\'' + image_base_url + img + '?v=' + str(ver) + '\')'
		
	if not os.path.isdir(to_css_path) : 
		os.mkdir(to_css_path)
		
	css_list = loadCSSList()
	for cf in css_list:
		srcfile = os.path.join(src_base_path + cf)
		#read
		f = open(srcfile, 'r')
		css = f.read()
		f.close()
		
		# write
		tofile = os.path.join(to_base_path, cf)
		f = open(tofile, 'w')
		con = p.sub(urlrepl, css)
		con = pex.sub(urlreplex, con)
		f.write(con)
		f.close()
		
def createCssFilesVersion():
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	css_list = loadCSSList()
	for cssfile in css_list:
		verMgr.add(to_base_path, cssfile)
	verMgr.save()
		
def copyImagesToDstFolder():
	if os.path.isdir(to_image_path) : shutil.rmtree(to_image_path)
	shutil.copytree(image_src_path, to_image_path, ignore = shutil.ignore_patterns('*.db', '.svn'))
	
def createZoneConfigPyWithFactImageBaseUrlToDstFolder():
	f = open(src_zone_config_py, 'r')
	s = f.read()
	f.close()
	
	s += (append_zone_config%image_base_url)
	f = open(to_zone_config_py, 'w')
	f.write(s)
	f.close()
	
def publish(needCopyImages):
	svn.update(image_src_path)
	imageFiles = collectImageFiles()
	if checkImageFilesHasUpperCase(imageFiles) :
		print '* error: has upper case image fileName'
		return
	createImageFilesVersion(imageFiles)
	createResImageJsFile(imageFiles)
	createCSSFileWithImageVerToDstFolder()
	copyImagesToDstFolder()
	createCssFilesVersion()
	if needCopyImages :
		copyImagesToDstFolder()
	createZoneConfigPyWithFactImageBaseUrlToDstFolder()

if __name__ == '__main__':
	publish(True)
