import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function createUsers() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'ticketuser',
    password: process.env.DB_PASSWORD || 'ticketpass',
    database: process.env.DB_NAME || 'ticketvue'
  });

  console.log('✅ Conectado a MySQL');

  // Limpiar usuarios existentes
  await conn.execute('DELETE FROM users');
  console.log('🗑️  Usuarios antiguos eliminados');

  const users = [
    {
      email: 'admin1@ticketvue.com',
      password: 'admin123',
      firstName: 'Carlos',
      lastName: 'Administrador',
      phone: '+54 11 1234-5678',
      userType: 'Administrador',
      employeeId: 'ADM001',
      adminLevel: 'super',
      permissions: JSON.stringify({ manage_events: true, manage_users: true, view_reports: true, manage_tickets: true })
    },
    {
      email: 'admin2@ticketvue.com',
      password: 'admin456',
      firstName: 'María',
      lastName: 'González',
      phone: '+54 11 2345-6789',
      userType: 'Administrador',
      employeeId: 'ADM002',
      adminLevel: 'moderador',
      permissions: JSON.stringify({ manage_events: true, manage_users: false, view_reports: true, manage_tickets: true })
    },
    {
      email: 'operador1@ticketvue.com',
      password: 'oper123',
      firstName: 'Juan',
      lastName: 'Operador',
      phone: '+54 11 3456-7890',
      userType: 'Operador',
      employeeId: 'OPR001',
      shift: 'completo'
    },
    {
      email: 'operador2@ticketvue.com',
      password: 'oper456',
      firstName: 'Ana',
      lastName: 'Pérez',
      phone: '+54 11 4567-8901',
      userType: 'Operador',
      employeeId: 'OPR002',
      shift: 'completo'
    }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    await conn.execute(
      `INSERT INTO users (email, password, first_name, last_name, phone, user_type, employee_id, admin_level, permissions, shift, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        user.email,
        hashedPassword,
        user.firstName,
        user.lastName,
        user.phone,
        user.userType,
        user.employeeId || null,
        user.adminLevel || null,
        user.permissions || null,
        user.shift || null
      ]
    );
    
    console.log(`✅ Creado: ${user.email} con contraseña: ${user.password}`);
  }

  await conn.end();
  console.log('\n🎉 ¡Todos los usuarios creados exitosamente!');
}

createUsers().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
