#!/usr/bin/env node

/**
 * Test the exact same data that failed in curl
 */

function testExactCurlData() {
  // This is the exact data from your curl command
  const curlData = {
    "type": "post",
    "data": {
      "title": "Test Blog Post About AI Innovation",
      "slug": "test-blog-post-ai-innovation", 
      "status": "draft",
      "datePublished": "2025-07-03",
      "seoTitle": "AI Innovation in 2025 | Tech Blog",
      "seoMeta": "Exploring the latest trends and breakthroughs in artificial intelligence technology for 2025",
      "bodyEnglish": "This is a comprehensive blog post about the exciting developments in AI technology...",
      "location": "Dubai, UAE",
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
      },
      "featured": true,
      "tags": [
        {"id": "ai-tag", "slug": "artificial-intelligence"},
        {"id": "tech-tag", "slug": "technology"}
      ],
      "programmeLabel": {
        "id": "ai-programme", 
        "slug": "ai-research-programme"
      }
    }
  };

  console.log("🔍 Testing Exact Curl Data");
  console.log("==========================");
  
  console.log("📥 Input slug:", curlData.data.slug);
  
  try {
    const { mapIncomingCollectionItem, collectionItemToDbFormat } = require('./dist/src/mappers');
    
    const mapped = mapIncomingCollectionItem(curlData);
    console.log("🔄 Mapped slug:", mapped.slug);
    
    const dbFormat = collectionItemToDbFormat(mapped);
    console.log("💾 DB Format:");
    console.log("  - title:", dbFormat.title);
    console.log("  - slug:", dbFormat.slug);
    console.log("  - type:", dbFormat.type);
    console.log("  - status:", dbFormat.status);
    
    // Check for null/undefined
    if (dbFormat.slug === null) {
      console.log("❌ slug is NULL");
    } else if (dbFormat.slug === undefined) {
      console.log("❌ slug is UNDEFINED");
    } else {
      console.log("✅ slug is good:", dbFormat.slug);
    }
    
    // Show what would be sent to database
    console.log("🗃️ Database INSERT values:");
    console.log("  VALUES ($1, $2, $3, $4, $5)");
    console.log("  $1 (slug):", JSON.stringify(dbFormat.slug));
    console.log("  $2 (title):", JSON.stringify(dbFormat.title));
    console.log("  $3 (type):", JSON.stringify(dbFormat.type));
    console.log("  $4 (data):", "JSON object");
    console.log("  $5 (status):", JSON.stringify(dbFormat.status));
    
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

testExactCurlData();
