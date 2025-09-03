// Test webhook integration - FINAL CORRECTED VERSION
// Using the exact IncomingTagData format expected by createCollectionItemFromForm

const API_URL = "https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items";

async function testWebhookWithCorrectFormat() {
  console.log("🧪 Testing Webhook Integration - FINAL CORRECT FORMAT");
  console.log("=".repeat(65));

  // Test 1: Create using the EXACT IncomingTagData format
  console.log("\n📝 Test 1: Creating new collection item...");
  
  // This matches IncomingCollectionItem interface exactly
  const createPayload = {
    type: "tag",
    data: {
      title: "Webhook Test Tag",      // required
      slug: "webhook-test-tag",       // required  
      name: "Webhook Test Tag",       // required
      "name-arabic": "تجربة الويب هوك", // optional
      status: "draft"                 // optional
    }
  };

  try {
    console.log("📤 Sending CREATE payload:", JSON.stringify(createPayload, null, 2));
    
    const createResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPayload)
    });

    const createResult = await createResponse.json();
    
    if (createResult.success) {
      console.log("✅ CREATE test successful:", {
        id: createResult.collectionItem.id,
        slug: createResult.collectionItem.slug,
        title: createResult.collectionItem.title,
        type: createResult.collectionItem.type,
        status: createResult.collectionItem.status
      });
      
      console.log("🎉 CREATE WEBHOOK should have been triggered!");
      console.log("   Expected webhook call:");
      console.log("   POST https://www.communityjameel.org/api/mnemo/create-collection-item");
      console.log("   Check logs for: '📤 Sending create webhook to:'");
      
      const itemId = createResult.collectionItem.id;
      
      // Wait a moment for webhook to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test 2: Update using the direct API format (PUT uses updateCollectionItem, not form mapper)
      console.log("\n🔄 Test 2: Updating collection item...");
      const updatePayload = {
        title: "UPDATED Webhook Test Tag",
        status: "published",
        data: {
          name: "UPDATED Webhook Test Tag",
          nameArabic: "تجربة الويب هوك المحدثة"
        }
      };

      console.log("📤 Sending UPDATE payload:", JSON.stringify(updatePayload, null, 2));

      const updateResponse = await fetch(`${API_URL}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      const updateResult = await updateResponse.json();
      
      if (updateResult.success) {
        console.log("✅ UPDATE test successful:", {
          id: updateResult.collectionItem.id,
          slug: updateResult.collectionItem.slug,
          title: updateResult.collectionItem.title,
          status: updateResult.collectionItem.status
        });
        
        console.log("🎉 UPDATE WEBHOOK should have been triggered!");
        console.log("   Expected webhook call:");
        console.log("   POST https://www.communityjameel.org/api/mnemo/update-collection");
        console.log("   Check logs for: '📤 Sending update webhook to:'");
        console.log("   Changed fields should include: ['title', 'status', 'data']");
        
      } else {
        console.error("❌ Update test failed:", updateResult);
      }

      // Wait before cleanup
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Clean up: Delete the test item
      console.log("\n🗑️ Cleaning up test data...");
      const deleteResponse = await fetch(`${API_URL}/${itemId}`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        console.log("✅ Test data cleaned up successfully");
      } else {
        console.warn("⚠️ Cleanup may have failed - check manually");
      }

    } else {
      console.error("❌ Create test failed:", createResult);
      console.log("📋 Full error response:", JSON.stringify(createResult, null, 2));
      
      // Try to give helpful debugging info
      if (createResult.error && createResult.error.includes("Missing required fields")) {
        console.log("\n🔍 Debugging Info:");
        console.log("The createCollectionItemFromForm function expects IncomingCollectionItem format:");
        console.log("{ type: 'tag', data: { title, slug, name, 'name-arabic'?, status? } }");
        console.log("Your payload structure looks correct, check field values.");
      }
    }

  } catch (error) {
    console.error("❌ Test error:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Test webhook environment setup
async function checkWebhookEnvironment() {
  console.log("\n🔧 Webhook Environment Check");
  console.log("-".repeat(40));
  
  const nodeEnv = process.env.NODE_ENV;
  const webhooksEnabled = process.env.WEBHOOKS_ENABLED;
  
  console.log("Current environment variables:");
  console.log(`  NODE_ENV: ${nodeEnv || 'undefined'}`);
  console.log(`  WEBHOOKS_ENABLED: ${webhooksEnabled || 'undefined'}`);
  
  const willWebhooksRun = nodeEnv === 'production' || webhooksEnabled === 'true';
  
  if (willWebhooksRun) {
    console.log("✅ Webhooks WILL execute with current configuration");
    console.log("   Real HTTP calls will be made to Community Jameel endpoints");
  } else {
    console.log("🔕 Webhooks are DISABLED with current configuration");
    console.log("   Webhook calls will be logged but not executed");
    console.log("   To enable: set NODE_ENV=production OR WEBHOOKS_ENABLED=true");
  }
  
  return willWebhooksRun;
}

// Show comprehensive webhook documentation
function showWebhookDocumentation() {
  console.log(`
📚 COMPLETE WEBHOOK INTEGRATION DOCUMENTATION
==============================================

🎯 WEBHOOK ENDPOINTS TO IMPLEMENT ON COMMUNITY JAMEEL:

1. CREATE Endpoint:
   POST https://www.communityjameel.org/api/mnemo/create-collection-item
   
2. UPDATE Endpoint:
   POST https://www.communityjameel.org/api/mnemo/update-collection

📦 WEBHOOK PAYLOAD SPECIFICATION:
{
  "action": "create" | "update",
  "collectionItem": {
    "id": "uuid-string",
    "title": "Item Title",
    "slug": "item-slug",
    "type": "tag" | "event" | "post" | "team" | "partner" | "person" | ...,
    "status": "published" | "draft",
    "data": "{\\"name\\":\\"Tag Name\\",\\"nameArabic\\":\\"Arabic Name\\"}",
    "created_at": "2025-09-03T12:00:00.000Z",
    "updated_at": "2025-09-03T12:00:00.000Z"
  },
  "metadata": {
    "timestamp": "2025-09-03T12:00:00.000Z",
    "source": "mnemosyne-functions",
    "changes": ["title", "data", "status"]  // only for updates
  }
}

🔧 WEBHOOK FEATURES:
✅ Automatic retry with exponential backoff (up to 3 attempts)
✅ Non-blocking execution (main API operations continue regardless)
✅ Comprehensive error logging and debugging
✅ Environment-based enable/disable control
✅ Change tracking for update operations
✅ Request timeout handling (10 seconds)
✅ Safe async execution using setImmediate()

🔍 MONITORING & DEBUGGING:
Watch your application logs for these patterns:

SUCCESS PATTERNS:
- "📤 Sending create webhook to: https://www.communityjameel.org/..."
- "📤 Sending update webhook to: https://www.communityjameel.org/..."
- "✅ Webhook create successful (attempt 1): {status: 200, ...}"
- "✅ Webhook update successful (attempt 1): {status: 200, ...}"

ERROR PATTERNS:
- "⚠️ Webhook create failed (attempt 1): {status: 404, ...}"
- "❌ Webhook create failed after 3 attempts: {finalError: '...'}"
- "📝 Logging webhook failure: {action: 'create', error: '...'}"

DISABLED PATTERNS:
- "🔕 Webhooks disabled - would have sent create webhook for: item-slug"

⚙️ WEBHOOK CONFIGURATION:

Environment Variables:
- NODE_ENV=production          → Enables webhooks
- WEBHOOKS_ENABLED=true        → Force-enables webhooks in any environment
- WEBHOOK_API_KEY=secret       → Optional authentication (uncomment in code)

Code Configuration (webhookService.ts):
- baseUrl: 'https://www.communityjameel.org/api/mnemo'
- timeout: 10000ms (10 seconds)
- retries: 3 attempts
- enabled: NODE_ENV === 'production' || WEBHOOKS_ENABLED === 'true'

🚨 IMPORTANT IMPLEMENTATION NOTES:

1. ENDPOINTS MUST EXIST: The Community Jameel website must implement both endpoints
2. ACCEPT JSON: Endpoints should accept Content-Type: application/json
3. RETURN 200/201: Success responses should return HTTP 200 or 201
4. HANDLE RETRIES: Expect the same webhook to be sent up to 3 times on failure
5. PARSE METADATA: Use metadata.changes to identify what fields were updated
6. VALIDATE PAYLOAD: Ensure the collectionItem structure matches your database

🔄 TRIGGERING CONDITIONS:
- CREATE webhook: When new collection items are created via any API endpoint
- UPDATE webhook: When existing collection items are modified via PUT endpoints
- NO DELETE webhook: Currently not implemented (add if needed)

📊 SUPPORTED COLLECTION TYPES:
- tag, event, post, programme, news, team, partner, person, source, innovation, 
  award, publication, prize

🎯 INTEGRATION VERIFICATION:
1. Run this test script with WEBHOOKS_ENABLED=true
2. Monitor your Community Jameel server logs for incoming webhook requests
3. Verify webhook payload structure matches your database schema
4. Test failure scenarios (return 4xx/5xx from webhook endpoints)
5. Confirm retry mechanism works as expected
`);
}

// Run complete test suite
(async () => {
  try {
    showWebhookDocumentation();
    
    const webhooksEnabled = await checkWebhookEnvironment();
    
    if (!webhooksEnabled) {
      console.log("\n⚠️ Running test with webhooks disabled");
      console.log("💡 Set WEBHOOKS_ENABLED=true to test actual webhook calls");
    }
    
    await testWebhookWithCorrectFormat();
    
    console.log("\n🎯 WEBHOOK INTEGRATION TEST COMPLETE!");
    console.log("📋 Next Steps:");
    
    if (webhooksEnabled) {
      console.log("  1. Check Community Jameel server logs for webhook requests");
      console.log("  2. Verify webhook payloads are being processed correctly");
      console.log("  3. Monitor for any webhook failures in mnemosyne logs");
    } else {
      console.log("  1. Enable webhooks: set WEBHOOKS_ENABLED=true");
      console.log("  2. Re-run this test to trigger actual webhook calls");
      console.log("  3. Implement webhook endpoints on Community Jameel website");
    }
    
    console.log("  4. Monitor production webhook activity");
    console.log("  5. Set up alerting for webhook failures");
    
  } catch (error) {
    console.error("💥 Test suite crashed:", error);
  }
})();
