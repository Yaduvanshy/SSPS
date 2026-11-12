@echo off
cd /d "%~dp0"
echo Starting S.S Public School Website on http://localhost:3000 ...
start "" http://localhost:3000/
node server.js
pause
