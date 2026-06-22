@echo off
echo 正在启动前端开发服务器...
echo ================================================

cd /d %~dp0

if not exist node_modules (
    echo 检测到缺少依赖，正在安装...
    npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接或npm配置
        pause
        exit /b 1
    )
)

echo 启动Vue开发服务器...
npm run dev

pause