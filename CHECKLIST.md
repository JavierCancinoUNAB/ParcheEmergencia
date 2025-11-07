# ✅ Checklist de Verificación para Nuevos Desarrolladores

## Antes de Empezar

- [ ] Docker Desktop instalado y corriendo
- [ ] Git instalado
- [ ] Puertos 80, 3000 y 3307 disponibles
- [ ] Mínimo 4GB de RAM libre

## Instalación

- [ ] Repositorio clonado correctamente
- [ ] Ejecutado script de instalación (`install.sh` o `install.bat`)
- [ ] Todos los contenedores iniciados (verde en `docker ps`)
- [ ] Base de datos inicializada

## Verificación

- [ ] ✅ Healthcheck pasa todas las pruebas
- [ ] ✅ Frontend accesible en http://localhost
- [ ] ✅ Backend responde en http://localhost:3000/health
- [ ] ✅ Login como admin funciona
- [ ] ✅ Login como operador funciona
- [ ] ✅ Se pueden crear eventos
- [ ] ✅ Se pueden crear tipos de tickets
- [ ] ✅ Panel de auditoría carga sin errores

## Funcionalidades Principales

### Como Administrador
- [ ] Puede crear, editar y eliminar eventos
- [ ] Puede crear, editar y eliminar tipos de tickets
- [ ] Puede crear usuarios (clientes, operadores)
- [ ] Puede ver estadísticas de auditoría
- [ ] Puede generar reportes PDF
- [ ] Puede exportar datos a CSV

### Como Operador
- [ ] Puede validar tickets por código QR
- [ ] Puede validar tickets por RUT
- [ ] Puede ver historial de validaciones
- [ ] Puede rechazar tickets con razón

### Como Cliente
- [ ] Puede ver lista de eventos
- [ ] Puede seleccionar tipos de tickets
- [ ] Puede ingresar datos personales
- [ ] Puede completar el pago
- [ ] Recibe confirmación con código QR
- [ ] Puede descargar entrada en PDF
- [ ] Recibe email automático (si está configurado)

## Si Algo Falla

1. Revisa logs: `docker-compose logs`
2. Ejecuta: `docker-compose restart`
3. Si persiste: `docker-compose down -v` y vuelve a instalar
4. Verifica puertos: 
   - Windows: `netstat -ano | findstr :3000`
   - Linux/Mac: `lsof -ti:3000`

## Contacto

Si tienes problemas, contacta a: [tu-email]

## Notas Importantes

- Las contraseñas están en texto plano solo para desarrollo
- El email automático requiere configurar `EMAIL_USER` y `EMAIL_PASSWORD` en `backend/.env`
- Los datos de prueba se cargan automáticamente con `npm run db:seed`
- Para resetear todo: `docker-compose down -v && ./install.sh`
