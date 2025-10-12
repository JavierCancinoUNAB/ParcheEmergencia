import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function run() {
  const email = process.env.EMAIL || 'admin1@ticketvue.com';
  const plain = process.env.PASS || 'admin123';

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'ticketuser',
    password: process.env.DB_PASSWORD || 'ticketpass',
    database: process.env.DB_NAME || 'ticketvue'
  });

  const [rows] = await conn.execute('SELECT email, user_type, password FROM users WHERE email=?', [email]);
  if (!rows.length) {
    console.log('❌ No existe usuario con email:', email);
    process.exit(2);
  }
  const row = rows[0];
  const ok = await bcrypt.compare(plain, row.password || '');
  console.log('✅ email:', row.email);
  console.log('✅ user_type:', row.user_type);
  console.log('✅ hash:', row.password);
  console.log(ok ? '✅ CONTRASEÑA CORRECTA ✅' : '❌ CONTRASEÑA INCORRECTA ❌');
  await conn.end();
  process.exit(ok ? 0 : 1);
}

run().catch((e) => { console.error('Error script:', e); process.exit(3); });
