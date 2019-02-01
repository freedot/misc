__cur_pl = 'cx_Freeze'
def defined(pl):
	return __cur_pl == pl	

if defined('cx_Freeze') :
	import sys
	from cx_Freeze import setup, Executable

	# Dependencies are automatically detected, but it might need fine tuning.
	build_exe_options = {"packages": [], "excludes": []}

	# GUI applications require a different base on Windows (the default is for a
	# console application).
	base = None
	if sys.platform == "win32":
		base = "Win32GUI"

	setup( name = "UI Editor",
		version = "1.2",
		description = "Ui Editor",
		options = {"build_exe": build_exe_options},
		executables = [Executable("main.py", base=base)])
		
if defined('py2exe'):
	from distutils.core import setup   
	import py2exe   
	import sys   
	sys.argv.append("py2exe")

	excludes = ['MyShape','AttrMapDef']
	data_files = [(r'UIEditor',['MyShape.py','AttrMapDef.py'])]
	options = {'py2exe':{
				'compressed':1,
				'optimize':0,
				'excludes':excludes,
				'bundle_files': 1
				}
			}
			
	setup(name = 'UI Editor',
		version = '1.2',
		author = 'qujianbiao',
		options = options,
		windows = ['main.py'],
		data_files = data_files,
		zipfile = 'UIEditor/proc.dat',
		)
