import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Creates a fallback pool that connects WITHOUT SSL.
 * This is used only if the DB server explicitly rejects SSL connections.
 */
const createNoSslPool = () => {
  return new Pool({
    connectionString: process.env.DB_URL,
    ssl: false
  });
};

/**
 * Runs a query using the normal db (from db.js). If the database server
 * rejects SSL connections, automatically retries the query using a non-SSL pool.
 */
const queryWithSslFallback = async (text, params) => {
  try {
    return await db.query(text, params);
  } catch (error) {
    const msg = (error?.message || '').toLowerCase();

    // If server rejects SSL, retry once without SSL
    if (msg.includes('does not support ssl')) {
      console.warn(
        'Database server rejected SSL. Retrying without SSL for setup/seed operations...'
      );

      const noSslPool = createNoSslPool();
      try {
        return await noSslPool.query(text, params);
      } finally {
        await noSslPool.end();
      }
    }

    // otherwise rethrow the original error
    throw error;
  }
};

/**
 * Sets up the database by running the seed.sql file if needed.
 * Checks if faculty table has data - if not, runs a full re-seed.
 */
const setupDatabase = async () => {
  /**
   * Check if faculty table has any rows and wrap in try-catch to handle cases
   * where table doesn't exist yet.
   */
  let hasData = false;

  try {
    const result = await queryWithSslFallback(
      "SELECT EXISTS (SELECT 1 FROM faculty LIMIT 1) as has_data"
    );
    hasData = result.rows[0]?.has_data || false;
  } catch (error) {
    /**
     * If query fails (e.g., table doesn't exist), treat the same as no data.
     * This allows the seed process to proceed.
     */
    hasData = false;
  }

  if (hasData) {
    console.log('Database already seeded');
    return true;
  }

  // No faculty found - run full seed
  console.log('Seeding database...');
  const seedPath = join(__dirname, 'sql', 'seed.sql');
  const seedSQL = fs.readFileSync(seedPath, 'utf8');

  await queryWithSslFallback(seedSQL);

  console.log('Database seeded successfully');
  return true;
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async () => {
  const result = await queryWithSslFallback('SELECT NOW() as current_time');
  console.log('Database connection successful:', result.rows[0].current_time);
  return true;
};

export { setupDatabase, testConnection };
