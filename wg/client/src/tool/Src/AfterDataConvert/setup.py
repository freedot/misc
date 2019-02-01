from distutils.core import setup   
import py2exe   
import sys   
sys.argv.append("py2exe")

excludes = []
options = {'py2exe':{
			'compressed':1,
			'optimize':0,
			'excludes':excludes,
			'bundle_files': 1
			}
		}
		
setup(name = 'AfterConvertJS',
	version = '1.1',
	author = 'qujianbiao',
	options = options,
	console = ['Main.py'],
	zipfile = 'AfterConvertJS/proc.dat',
	)