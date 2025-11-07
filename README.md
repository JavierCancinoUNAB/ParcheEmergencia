# 🎫 TicketVue - Sistema de Gestión de Tickets

Sistema completo de venta y validación de tickets para eventos con Vue.js, Node.js, Express y MySQL en Docker.

## 📋 Descripción

Aplicación web completa que permite:
- **Compra de tickets**: Exploración de eventos y compra segura de entradas
- **Validación QR**: Validación mediante escaneo QR o ingreso manual (RUT/código)
- **Panel de administración**: Gestión de eventos, tipos de tickets y usuarios
- **Sistema de auditoría**: Historial completo de validaciones y reportes
- **Base de datos MySQL**: Almacenamiento persistente con transacciones atómicas
- **Arquitectura dockerizada**: Fácil despliegue y escalabilidad

## ⭐ Características Principales

✅ **Gestión de Eventos**
- Crear, editar y eliminar eventos
- Múltiples tipos de tickets por evento (Normal, VIP, General, Premium)
- Control de capacidad y precios

✅ **Sistema de Compra**
- Flujo de compra intuitivo
- Generación automática de código QR
- Descarga de entrada en PDF
- Envío automático por email (opcional)

✅ **Validación de Tickets**
- Escaneo de código QR
- Validación por código de ticket
- Validación por RUT del comprador
- Detección de fraude (tickets ya validados)

✅ **Panel de Administración**
- Dashboard con estadísticas
- Gestión de usuarios (clientes, operadores, administradores)
- Reportes de auditoría
- Exportación a PDF y CSV
- Control de acceso basado en roles (RBAC)

✅ **Sistema de Auditoría**
- Registro completo de validaciones
- Filtros avanzados (por evento, fecha, operador, resultado)
- Estadísticas en tiempo real
- Generación de reportes PDF

## 🏗️ Arquitectura

### Frontend (Vue.js 3)
- Framework: Vue 3 + Composition API
- State Management: Pinia
- Routing: Vue Router
- UI: Bootstrap 5
- QR: QRCode.js + jsPDF
- Servidor: Nginx

### Backend (Node.js + Express)
- Framework: Express.js
- ORM: Sequelize
- Autenticación: JWT
- Validación: express-validator
- Generación PDF: PDFKit

### Base de Datos (MySQL 8.0)
- Tablas: users, events, ticket_types, tickets, audit_logs
- Migraciones automatizadas
- Seed con datos de prueba

### Infraestructura (Docker)
- 3 contenedores: MySQL, Backend, Frontend
- Docker Compose para orquestación
- Volúmenes persistentes para la BD
- Health checks configurados

## 🚀 Inicio Rápido

### Requisitos Previos

- **Docker Desktop** instalado y corriendo
- **Git**
- **4GB de RAM** disponibles
- **Puertos libres**: 80, 3000, 3307

### Instalación Automática (Recomendado)

**Windows:**
```bash
git clone https://github.com/tu-usuario/ParcheEmergencia-Parche2.git
cd ParcheEmergencia-Parche2
install.bat
```

**Linux/Mac:**
```bash
git clone https://github.com/tu-usuario/ParcheEmergencia-Parche2.git
cd ParcheEmergencia-Parche2
chmod +x install.sh healthcheck.sh
./install.sh
```

### Verificar Instalación

**Windows:**
```bash
healthcheck.bat
```

**Linux/Mac:**
```bash
./healthcheck.sh
```

## 🌐 Acceso al Sistema

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3307

## 👤 Usuarios de Prueba

| Rol | Email | Contraseña | UserType |
|-----|-------|------------|----------|
| Admin | admin1@ticketvue.com | admin123 | Administrador |
| Operador | operador1@ticketvue.com | oper123 | Operador |
| Cliente | cliente1@email.com | cliente123 | Cliente |

**Nota**: Al hacer login, selecciona el tipo de usuario correcto.

## 📁 Estructura del Proyecto

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
│   │   ├── EventList.vue      # Lista de eventos
│   │   ├── TicketSelection.vue # Selección de tickets
│   │   ├── PersonalData.vue   # Datos personales
│   │   ├── Confirmation.vue   # Confirmación y QR
│   │   ├── OperatorPanel.vue  # Panel de validación
│   │   └── AdminPanel.vue     # Panel de administración
│   ├── components/            # Componentes reutilizables
│   ├── services/              # Servicios API
│   ├── stores/                # Estado global (Pinia)
│   └── router/                # Enrutamiento
├── docker-compose.yml          # Configuración Docker
├── Dockerfile                  # Frontend Docker
├── nginx.conf                  # Configuración Nginx
├── install.sh                  # Instalador Linux/Mac
├── install.bat                 # Instalador Windows
├── healthcheck.sh              # Verificación Linux/Mac
├── healthcheck.bat             # Verificación Windows
├── CHECKLIST.md                # Lista de verificación
├── GUIA_INSTALACION.md         # Guía detallada
└── README.md                   # Este archivo
```

## 🛠️ Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra la BD)
docker-compose down -v

# Reconstruir después de cambios
docker-compose up -d --build

# Acceder a la consola de MySQL
docker exec -it ticketvue-mysql mysql -u root -prootpassword ticketvue

# Ejecutar seed nuevamente
docker exec ticketvue-backend npm run db:seed

# Ver contenedores corriendo
docker ps

# Ver estado de salud de MySQL
docker exec ticketvue-mysql mysqladmin ping -h localhost -u root -prootpassword
```

## 📖 Documentación Adicional

- **[`GUIA_INSTALACION.md`](GUIA_INSTALACION.md )** - Guía completa de instalación paso a paso
- **[`CHECKLIST.md`](CHECKLIST.md )** - Lista de verificación para desarrolladores
- **Otros documentos**:
  - [`AUDIT_SYSTEM_IMPLEMENTATION.md`](AUDIT_SYSTEM_IMPLEMENTATION.md ) - Sistema de auditoría
  - [`HU7_IMPLEMENTACION_COMPLETA.md`](HU7_IMPLEMENTACION_COMPLETA.md ) - Gestión de usuarios
  - [`PDF_REPORT_FEATURE.md`](PDF_REPORT_FEATURE.md ) - Generación de reportes PDF

## 🐛 Solución de Problemas

### Error: "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "Container name already in use"
```bash
docker rm -f ticketvue-mysql ticketvue-backend ticketvue-frontend
docker-compose up -d
```

### La base de datos está vacía
```bash
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/database-schema-init.sql
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/migrations/create-audit-logs-table.sql
docker exec ticketvue-backend npm run db:seed
```

### El frontend no carga
```bash
docker-compose up -d --build frontend
# Esperar 10 segundos y recargar con Ctrl+Shift+R
```

Para más soluciones, consulta [`GUIA_INSTALACION.md`](GUIA_INSTALACION.md )

## 🔒 Seguridad

**⚠️ IMPORTANTE**: Antes de desplegar en producción:

1. ✅ Cambia `JWT_SECRET` en `backend/.env`
2. ✅ Cambia las contraseñas de MySQL
3. ✅ Configura HTTPS/SSL
4. ✅ Cambia las contraseñas de los usuarios de prueba
5. ✅ Configura CORS correctamente
6. ✅ Habilita rate limiting
7. ✅ Usa variables de entorno seguras

## 📧 Configuración de Email (Opcional)

Para habilitar el envío automático de emails al comprar tickets:

1. Edita `backend/.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-password-de-aplicacion
EMAIL_FROM=noreply@ticketvue.com
```

2. Si usas Gmail:
   - Habilita "Verificación en 2 pasos"
   - Crea una "Contraseña de aplicación"
   - Usa esa contraseña en `EMAIL_PASSWORD`

3. Reinicia el backend:
```bash
docker restart ticketvue-backend
```

## 🧪 Testing

```bash
# Backend tests (cuando estén implementados)
docker exec ticketvue-backend npm test

# Ver coverage
docker exec ticketvue-backend npm run test:coverage
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📊 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de cliente
- `POST /api/auth/login` - Login (admin/operador/cliente)
- `GET /api/auth/me` - Perfil del usuario actual

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento (admin)
- `PUT /api/events/:id` - Actualizar evento (admin)
- `DELETE /api/events/:id` - Eliminar evento (admin)

### Tipos de Tickets
- `GET /api/ticket-types/event/:eventId` - Tipos de tickets por evento
- `POST /api/ticket-types` - Crear tipo de ticket (admin)
- `PUT /api/ticket-types/:id` - Actualizar tipo (admin)
- `DELETE /api/ticket-types/:id` - Eliminar tipo (admin)

### Tickets
- `POST /api/tickets` - Comprar ticket
- `POST /api/tickets/validate-qr` - Validar por QR (operador)
- `POST /api/tickets/validate-rut` - Validar por RUT (operador)

### Auditoría
- `GET /api/audit/logs` - Historial de auditoría (admin)
- `GET /api/audit/stats` - Estadísticas (admin)
- `POST /api/audit/generate-pdf` - Generar reporte PDF (admin)

### Administración
- `GET /api/admin/users` - Listar usuarios (admin)
- `POST /api/admin/clients` - Crear cliente (admin)
- `POST /api/admin/operators` - Crear operador (admin)
- `PUT /api/admin/users/:id/toggle-status` - Activar/desactivar usuario (admin)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 🙋 Soporte

Si tienes problemas o preguntas:

1. Consulta [`GUIA_INSTALACION.md`](GUIA_INSTALACION.md )
2. Revisa [`CHECKLIST.md`](CHECKLIST.md )
3. Abre un [Issue](https://github.com/tu-usuario/ParcheEmergencia-Parche2/issues)
4. Contacta a: tu-email@ejemplo.com

---

Desarrollado con ❤️ por [Tu Nombre]
```sql
CREATE DATABASE ticketing_system;
```

Configurar variables de entorno (`backend/.env`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ticketing_system
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

Inicializar datos:
```bash
cd backend
npm run seed
```

### 3. Ejecutar Aplicación

#### Opción A: Docker (Recomendado)
```bash
docker-compose up
```

#### Opción B: Ejecución Local

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Acceso:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## ✨ Funcionalidades Principales

### 1. Sistema de Compra de Tickets

**Flujo:**
1. Selección de Evento
2. Selección de Tipo de Ticket y Cantidad
3. Datos Personales y Pago
4. Confirmación con QR

**Características:**
- ✅ Transacciones atómicas en MySQL
- ✅ Verificación de disponibilidad en tiempo real
- ✅ Actualización automática de tickets disponibles después de compra
- ✅ Generación de QR único y seguro con checksum
- ✅ Descarga de ticket en PDF
- ✅ Envío por email (configuración requerida)

### 2. Sistema de Validación QR (Panel Operador)

**Acceso:** `/operator/login`
- Usuario: `operador@ticketsystem.com`
- Contraseña: `Operador123!`

**Métodos de Validación:**
1. **Escaneo QR:**
   - Activa cámara del dispositivo
   - **Espera 15 segundos a que se presente el código**
   - **Muestra "Tiempo de Escaneo Expirado" si no hay código**
   - Valida solo cuando detecta un QR válido
   - Presiona Enter para simular detección

2. **Ingreso Manual:**
   - Por código de ticket (TKT-XXXXX-XXXX)
   - Por RUT del comprador

**Características de Seguridad:**
- ✅ Verificación de checksum
- ✅ Detección de tickets duplicados
- ✅ Detección de códigos falsificados
- ✅ Registro de auditoría
- ✅ Protección anti-replay
- ✅ Validación de integridad

### 3. Panel de Administración

**Acceso:** `/admin`
- Usuario: `admin@ticketsystem.com`
- Contraseña: `Admin123!`

**Funcionalidades:**
- Gestión de eventos
- Gestión de tipos de tickets
- Gestión de usuarios
- Estadísticas en tiempo real
- Exportación de datos

## 📊 Estructura del Proyecto

```
ingenieriaSoftware-Boleteria/
├── src/                         # Frontend
│   ├── views/
│   │   ├── EventList.vue       # Lista de eventos
│   │   ├── TicketSelection.vue # Selección de tickets
│   │   ├── PersonalData.vue    # Datos y pago
│   │   ├── Confirmation.vue    # Confirmación con QR
│   │   ├── OperatorPanel.vue   # Panel de validación
│   │   └── AdminPanel.vue      # Panel admin
│   ├── components/             # Componentes
│   ├── stores/                 # Pinia stores
│   ├── services/               # Servicios
│   └── router/                 # Rutas
├── backend/
│   ├── src/
│   │   ├── models/            # Modelos Sequelize
│   │   ├── controllers/       # Controladores
│   │   ├── routes/            # Rutas API
│   │   └── config/            # Configuración
│   └── server.js              # Servidor Express
├── docker-compose.yml
└── package.json
```

## 🔧 API Endpoints

### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events/:id` - Obtener evento
- `POST /api/events` - Crear evento
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento

### Tipos de Tickets
- `GET /api/ticket-types` - Listar tipos
- `GET /api/ticket-types/event/:eventId` - Tipos por evento
- `GET /api/ticket-types/:id` - Obtener tipo
- `POST /api/ticket-types` - Crear tipo
- `PUT /api/ticket-types/:id` - Actualizar tipo
- `DELETE /api/ticket-types/:id` - Eliminar tipo

### Tickets
- `GET /api/tickets` - Listar tickets
- `GET /api/tickets/code/:ticketCode` - Obtener por código
- `POST /api/tickets` - Crear ticket (compra)
- `PUT /api/tickets/:ticketCode/validate` - Validar ticket
- `DELETE /api/tickets/:id` - Cancelar ticket

### Usuarios
- `POST /api/users/register` - Registrar
- `POST /api/users/login` - Login
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## 🔐 Seguridad

### Sistema QR
- Códigos con checksum (TKT-XXXXX-XXXX)
- Verificación de integridad
- Detección de códigos falsificados
- Control anti-replay (caché 5 min)

### Autenticación
- Tokens JWT
- Roles: cliente, operador, administrador
- Protección de rutas

## 💾 Base de Datos

### Diagrama ER Simplificado
```
USERS ─┐
       ├─► TICKETS ◄─┬─ TICKET_TYPES ◄─── EVENTS ◄─── VENUES
       │             │
       └─────────────┘
```

### Tablas Principales
- `users`: Usuarios (clientes, operadores, admins)
- `events`: Eventos
- `ticket_types`: Tipos de tickets por evento  
- `tickets`: Tickets comprados
- `venues`: Lugares de eventos

## 🎯 Mejoras Implementadas

### ✅ Sistema de Compra
- Transacciones atómicas en MySQL
- Validación de stock en tiempo real
- Actualización automática de disponibilidad
- Recarga de datos desde BD al volver a vistas

### ✅ Sistema de Validación QR
- **NO valida automáticamente sin código QR**
- Espera 15 segundos a que se presente el QR
- Muestra "Tiempo de Escaneo Expirado" si no hay código
- Feedback visual, sonoro y táctil
- Registro de auditoría completo

### ✅ Actualización de Tickets
- Se recargan automáticamente desde MySQL
- Sincronización entre frontend y backend
- Refleja cambios en tiempo real

## 🐛 Solución de Problemas

### Frontend no conecta al backend
- Verificar backend corriendo en puerto 3000
- Revisar CORS en `backend/server.js`
- Verificar `VITE_API_URL` en configuración

### Base de datos no conecta
- Verificar credenciales en `backend/.env`
- Asegurar MySQL corriendo en puerto 3306
- Verificar que la BD `ticketing_system` exista

### Tickets no se actualizan
- Verificar que backend guarde correctamente
- Revisar consola del navegador
- Verificar transacciones en MySQL

### QR valida sin código
- **SOLUCIONADO**: Ahora espera 15s a que se presente QR
- Muestra timeout si no hay código
- Presiona Enter para simular detección en pruebas

## 📚 Documentación Adicional

Para más detalles, consulta:
- **Backend:** `backend/README.md`

## 🤝 Contribuir

1. Fork el repositorio
2. Crea rama (`git checkout -b feature/NuevaFeature`)
3. Commit cambios (`git commit -m 'Agregar NuevaFeature'`)
4. Push (`git push origin feature/NuevaFeature`)
5. Abre Pull Request

## 📄 Licencia

Proyecto de código abierto - Licencia MIT

## 👥 Equipo

Equipo de Desarrollo - Ingeniería de Software

## Sprint 1
Benjamín Vivanco:
- Creacion del BackEnd
- Vista de operador.
- Estructura de facilitaroes visuales.
- Desarallo de la vista completa, a través de framework View.
- Uso de JavaScript.

Pablo Sepulveda:
- Creacion Backend
- Integrar base de datos.
- Integrar Docker
- Utilizo Api Node.js
- Utilizo Api EndPoints

Fernando Salazar:

- 

- Sistema de envio por email


Javier Cancino:
- Creacion Jira
- Ajustes de Historias de usaurio
- Ajuste SubTares.

---

**Versión:** 2.0.0  
**Última actualización:** Octubre 2025
