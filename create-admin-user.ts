import { storage } from "./server/storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  console.log("Creating admin user for StyleHub store...");
  
  const username = "admin";
  const password = "admin123"; // You should change this to a stronger password
  
  try {
    // Check if admin user already exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (existingUser) {
      console.log("Admin user already exists");
      return existingUser;
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the admin user
    const adminUser = await storage.createUser({
      username,
      password: hashedPassword,
      email: "admin@stylehub.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });
    
    console.log("Admin user created successfully!");
    console.log("Username:", username);
    console.log("Password:", password);
    
    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

// Run the function
createAdminUser()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch(error => {
    console.error("Failed:", error);
    process.exit(1);
  });