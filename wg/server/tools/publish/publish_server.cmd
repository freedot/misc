@echo --------------------------------------------------------------------
@echo -- publish server luascript
@E:\wg\server\tools\PkgMaker.exe -p E:/wg/server/data E:/wg/server/data E:/wg/server-run/data/stuff.dat E:/wg/server/data/pkgexclude.txt
@xcopy E:\wg\server\data\script\res\. E:\wg\server-run\data\script\res /S /I /Y
@xcopy E:\wg\server\data\script\npctalks\. E:\wg\server-run\data\script\npctalks /S /I /Y
@echo .
@echo .

@echo --------------------------------------------------------------------
@echo -- publish server dll exe
@copy E:\wg\server\bin\*.so E:\wg\server-run\bin\ /Y
@copy E:\wg\server\bin\*.dll E:\wg\server-run\bin\ /Y
@copy E:\wg\server\bin\*.exe E:\wg\server-run\bin\ /Y
@echo .
@echo .

pause

