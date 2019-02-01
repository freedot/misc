c:/python27/python.exe setup.py py2exe
xcopy .\dist\. ..\..\Bin\UIEditorBin /S /I
rd .\dist\. /s /q
rd .\build\. /s /q
@pause