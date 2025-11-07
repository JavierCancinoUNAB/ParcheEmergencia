#!/bin/bash

echo "🔍 ============================================"
echo "   VERIFICACIÓN DE SALUD DEL SISTEMA"
echo "============================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# 1. Verificar Docker
echo "📦 Verificando Docker..."
docker --version > /dev/null 2>&1
check "Docker instalado"

docker-compose --version > /dev/null 2>&1
check "Docker Compose instalado"

# 2. Verificar contenedores
echo ""
echo "🐳 Verificando contenedores..."
docker ps | grep -q ticketvue-mysql
check "MySQL container corriendo"

docker ps | grep -q ticketvue-backend
check "Backend container corriendo"

docker ps | grep -q ticketvue-frontend
check "Frontend container corriendo"

# 3. Verificar salud de MySQL
echo ""
echo "🗄️  Verificando MySQL..."
docker exec ticketvue-mysql mysqladmin ping -h localhost -u root -prootpassword > /dev/null 2>&1
check "MySQL respondiendo"

# 4. Verificar tablas
echo ""
echo "📊 Verificando tablas de la base de datos..."
TABLES=$(docker exec ticketvue-mysql mysql -u root -prootpassword -D ticketvue -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ $TABLES -gt 5 ]; then
    echo -e "${GREEN}✓${NC} Tablas creadas (encontradas: $((TABLES-1)))"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Faltan tablas (encontradas: $((TABLES-1)))"
    ((FAILED++))
fi

# 5. Verificar backend
echo ""
echo "🖥️  Verificando Backend..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓${NC} Backend respondiendo (HTTP $BACKEND_HEALTH)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Backend no responde correctamente (HTTP $BACKEND_HEALTH)"
    ((FAILED++))
fi

# 6. Verificar frontend
echo ""
echo "🌐 Verificando Frontend..."
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)
if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓${NC} Frontend respondiendo (HTTP $FRONTEND_HEALTH)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Frontend no responde correctamente (HTTP $FRONTEND_HEALTH)"
    ((FAILED++))
fi

# 7. Verificar APIs críticas
echo ""
echo "🔗 Verificando endpoints críticos..."
API_EVENTS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/events)
if [ "$API_EVENTS" = "200" ]; then
    echo -e "${GREEN}✓${NC} API /api/events (HTTP $API_EVENTS)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} API /api/events no responde (HTTP $API_EVENTS)"
    ((FAILED++))
fi

# Resumen
echo ""
echo "============================================"
echo "📊 RESUMEN"
echo "============================================"
echo -e "Pruebas exitosas: ${GREEN}$PASSED${NC}"
echo -e "Pruebas fallidas: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ SISTEMA OPERATIVO CORRECTAMENTE${NC}"
    exit 0
else
    echo -e "${RED}❌ SISTEMA TIENE ERRORES${NC}"
    echo ""
    echo "💡 Sugerencias:"
    echo "1. Ejecuta: docker-compose down -v"
    echo "2. Ejecuta: docker-compose up -d"
    echo "3. Espera 30 segundos y vuelve a ejecutar este script"
    exit 1
fi
