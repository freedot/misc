@echo off

:menu
cls
echo -----------------------------------------------------------------
echo 1  -  发布客户端
echo 2  -  发布服务器
echo 3  -  全部发布
echo -----------------------------------------------------------------
set /p input=请选择: 
cls
if "%input%"=="1" call :execute publish\publish_client.cmd
if "%input%"=="2" call :execute publish\publish_server.cmd
if "%input%"=="3" call :execute publish\publish_all.cmd

:execute
if exist %1 (call %1 && goto :eof) else echo %1 不存在. & pause & exit
