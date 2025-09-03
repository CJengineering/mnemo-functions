// Test webhook integration - Using WORKING Python script format
// This matches the exact format that successfully uploaded tags

const API_URL =
  "https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items";

async function testWebhookWithWorkingFormat() {
  console.log("🧪 Testing Webhook Integration - Using WORKING Format");
  console.log("=".repeat(60));

  // Test 1: Create using the EXACT format that worked in Python
  console.log("\n📝 Test 1: Creating new collection item...");

  const createPayload = {
    type: "tag",
    status: "draft",
    slug: "webhook-test-tag",
    title: "Webhook Test Tag",
    data: {
      name: "Webhook Test Tag", // This matches the working Python format
    },
  };

  try {
    console.log("📤 Sending payload:", JSON.stringify(createPayload, null, 2));

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
        type: createResult.collectionItem.type,
      });

      console.log("🎉 CREATE WEBHOOK should have been triggered!");
      console.log("   Check logs for: '📤 Sending create webhook to:'");

      const itemId = createResult.collectionItem.id;

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Test 2: Update the collection item (should trigger UPDATE webhook)
      console.log("\n🔄 Test 2: Updating collection item...");
      const updatePayload = {
        title: "UPDATED Webhook Test Tag",
        status: "published",
        data: {
          name: "UPDATED Webhook Test Tag",
          nameArabic: "تجربة الويب هوك المحدثة",
        },
      };

      console.log(
        "📤 Sending update payload:",
        JSON.stringify(updatePayload, null, 2)
      );

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

        console.log("🎉 UPDATE WEBHOOK should have been triggered!");
        console.log("   Check logs for: '📤 Sending update webhook to:'");
        console.log("   Changed fields: ['title', 'status', 'data']");
      } else {
        console.error("❌ Update test failed:", updateResult);
      }

      // Wait before cleanup
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clean up: Delete the test item
      console.log("\n🗑️ Cleaning up test data...");
      const deleteResponse = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
      });

      if (deleteResponse.ok) {
        console.log("✅ Test data cleaned up successfully");
      } else {
        console.warn("⚠️ Cleanup may have failed - check manually");
      }
    } else {
      console.error("❌ Create test failed:", createResult);
      console.log(
        "📋 Full error response:",
        JSON.stringify(createResult, null, 2)
      );
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Test environment configuration
async function testWebhookEnvironment() {
  console.log("\n🔧 Environment Configuration Test");
  console.log("-".repeat(40));

  // Check if webhooks are enabled
  const nodeEnv = process.env.NODE_ENV;
  const webhooksEnabled = process.env.WEBHOOKS_ENABLED;

  console.log("Environment variables:");
  console.log(`  NODE_ENV: ${nodeEnv || "undefined"}`);
  console.log(`  WEBHOOKS_ENABLED: ${webhooksEnabled || "undefined"}`);

  const willWebhooksRun =
    nodeEnv === "production" || webhooksEnabled === "true";

  if (willWebhooksRun) {
    console.log("✅ Webhooks WILL run with current config");
  } else {
    console.log("🔕 Webhooks are DISABLED with current config");
    console.log(
      "   To enable: set NODE_ENV=production OR WEBHOOKS_ENABLED=true"
    );
  }

  return willWebhooksRun;
}

// Instructions and webhook format
function showWebhookInstructions() {
  console.log(`
📋 WEBHOOK INTEGRATION SUMMARY
=================================

🎯 WEBHOOK ENDPOINTS TO IMPLEMENT:
1. CREATE: POST https://www.communityjameel.org/api/mnemo/create-collection-item
2. UPDATE: POST https://www.communityjameel.org/api/mnemo/update-collection

📦 WEBHOOK PAYLOAD FORMAT:
{
  "action": "create" | "update",
  "collectionItem": {
    "id": "uuid",
    "title": "Item Title",
    "slug": "item-slug",
    "type": "tag",
    "status": "published",
    "data": "{\\"name\\":\\"Tag Name\\"}",  // JSON string
    "created_at": "2025-09-03T...",
    "updated_at": "2025-09-03T..."
  },
  "metadata": {
    "timestamp": "2025-09-03T...",
    "source": "mnemosyne-functions",
    "changes": ["title", "data"]  // only for updates
  }
}

🔧 WEBHOOK FEATURES:
✅ Automatic retry with exponential backoff (3 attempts)
✅ Non-blocking (won't fail main operations)
✅ Detailed logging for debugging
✅ Environment-based enable/disable
✅ Change tracking for updates

🔍 LOG MESSAGES TO WATCH FOR:
- "📤 Sending create webhook to: ..."
- "📤 Sending update webhook to: ..."
- "✅ Webhook create successful (attempt 1):"
- "✅ Webhook update successful (attempt 1):"
- "❌ Webhook create failed after 3 attempts:"
- "🔕 Webhooks disabled - would have sent..."

⚙️ TO ENABLE WEBHOOKS:
1. Set environment variable: WEBHOOKS_ENABLED=true
2. OR set: NODE_ENV=production
3. Restart your server
4. Watch logs for webhook activity
`);
}

// Run all tests
(async () => {
  try {
    showWebhookInstructions();

    const webhooksEnabled = await testWebhookEnvironment();

    if (!webhooksEnabled) {
      console.log(
        "\n⚠️ Running test anyway (webhooks will be logged but not sent)"
      );
    }

    await testWebhookWithWorkingFormat();

    console.log("\n🎯 Webhook Integration Test Complete!");
    console.log("📋 Check your application logs for webhook activity");

    if (webhooksEnabled) {
      console.log("🔍 Expected webhook calls:");
      console.log(
        "  1. POST https://www.communityjameel.org/api/mnemo/create-collection-item"
      );
      console.log(
        "  2. POST https://www.communityjameel.org/api/mnemo/update-collection"
      );
    } else {
      console.log(
        "🔕 Webhooks were disabled, enable them to see real webhook calls"
      );
    }
  } catch (error) {
    console.error("💥 Test suite failed:", error);
  }
})();
