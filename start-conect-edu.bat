@echo off
setlocal

set "NODE_PATH=C:\Program Files\nodejs"
set "PATH=%NODE_PATH%;%PATH%"
cd /d "C:\Users\sadiq\OneDrive\Documents\CONECT EDU"

for /f "usebackq" %%P in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 3005 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' } | Select-Object -ExpandProperty OwningProcess 2>$null"`) do (
  if not "%%P"=="" (
    taskkill /PID %%P /F >nul 2>&1
  )
)

REM Clean any stale Next.js output before starting
if exist ".next" (
  rmdir /s /q ".next"
)

start "CONECT EDU" cmd /k "set "PATH=C:\Program Files\nodejs;%PATH%" && cd /d "C:\Users\sadiq\OneDrive\Documents\CONECT EDU" && npm run dev -- --port 3005"
start "" "http://localhost:3005"

echo.
echo CONECT EDU is starting on http://localhost:3005
ping -n 5 127.0.0.1 >nul
exit /b 0
