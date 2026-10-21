@echo off
cd /d "%~dp0"
echo StudentSwap local launcher
set /p DB_PASSWORD=Enter your MySQL root password: 
set /p ADMIN_PASSWORD=Choose your admin dashboard password: 
if "%DB_PASSWORD%"=="" (echo MySQL password is required.& pause& exit /b 1)
if "%ADMIN_PASSWORD%"=="" (echo Admin password is required.& pause& exit /b 1)
start "StudentSwap Backend" cmd /k "cd /d ""%~dp0studentswap-backend"" && set ""DB_PASSWORD=%DB_PASSWORD%"" && set ""ADMIN_PASSWORD=%ADMIN_PASSWORD%"" && mvnw.cmd spring-boot:run"
start "StudentSwap Frontend" cmd /k "cd /d ""%~dp0StudentSwap-Frontend"" && npm.cmd install && npm.cmd run dev -- --port 5175"
echo Open http://localhost:5175 once both servers start.
pause
