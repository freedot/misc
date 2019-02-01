import subprocess, sys
		
def __printPopenInfo(fp, cout=sys.stdout.write, cerr=sys.stderr.write):
	stdoutstr = fp.stdout.read()
	stderrstr = fp.stderr.read()
	if stdoutstr != '' and stdoutstr != '\n' and stdoutstr != '\r' :
		cout(stdoutstr)
		return True
	if stderrstr != '' and stderrstr != '\n' and stderrstr != '\r' :
		cerr(stderrstr)
		return False
	return True
		
def syscall(cmd):
	fp =subprocess.Popen(cmd, stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=True)
	__printPopenInfo(fp)
	
def syscallEx(cmd):
	fp =subprocess.Popen(cmd, stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=True)
	stdoutstr = fp.stdout.read()
	stderrstr = fp.stderr.read()
	if stdoutstr != '' and stdoutstr != '\n' and stdoutstr != '\r' :
		return {'ret':0, 'out':stdoutstr }
	if stderrstr != '' and stderrstr != '\n' and stderrstr != '\r' :
		return {'ret':-1, 'out':stderrstr }
	return {'ret':0, 'out':'' }
