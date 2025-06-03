import { db } from "./server/db";
import { users } from "./shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function fixAdminUser() {
  console.log("Fixing admin user with proper password...");
  
  try {
    // Hash the password properly
    const hashedPassword = await hashPassword("admin123");
    
    // Update the existing admin user with proper password
    await db.update(users)
      .set({ 
        password: hashedPassword,
        username: "admin",
        email: "admin@yona.com"
      })
      .where(eq(users.id, "admin-user-1"));
    
    console.log("✓ Admin user updated successfully!");
    console.log("Login credentials:");
    console.log("Username: admin");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Error fixing admin user:", error);
  }
}

fixAdminUser();