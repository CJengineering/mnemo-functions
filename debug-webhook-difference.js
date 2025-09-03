// Compare webhook payload with curl payload
// This will help us identify the difference

console.log("🔍 PAYLOAD COMPARISON TEST\n");

// 1. Your working curl payload
const workingCurlPayload = {
  action: "create",
  collectionItem: {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Dr. Sarah Ahmed",
    slug: "dr-sarah-ahmed",
    type: "team",
    status: "published",
    data: '{"name":"Dr. Sarah Ahmed","nameArabic":"د. سارة أحمد","position":"Research Director","positionArabic":"مدير الأبحاث","photo":{"url":"https://example.com/photos/sarah-ahmed.jpg","alt":"Dr. Sarah Ahmed profile photo"},"photoHires":"https://example.com/photos/sarah-ahmed-hires.jpg","altTextImage":"Professional headshot of Dr. Sarah Ahmed","altTextImageArabic":"صورة شخصية مهنية للدكتورة سارة أحمد","paragraphDescription":"...","biographyArabic":"...","metaDescription":"...","metaDescriptionArabic":"...","filter":"Leadership","order":1,"newsOnOff":true,"tags":[{"id":"tag-123","slug":"climate-research"}]}',
  },
};

// 2. What a real webhook payload would look like
const realWebhookPayload = {
  action: "create",
  collectionItem: {
    id: "69c8b3b9-0e48-4ea6-b96c-4ada02e69df0",
    title: "Real Webhook Test Tag",
    slug: "real-webhook-test-tag",
    type: "tag",
    status: "published",
    data: '{"name":"Real Webhook Test Tag","nameArabic":"اختبار الويب هوك الحقيقي"}',
    created_at: "2025-09-03T14:59:18.123Z",
    updated_at: "2025-09-03T14:59:18.123Z",
  },
  metadata: {
    timestamp: "2025-09-03T14:59:18.125Z",
    source: "mnemosyne-functions",
  },
};

console.log("✅ Working curl payload structure:");
console.log(JSON.stringify(workingCurlPayload, null, 2));

console.log("\n🔍 Real webhook payload structure:");
console.log(JSON.stringify(realWebhookPayload, null, 2));

console.log("\n📋 Key differences:");
console.log('1. Real webhook has "metadata" field (curl test doesn\'t)');
console.log('2. Real webhook has "created_at" and "updated_at" timestamps');
console.log(
  "3. Different data content (curl uses team data, real webhook used tag data)"
);

console.log(
  '\n🎯 Likely issue: Your endpoint expects only "action" and "collectionItem"'
);
console.log('   but crashes when it receives the "metadata" field');

console.log("\n🚀 Quick fix for your endpoint:");
console.log("   Add: const { action, collectionItem, metadata } = req.body;");
console.log(
  "   Or:  const { action, collectionItem } = req.body; // ignore metadata"
);
