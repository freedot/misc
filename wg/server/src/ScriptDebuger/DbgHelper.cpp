#include "DbgHelper.h"
#include "DbgServer.h"
#include <commhead.h>

DbgHelper::DbgHelper() {

}

DbgHelper::~DbgHelper() {

}

const char* DbgHelper::GetHelpInfo(const char* lpszCmd) {
	m_strHelpInfo = "Version 0.1, writer by Qujianbiao\n";
	if (lpszCmd == NULL || strcmp(lpszCmd, "help") == 0
			|| strcmp(lpszCmd, "h") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "h(elp)\n";
		m_strHelpInfo +=
				"	Without argument, print the list of available commands.\n";
		m_strHelpInfo +=
				"	'help rdb' pipes the full documentation file to the $PAGER\n";
		m_strHelpInfo += "	'help exec' gives help on the ! command\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "setpath") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "setpath basepath\n";
		m_strHelpInfo += "	Set the script base work path.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "conn") == 0
			|| strcmp(lpszCmd, "connect") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "connect [ip, port]\n";
		char msg[128] = {0};
		SafeSprintf(msg, sizeof(msg), "	Without argument,will connect localhost:%d.\n", c_serverPort);
		m_strHelpInfo += msg;
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "login") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "login username password\n";
		m_strHelpInfo += "	Login the remote server than will be debug.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "where") == 0
			|| strcmp(lpszCmd, "w") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "w(here)\n";
		m_strHelpInfo +=
				"	Print a stack trace, with the most recent frame at the bottom.\n";
		m_strHelpInfo +=
				"	An arrow indicates the 'current frame', which determines the\n";
		m_strHelpInfo += "	context of most commands.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "down") == 0
			|| strcmp(lpszCmd, "d") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "d(own)\n";
		m_strHelpInfo +=
				"	Move the current frame one level down in the stack trace\n";
		m_strHelpInfo += "	(to an older frame).\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "up") == 0
			|| strcmp(lpszCmd, "u") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "u(p)\n";
		m_strHelpInfo +=
				"	Move the current frame one level up in the stack trace\n";
		m_strHelpInfo += "	(to a newer frame).\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "break") == 0
			|| strcmp(lpszCmd, "b") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "b(reak) ([file:]lineno | function) [, condition]\n";
		m_strHelpInfo +=
				"	With a line number argument, set a break there in the current\n";
		m_strHelpInfo +=
				"	file.  With a function name, set a break at first executable line\n";
		m_strHelpInfo +=
				"	argument is present, it is a string specifying an expression\n";
		m_strHelpInfo +=
				"	which must evaluate to true before the breakpoint is honored.\n\n";
		m_strHelpInfo +=
				"	The line number may be prefixed with a filename and a colon,\n";
		m_strHelpInfo +=
				"	to specify a breakpoint in another file (probably one that\n";
		m_strHelpInfo +=
				"	hasn't been loaded yet).  The file is searched for on sys.path;\n";
		m_strHelpInfo += "	the .lua or .py suffix may be omitted.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "clear") == 0
			|| strcmp(lpszCmd, "cl") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "cl(ear) filename:lineno\n";
		m_strHelpInfo += "cl(ear) [bpnumber [bpnumber...]]\n";
		m_strHelpInfo +=
				"	With a space separated list of breakpoint numbers, clear\n";
		m_strHelpInfo +=
				"	those breakpoints.  Without argument, clear all breaks (but\n";
		m_strHelpInfo +=
				"	first ask confirmation).  With a filename:lineno argument,\n";
		m_strHelpInfo +=
				"	clear all break points at that Line in that file.\n\n";
		m_strHelpInfo +=
				"	Note that the argument is different from previous versions of\n";
		m_strHelpInfo +=
				"	the debugger wherea linenumber was used instead of either\n";
		m_strHelpInfo += "	filename:lineno or breakpoint numbers.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "tbreak") == 0
			|| strcmp(lpszCmd, "tb") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "tb(reak) ([file:]lineno | function) [, condition]\n";
		m_strHelpInfo +=
				"	tbreak  same arguments as break, but breakpoint is\n";
		m_strHelpInfo += "	removed when first hit.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "enable") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "enable bpnumber [bpnumber ...]\n";
		m_strHelpInfo +=
				"	Enables the breakpoints given as a space separated list of\n";
		m_strHelpInfo += "	bp numbers.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "disable") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "disable bpnumber [bpnumber ...]\n";
		m_strHelpInfo +=
				"	Disables the breakpoints given as a space separated list of\n";
		m_strHelpInfo += "	bp numbers.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "ignore") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "ignore bpnumber count\n";
		m_strHelpInfo +=
				"	Sets the ignore count for the given breakpoint number.  A breakpoint\n";
		m_strHelpInfo +=
				"	becomes active when the ignore count is zero.  When non-zero, the\n";
		m_strHelpInfo +=
				"	count is decremented each time the breakpoint is reached and the\n";
		m_strHelpInfo +=
				"	breakpoint is not disabled and any associated condition evaluates\n";
		m_strHelpInfo += "	to true.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "condition") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "condition bpnumber str_condition\n";
		m_strHelpInfo +=
				"	str_condition is a string specifying an expression which\n";
		m_strHelpInfo +=
				"	must evaluate to true before the breakpoint is honored.\n";
		m_strHelpInfo +=
				"	If str_condition is absent, any existing condition is removed;\n";
		m_strHelpInfo += "	i.e., the breakpoint is made unconditional.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "step") == 0
			|| strcmp(lpszCmd, "s") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "s(tep)\n";
		m_strHelpInfo +=
				"	Execute the current line, stop at the first possible occasion\n";
		m_strHelpInfo +=
				"	(either in a function that is called or in the current function).\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "next") == 0
			|| strcmp(lpszCmd, "n") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "n(ext)\n";
		m_strHelpInfo +=
				"	Continue execution until the next line in the current function\n";
		m_strHelpInfo += "	is reached or it returns.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "return") == 0
			|| strcmp(lpszCmd, "r") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "r(eturn)\n";
		m_strHelpInfo +=
				"	Continue execution until the current function returns.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "continue") == 0
			|| strcmp(lpszCmd, "cont") == 0 || strcmp(lpszCmd, "c") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "c(ont(inue))\n";
		m_strHelpInfo +=
				"	Continue execution, only stop when a breakpoint is encountered.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "jump") == 0
			|| strcmp(lpszCmd, "j") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "j(ump) file:lineno\n";
		m_strHelpInfo += "	Set the next line that will be executed.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "debug") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "debug code\n";
		m_strHelpInfo +=
				"	Enter a recursive debugger that steps through the code argument\n";
		m_strHelpInfo +=
				"	(which is an arbitrary expression or statement to be executed\n";
		m_strHelpInfo += "	in the current environment).\n";
		m_strHelpInfo += "	This version no support!\n";

	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "print") == 0
			|| strcmp(lpszCmd, "p") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "p(rint) expression\n";
		m_strHelpInfo += "	Print the value of the expression.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "args") == 0
			|| strcmp(lpszCmd, "a") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "a(rgs)\n";
		m_strHelpInfo += "	Print the arguments of the current function.\n";
		m_strHelpInfo += "	This version no support!\n";

	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "!") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "! statement\n";
		m_strHelpInfo +=
				"	Execute the (one-line) statement in the context of\n";
		m_strHelpInfo += "	the current stack frame.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "quit") == 0
			|| strcmp(lpszCmd, "q") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "q(uit) or exit - Quit from the debugger.\n";
		m_strHelpInfo += "	The program being executed is aborted.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "whatis") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "whatis arg\n";
		m_strHelpInfo += "	Prints the type of the argument.\n";
	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "EOF") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "EOF\n";
		m_strHelpInfo += "	Handles the receipt of EOF as a command.\n";
		m_strHelpInfo += "	This version no support!\n";

	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "alias") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "alias [name [command [parameter parameter ...] ]]\n";
		m_strHelpInfo += "	This version no support!\n";

	}
	if (lpszCmd == NULL || strcmp(lpszCmd, "unalias") == 0) {
		m_strHelpInfo +=
				"---------------------------------------------------------------\n";
		m_strHelpInfo += "unalias name\n";
		m_strHelpInfo += "	Deletes the specified alias.\n";
		m_strHelpInfo += "	This version no support!\n";

	}

	return m_strHelpInfo.c_str();
}
