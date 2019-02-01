cd ..\..\PyInstaller-2.1
python .\pyinstaller.py -F ..\Src\DataConvert\ConvertXLS.py
xcopy .\ConvertXLS\dist ..\Bin\DataConvert /S /I
rd .\ConvertXLS\. /s /q
cd ..\Src\DataConvert
@pause