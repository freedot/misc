#! /usr/bin/env python
# -*- coding: utf-8 -*-
import pycurl

class MyCurl:
	def __init__(self):
		self._contents = ''
		self._curl = pycurl.Curl()
	def _callback(self, buf):
		self._contents = self._contents + buf
	def _clear(self):
		self._contents = ''
	def curl(self, url):
		self._clear()
		self._curl.setopt(self._curl.URL, url)
		self._curl.setopt(self._curl.WRITEFUNCTION, self._callback)
		self._curl.perform()
		self._curl.close()
	def getContent(self):
		return self._contents

def getUrlContent(url):
	t = MyCurl()
	t.curl(url)
	return t.getContent()
