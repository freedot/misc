import os, shutil

def readall(fname):
    file = open(fname, 'r')
    s = file.read( )
    file.close( )
    return s
    
def writeall(fname, s):
    file = open(fname, 'w')
    file.write( s )
    file.close( )
    
#src path
src_path='duk-1.5.0'

# modify duk src. suport DUK_RET_THROW
replace_seg = '''DUK_INTERNAL void duk_error_throw_from_negative_rc(duk_hthread *thr, duk_ret_t rc) {
	duk_context *ctx = (duk_context *) thr;
	const char *msg;
	duk_errcode_t code;

	DUK_ASSERT(thr != NULL);
	DUK_ASSERT(rc < 0);'''
insert_seg = '''
	if ( rc == -1000000 ) { // DUK_RET_THROW
		const char* msg = (const char*)duk_require_string(ctx, -1);
		DUK_ERROR(thr, DUK_ERR_ERROR, msg);
	}'''

replace_seg2= '''#define DUK_OP_LDREG                0
#define DUK_OP_STREG                1
#define DUK_OP_LDCONST              2
#define DUK_OP_LDINT                3
#define DUK_OP_LDINTX               4
#define DUK_OP_MPUTOBJ              5
#define DUK_OP_MPUTOBJI             6
#define DUK_OP_MPUTARR              7
#define DUK_OP_MPUTARRI             8
#define DUK_OP_NEW                  9
#define DUK_OP_NEWI                 10
#define DUK_OP_REGEXP               11
#define DUK_OP_CSREG                12
#define DUK_OP_CSREGI               13
#define DUK_OP_GETVAR               14
#define DUK_OP_PUTVAR               15
#define DUK_OP_DECLVAR              16
#define DUK_OP_DELVAR               17
#define DUK_OP_CSVAR                18
#define DUK_OP_CSVARI               19
#define DUK_OP_CLOSURE              20
#define DUK_OP_GETPROP              21
#define DUK_OP_PUTPROP              22
#define DUK_OP_DELPROP              23
#define DUK_OP_CSPROP               24
#define DUK_OP_CSPROPI              25
#define DUK_OP_ADD                  26
#define DUK_OP_SUB                  27
#define DUK_OP_MUL                  28
#define DUK_OP_DIV                  29
#define DUK_OP_MOD                  30
#define DUK_OP_BAND                 31
#define DUK_OP_BOR                  32
#define DUK_OP_BXOR                 33
#define DUK_OP_BASL                 34
#define DUK_OP_BLSR                 35
#define DUK_OP_BASR                 36
#define DUK_OP_EQ                   37
#define DUK_OP_NEQ                  38
#define DUK_OP_SEQ                  39
#define DUK_OP_SNEQ                 40
#define DUK_OP_GT                   41
#define DUK_OP_GE                   42
#define DUK_OP_LT                   43
#define DUK_OP_LE                   44
#define DUK_OP_IF                   45
#define DUK_OP_JUMP                 46
#define DUK_OP_RETURN               47
#define DUK_OP_CALL                 48
#define DUK_OP_CALLI                49
#define DUK_OP_TRYCATCH             50
#define DUK_OP_EXTRA                51
#define DUK_OP_PREINCR              52  /* pre/post opcode values have constraints, */
#define DUK_OP_PREDECR              53  /* see duk_js_executor.c */
#define DUK_OP_POSTINCR             54
#define DUK_OP_POSTDECR             55
#define DUK_OP_PREINCV              56
#define DUK_OP_PREDECV              57
#define DUK_OP_POSTINCV             58
#define DUK_OP_POSTDECV             59
#define DUK_OP_PREINCP              60
#define DUK_OP_PREDECP              61
#define DUK_OP_POSTINCP             62
#define DUK_OP_POSTDECP             63
#define DUK_OP_NONE                 64  /* dummy value used as marker */'''


replace_newseg2 = '''#define DUK_OP_LDREG                0
#define DUK_OP_STREG                1
#define DUK_OP_LDCONST              2
#define DUK_OP_LDINT                3
#define DUK_OP_LDINTX               4
#define DUK_OP_JUMP                 5
#define DUK_OP_RETURN               6
#define DUK_OP_CALL                 7
#define DUK_OP_CALLI                8
#define DUK_OP_MPUTOBJ              9
#define DUK_OP_MPUTOBJI             10
#define DUK_OP_MPUTARR              11
#define DUK_OP_MPUTARRI             12
#define DUK_OP_NEW                  13
#define DUK_OP_NEWI                 14
#define DUK_OP_REGEXP               15
#define DUK_OP_CSREG                16
#define DUK_OP_CSREGI               17
#define DUK_OP_GETVAR               18
#define DUK_OP_PUTVAR               19
#define DUK_OP_DECLVAR              20
#define DUK_OP_DELVAR               21
#define DUK_OP_CSVAR                22
#define DUK_OP_CSVARI               23
#define DUK_OP_CLOSURE              24
#define DUK_OP_GETPROP              25
#define DUK_OP_PUTPROP              26
#define DUK_OP_DELPROP              27
#define DUK_OP_CSPROP               28
#define DUK_OP_CSPROPI              29
#define DUK_OP_EQ                   30
#define DUK_OP_NEQ                  31
#define DUK_OP_SEQ                  32
#define DUK_OP_SNEQ                 33
#define DUK_OP_GT                   34
#define DUK_OP_GE                   35
#define DUK_OP_LT                   36
#define DUK_OP_LE                   37
#define DUK_OP_IF                   38
#define DUK_OP_MOD                  39
#define DUK_OP_BAND                 40
#define DUK_OP_BOR                  41
#define DUK_OP_BXOR                 42
#define DUK_OP_BASL                 43
#define DUK_OP_BLSR                 44
#define DUK_OP_BASR                 45
#define DUK_OP_ADD                  46
#define DUK_OP_SUB                  47
#define DUK_OP_MUL                  48
#define DUK_OP_DIV                  49
#define DUK_OP_TRYCATCH             50
#define DUK_OP_EXTRA                51
#define DUK_OP_PREINCR              52  /* pre/post opcode values have constraints, */
#define DUK_OP_PREDECR              53  /* see duk_js_executor.c */
#define DUK_OP_POSTINCR             54
#define DUK_OP_POSTDECR             55
#define DUK_OP_PREINCV              56
#define DUK_OP_PREDECV              57
#define DUK_OP_POSTINCV             58
#define DUK_OP_POSTDECV             59
#define DUK_OP_PREINCP              60
#define DUK_OP_PREDECP              61
#define DUK_OP_POSTINCP             62
#define DUK_OP_POSTDECP             63
#define DUK_OP_NONE                 64  /* dummy value used as marker */'''

print ('::build uts.exe::')

allsrc = readall(src_path + r'\src\duktape.c')
if allsrc.find(replace_seg) < 0:
  print('build error, replace src failed:1!')
  os.exit(0)
allsrc = allsrc.replace(replace_seg, replace_seg + insert_seg)

if allsrc.find(replace_seg2) < 0:
  print('build error, replace src failed:2!')
  os.exit(0)
allsrc = allsrc.replace(replace_seg2, replace_newseg2)

allsrc = allsrc.replace('duktape.h', 'duk.h')
writeall(r'uts-src\duk.c', allsrc)
shutil.copy(src_path + r'\src\duktape.h',r'uts-src\duk.h')
shutil.copy(src_path + r'\src\duk_config.h',r'uts-src\duk_config.h')

#delete duk_cmdline.c duk_cmdline_ajduk.c
duk_cmdline = r'uts-src\duk_cmdline.c'
duk_cmdline_ajduk = r'uts-src\duk_cmdline_ajduk.c'
if os.path.exists(duk_cmdline): os.remove(duk_cmdline)
if os.path.exists(duk_cmdline_ajduk): os.remove(duk_cmdline_ajduk)

os.system('make_x86.bat')
os.system('make_x64.bat')

print ('::build uts.exe::')
#copy  duk_cmdline.c duk_cmdline_ajduk.c
allsrc = readall(src_path + r'\examples\cmdline\duk_cmdline.c')
allsrc = allsrc.replace('duktape.h', 'duk.h')
writeall(duk_cmdline, allsrc)

allsrc = readall(src_path + r'\examples\cmdline\duk_cmdline_ajduk.c')
allsrc = allsrc.replace('duktape.h', 'duk.h')
writeall(duk_cmdline_ajduk, allsrc)

os.system('make_x86_exe.bat')

