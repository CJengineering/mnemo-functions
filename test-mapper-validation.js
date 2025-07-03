/**
 * Test the production API with the corrected mapper format
 */

const BASE_URL = "https://mnemo-app-e4f6j5kdsq-ew.a.run.app";

// Test data in the correct format (using IncomingCollectionItem structure)
const testEventData = {
  type: "event",
  data: {
    title: "Production Mapper Test Event",
    slug: "production-mapper-test-event",
    status: "published",
    arabicTitle: "حدث اختبار الخريطة الإنتاجية",
    eventDate: "2025-08-15",
    endDate: "2025-08-16",
    city: "Dubai",
    address: "DIFC",
    featured: true,
    thumbnail: {
      url: "https://example.com/test-thumb.jpg",
      alt: "Test event thumbnail",
    },
    heroImage: {
      url: "https://example.com/test-hero.jpg",
      alt: "Test event hero image",
    },
    programmeLabel: {
      id: "test-prog-1",
      slug: "test-programme",
    },
    tags: [
      { id: "tag-test", slug: "test" },
      { id: "tag-api", slug: "api" },
    ],
    rsvpLink: "https://example.com/rsvp",
    contactDetails: "test@example.com",
  },
};

async function testMapperEndpoint() {
  console.log("🚀 Testing Mapper Endpoint with Correct Format");
  console.log("📍 API URL:", BASE_URL);

  try {
    console.log("\n📝 Testing Collection Item Creation with Mapper...");
    console.log("📤 Sending data:", JSON.stringify(testEventData, null, 2));

    const response = await fetch(`${BASE_URL}/api/collection-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEventData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Success! Created collection item:");
      console.log("   ID:", result.collectionItem.id);
      console.log("   Title:", result.collectionItem.title);
      console.log("   Slug:", result.collectionItem.slug);
      console.log("   Type:", result.collectionItem.type);
      console.log("   Status:", result.collectionItem.status);

      // Test reading the created item
      console.log("\n📖 Testing Read Created Item...");
      const readResponse = await fetch(
        `${BASE_URL}/api/collection-items/${result.collectionItem.id}`
      );
      const readResult = await readResponse.json();

      if (readResponse.ok) {
        console.log("✅ Successfully read created item");
        console.log(
          "   Data keys:",
          Object.keys(JSON.parse(readResult.collectionItem.data))
        );
      } else {
        console.log("❌ Failed to read created item:", readResult.error);
      }

      return result.collectionItem.id;
    } else {
      console.log("❌ Failed to create collection item:");
      console.log("   Status:", response.status);
      console.log("   Error:", result.error);
    }
  } catch (error) {
    console.error("❌ Request failed:", error.message);
  }
}

async function testAIEndpoint() {
  console.log("\n🤖 Testing AI Prompt-to-Item Endpoint...");

  try {
    const promptData = {
      prompt:
        "Create an event about sustainable technology innovations in Dubai, happening next month",
      type: "event",
      saveToDB: false, // Just test the AI generation
    };

    const response = await fetch(`${BASE_URL}/api/prompt-to-item/demo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ AI endpoint working!");
      console.log("   Generated title:", result.data.data.title);
      console.log("   Generated slug:", result.data.data.slug);
      console.log("   Generated type:", result.data.type);
    } else {
      console.log("❌ AI endpoint failed:", result.error);
    }
  } catch (error) {
    console.error("❌ AI request failed:", error.message);
  }
}

async function runTests() {
  console.log("🔧 Testing Mapper System Validation\n");

  const createdId = await testMapperEndpoint();
  await testAIEndpoint();

  if (createdId) {
    console.log("\n🗑️ Cleaning up - deleting test item...");
    try {
      const deleteResponse = await fetch(
        `${BASE_URL}/api/collection-items/${createdId}`,
        {
          method: "DELETE",
        }
      );

      if (deleteResponse.ok) {
        console.log("✅ Test item cleaned up successfully");
      } else {
        console.log("⚠️ Could not clean up test item (ID:", createdId, ")");
      }
    } catch (error) {
      console.log("⚠️ Cleanup failed:", error.message);
    }
  }

  console.log("\n✅ Mapper validation tests completed!");
}

runTests().catch(console.error);
