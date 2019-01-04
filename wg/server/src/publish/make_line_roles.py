# -*- coding: utf-8 -*-
roles = r'''
'''

import os, tarfile


def unpack():
	f = open(r'e:\allroles.txt', 'r')
	idx = 0
	s = ''
	for eachLine in f:
		orderno = eachLine.strip()
		if orderno == '' : continue
		if s != '' :
			s = s + ';'
		s = s + orderno
		idx = idx + 1
		
		if idx >= 20 :
			print s
			s = ''
			idx = 0
	f.close()

if __name__ == '__main__':
	unpack()
