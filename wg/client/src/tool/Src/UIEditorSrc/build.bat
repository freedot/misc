c:/python27/python.exe setup.py build
copy .\build\exe.win-amd64-2.7\*.* ..\..\Bin\UIEditorBin\. 
rd .\build\. /s /q
@pause