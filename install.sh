#!/bin/bash

echo "🚀 ============================================"
echo "   INSTALADOR DE TICKETVUE"
echo "============================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar requisitos
echo "📋 Verificando requisitos previos..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker instalado"

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado."
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker Compose instalado"

# 2. Crear archivo .env si no existe
echo ""
echo "📝 Configurando variables de entorno..."
if [ ! -f backend/.env ]; then
    cat > backend/.env << EOF
# Base de datos
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ticketvue
DB_USER=ticketuser
DB_PASSWORD=ticketpass

# JWT
JWT_SECRET=tu-secret-key-super-secreta-cambiala

# Email (opcional - dejar vacío si no se usa)
EMAIL_USER=
EMAIL_PASSWORD=

# Puerto del servidor
PORT=3000
EOF
    echo -e "${GREEN}✓${NC} Archivo .env creado en backend/"
else
    echo -e "${YELLOW}⚠${NC} .env ya existe, no se sobrescribe"
fi

# 3. Detener contenedores anteriores
echo ""
echo "🛑 Deteniendo contenedores anteriores..."
docker-compose down -v 2>/dev/null

# 4. Construir e iniciar
echo ""
echo "🏗️  Construyendo e iniciando contenedores..."
docker-compose up -d --build

# 5. Esperar a que MySQL esté listo
echo ""
echo "⏳ Esperando a que MySQL esté listo..."
for i in {1..30}; do
    if docker exec ticketvue-mysql mysqladmin ping -h localhost -u root -prootpassword > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} MySQL listo"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# 6. Inicializar base de datos
echo ""
echo "🗄️  Inicializando base de datos..."
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/database-schema-init.sql
echo -e "${GREEN}✓${NC} Esquema de base de datos creado"

# 7. Ejecutar migrations
echo ""
echo "📊 Ejecutando migraciones..."
docker exec -i ticketvue-mysql mysql -u root -prootpassword ticketvue < backend/migrations/create-audit-logs-table.sql 2>/dev/null
echo -e "${GREEN}✓${NC} Migraciones completadas"

# 8. Ejecutar seed
echo ""
echo "🌱 Poblando base de datos con datos de prueba..."
docker exec ticketvue-backend npm run db:seed
echo -e "${GREEN}✓${NC} Datos de prueba cargados"

# 9. Verificar salud
echo ""
echo "🔍 Verificando salud del sistema..."
sleep 5
bash healthcheck.sh

echo ""
echo "============================================"
echo -e "${GREEN}✅ INSTALACIÓN COMPLETA${NC}"
echo "============================================"
echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3000"
echo "   MySQL: localhost:3307"
echo ""
echo "👤 Usuarios de prueba:"
echo "   Admin: admin1@ticketvue.com / admin123"
echo "   Operador: operador1@ticketvue.com / oper123"
echo "   Cliente: cliente1@email.com / cliente123"
echo ""
