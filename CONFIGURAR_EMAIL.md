# 📧 Configuración de Email para Envío de Tickets

## ⚠️ IMPORTANTE: Sistema Actual

Actualmente el sistema usa **Ethereal Email**, un servicio de emails de prueba que:
- ✅ Funciona perfectamente para desarrollo
- ❌ NO envía emails a buzones reales (Gmail, Outlook, etc.)
- 🔗 Los emails se ven en: https://ethereal.email/messages

**Los Preview URLs se muestran en los logs del backend:**
```bash
docker logs ticketvue-backend --tail 20
```

## 🎯 Para Enviar Emails REALES (Gmail, Outlook, etc.)

### Opción 1: Gmail (Recomendado para producción)

#### Paso 1: Crear Contraseña de Aplicación en Gmail

1. Ve a tu cuenta de Gmail
2. Accede a: https://myaccount.google.com/apppasswords
3. Selecciona "Correo" y "Windows Computer"
4. Haz clic en "Generar"
5. Copia la contraseña de 16 caracteres (ejemplo: `abcd efgh ijkl mnop`)

#### Paso 2: Configurar Variables de Entorno

Edita el archivo `docker-compose.yml` y agrega estas líneas en la sección `backend > environment`:

```yaml
backend:
  environment:
    # ... otras variables ...
    - EMAIL_SERVICE=gmail
    - EMAIL_USER=tu-email@gmail.com
    - EMAIL_PASSWORD=abcd efgh ijkl mnop  # Tu contraseña de aplicación
    - EMAIL_FROM=Sistema de Boletería <tu-email@gmail.com>
```

#### Paso 3: Reiniciar el Backend

```bash
docker-compose down
docker-compose up -d --build
```

### Opción 2: Otro Servicio SMTP (SendGrid, AWS SES, etc.)

```yaml
backend:
  environment:
    # ... otras variables ...
    - SMTP_HOST=smtp.sendgrid.net
    - SMTP_PORT=587
    - SMTP_USER=tu-usuario-smtp
    - SMTP_PASSWORD=tu-contraseña-smtp
    - EMAIL_FROM=Sistema de Boletería <noreply@tudominio.com>
```

## 🧪 Verificar que Funciona

1. Crear un ticket desde el frontend
2. Ver los logs del backend:
   ```bash
   docker logs ticketvue-backend --tail 50
   ```
3. Buscar líneas como:
   - `✅ Email enviado exitosamente!`
   - `📧 Message ID: ...`
   - Si usas Gmail real, el email llegará al correo del comprador

## 🐛 Solución de Problemas

### Error: "Invalid login"
- Verifica que usas una **contraseña de aplicación**, no tu contraseña normal de Gmail
- Verifica que la autenticación de 2 pasos esté activada en Gmail

### Error: "Missing credentials"
- Verifica que las variables EMAIL_USER y EMAIL_PASSWORD estén configuradas
- Revisa que no haya espacios extra en las variables

### Los emails no llegan
- Revisa la carpeta de SPAM
- Verifica que el correo del comprador sea válido
- Revisa los logs del backend para ver errores específicos

## 📝 Ejemplo Completo de docker-compose.yml

```yaml
services:
  backend:
    build: ./backend
    container_name: ticketvue-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=ticketvue
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
      - JWT_EXPIRE=7d
      # 📧 CONFIGURACIÓN DE EMAIL PARA GMAIL
      - EMAIL_SERVICE=gmail
      - EMAIL_USER=tu-email@gmail.com
      - EMAIL_PASSWORD=abcd efgh ijkl mnop
      - EMAIL_FROM=Sistema de Boletería <tu-email@gmail.com>
    depends_on:
      mysql:
        condition: service_healthy
```

## ✅ Resumen

1. **Desarrollo**: Usa Ethereal (configuración actual) ✅
   - Los emails se ven en Preview URLs de los logs
   
2. **Producción**: Usa Gmail o SMTP real 🚀
   - Configura EMAIL_SERVICE=gmail
   - Usa contraseña de aplicación de Gmail
   - Los emails llegarán a buzones reales
