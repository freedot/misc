import subprocess
def printPopenInfo(fp, cmd):
	stdoutstr = fp.stdout.read()
	stderrstr = fp.stderr.read()
	if stderrstr != '' and stderrstr != '\n' and stderrstr != '\r' :
		print cmd + '\n' + stderrstr
		return ''
	return stdoutstr

def syscall(cmd):
	fp = subprocess.Popen(cmd, stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=True)
	return printPopenInfo(fp, cmd)
	
import re
class ShareMemHdr:
	def deleteAll(self):
		smems = self.collectShareMems()
		for node in smems :
			self.deleteShareMem(node['shmid'])
		print 'deleted all shmids!'
			
	def deleteShareMem(self, shmid):
		print 'deleting shmid : ' + str(shmid)
		print syscall('ipcrm -m ' + str(shmid))
				
	def collectShareMems(self):
		nodeTags = ['key', 'shmid', 'owner', 'perms', 'bytes', 'nattch', 'status']
		smems = []
		rt = syscall('ipcs -m')
		lines = rt.splitlines()
		for line in lines :
			items = re.split(r'\s+', line)
			if not items[0].startswith('0x') :
				continue
			node = {}
			for i in range(len(items)) :
				if i >= len(nodeTags) : continue
				node[ nodeTags[i] ] = items[i]
			smems.append(node)
		return smems
		
def main():
	hdr = ShareMemHdr()
	hdr.deleteAll()
main()
