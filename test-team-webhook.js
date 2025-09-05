// Test creating a team member to see exact webhook payload
const API_URL =
  "https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items";

async function testTeamWebhook() {
  console.log("🚀 Creating team member to trigger webhook...\n");

  // Create a team member that should trigger a webhook
  const teamPayload = {
    type: "team",
    data: {
      title: "Jane Smith Webhook Test",
      slug: "jane-smith-webhook-test",
      name: "Jane Smith Webhook Test",
      "name-arabic": "جين سميث اختبار",
      position: "Test Position",
      "position-arabic": "منصب تجريبي",
      "paragraph-description": "Test description for Jane Smith",
      "biography-arabic": "وصف تجريبي لجين سميث",
      order: 1,
      filter: "Team",
      "news-on-off": true,
      photo: {
        url: "https://example.com/jane-smith.jpg",
        alt: "Jane Smith photo",
      },
      status: "published",
    },
  };

  try {
    console.log("📤 Creating team member...");
    console.log("📋 Payload:", JSON.stringify(teamPayload, null, 2));

    const createResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamPayload),
    });

    const createResult = await createResponse.json();

    if (createResult.success) {
      console.log("✅ Team member created:", {
        id: createResult.collectionItem.id,
        slug: createResult.collectionItem.slug,
        title: createResult.collectionItem.title,
        type: createResult.collectionItem.type,
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
      console.error("❌ Failed to create team member:", createResult);
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

testTeamWebhook();
