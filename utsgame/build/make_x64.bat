@echo off

@SET VSINSTALLDIR=D:\Program Files (x86)\Microsoft Visual Studio 14.0\
@SET VCINSTALLDIR=D:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\
@SET WindowsSdkDir=C:\Program Files (x86)\Windows Kits\10\

@set "PATH=%VCINSTALLDIR%BIN;%PATH%"
@set "INCLUDE=%WindowsSdkDir%include\10.0.10586.0\shared;%WindowsSdkDir%include\10.0.10586.0\um;%WindowsSdkDir%include\10.0.10586.0\winrt;%WindowsSdkDir%include\10.0.10586.0\ucrt;%VCINSTALLDIR%include;%INCLUDE%"
@set "LIB=%WindowsSdkDir%Lib\10.0.10586.0\ucrt\x64;%WindowsSdkDir%Lib\10.0.10586.0\um\x64;%VCINSTALLDIR%lib/amd64;%LIB%"

@SET cl64=%VCINSTALLDIR%bin\amd64\cl.exe
@SET link64=%VCINSTALLDIR%bin\amd64\link.exe

@echo x64 build env

@cd uts-src
@del *.obj
@del *.o
@del *.dll

@"%cl64%" /MD /O2 /c /DDUK_OPT_DLL_BUILD /D_WIN64 *.c
@"%link64%" /DLL /DEFAULTLIB:msvcrt.lib /IMPLIB:uts.lib /OUT:uts.dll *.obj
@copy uts.dll /Y ..\..\Assets\Plugins\x64\uts.dll

@cd ..

goto :eof

:missing
echo Can't find Visual Studio 2015.
goto :eofl



