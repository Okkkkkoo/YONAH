import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import pg from 'pg';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const password = 'admin123';
  const hashedPassword = await hashPassword(password);
  
  console.log("Hashed password:", hashedPassword);
  
  // Update the admin user with the new hashed password
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [hashedPassword, 'admin']
    );
    
    console.log(`Updated ${result.rowCount} user(s)`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);