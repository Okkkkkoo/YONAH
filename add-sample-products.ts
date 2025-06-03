import { db } from "./server/db";
import { products, categories } from "./shared/schema";
import { eq } from "drizzle-orm";

// Simple script to add sample products
async function addSampleProducts() {
  try {
    console.log("Starting to add sample products...");
    
    // First check if we have categories
    const existingCategories = await db.select().from(categories);
    console.log(`Found ${existingCategories.length} categories`);
    
    // If no categories exist, create some
    if (existingCategories.length === 0) {
      console.log("Creating categories...");
      
      const categoryData = [
        { name: "Clothing", slug: "clothing", description: "Women's clothing" },
        { name: "Accessories", slug: "accessories", description: "Women's accessories" },
        { name: "Shoes", slug: "shoes", description: "Women's shoes" },
        { name: "Bags", slug: "bags", description: "Women's bags" }
      ];
      
      for (const category of categoryData) {
        await db.insert(categories).values(category);
      }
      
      console.log("Categories created successfully");
    }
    
    // Get all categories again to make sure we have their IDs
    const allCategories = await db.select().from(categories);
    console.log("Categories:", allCategories);
    
    // Create a featured product in each category
    for (const category of allCategories) {
      console.log(`Adding featured product in category: ${category.name}`);
      
      const productName = `Featured ${category.name} Item`;
      const productSlug = `featured-${category.slug}-item`;
      
      // Check if this product already exists
      const existingProduct = await db
        .select()
        .from(products)
        .where(condition => condition.eq(products.slug, productSlug));
      
      if (existingProduct.length === 0) {
        await db.insert(products).values({
          name: productName,
          slug: productSlug,
          description: `A premium ${category.name.toLowerCase()} item that's currently featured`,
          price: "99.99",
          inventory: 10,
          categoryId: category.id,
          images: [`https://placehold.co/400x600/e2e8f0/1e293b?text=${category.name}`],
          featured: true,
          isNew: true,
          rating: "4.5",
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`Added featured product: ${productName}`);
      } else {
        console.log(`Product ${productName} already exists`);
      }
    }
    
    // Verify products were created
    const featuredProducts = await db
      .select()
      .from(products)
      .where(condition => condition.eq(products.featured, true));
      
    console.log(`Found ${featuredProducts.length} featured products`);
    
    // Add some non-featured products too
    for (const category of allCategories) {
      console.log(`Adding regular product in category: ${category.name}`);
      
      const productName = `New ${category.name} Item`;
      const productSlug = `new-${category.slug}-item`;
      
      // Check if this product already exists
      const existingProduct = await db
        .select()
        .from(products)
        .where(condition => condition.eq(products.slug, productSlug));
      
      if (existingProduct.length === 0) {
        await db.insert(products).values({
          name: productName,
          slug: productSlug,
          description: `A standard ${category.name.toLowerCase()} item that's new in our catalog`,
          price: "49.99",
          inventory: 25,
          categoryId: category.id,
          images: [`https://placehold.co/400x600/f0e2e8/1e293b?text=New+${category.name}`],
          featured: false,
          isNew: true,
          rating: "4.0",
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`Added regular product: ${productName}`);
      } else {
        console.log(`Product ${productName} already exists`);
      }
    }
    
    // Final verification
    const allProducts = await db.select().from(products);
    console.log(`Total products in database: ${allProducts.length}`);
    
  } catch (error) {
    console.error("Error adding sample products:", error);
  }
}

addSampleProducts()
  .then(() => {
    console.log("Sample products added successfully");
    process.exit(0);
  })
  .catch(error => {
    console.error("Failed to add sample products:", error);
    process.exit(1);
  });