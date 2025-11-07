# 🚀 Guía de Instalación - TicketVue

## Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Automática](#instalación-automática)
3. [Instalación Manual](#instalación-manual)
4. [Verificación](#verificación)
5. [Solución de Problemas](#solución-de-problemas)
6. [Comandos Útiles](#comandos-útiles)

## Requisitos Previos

### Software Necesario
- **Docker Desktop** (versión 20.10 o superior)
  - Windows: https://www.docker.com/products/docker-desktop
  - Mac: https://www.docker.com/products/docker-desktop
  - Linux: https://docs.docker.com/engine/install/
- **Git** (para clonar el repositorio)
- **4GB de RAM** disponibles
- **10GB de espacio** en disco

### Puertos Requeridos
Asegúrate de que estos puertos estén libres:
- **80**: Frontend (Nginx)
- **3000**: Backend API (Node.js)
- **3307**: MySQL

### Verificar Puertos (Windows)
```powershell
netstat -ano | findstr :80
netstat -ano | findstr :3000
netstat -ano | findstr :3307
```

### Verificar Puertos (Linux/Mac)
```bash
lsof -ti:80
lsof -ti:3000
lsof -ti:3307
```

## Instalación Automática

### Windows

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/ParcheEmergencia-Parche2.git
cd ParcheEmergencia-Parche2
```

2. **Ejecutar instalador**
```bash
install.bat
```

3. **Esperar** (aproximadamente 5-10 minutos)

### Linux/Mac

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/ParcheEmergencia-Parche2.git
cd ParcheEmergencia-Parche2
```

2. **Dar permisos de ejecución**
```bash
chmod +x install.sh healthcheck.sh
```

3. **Ejecutar instalador**
```bash
./install.sh
```

4. **Esperar** (aproximadamente 5-10 minutos)

## Instalación Manual

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/ParcheEmergencia-Parche2.git
cd ParcheEmergencia-Parche2
```

### Paso 2: Crear Archivo .env

Crea el archivo `backend/.env` con el siguiente contenido:

```env
# Base de datos
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ticketvue
DB_USER=ticketuser
DB_PASSWORD=ticketpass
DB_ROOT_PASSWORD=rootpassword

# JWT
JWT_SECRET=tu-secret-key-super-secreta-cambiala-en-produccion
JWT_EXPIRE=7d

# Email (opcional - dejar vacío si no se usa)
EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@ticketvue.com

# Puerto del servidor
PORT=3000
NODE_ENV=production
```

### Paso 3: Iniciar Contenedores
```bash
docker-compose up -d --build
```

### Paso 4: Esperar a que MySQL Esté Listo

**Windows:**
```powershell
timeout /t 30 /nobreak
```

**Linux/Mac:**
```bash
sleep 30
```

### Paso 5: Inicializar Base de Datos

**Windows:**
```bash
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend\database-schema-init.sql
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend\migrations\create-audit-logs-table.sql
```

**Linux/Mac:**
```bash
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/database-schema-init.sql
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/migrations/create-audit-logs-table.sql
```

### Paso 6: Cargar Datos de Prueba
```bash
docker exec ticketvue-backend npm run db:seed
```

## Verificación

### Opción 1: Script de Verificación

**Windows:**
```bash
healthcheck.bat
```

**Linux/Mac:**
```bash
./healthcheck.sh
```

### Opción 2: Verificación Manual

1. **Ver contenedores corriendo**
```bash
docker ps
```

Deberías ver 3 contenedores:
- `ticketvue-mysql`
- `ticketvue-backend`
- `ticketvue-frontend`

2. **Verificar MySQL**
```bash
docker exec ticketvue-mysql mysqladmin ping -h localhost -u root -prootpassword
```

3. **Verificar Backend**
```bash
curl http://localhost:3000/health
```

4. **Verificar Frontend**
Abre tu navegador en: http://localhost

### URLs de Acceso

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3307 (usuario: `root`, password: `rootpassword`)

### Usuarios de Prueba

| Rol | Email | Contraseña | UserType |
|-----|-------|------------|----------|
| Administrador | admin1@ticketvue.com | admin123 | Administrador |
| Administrador 2 | admin2@ticketvue.com | admin456 | Administrador |
| Operador | operador1@ticketvue.com | oper123 | Operador |
| Operador 2 | operador2@ticketvue.com | oper456 | Operador |
| Cliente | cliente1@email.com | cliente123 | Cliente |
| Cliente 2 | cliente2@email.com | cliente456 | Cliente |

**Nota**: Al hacer login, asegúrate de seleccionar el tipo de usuario correcto (userType).

## Solución de Problemas

### Error: "Port already in use"

**Windows:**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Error: "Container name already in use"

```bash
# Eliminar contenedores existentes
docker rm -f ticketvue-mysql ticketvue-backend ticketvue-frontend

# Reiniciar
docker-compose up -d
```

### La Base de Datos Está Vacía

```bash
# Reinicializar base de datos
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/database-schema-init.sql
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/migrations/create-audit-logs-table.sql

# Cargar datos de prueba
docker exec ticketvue-backend npm run db:seed
```

### El Frontend No Carga

```bash
# Reconstruir solo el frontend
docker-compose up -d --build frontend

# Esperar 10 segundos
# Recargar navegador con Ctrl+Shift+R
```

### Error 500 en APIs

```bash
# Ver logs del backend
docker-compose logs -f backend

# Reiniciar backend
docker restart ticketvue-backend
```

### Tabla "events" o "audit_logs" No Existe

```bash
# Ejecutar migraciones nuevamente
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/database-schema-init.sql
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/migrations/create-audit-logs-table.sql

# Reiniciar backend
docker restart ticketvue-backend
```

## Comandos Útiles

### Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo MySQL
docker-compose logs -f mysql

# Últimas 100 líneas del backend
docker logs ticketvue-backend --tail 100
```

### Reiniciar Servicios

```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo backend
docker restart ticketvue-backend

# Reiniciar solo frontend
docker restart ticketvue-frontend
```

### Detener y Eliminar

```bash
# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Eliminar imágenes también
docker-compose down -v --rmi all
```

### Acceder a Contenedores

```bash
# Consola de MySQL
docker exec -it ticketvue-mysql mysql -u root -prootpassword ticketvue

# Bash en backend
docker exec -it ticketvue-backend sh

# Bash en frontend
docker exec -it ticketvue-frontend sh
```

### Base de Datos

```bash
# Ver tablas
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue -e "SHOW TABLES;"

# Ver eventos
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue -e "SELECT * FROM events;"

# Ver usuarios
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue -e "SELECT id, email, user_type FROM users;"

# Backup de la base de datos
docker exec ticketvue-mysql mysqldump -u root -prootpassword ticketvue > backup.sql

# Restaurar backup
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backup.sql
```

### Reconstruir Después de Cambios

```bash
# Reconstruir todo
docker-compose up -d --build

# Reconstruir solo frontend
docker-compose up -d --build frontend

# Reconstruir solo backend
docker-compose up -d --build backend
```

## Estructura del Proyecto

```
ParcheEmergencia-Parche2/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── config/            # Configuración DB, seed
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── middleware/        # Auth, validación
│   │   ├── models/            # Modelos Sequelize
│   │   ├── routes/            # Rutas de la API
│   │   ├── services/          # Servicios (PDF, email)
│   │   └── utils/             # Utilidades
│   ├── migrations/            # Migraciones SQL
│   ├── database-schema-init.sql
│   ├── server.js
│   └── package.json
├── src/                        # Frontend Vue.js
│   ├── views/                 # Vistas principales
│   ├── components/            # Componentes reutilizables
│   ├── services/              # Servicios API
│   ├── stores/                # Estado global
│   └── router/                # Enrutamiento
├── docker-compose.yml          # Configuración Docker
├── Dockerfile                  # Frontend Docker
├── nginx.conf                  # Configuración Nginx
├── install.sh                  # Instalador Linux/Mac
├── install.bat                 # Instalador Windows
├── healthcheck.sh              # Verificación Linux/Mac
├── healthcheck.bat             # Verificación Windows
├── CHECKLIST.md                # Lista de verificación
└── README.md                   # Documentación principal
```

## Seguridad

⚠️ **IMPORTANTE**: Antes de desplegar en producción:

1. Cambia `JWT_SECRET` en `backend/.env`
2. Cambia las contraseñas de MySQL (`DB_PASSWORD`, `DB_ROOT_PASSWORD`)
3. Configura HTTPS/SSL con certificados válidos
4. Cambia las contraseñas de los usuarios de prueba
5. Configura CORS correctamente para tu dominio
6. Habilita logs de auditoría
7. Configura límites de rate limiting
8. Usa variables de entorno seguras (no commits en git)

## Configuración de Email (Opcional)

Para habilitar el envío automático de emails:

1. Edita `backend/.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-password-de-aplicacion
EMAIL_FROM=noreply@ticketvue.com
```

2. Si usas Gmail, necesitas:
   - Habilitar "Verificación en 2 pasos"
   - Crear una "Contraseña de aplicación"
   - Usar esa contraseña en `EMAIL_PASSWORD`

3. Reinicia el backend:
```bash
docker restart ticketvue-backend
```

## Siguientes Pasos

1. ✅ Verifica que todo funcione con `healthcheck.sh` o `healthcheck.bat`
2. 📖 Lee el [`CHECKLIST.md`](CHECKLIST.md ) para verificar funcionalidades
3. 🔐 Haz login con los usuarios de prueba
4. 🎫 Crea un evento de prueba
5. 🎟️ Genera tickets de prueba
6. ✔️ Valida tickets como operador

## Soporte

Si encuentras problemas:

1. Revisa esta guía
2. Consulta [`CHECKLIST.md`](CHECKLIST.md )
3. Revisa logs: `docker-compose logs`
4. Contacta a: [tu-email@ejemplo.com]
