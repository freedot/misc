// rm.cpp : 此文件包含 "main" 函数。程序执行将在此处开始并结束。
//

#include "pch.h"
#include <iostream>
#include <windows.h>
using namespace std;

int main(int argc, char *argv[]) {
  for (int i = 2; i < argc; ++i) { // skip -rf
    cout << argv[i] << endl;
    DeleteFileA(argv[i]);
  }
  return 0;
}
