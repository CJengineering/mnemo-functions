// Test webhook integration with collection items
// This script tests the webhook functionality by creating and updating collection items

const API_URL =
  "https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items";

async function testWebhookIntegration() {
  console.log("🧪 Testing Webhook Integration");
  console.log("=" * 50);

  // Test 1: Create a new collection item (should trigger CREATE webhook)
  console.log("\n📝 Test 1: Creating new collection item...");
  const createPayload = {
    type: "tag",
    title: "Webhook Test Tag",
    status: "draft",
    data: {
      name: "Webhook Test Tag",
      nameArabic: "تجربة الويب هوك",
    },
  };

  try {
    const createResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPayload),
    });

    const createResult = await createResponse.json();

    if (createResult.success) {
      console.log("✅ Create test successful:", {
        id: createResult.collectionItem.id,
        slug: createResult.collectionItem.slug,
        title: createResult.collectionItem.title,
      });

      const itemId = createResult.collectionItem.id;

      // Test 2: Update the collection item (should trigger UPDATE webhook)
      console.log("\n🔄 Test 2: Updating collection item...");
      const updatePayload = {
        title: "Updated Webhook Test Tag",
        status: "published",
        data: {
          name: "Updated Webhook Test Tag",
          nameArabic: "تجربة الويب هوك المحدثة",
        },
      };

      const updateResponse = await fetch(`${API_URL}/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const updateResult = await updateResponse.json();

      if (updateResult.success) {
        console.log("✅ Update test successful:", {
          id: updateResult.collectionItem.id,
          slug: updateResult.collectionItem.slug,
          title: updateResult.collectionItem.title,
          status: updateResult.collectionItem.status,
        });
      } else {
        console.error("❌ Update test failed:", updateResult);
      }

      // Clean up: Delete the test item
      console.log("\n🗑️ Cleaning up test data...");
      const deleteResponse = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
      });

      if (deleteResponse.ok) {
        console.log("✅ Test data cleaned up successfully");
      }
    } else {
      console.error("❌ Create test failed:", createResult);
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }

  console.log("\n🎯 Webhook Integration Test Complete");
  console.log("Check your server logs for webhook activity!");
}

// Instructions for webhook endpoint setup
console.log(`
🔧 WEBHOOK ENDPOINTS EXPECTED:

1. CREATE webhook: 
   POST https://www.communityjameel.org/api/mnemo/create-collection-item
   
2. UPDATE webhook:
   POST https://www.communityjameel.org/api/mnemo/update-collection

📋 Expected payload format:
{
  "action": "create" | "update",
  "collectionItem": {
    "id": "uuid",
    "title": "Item Title",
    "slug": "item-slug", 
    "type": "tag",
    "status": "published",
    "data": {...},
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  "metadata": {
    "timestamp": "2025-01-01T00:00:00Z",
    "source": "mnemosyne-functions",
    "changes": ["title", "data"] // only for updates
  }
}

⚠️ Note: Webhooks are disabled by default in development.
Set WEBHOOKS_ENABLED=true in your .env file to test them.
`);

// Run the test
testWebhookIntegration();
