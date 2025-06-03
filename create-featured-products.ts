import { db } from "./server/db";
import { products, categories } from "./shared/schema";
import { eq } from "drizzle-orm";

async function createFeaturedProducts() {
  try {
    console.log("Adding featured products...");
    
    // Get all categories
    const allCategories = await db.select().from(categories);
    console.log(`Found ${allCategories.length} categories`);
    
    if (allCategories.length === 0) {
      console.log("No categories found. Creating a default category...");
      const [newCategory] = await db.insert(categories).values({
        name: "Women's Fashion",
        slug: "womens-fashion",
        description: "Women's fashion clothing and accessories",
        featured: true
      }).returning();
      
      allCategories.push(newCategory);
    }
    
    // Create featured products for each category
    for (const category of allCategories) {
      console.log(`Creating products for category: ${category.name}`);
      
      // Create a featured product
      await db.insert(products).values({
        name: `Featured ${category.name} Item`,
        slug: `featured-${category.slug}-item-${Date.now()}`,
        description: `A beautiful featured item from our ${category.name} collection`,
        price: "99.99",
        inventory: 50,
        categoryId: category.id,
        featured: true,
        isNew: true,
        rating: "4.8",
        images: [`https://placehold.co/400x400/e2e8f0/1e293b?text=Featured+${category.name}`],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Create a regular product
      await db.insert(products).values({
        name: `New ${category.name} Item`,
        slug: `new-${category.slug}-item-${Date.now()}`,
        description: `A beautiful new item from our ${category.name} collection`,
        price: "79.99",
        inventory: 20,
        categoryId: category.id,
        featured: false,
        isNew: true,
        rating: "4.5",
        images: [`https://placehold.co/400x400/e2e8f0/1e293b?text=New+${category.name}`],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Check if products were created
    const featuredProducts = await db.select().from(products).where(eq(products.featured, true));
    console.log(`Created ${featuredProducts.length} featured products`);
    
    const newProducts = await db.select().from(products).where(eq(products.isNew, true));
    console.log(`Created ${newProducts.length} new products`);
    
  } catch (error) {
    console.error("Error creating products:", error);
  }
}

createFeaturedProducts()
  .then(() => {
    console.log("Finished creating products!");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error:", error);
    process.exit(1);
  });