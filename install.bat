@echo off
cd ./client
call npm clean-install
call npm run build
cd ./..
call npm clean-install
start http://localhost:6009/
call npm run build
