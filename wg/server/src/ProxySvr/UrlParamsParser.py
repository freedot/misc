#-*- coding:utf-8 -*-  
class UrlParamsParser:
	def __init__(self):
		self._params = None
		
	def parse(self, path):
		paths = path.split('?')
		if len(paths) != 2 :
			print 'paths len error: ', path
			return None
		url_path = paths[0]
		params = paths[1]
		
		pairs = params.split('&')
		if len(pairs) == 0 :
			print 'pairs len 0'
			return None
		
		rt = {'url_path':url_path.strip(), 'params':{}}
		for pair in pairs:
			pairWords = pair.split('=')
			if len(pairWords) != 2 : return None
			rt['params'][pairWords[0].strip()] = pairWords[1].strip()
		self._params = rt['params']
		return rt
		
	def getParams(self):
		return self._params
