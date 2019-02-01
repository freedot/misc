import os, sys, tarfile
import publish_py, publish_image, publish_css,  publish_js, find, svn

base_path = r'E:\MyWork\wg'
final_path = base_path  + r'\trunk\publish\output\final'

def publish(needCopyImages):
	print 'py publish ...'
	publish_py.publish()
	print 'py publish ok!'

	print 'image publish ...'
	publish_image.publish(needCopyImages)
	print 'image publish ok!'
	
	print 'css publish ...'
	publish_css.publish()
	print 'css publish ok!'

	print 'js publish ...'
	publish_js.publish()
	print 'js publish ok!'
	
	os.chdir( final_path )
	os.system('del client_pack.tar')
	tar = tarfile.open("client_pack.tar", "w:bz2")
	for name in find.find2('*.*', '.\\'): 
		tar.add(name)
	tar.close()
	
	print 'commit all'
	svn.commit(base_path)
	
	print 'all publish ok!'

if __name__ == '__main__':
	needCopyImages = True
	#if len(sys.argv) == 2 and sys.argv[1] == 'copy_images' :
	#	needCopyImages = True
	publish(needCopyImages)