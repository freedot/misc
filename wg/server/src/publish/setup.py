from distutils.core import setup   
import py2exe   
import sys   
sys.argv.append("py2exe")

setup(name='make_cdkey', author='qujianbiao', console=["make_cdkey.py"], zipfile = 'data/proc.dat')
