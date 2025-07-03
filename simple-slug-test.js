#!/usr/bin/env node

/**
 * Simple function to test slug extraction
 */

function testSlugExtraction(inputData) {
  console.log("🔍 Simple Slug Test");
  console.log("==================");
  
  console.log("📥 Input:");
  console.log("- Type:", inputData.type);
  console.log("- Data.title:", inputData.data?.title);
  console.log("- Data.slug:", inputData.data?.slug);
  console.log("");
  
  // Step 1: Check if slug exists in input
  if (!inputData.data?.slug) {
    console.log("❌ PROBLEM: No slug in input data!");
    return false;
  }
  
  // Step 2: Simple extraction (what the mapper should do)
  const extractedSlug = inputData.data.slug;
  const extractedTitle = inputData.data.title;
  
  console.log("🔄 Extracted:");
  console.log("- Title:", extractedTitle);
  console.log("- Slug:", extractedSlug);
  console.log("");
  
  // Step 3: Test the actual mapper
  try {
    const { mapIncomingCollectionItem, collectionItemToDbFormat } = require('./dist/src/mappers');
    
    console.log("🔧 Using actual mapper...");
    const mapped = mapIncomingCollectionItem(inputData);
    
    console.log("- Mapped title:", mapped.title);
    console.log("- Mapped slug:", mapped.slug);
    
    const dbFormat = collectionItemToDbFormat(mapped);
    console.log("- DB slug:", dbFormat.slug);
    
    if (dbFormat.slug !== extractedSlug) {
      console.log("❌ MISMATCH!");
      console.log("  Expected:", extractedSlug);
      console.log("  Got:", dbFormat.slug);
      return false;
    } else {
      console.log("✅ Slug extraction works!");
      return true;
    }
    
  } catch (error) {
    console.log("❌ Mapper error:", error.message);
    return false;
  }
}

// Test with the failing data
const testData = {
  "type": "post", 
  "data": {
    "title": "Test Post",
    "slug": "test-post-slug",
    "status": "draft",
    "datePublished": "2025-07-03",
    "seoTitle": "Test SEO",
    "seoMeta": "Test meta",
    "thumbnail": {"url": "test.jpg", "alt": "test"},
    "mainImage": {"url": "test.jpg", "alt": "test"},
    "openGraphImage": {"url": "test.jpg", "alt": "test"}
  }
};

testSlugExtraction(testData);
