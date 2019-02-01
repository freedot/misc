// runner.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include <process.h>
#include <Windows.h>

int main(int argc, char* argv[])
{
	while(true) {
		Sleep(10000);
		system("E:\\WebGame\\Server\\trunk\\serverbin\\win32\\update_res.bat");
	}
	printf("Hello World!\n");
	return 0;
}

