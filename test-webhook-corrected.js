// Test webhook integration with collection items - CORRECTED VERSION
// This script tests the webhook functionality using the direct API endpoint

const API_URL = "https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items";

async function testWebhookIntegration() {
  console.log("🧪 Testing Webhook Integration - CORRECTED");
  console.log("=".repeat(50));

  // Test 1: Create a new collection item (should trigger CREATE webhook)
  console.log("\n📝 Test 1: Creating new collection item...");
  
  // Using the DIRECT API format (not the form mapper format)
  const createPayload = {
    type: "tag",
    title: "Webhook Test Tag",
    status: "draft",
    // NO nested data object for direct API
  };

  try {
    const createResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPayload)
    });

    const createResult = await createResponse.json();
    
    if (createResult.success) {
      console.log("✅ Create test successful:", {
        id: createResult.collectionItem.id,
        slug: createResult.collectionItem.slug,
        title: createResult.collectionItem.title
      });
      
      const itemId = createResult.collectionItem.id;
      
      // Test 2: Update the collection item (should trigger UPDATE webhook)
      console.log("\n🔄 Test 2: Updating collection item...");
      const updatePayload = {
        title: "Updated Webhook Test Tag",
        status: "published",
        data: {
          name: "Updated Webhook Test Tag",
          nameArabic: "تجربة الويب هوك المحدثة"
        }
      };

      const updateResponse = await fetch(`${API_URL}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      const updateResult = await updateResponse.json();
      
      if (updateResult.success) {
        console.log("✅ Update test successful:", {
          id: updateResult.collectionItem.id,
          slug: updateResult.collectionItem.slug,
          title: updateResult.collectionItem.title,
          status: updateResult.collectionItem.status
        });
        
        console.log("📊 Webhook calls should have been made:");
        console.log("  1. CREATE webhook when item was created");
        console.log("  2. UPDATE webhook when item was updated");
        
      } else {
        console.error("❌ Update test failed:", updateResult);
      }

      // Clean up: Delete the test item
      console.log("\n🗑️ Cleaning up test data...");
      const deleteResponse = await fetch(`${API_URL}/${itemId}`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        console.log("✅ Test data cleaned up successfully");
      }

    } else {
      console.error("❌ Create test failed:", createResult);
      console.log("📝 Request payload was:", JSON.stringify(createPayload, null, 2));
    }

  } catch (error) {
    console.error("❌ Test error:", error.message);
  }

  console.log("\n🎯 Webhook Integration Test Complete");
  console.log("📋 Check your server logs for webhook activity!");
  console.log("🔍 Look for log messages starting with:");
  console.log("  - '📤 Sending create webhook to:'");
  console.log("  - '📤 Sending update webhook to:'");
  console.log("  - '✅ Webhook create successful'");
  console.log("  - '✅ Webhook update successful'");
}

// Test using the Tag Upload Script approach
async function testWebhookWithTagUpload() {
  console.log("\n🏷️ Alternative Test: Using Tag Upload Approach");
  console.log("-".repeat(50));
  
  // This matches the working tag upload script format
  const tagPayload = {
    type: "tag",
    title: "Webhook Tag Test",
    name: "Webhook Tag Test", 
    slug: "webhook-tag-test",
    status: "published",
    "name-arabic": "اختبار التاغ"
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagPayload)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ Tag upload style test successful:", {
        id: result.collectionItem.id,
        slug: result.collectionItem.slug,
        title: result.collectionItem.title
      });
      
      // Clean up
      await fetch(`${API_URL}/${result.collectionItem.id}`, {
        method: 'DELETE'
      });
      
    } else {
      console.error("❌ Tag upload style test failed:", result);
    }
    
  } catch (error) {
    console.error("❌ Tag upload test error:", error.message);
  }
}

// Instructions for webhook endpoint setup
console.log(`
🔧 WEBHOOK ENDPOINTS TO IMPLEMENT ON COMMUNITY JAMEEL WEBSITE:

1. CREATE webhook: 
   POST https://www.communityjameel.org/api/mnemo/create-collection-item
   
2. UPDATE webhook:
   POST https://www.communityjameel.org/api/mnemo/update-collection

📋 Expected webhook payload format:
{
  "action": "create" | "update",
  "collectionItem": {
    "id": "uuid",
    "title": "Item Title",
    "slug": "item-slug", 
    "type": "tag",
    "status": "published",
    "data": "{...json string...}",
    "created_at": "2025-09-03T00:00:00Z",
    "updated_at": "2025-09-03T00:00:00Z"
  },
  "metadata": {
    "timestamp": "2025-09-03T00:00:00Z",
    "source": "mnemosyne-functions",
    "changes": ["title", "data"] // only for updates
  }
}

🔧 TO ENABLE WEBHOOKS:
1. Create .env file with: WEBHOOKS_ENABLED=true
2. OR set NODE_ENV=production
3. Watch server logs for webhook activity

⚠️ Note: Webhooks are currently disabled in development by default.
`);

// Run both tests
(async () => {
  await testWebhookIntegration();
  await testWebhookWithTagUpload();
})();
