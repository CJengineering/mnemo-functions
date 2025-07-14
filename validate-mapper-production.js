#!/usr/bin/env node

/**
 * Production Mapper Validation Test
 * Tests the mapper system against the actual production API
 */

const BASE_URL = "https://mnemo-app-e4f6j5kdsq-ew.a.run.app";

// Test data in the exact format expected by the mapper API
const testEventData = {
  type: "event",
  data: {
    title: "Mapper Validation Test Event",
    slug: "mapper-validation-test-event",
    status: "draft",
    eventDate: "2025-12-01",
    city: "Test City",
    featured: true,
    thumbnail: {
      url: "https://example.com/test-thumb.jpg",
      alt: "Test thumbnail",
    },
  },
};

async function testMapperEndpoint() {
  console.log("🧪 Testing Mapper Endpoint...");
  console.log("📤 Sending data:", JSON.stringify(testEventData, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/api/collection-items/demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testEventData),
    });

    const result = await response.json();

    console.log("📥 Response Status:", response.status);
    console.log("📥 Response:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("✅ Mapper endpoint works!");

      // Validate the mapping
      if (result.collectionItem && result.collectionItem.slug) {
        console.log(
          "✅ Slug field is properly set:",
          result.collectionItem.slug
        );
      } else {
        console.log("❌ Slug field is missing or null");
      }

      if (result.collectionItem && result.collectionItem.status) {
        console.log("✅ Status field is set:", result.collectionItem.status);
      } else {
        console.log("❌ Status field is missing");
      }
    } else {
      console.log("❌ Mapper endpoint failed");
    }
  } catch (error) {
    console.error("❌ Error testing mapper:", error.message);
  }
}

async function testAIEndpoint() {
  console.log("\n🤖 Testing AI Endpoint...");

  try {
    const response = await fetch(`${BASE_URL}/api/prompt-to-item/demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt:
          "Create a test event about AI innovation in Dubai on December 15th, 2025",
        type: "event",
      }),
    });

    const result = await response.json();

    console.log("📥 AI Response Status:", response.status);

    if (response.ok) {
      console.log("✅ AI endpoint works!");
      console.log("🎯 Generated type:", result.data?.type);
      console.log("🎯 Generated title:", result.data?.data?.title);
      console.log("🎯 Generated slug:", result.data?.data?.slug);
    } else {
      console.log("❌ AI endpoint failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error testing AI:", error.message);
  }
}

async function main() {
  console.log("🚀 Production Mapper Validation");
  console.log("🎯 Target:", BASE_URL);
  console.log("=" * 50);

  await testMapperEndpoint();
  await testAIEndpoint();

  console.log("\n✨ Validation complete!");
}

main().catch(console.error);
