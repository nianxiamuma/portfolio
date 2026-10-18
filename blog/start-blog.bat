@echo off
chcp 936 >nul
title 年下牧马 · 博客
setlocal

echo ============================================
echo   年下牧马 · 博客（Astro）
echo ============================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

set "PORT=4321"
set "BLOG_URL=http://localhost:%PORT%/portfolio/blog/"

rem ---- 端口已被占用：多半是 dev server 已在跑，直接打开浏览器 ----
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [跳过启动] 端口 %PORT% 已有服务在运行
    echo            如果页面 404，说明占用该端口的不是本博客
    echo            请先关掉占用 %PORT% 的进程再双击本脚本
    echo ============================================
    echo 正在打开浏览器...
    start "" "%BLOG_URL%"
    pause
    exit /b 0
)

rem ---- 依赖检查（本仓库的 preinstall 限定 pnpm，用 --ignore-scripts 绕过）----
if not exist "%SCRIPT_DIR%node_modules" (
    echo [1/2] 首次运行，正在安装依赖，可能需要 1-2 分钟...
    call npm install --ignore-scripts
    if errorlevel 1 (
        echo        [X] 安装失败，请确认已安装 Node.js
        pause
        exit /b 1
    )
) else (
    echo [1/2] 依赖就绪
)

echo.
echo [2/2] 启动 dev server...
echo       网址：
echo       %BLOG_URL%
echo       关闭本窗口即停止服务
echo ============================================
echo.

rem 等服务起来再开浏览器，避免打开空白页
start "" cmd /c "timeout /t 6 >nul && start "" "%BLOG_URL%""

call npx astro dev --host 127.0.0.1 --port %PORT% --force

echo.
echo 服务已停止。
pause
