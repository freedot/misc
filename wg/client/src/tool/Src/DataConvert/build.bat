setup.py
xcopy .\dist\. ..\..\Bin\DataConvert /S /I
rd .\dist\. /s /q
rd .\build\. /s /q
@pause