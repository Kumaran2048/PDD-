@echo off
title K6 Load Testing Runner
echo ====================================================================
echo                   K6 Load Testing Runner
echo ====================================================================

:: Refresh PATH locally to pick up any new k6 installation
set "PATH=%PATH%;C:\Program Files\k6"

:: Check if k6 is available
where k6 >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] k6 command could not be found in the current session.
    echo Please ensure Grafana k6 is installed properly.
    echo.
    pause
    exit /b 1
)

echo [INFO] k6 binary found successfully.
echo [INFO] Target Server: http://localhost:5000 (Ensure your backend is running)
echo ====================================================================
echo.
echo Select the test run mode:
echo   [1] Dry Run  - 1 Virtual User (VU) for 5 seconds (to verify endpoints)
echo   [2] Load Test - 100 Virtual Users (VUs) for 1 minute (baseline load test)
echo.

set /p choice="Enter option (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo [RUNNING] Executing Dry Run (1 VU, 5s)...
    k6 run --vus 1 --duration 5s load-test.js
) else if "%choice%"=="2" (
    echo.
    echo [RUNNING] Executing Full Baseline Load Test (100 VUs, 1m)...
    k6 run load-test.js
) else (
    echo.
    echo [ERROR] Invalid choice "%choice%". Exiting.
)

echo.
echo ====================================================================
pause
