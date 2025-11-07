# 🚀 Quick Start Guide - TicketVue

## TL;DR (Para impacientes)

```bash
# Clonar
git clone <repo-url>
cd ParcheEmergencia-Parche2

# Windows
install.bat

# Linux/Mac
chmod +x install.sh && ./install.sh

# Abrir: http://localhost
# Login: admin1@ticketvue.com / admin123 (tipo: Administrador)
```

## ¿Qué hace el instalador?

1. ✅ Verifica Docker y Docker Compose
2. ✅ Crea archivo `.env` con configuración por defecto
3. ✅ Inicia 3 contenedores: MySQL, Backend, Frontend
4. ✅ Espera a que MySQL esté listo (30 segundos)
5. ✅ Crea tablas en la base de datos
6. ✅ Ejecuta migraciones
7. ✅ Carga datos de prueba (3 eventos, 6 usuarios)
8. ✅ Verifica que todo funcione

**Tiempo estimado**: 5-10 minutos

## Verificar que todo funciona

```bash
# Windows
healthcheck.bat

# Linux/Mac
./healthcheck.sh
```

Deberías ver todas marcas verdes ✓

## URLs

- **Frontend**: http://localhost
- **Backend**: http://localhost:3000
- **MySQL**: localhost:3307

## Usuarios de Prueba

| Email | Password | Tipo |
|-------|----------|------|
| admin1@ticketvue.com | admin123 | Administrador |
| operador1@ticketvue.com | oper123 | Operador |
| cliente1@email.com | cliente123 | Cliente |

**⚠️ IMPORTANTE**: Al hacer login, selecciona el tipo de usuario correcto.

## Problemas Comunes

### Puerto ocupado
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Contenedor ya existe
```bash
docker rm -f ticketvue-mysql ticketvue-backend ticketvue-frontend
docker-compose up -d
```

### Base de datos vacía
```bash
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/database-schema-init.sql
docker exec ticketvue-backend npm run db:seed
```

### Todo está roto
```bash
docker-compose down -v
# Espera 5 segundos
# Ejecuta install.sh o install.bat nuevamente
```

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar todo
docker-compose restart

# Detener todo
docker-compose down

# Ver contenedores
docker ps

# Reconstruir después de cambios
docker-compose up -d --build
```

## Estructura Rápida

```
backend/          → API (Node.js + Express)
  src/
    controllers/  → Lógica de negocio
    routes/       → Endpoints
    models/       → Modelos DB
  migrations/     → SQL para tablas
  
src/              → Frontend (Vue.js)
  views/          → Páginas principales
    AdminPanel.vue      → Panel admin
    OperatorPanel.vue   → Panel operador
    EventList.vue       → Lista eventos
    Confirmation.vue    → Confirmación + QR
```

## Flujo de Usuario

### Cliente (Comprar Ticket)
1. Ver eventos → http://localhost
2. Seleccionar ticket
3. Ingresar datos personales
4. Confirmar compra
5. Descargar PDF con QR

### Operador (Validar Ticket)
1. Login como operador
2. Escanear QR o ingresar código/RUT
3. Ver resultado de validación
4. Ver historial

### Admin (Gestión)
1. Login como admin
2. Crear/editar eventos
3. Crear/editar tipos de tickets
4. Crear usuarios
5. Ver reportes y auditoría
6. Exportar PDF/CSV

## Testing Rápido

```bash
# 1. Login como admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@ticketvue.com","password":"admin123","userType":"Administrador"}'

# 2. Ver eventos (debería devolver 3 eventos)
curl http://localhost:3000/api/events

# 3. Ver usuarios (requiere token)
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <tu-token>"
```

## Datos de Prueba Incluidos

- **3 Eventos**: Concierto, Teatro, Festival
- **6 Usuarios**: 2 admins, 2 operadores, 2 clientes
- **Tipos de tickets**: Normal, VIP, General, Premium (por evento)
- **1 Ticket de ejemplo**: Para probar validación

## Documentación Completa

- **[README.md](README.md)** - Documentación principal
- **[GUIA_INSTALACION.md](GUIA_INSTALACION.md)** - Guía detallada paso a paso
- **[CHECKLIST.md](CHECKLIST.md)** - Lista de verificación completa

## Soporte

1. Lee la documentación
2. Ejecuta `healthcheck.sh`
3. Revisa logs: `docker-compose logs`
4. Abre un issue en GitHub

---

**Pro tip**: Si algo no funciona, el 90% de las veces se soluciona con:
```bash
docker-compose down -v && ./install.sh
```

**¿Listo para producción?** 

NO. Antes debes:
1. Cambiar `JWT_SECRET`
2. Cambiar contraseñas de MySQL
3. Cambiar contraseñas de usuarios
4. Configurar HTTPS
5. Configurar CORS
6. Habilitar logs de auditoría

Lee [`README.md`](README.md ) para más detalles.
