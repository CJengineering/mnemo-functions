#!/usr/bin/env node

// Demo script to test the mapper functionality
const {
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
} = require("./dist/src/mappers");

console.log("🚀 Testing Collection Item Mapper System\n");

// Test Event Mapping
const sampleEventData = {
  type: "event",
  data: {
    title: "AI Innovation Summit 2025",
    slug: "ai-innovation-summit-2025",
    status: "published",
    eventDate: "2025-09-15",
    city: "Dubai",
    featured: true,
    thumbnail: {
      url: "https://example.com/thumb.jpg",
      alt: "Event thumbnail",
    },
    programmeLabel: {
      id: "prog-1",
      slug: "ai-programme",
    },
  },
};

console.log("📥 Sample Frontend Data:");
console.log(JSON.stringify(sampleEventData, null, 2));

try {
  // Transform using mapper
  const mappedItem = mapIncomingCollectionItem(sampleEventData);
  console.log("\n🔄 Mapped Collection Item:");
  console.log(JSON.stringify(mappedItem, null, 2));

  // Convert to database format
  const dbFormat = collectionItemToDbFormat(mappedItem);
  console.log("\n💾 Database Format:");
  console.log(JSON.stringify(dbFormat, null, 2));

  console.log("\n✅ Mapper test completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`- Title: ${dbFormat.title}`);
  console.log(`- Type: ${dbFormat.type}`);
  console.log(`- Status: ${dbFormat.status}`);
  console.log(`- Data size: ${dbFormat.data.length} characters`);
  console.log(`- MetaData size: ${dbFormat.metaData.length} characters`);
} catch (error) {
  console.error("❌ Mapper test failed:", error.message);
  process.exit(1);
}

console.log("\n🎉 Mapper system is working correctly!");
console.log("\nTo use in your frontend:");
console.log(
  "1. Send data in the format shown above to /api/collection-items/form"
);
console.log("2. The mapper will transform it automatically");
console.log("3. Save the transformed data to your database");
