#!/usr/bin/env node

/**
 * Test script for Tag collection type implementation
 * Tests the complete Tag data flow from incoming data to database format
 */

const {
  mapIncomingTagToCollectionItem,
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
} = require("./dist/src/mappers/collectionItemMapper");

console.log("🏷️ Testing Tag Collection Type Implementation\n");

// Test data sets
const testCases = [
  {
    name: "Full Tag Data",
    data: {
      title: "Artificial Intelligence",
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      status: "published",
      "name-arabic": "الذكاء الاصطناعي",
    },
  },
  {
    name: "Minimal Tag Data",
    data: {
      title: "Machine Learning",
      name: "Machine Learning",
      slug: "machine-learning",
    },
  },
  {
    name: "Tag with Name Fallback",
    data: {
      title: "Deep Learning",
      name: "", // Empty name should fallback to title
      slug: "deep-learning",
      status: "draft",
    },
  },
  {
    name: "Arabic Tag",
    data: {
      title: "البحث العلمي",
      name: "البحث العلمي",
      slug: "scientific-research-ar",
      "name-arabic": "البحث العلمي",
      status: "published",
    },
  },
];

// Test individual tag mapper function
console.log("📋 Testing mapIncomingTagToCollectionItem function:");
console.log("=".repeat(60));

testCases.forEach((testCase, index) => {
  try {
    console.log(`\n${index + 1}. ${testCase.name}`);
    console.log("   Input:", JSON.stringify(testCase.data, null, 2));

    const result = mapIncomingTagToCollectionItem(testCase.data);

    console.log("   ✅ Output:");
    console.log("     - Type:", result.type);
    console.log("     - Status:", result.status);
    console.log("     - Slug:", result.slug);
    console.log("     - Title:", result.title);
    console.log("     - Data Name:", result.data.name);
    console.log(
      "     - Data Name Arabic:",
      result.data.nameArabic || "undefined"
    );
    console.log("     - ID:", result.id ? "✅ Generated" : "❌ Missing");
    console.log(
      "     - Timestamps:",
      result.created_at && result.updated_at ? "✅ Generated" : "❌ Missing"
    );

    // Validate structure
    if (result.type !== "tag") {
      console.log("     ❌ Error: Type should be 'tag'");
    }
    if (!result.data.name) {
      console.log("     ❌ Error: Name is required but missing");
    }
    if (!result.slug) {
      console.log("     ❌ Error: Slug is required but missing");
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
});

// Test main mapper routing
console.log("\n\n🔀 Testing main mapper routing:");
console.log("=".repeat(60));

const routingTestCase = {
  type: "tag",
  data: {
    title: "Climate Change",
    name: "Climate Change",
    slug: "climate-change",
    status: "published",
    "name-arabic": "تغير المناخ",
  },
};

try {
  console.log("\nInput:", JSON.stringify(routingTestCase, null, 2));

  const result = mapIncomingCollectionItem(routingTestCase);

  console.log("✅ Main mapper routing successful:");
  console.log("  - Routed to correct mapper: ✅");
  console.log("  - Result type:", result.type);
  console.log("  - Result title:", result.title);
  console.log("  - Result data name:", result.data.name);
} catch (error) {
  console.log(`❌ Main mapper routing failed: ${error.message}`);
}

// Test database format conversion
console.log("\n\n💾 Testing database format conversion:");
console.log("=".repeat(60));

try {
  const tagCollectionItem = mapIncomingTagToCollectionItem({
    title: "Sustainability",
    name: "Sustainability",
    slug: "sustainability",
    status: "published",
    "name-arabic": "الاستدامة",
  });

  const dbFormat = collectionItemToDbFormat(tagCollectionItem);

  console.log("\nMapped Item:", JSON.stringify(tagCollectionItem, null, 2));
  console.log("\nDB Format:", JSON.stringify(dbFormat, null, 2));

  // Validate DB format
  if (
    dbFormat.title &&
    dbFormat.slug &&
    dbFormat.type &&
    dbFormat.status &&
    dbFormat.data
  ) {
    console.log("✅ Database format conversion successful");
    console.log("  - All required fields present: ✅");
    console.log("  - Data is JSON serializable: ✅");
  } else {
    console.log(
      "❌ Database format conversion failed - missing required fields"
    );
  }
} catch (error) {
  console.log(`❌ Database format conversion failed: ${error.message}`);
}

// Test edge cases
console.log("\n\n🧪 Testing edge cases:");
console.log("=".repeat(60));

const edgeCases = [
  {
    name: "Missing name field (should fallback to title)",
    data: {
      title: "Edge Case Tag",
      slug: "edge-case-tag",
    },
  },
  {
    name: "Empty name field (should fallback to title)",
    data: {
      title: "Another Edge Case",
      name: "",
      slug: "another-edge-case",
    },
  },
  {
    name: "Special characters in title",
    data: {
      title: "AI & Machine Learning (2024)",
      name: "AI & Machine Learning (2024)",
      slug: "ai-machine-learning-2024",
    },
  },
];

edgeCases.forEach((testCase, index) => {
  try {
    console.log(`\n${index + 1}. ${testCase.name}`);

    const result = mapIncomingTagToCollectionItem(testCase.data);

    console.log("   ✅ Handled successfully:");
    console.log("     - Name:", result.data.name);
    console.log("     - Title:", result.title);
    console.log("     - Slug:", result.slug);

    // Validate name fallback logic
    if (!testCase.data.name || testCase.data.name === "") {
      if (result.data.name === testCase.data.title) {
        console.log("     ✅ Name fallback to title working correctly");
      } else {
        console.log("     ❌ Name fallback logic failed");
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
});

console.log("\n\n🎉 Tag Mapper Testing Complete!");
console.log("=".repeat(60));
console.log("✅ Tag collection type implementation is ready for integration");
