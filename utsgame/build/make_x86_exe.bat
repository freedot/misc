@echo off

@SET VSINSTALLDIR=D:\Program Files (x86)\Microsoft Visual Studio 14.0\
@SET VCINSTALLDIR=D:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\
@SET WindowsSdkDir=C:\Program Files (x86)\Windows Kits\10\

@set "PATH=%VCINSTALLDIR%BIN;%PATH%"
@set "INCLUDE=%WindowsSdkDir%include\10.0.10586.0\shared;%WindowsSdkDir%include\10.0.10586.0\um;%WindowsSdkDir%include\10.0.10586.0\winrt;%WindowsSdkDir%include\10.0.10586.0\ucrt;%VCINSTALLDIR%include;%INCLUDE%"
@set "LIB=%WindowsSdkDir%Lib\10.0.10586.0\ucrt\x86;%WindowsSdkDir%Lib\10.0.10586.0\um\x86;%VCINSTALLDIR%lib;%LIB%"

@echo x86 build env

@cd uts-src
@del *.obj
@del *.o
@del *.dll
@del *.exe
@cl /MD /O2 /c /D_WIN32 *.c
@link /DEFAULTLIB:msvcrt.lib /IMPLIB:uts.lib /OUT:uts.exe *.obj
@copy uts.exe /Y ..\..\Assets\Editor\tools\uts.exe
@cd ..

goto :eof

:missing
echo Can't find Visual Studio 2015.
goto :eofl



