import 'dotenv/config';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const caCert = fs.readFileSync(join(__dirname, 'bin', 'byuicse-psql-cert.pem'));

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    ca: caCert,
    rejectUnauthorized: true,
    checkServerIdentity: () => undefined
  }
});

const practicePath = join(__dirname, 'src/models/sql/practice.sql');
const practiceSQL = fs.readFileSync(practicePath, 'utf8');

try {
  await pool.query(practiceSQL);
  console.log('Practice SQL executed successfully - contact_form table created');
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await pool.end();
}
