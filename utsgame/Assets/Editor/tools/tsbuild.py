# python 3.x
import sys, os, re, shutil

class FileUtil:
    @staticmethod
    def findFiles(basepath, ext=''):
        rfiles = []
        for root, dirs, files in os.walk(basepath):
            for file in files:
                if ext != '' and re.search(r'\.' + ext + r'$', file) == None: continue
                rfiles.append(root + os.sep + file)
        return rfiles
    @staticmethod
    def readAll(fname):
        f = open(fname, "rb")
        content = f.read()
        f.close()
        return content
    @staticmethod
    def write(fname, s):
        f = open(fname, "wb")
        f.write(s)
        f.close()
        
xorpsw = [0x40,0x11,0x34,0x68,0x81,0xa1,0x02,0xf1,0xf9,0xbf,0x4b,0x6f,0x74,0x32,0x55,0xaa]
def encode(bs):
    slen = len(bs)
    passlen = len(xorpsw)
    ebs = []
    for i in range(slen) :
        if i == 0:
            ebs.append(bs[i])
        else:
            ebs.append(bs[i]^xorpsw[(i+slen)%passlen])
    return bytes(ebs)

def main():
    scriptpath = sys.argv[0]
    scriptpath = scriptpath[0:scriptpath.rfind('/')]
    tsspath = sys.argv[1]
    
    print('@convert ts to js')
    srcpath = tsspath + '/.'
    tojspath = tsspath + '/.dist'
    if os.path.exists(tojspath):
        shutil.rmtree( tojspath )
    buildtscmd = 'tscc -p ' + srcpath + ' --outDir ' + tojspath + ' --sourceMap --module commonjs --target ES5'
    os.system(buildtscmd)
    
    print('@convert js to bytes')
    tobytespath = tsspath + '/compiled'
    if os.path.exists(tobytespath):
        shutil.rmtree( tobytespath )
    utstool = (scriptpath + '/uts').replace('/', '\\')
    files = FileUtil.findFiles(tojspath, 'js')
    for file in files :
        file = file.replace('\\', '/')
        tobytes = file.replace(".dist", "compiled").replace(".js", ".bytes");
        topath = tobytes[0:tobytes.rfind('/')]
        if not os.path.exists(topath):
            os.makedirs(topath)
        tobytescmd = utstool + ' -c ' + tobytes + ' ' + file
        os.system(tobytescmd)
        
    print('@encrypt bytes')
    files = FileUtil.findFiles(tobytespath, 'bytes')
    for file in files :
        FileUtil.write(file, encode(FileUtil.readAll(file)))
    
main()