import 'dotenv/config';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/models/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTestAccounts() {
  const practiceSqlPath = path.join(__dirname, 'src', 'models', 'sql', 'practice.sql');
  const practiceSql = fs.readFileSync(practiceSqlPath, 'utf8');
  await db.query(practiceSql);

  const password = 'Test1234!';
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = [
    { name: 'Admin User', email: 'admin@example.com' },
    { name: 'User One', email: 'user1@example.com' },
    { name: 'User Two', email: 'user2@example.com' }
  ];
  for (const user of users) {
    // Upsert user (insert if not exists)
    await db.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [user.name, user.email, hashedPassword]
    );
  }
  // Promote admin@example.com to admin role
  await db.query(
    `UPDATE users SET role_id = (SELECT id FROM roles WHERE role_name = 'admin') WHERE email = 'admin@example.com'`
  );
  console.log('Test accounts created and admin promoted.');
}

createTestAccounts().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
