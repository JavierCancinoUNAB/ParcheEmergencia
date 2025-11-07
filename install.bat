@echo off
echo ============================================
echo    INSTALADOR DE TICKETVUE
echo ============================================
echo.

REM Verificar Docker
echo Verificando requisitos previos...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mDocker no esta instalado. Por favor instala Docker Desktop.[0m
    pause
    exit /b 1
)
echo [92m+ Docker instalado[0m

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [91mDocker Compose no esta instalado.[0m
    pause
    exit /b 1
)
echo [92m+ Docker Compose instalado[0m

REM Crear archivo .env si no existe
echo.
echo Configurando variables de entorno...
if not exist backend\.env (
    (
    echo # Base de datos
    echo DB_HOST=mysql
    echo DB_PORT=3306
    echo DB_NAME=ticketvue
    echo DB_USER=ticketuser
    echo DB_PASSWORD=ticketpass
    echo.
    echo # JWT
    echo JWT_SECRET=tu-secret-key-super-secreta-cambiala
    echo.
    echo # Email ^(opcional - dejar vacio si no se usa^)
    echo EMAIL_USER=
    echo EMAIL_PASSWORD=
    echo.
    echo # Puerto del servidor
    echo PORT=3000
    ) > backend\.env
    echo [92m+ Archivo .env creado en backend/[0m
) else (
    echo [93m! .env ya existe, no se sobrescribe[0m
)

REM Detener contenedores anteriores
echo.
echo Deteniendo contenedores anteriores...
docker-compose down -v 2>nul

REM Construir e iniciar servicios
echo.
echo Construyendo e iniciando contenedores...
docker-compose up -d --build

REM Esperar a que MySQL este listo
echo.
echo Esperando a que MySQL este listo (30 segundos)...
timeout /t 30 /nobreak >nul

REM Inicializar base de datos
echo.
echo Inicializando base de datos...
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend\database-schema-init.sql
if %errorlevel% equ 0 (
    echo [92m+ Esquema de base de datos creado[0m
) else (
    echo [91mError al crear esquema de base de datos[0m
)

REM Ejecutar migraciones
echo.
echo Ejecutando migraciones...
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend\migrations\create-audit-logs-table.sql 2>nul
echo [92m+ Migraciones completadas[0m

REM Ejecutar seed
echo.
echo Cargando datos de prueba...
docker exec ticketvue-backend npm run db:seed
if %errorlevel% equ 0 (
    echo [92m+ Datos de prueba cargados[0m
) else (
    echo [91mError al cargar datos de prueba[0m
)

REM Verificar salud
echo.
echo Verificando salud del sistema (espera 5 segundos)...
timeout /t 5 /nobreak >nul
call healthcheck.bat

echo.
echo ============================================
echo [92mINSTALACION COMPLETA[0m
echo ============================================
echo.
echo URLs de acceso:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:3000
echo   MySQL: localhost:3307
echo.
echo Usuarios de prueba:
echo   Admin: admin1@ticketvue.com / admin123
echo   Operador: operador1@ticketvue.com / oper123
echo   Cliente: cliente1@email.com / cliente123
echo.
pause
