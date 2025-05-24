@echo off
start "" /b cmd /c "timeout /t 10 && start http://localhost:5173/"
docker-compose up --build
pause