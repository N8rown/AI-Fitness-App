import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || './fitness.db';

export const pool = new Database(dbPath);

// Enable foreign keys
pool.pragma('foreign_keys = ON');

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    let stmt = pool.prepare(text);
    let result;
    
    if (text.trim().toUpperCase().startsWith('SELECT')) {
      const rows = params ? stmt.all(...params) : stmt.all();
      result = { rows: rows || [] };
    } else if (text.trim().toUpperCase().startsWith('INSERT')) {
      const info = params ? stmt.run(...params) : stmt.run();
      // For INSERT, fetch the inserted rows
      const idResult = pool.prepare('SELECT last_insert_rowid() as id').get() as any;
      result = { rows: idResult ? [{ id: idResult.id }] : [] };
    } else {
      const info = params ? stmt.run(...params) : stmt.run();
      result = { rowCount: info.changes };
    }
    
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rows?.length || 0 });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient() {
  return pool;
}

export async function closePool() {
  pool.close();
}
