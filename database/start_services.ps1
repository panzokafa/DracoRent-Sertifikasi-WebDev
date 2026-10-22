$wsh = New-Object -ComObject WScript.Shell
if (-not (Get-Process mysqld -ErrorAction SilentlyContinue)) {
    $wsh.Run('E:\XAMPP\mysql\bin\mysqld.exe --defaults-file=E:\XAMPP\mysql\bin\my.ini --standalone', 0, $false) | Out-Null
}
if (-not (Get-Process httpd -ErrorAction SilentlyContinue)) {
    $wsh.Run('E:\XAMPP\apache\bin\httpd.exe -d E:\XAMPP\apache -f E:\XAMPP\apache\conf\httpd.conf', 0, $false) | Out-Null
}
if (-not (Get-Process php -ErrorAction SilentlyContinue)) {
    $wsh.Run('cmd /c cd /d C:\Users\Ghilman\.t3\projects\sistem-peminjaman-naga && E:\XAMPP\php\php.exe -S localhost:8000 -t public public/index.php', 0, $false) | Out-Null
}
Start-Sleep -Seconds 2
Get-Process mysqld, httpd, php -ErrorAction SilentlyContinue | Select-Object Id, ProcessName
