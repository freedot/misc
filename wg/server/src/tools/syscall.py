import subprocess

def syscall(cmd):
	fp = subprocess.Popen(cmd, stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=True)
	printPopenInfo(fp, cmd)
	
def printPopenInfo(fp, cmd):
	stdoutstr = fp.stdout.read()
	stderrstr = fp.stderr.read()
	if stdoutstr != '' and stdoutstr != '\n' and stdoutstr != '\r' :
		print stdoutstr
		
	if stderrstr != '' and stderrstr != '\n' and stderrstr != '\r' :
		print stderrstr
