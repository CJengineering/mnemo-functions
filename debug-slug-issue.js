#!/usr/bin/env node

/**
 * Debug the slug issue specifically
 */

// Import the compiled mapper functions
const { mapIncomingCollectionItem, collectionItemToDbFormat } = require('./dist/src/mappers');

console.log("🔍 Debugging Slug Issue");
console.log("=" * 50);

// Test the exact data structure that's failing
const testData = {
  "type": "post",
  "data": {
    "title": "Test Blog Post About AI Innovation",
    "slug": "test-blog-post-ai-innovation",
    "status": "draft",
    "datePublished": "2025-07-03",
    "seoTitle": "AI Innovation in 2025 | Tech Blog",
    "seoMeta": "Exploring the latest trends and breakthroughs in artificial intelligence technology for 2025",
    "bodyEnglish": "This is a comprehensive blog post about the exciting developments in AI technology...",
    "thumbnail": {
      "url": "https://example.com/ai-blog-thumb.jpg",
      "alt": "AI technology thumbnail"
    },
    "mainImage": {
      "url": "https://example.com/ai-blog-main.jpg", 
      "alt": "Artificial intelligence main image"
    },
    "openGraphImage": {
      "url": "https://example.com/ai-blog-og.jpg",
      "alt": "AI blog social media image"
    }
  }
};

console.log("1️⃣ Input data:");
console.log("   - Type:", testData.type);
console.log("   - Title:", testData.data.title);
console.log("   - Slug:", testData.data.slug);
console.log("");

try {
  console.log("2️⃣ Calling mapIncomingCollectionItem...");
  const mappedItem = mapIncomingCollectionItem(testData);
  
  console.log("   - Mapped ID:", mappedItem.id);
  console.log("   - Mapped Type:", mappedItem.type);
  console.log("   - Mapped Title:", mappedItem.title);
  console.log("   - Mapped Slug:", mappedItem.slug);
  console.log("   - Mapped Status:", mappedItem.status);
  console.log("");
  
  console.log("3️⃣ Calling collectionItemToDbFormat...");
  const dbFormat = collectionItemToDbFormat(mappedItem);
  
  console.log("   - DB Title:", dbFormat.title);
  console.log("   - DB Slug:", dbFormat.slug);
  console.log("   - DB Type:", dbFormat.type);
  console.log("   - DB Status:", dbFormat.status);
  console.log("   - DB Data keys:", Object.keys(dbFormat.data || {}));
  console.log("");
  
  console.log("4️⃣ Final Database Insert Values:");
  console.log("   VALUES ($1, $2, $3, $4, $5)");
  console.log("   $1 (slug):", dbFormat.slug);
  console.log("   $2 (title):", dbFormat.title);
  console.log("   $3 (type):", dbFormat.type);
  console.log("   $4 (data):", typeof dbFormat.data);
  console.log("   $5 (status):", dbFormat.status);
  
  if (dbFormat.slug === null || dbFormat.slug === undefined) {
    console.log("");
    console.log("🚨 PROBLEM FOUND: slug is", dbFormat.slug);
    console.log("🔧 Debugging mappedItem structure:");
    console.log(JSON.stringify(mappedItem, null, 2));
  } else {
    console.log("");
    console.log("✅ Slug looks good!");
  }
  
} catch (error) {
  console.error("❌ Error during mapping:", error.message);
  console.error("Stack:", error.stack);
}
