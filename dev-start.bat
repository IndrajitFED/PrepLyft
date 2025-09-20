@echo off
REM Development startup script for Interview Booking Project
REM This script starts both frontend and backend with auto-restart enabled

echo 🚀 Starting Interview Booking Development Environment...
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version:
npm --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

echo.
echo 🔄 Starting servers with auto-restart enabled...
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 💡 Tips:
echo    - Both servers will auto-restart when you save files
echo    - Type 'rs' in either terminal to manually restart
echo    - Press Ctrl+C to stop all servers
echo.

REM Start both servers concurrently
npm run dev:watch

pause
