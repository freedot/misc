import glob, os, fnmatch

def __findFiles(path, pattern, cfiles):
	files = glob.glob1(path, '*')
	for file in files:
		fullpath = os.path.join(path, file)
		if os.path.isdir(fullpath):
			__findFiles(fullpath, pattern, cfiles)
		else:
			fname = fullpath.replace('\\','/')
			if pattern.search(fname):
				cfiles.append(fname)
				
def find(path, pattern):
	cfiles = []
	__findFiles(path, pattern, cfiles)
	return cfiles
	
	

def _findvisitor((matches, pattern), thisdir, nameshere):
    for name in nameshere:
        if fnmatch.fnmatch(name, pattern):
            fullpath = os.path.join(thisdir, name)
            matches.append(fullpath)

def find2(pattern, startdir=os.curdir):
    matches = []
    os.path.walk(startdir, _findvisitor, (matches, pattern))
    matches.sort()
    return matches

