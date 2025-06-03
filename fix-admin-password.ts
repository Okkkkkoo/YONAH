import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function fixAdminPassword() {
  try {
    console.log('Fixing admin password...');
    
    // Generate a properly hashed password for 'admin123'
    const hashedPassword = await hashPassword('admin123');
    
    // Update the admin user with the new hashed password
    const result = await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.username, 'admin'))
      .returning();
    
    if (result.length > 0) {
      console.log('Admin password updated successfully!');
      console.log('You can now log in with:');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('Admin user not found. Make sure to run the seed script first.');
    }
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    process.exit(0);
  }
}

// Run the fix
fixAdminPassword();