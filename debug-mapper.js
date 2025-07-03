// Debug the mapper system step by step
const {
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
} = require("./dist/src/mappers");

const testData = {
  type: "event",
  data: {
    title: "Debug Test Event",
    slug: "debug-test-event",
    status: "published",
    eventDate: "2025-08-15",
    city: "Dubai",
  },
};

console.log("🔍 Debugging Mapper System");
console.log("1. Input data:", JSON.stringify(testData, null, 2));

try {
  // Step 1: Map incoming data
  const mappedItem = mapIncomingCollectionItem(testData);
  console.log("2. Mapped item:", JSON.stringify(mappedItem, null, 2));

  // Step 2: Convert to DB format
  const dbFormat = collectionItemToDbFormat(mappedItem);
  console.log("3. DB format:", JSON.stringify(dbFormat, null, 2));

  // Check specific fields
  console.log("4. Field check:");
  console.log("   - title:", dbFormat.title);
  console.log("   - slug:", dbFormat.slug);
  console.log("   - type:", dbFormat.type);
  console.log("   - status:", dbFormat.status);
  console.log("   - data type:", typeof dbFormat.data);
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);
}
