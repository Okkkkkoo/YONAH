import { db } from "./server/db";
import { products, categories } from "./shared/schema";
import { eq } from "drizzle-orm";

async function seedTestProducts() {
  console.log("Starting to seed test products...");
  
  // Check for existing categories
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length === 0) {
    console.log("Creating categories first...");
    
    // Create categories if none exist
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
  
  // Get categories after ensuring they exist
  const allCategories = await db.select().from(categories);
  
  if (allCategories.length === 0) {
    console.error("Failed to create categories");
    return;
  }
  
  // Create a map of category slugs to IDs for easier reference
  const categoryMap = new Map();
  allCategories.forEach(cat => {
    categoryMap.set(cat.slug, cat.id);
  });
  
  console.log("Category map:", Object.fromEntries(categoryMap));
  
  // Delete existing products
  await db.delete(products);
  
  // Create test products
  const productData = [
    {
      name: "Summer Floral Dress",
      slug: "summer-floral-dress",
      description: "A beautiful floral dress perfect for summer days",
      price: "49.99",
      inventory: 25,
      categoryId: categoryMap.get("clothing"),
      images: ["https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=600&q=80"],
      featured: true,
      isNew: true,
      rating: "4.5"
    },
    {
      name: "Elegant Evening Gown",
      slug: "elegant-evening-gown",
      description: "A stunning evening gown for special occasions",
      price: "199.99",
      inventory: 10,
      categoryId: categoryMap.get("clothing"),
      images: ["https://images.unsplash.com/photo-1566174053879-31528523f8cb?w=400&h=600&q=80"],
      featured: true,
      isNew: false,
      rating: "5.0"
    },
    {
      name: "Casual Denim Jacket",
      slug: "casual-denim-jacket",
      description: "A versatile denim jacket for everyday wear",
      price: "79.99",
      inventory: 30,
      categoryId: categoryMap.get("clothing"),
      images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&q=80"],
      featured: false,
      isNew: true,
      rating: "4.2"
    },
    {
      name: "Designer Sunglasses",
      slug: "designer-sunglasses",
      description: "Stylish designer sunglasses for summer",
      price: "129.99",
      inventory: 15,
      categoryId: categoryMap.get("accessories"),
      images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=600&q=80"],
      featured: true,
      isNew: false,
      rating: "4.8"
    },
    {
      name: "Gold Hoop Earrings",
      slug: "gold-hoop-earrings",
      description: "Classic gold hoop earrings for any occasion",
      price: "39.99",
      inventory: 40,
      categoryId: categoryMap.get("accessories"),
      images: ["https://images.unsplash.com/photo-1575863438850-fb1c06fbae24?w=400&h=600&q=80"],
      featured: false,
      isNew: true,
      rating: "4.6"
    },
    {
      name: "Leather Ankle Boots",
      slug: "leather-ankle-boots",
      description: "Stylish leather ankle boots for fall",
      price: "149.99",
      inventory: 20,
      categoryId: categoryMap.get("shoes"),
      images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&q=80"],
      featured: true,
      isNew: true,
      rating: "4.7"
    },
    {
      name: "Summer Sandals",
      slug: "summer-sandals",
      description: "Comfortable sandals for beach days",
      price: "59.99",
      inventory: 35,
      categoryId: categoryMap.get("shoes"),
      images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&q=80"],
      featured: false,
      isNew: true,
      rating: "4.4"
    },
    {
      name: "Leather Tote Bag",
      slug: "leather-tote-bag",
      description: "Spacious leather tote bag for work or travel",
      price: "169.99",
      inventory: 15,
      categoryId: categoryMap.get("bags"),
      images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=600&q=80"],
      featured: true,
      isNew: false,
      rating: "4.9"
    }
  ];
  
  for (const product of productData) {
    await db.insert(products).values({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  console.log("Test products seeded successfully!");
  
  // Verify products were created
  const createdProducts = await db.select().from(products);
  console.log(`Created ${createdProducts.length} products`);
  
  // List featured products
  const featuredProducts = await db.select().from(products).where(eq(products.featured, true));
  console.log(`There are ${featuredProducts.length} featured products`);
  
  // List new products
  const newProducts = await db.select().from(products).where(eq(products.isNew, true));
  console.log(`There are ${newProducts.length} new products`);
}

seedTestProducts()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error seeding test products:", error);
    process.exit(1);
  });