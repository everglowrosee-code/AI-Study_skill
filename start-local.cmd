@echo off
setlocal

set "CODEX_NODE_DIR=C:\Users\g3spi\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "CODEX_PNPM=C:\Users\g3spi\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"

if not exist "%CODEX_NODE_DIR%\node.exe" (
  echo [ERROR] Codex bundled Node.js was not found.
  pause
  exit /b 1
)

if not exist "%CODEX_PNPM%" (
  echo [ERROR] Codex bundled pnpm was not found.
  pause
  exit /b 1
)

set "PATH=%CODEX_NODE_DIR%;%PATH%"
cd /d "%~dp0"

powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:3000; if ($r.Content -match 'Seoul Exhibition Notes') { exit 0 } else { exit 1 } } catch { exit 1 }"
if not errorlevel 1 (
  echo The exhibition page is already running at http://localhost:3000
  start "" "http://localhost:3000"
  exit /b 0
)

call "%CODEX_PNPM%" dev
