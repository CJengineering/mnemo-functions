// Test actual webhook trigger by creating a real collection item
const API_URL =
  "https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items";

async function testRealWebhook() {
  console.log("🚀 Creating real collection item to trigger webhook...\n");

  // Create a tag that should trigger a webhook
  const createPayload = {
    type: "tag",
    data: {
      title: "Real Webhook Test Tag",
      slug: "real-webhook-test-tag",
      name: "Real Webhook Test Tag",
      "name-arabic": "اختبار الويب هوك الحقيقي",
      status: "published",
    },
  };

  try {
    console.log("📤 Creating collection item...");
    const createResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPayload),
    });

    const createResult = await createResponse.json();

    if (createResult.success) {
      console.log("✅ Collection item created:", {
        id: createResult.collectionItem.id,
        slug: createResult.collectionItem.slug,
        title: createResult.collectionItem.title,
      });

      console.log(
        "🎯 Webhook should have been sent to your Community Jameel endpoint!"
      );
      console.log("⏱️  Waiting 3 seconds for webhook to complete...\n");

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Clean up
      console.log("🗑️  Cleaning up test data...");
      await fetch(`${API_URL}/${createResult.collectionItem.id}`, {
        method: "DELETE",
      });

      console.log(
        "✅ Test complete! Check your Vercel logs for the webhook payload."
      );
    } else {
      console.error("❌ Failed to create collection item:", createResult);
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

testRealWebhook();
