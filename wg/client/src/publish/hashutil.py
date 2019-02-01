import md5

def md5HashFile(path):
	m = md5.new()
	f = open(path, 'rb')
	buffer = 8192
	while 1:
		chunk = f.read(buffer)
		if not chunk : break
		m.update(chunk)
	f.close()
	return m.hexdigest()

def hashString(s):
	h = 0
	for a in s :
		h = (31 * h + int(ord(a))) % 0xffffffff
	return h