del E:\MyWork\wg\trunk\xls\cov\client\*.js
del E:\MyWork\wg\trunk\xls\cov\server\*.lua

@echo ----------------------------------------------------------------
E:/MyWork/wg/trunk/tool/Bin/DataConvert/ConvertXLS.exe E:/MyWork/wg/trunk/xls/convertinput.py
E:/MyWork/wg/trunk/tool/Bin/AfterDataConvert/main.exe E:/MyWork/wg/trunk/xls/afterConverCfg.py
@echo .
@echo ----------------------------------------------------------------
@echo 开始发布文件
xcopy E:\MyWork\wg\trunk\xls\cov\client\. E:\MyWork\wg\trunk\web\js\res /S /I 
xcopy E:\MyWork\wg\trunk\xls\cov\server\. E:\MyWork\TqGame\trunk\data\script\res /S /I 

@pause