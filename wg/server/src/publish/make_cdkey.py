#-*- coding:utf-8 -*-  
#cdkey长度为20个字节
import sys, random, time

g_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
def makeCdKey(ty, itemId, count):
	filename = './cdkey_%s_%d.txt'%(time.strftime("%Y%m%d%H%M%S",time.localtime()), itemId)
	sql_filename = './cdkey_%s_%d.sql'%(time.strftime("%Y%m%d%H%M%S",time.localtime()), itemId)
	f = open(filename, 'a')
	sql_f = open(sql_filename, 'a')
	f.write('itemid=%d,time=%d\n'%(itemId, time.time()))
	sql_f.write('LOCK TABLES `cdkey` WRITE;\n')
	for countIdx in range(count) :
		lastCharSum = 0
		cdkey = ''
		for cdkeyIdx in range(19):
			charIdx = random.randint(0,15)
			cdkey = cdkey + g_chars[charIdx]
			lastCharSum = lastCharSum + charIdx
		cdkey = cdkey + g_chars[lastCharSum%16]
		f.write(cdkey + '\n')
		sql_f.write("INSERT INTO cdkey VALUES('%s', '%d', '%d', '1', '%d', '0');\n"%(cdkey, ty, itemId, time.time()) )
	sql_f.write("UNLOCK TABLES;")
	f.close()
	sql_f.close()
	print '[%s] create ok!'%filename 
	
def printHelpInfo():
	print('params error, like:')
	print('make_cdkey cdkeytype itemid cdkeyCount')
	print('make_cdkey 1 3000008 100')
	
if __name__ == '__main__':
	if len(sys.argv) != 4:
		printHelpInfo()
	else:
		print('start ...')
		try :
			ty = int(sys.argv[1])
			itemId = int(sys.argv[2])
			count = int(sys.argv[3])
			makeCdKey(ty, itemId, count)
		except Exception, e:
			printHelpInfo()