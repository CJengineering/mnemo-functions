const { sendWebhookSafe } = require('./dist/src/services/webhookService');

console.log('🧪 Testing hardcoded webhook enablement...\n');

// Create a test collection item
const testItem = {
  id: 'test-123',
  title: 'Test Item',
  slug: 'test-item',
  type: 'tag',
  status: 'published',
  data: '{"name":"Test Tag"}',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

console.log('📤 Attempting to send CREATE webhook...');
sendWebhookSafe('create', testItem)
  .then(() => {
    console.log('✅ Webhook call completed (check logs above for success/failure details)');
  })
  .catch((error) => {
    console.log('❌ Webhook call failed:', error.message);
  });

// Wait a bit to see the webhook logs
setTimeout(() => {
  console.log('\n🎯 Test complete! Look for webhook attempt logs above.');
  process.exit(0);
}, 3000);
