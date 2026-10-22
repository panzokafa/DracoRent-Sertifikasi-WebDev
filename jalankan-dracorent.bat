@echo off
title DracoRent - Server & Database Launcher
echo =====================================================
echo  DRACORENT - MENYALAKAN MYSQL, APACHE, DAN SERVER WEB
echo =====================================================

cd /d "%~dp0"

echo [1/3] Menyalakan MySQL (XAMPP)...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="1" (
    start "" /B "E:\XAMPP\mysql\bin\mysqld.exe" --defaults-file="E:\XAMPP\mysql\bin\my.ini" --standalone
)

echo [2/3] Menyalakan Apache / phpMyAdmin (XAMPP)...
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="1" (
    start "" /B "E:\XAMPP\apache\bin\httpd.exe" -d "E:\XAMPP\apache" -f "E:\XAMPP\apache\conf\httpd.conf"
)

echo [3/3] Menjalankan Server Website DracoRent di http://localhost:8000 ...
echo.
echo  - Portal Utama 13 Layar : http://localhost:8000
echo  - Halaman Login         : http://localhost:8000/screens/masuk.html
echo  - phpMyAdmin Database   : http://localhost/phpmyadmin/
echo.
start "" "http://localhost:8000"
"E:\XAMPP\php\php.exe" -S localhost:8000 -t public public/index.php
pause
