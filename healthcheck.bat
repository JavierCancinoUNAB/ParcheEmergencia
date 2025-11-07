@echo off
echo ============================================
echo    VERIFICACION DE SALUD DEL SISTEMA
echo ============================================
echo.

set PASSED=0
set FAILED=0

REM Verificar Docker
echo Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX Docker no instalado[0m
    set /a FAILED+=1
) else (
    echo [92m+ Docker instalado[0m
    set /a PASSED+=1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX Docker Compose no instalado[0m
    set /a FAILED+=1
) else (
    echo [92m+ Docker Compose instalado[0m
    set /a PASSED+=1
)

REM Verificar contenedores
echo.
echo Verificando contenedores...
docker ps | findstr ticketvue-mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX MySQL no corriendo[0m
    set /a FAILED+=1
) else (
    echo [92m+ MySQL corriendo[0m
    set /a PASSED+=1
)

docker ps | findstr ticketvue-backend >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX Backend no corriendo[0m
    set /a FAILED+=1
) else (
    echo [92m+ Backend corriendo[0m
    set /a PASSED+=1
)

docker ps | findstr ticketvue-frontend >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX Frontend no corriendo[0m
    set /a FAILED+=1
) else (
    echo [92m+ Frontend corriendo[0m
    set /a PASSED+=1
)

REM Verificar MySQL
echo.
echo Verificando MySQL...
docker exec ticketvue-mysql mysqladmin ping -h localhost -u root -prootpassword >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX MySQL no respondiendo[0m
    set /a FAILED+=1
) else (
    echo [92m+ MySQL respondiendo[0m
    set /a PASSED+=1
)

REM Verificar Backend
echo.
echo Verificando Backend...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/health | findstr "200" >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX Backend no responde correctamente[0m
    set /a FAILED+=1
) else (
    echo [92m+ Backend respondiendo (HTTP 200)[0m
    set /a PASSED+=1
)

REM Verificar Frontend
echo.
echo Verificando Frontend...
curl -s -o nul -w "%%{http_code}" http://localhost:80 | findstr "200" >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX Frontend no responde correctamente[0m
    set /a FAILED+=1
) else (
    echo [92m+ Frontend respondiendo (HTTP 200)[0m
    set /a PASSED+=1
)

REM Verificar API eventos
echo.
echo Verificando endpoints criticos...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/api/events | findstr "200" >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mX API /api/events no responde[0m
    set /a FAILED+=1
) else (
    echo [92m+ API /api/events (HTTP 200)[0m
    set /a PASSED+=1
)

REM Resumen
echo.
echo ============================================
echo RESUMEN
echo ============================================
echo Pruebas exitosas: %PASSED%
echo Pruebas fallidas: %FAILED%
echo.

if %FAILED% equ 0 (
    echo [92mSISTEMA OPERATIVO CORRECTAMENTE[0m
) else (
    echo [91mSISTEMA TIENE ERRORES[0m
    echo.
    echo Sugerencias:
    echo 1. Ejecuta: docker-compose down -v
    echo 2. Ejecuta: docker-compose up -d
    echo 3. Espera 30 segundos y vuelve a ejecutar este script
)

echo.
echo ============================================
echo Presiona cualquier tecla para salir...
pause >nul
