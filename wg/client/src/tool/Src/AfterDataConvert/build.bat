setup.py
xcopy .\dist\. ..\..\Bin\AfterDataConvert /S /I
rd .\dist\. /s /q
rd .\build\. /s /q
@pause