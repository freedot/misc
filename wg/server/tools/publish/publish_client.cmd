@echo --------------------------------------------------------------------
@echo -- publish client image
@"C:\Python25\python" -u "E:\MyWork\wg\trunk\run\root\sgl\convertimage.py"
@echo .
@echo .

@echo --------------------------------------------------------------------
@echo -- publish client javascript
@"C:\Python25\python" -u "E:\MyWork\wg\trunk\run\root\sgl\convertjs.py"
@echo .
@echo .

@echo --------------------------------------------------------------------
@echo -- publish client css
@"C:\Python25\python" -u "E:\MyWork\wg\trunk\run\root\sgl\convertcss.py"
@echo .
@echo .

@echo --------------------------------------------------------------------
@echo -- commit
del E:\WebGames\Client\trunk\root\images\Thumbs.db /AH
del E:\MyWork\wg\trunk\run\root\sgl\images\Thumbs.db /AH
E:\WebGames\Server\trunk\svntool\svn.exe  cleanup E:\WebGames\Client
E:\WebGames\Server\trunk\svntool\svn.exe add E:\WebGames\Client\trunk\* --force

E:\WebGames\Server\trunk\svntool\svn.exe  cleanup E:\WebGames\Client
E:\WebGames\Server\trunk\svntool\svn.exe commit E:\WebGames\Client\trunk\ --message "auto publish"

@echo .
@echo .

pause
