@echo off
setlocal
set "PATH=%ProgramFiles%\nodejs;%PATH%"
if not exist "%ProgramFiles%\nodejs\node.exe" (
  echo Node.js was not found in Program Files.
  exit /b 1
)
if not exist "%~dp0.tools\pnpm\bin\pnpm.mjs" (
  echo Local pnpm was not found beside this script.
  exit /b 1
)
"%ProgramFiles%\nodejs\node.exe" "%~dp0.tools\pnpm\bin\pnpm.mjs" %*
exit /b %errorlevel%
