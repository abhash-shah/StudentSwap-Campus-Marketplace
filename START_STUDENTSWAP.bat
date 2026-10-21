@echo off
cd /d "%~dp0"
echo ==========================================
echo StudentSwap local development launcher
 echo ==========================================
set /p DB_PASSWORD=Enter your MySQL root password: 
set /p ADMIN_PASSWORD=Choose/enter your admin password: 
if "%ADMIN_PASSWORD%"=="" set "ADMIN_PASSWORD=change-this-admin-password"
echo Starting Spring Boot backend...
start "StudentSwap Backend" cmd /k "cd /d ""%~dp0studentswap-backend"" && set ""DB_PASSWORD=%DB_PASSWORD%"" && set ""ADMIN_PASSWORD=%ADMIN_PASSWORD%"" && mvnw.cmd spring-boot:run"
echo Starting React frontend...
start "StudentSwap Frontend" cmd /k "cd /d ""%~dp0StudentSwap-Frontend"" && if not exist node_modules call npm.cmd install && npm.cmd run dev -- --port 5175 --strictPort"
echo Open http://localhost:5175 after both terminals start.
pause
