@echo off
chcp 65001 >nul
echo ============================================
echo   年下牧马 · 个人收藏站
echo ============================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo [1/2] 检查依赖...
if not exist "%SCRIPT_DIR%node_modules" (
    echo        首次运行，正在安装依赖（可能需要 1-2 分钟）...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo        ✗ 安装失败，请检查 Node.js 是否已安装
        pause
        exit /b 1
    )
)
echo        ✓ 依赖就绪

echo.
echo [2/2] 启动并打开浏览器...
echo        网址：http://localhost:5173
echo        关闭本窗口即停止服务
echo ============================================
echo.

rem --open 让 vite 启动完成后自动打开默认浏览器
node "%SCRIPT_DIR%node_modules\vite\bin\vite.js" --host 0.0.0.0 --port 5173 --open

pause
