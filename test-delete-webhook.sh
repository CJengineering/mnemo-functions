#!/bin/bash

# Test DELETE webhook functionality
echo "🧪 Testing DELETE Webhook Functionality"
echo "================================================================="

API_URL="https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items"

# Step 1: Create a test item to delete
echo "📝 Step 1: Creating test collection item for deletion..."
CREATE_RESPONSE=$(curl -s -X POST $API_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "tag",
    "data": {
      "title": "Delete Webhook Test Tag",
      "slug": "delete-webhook-test",
      "name": "Delete Webhook Test Tag",
      "name-arabic": "اختبار حذف الويب هوك",
      "status": "draft"
    }
  }')

echo "✅ Create Response:"
echo $CREATE_RESPONSE | jq '.'

# Extract the item ID and slug
ITEM_ID=$(echo $CREATE_RESPONSE | jq -r '.collectionItem.id')
ITEM_SLUG=$(echo $CREATE_RESPONSE | jq -r '.collectionItem.slug')
ITEM_TITLE=$(echo $CREATE_RESPONSE | jq -r '.collectionItem.title')

if [ "$ITEM_ID" = "null" ] || [ -z "$ITEM_ID" ]; then
  echo "❌ Failed to create test item. Exiting."
  exit 1
fi

echo ""
echo "📋 Created item for deletion test:"
echo "  ID: $ITEM_ID"
echo "  Title: $ITEM_TITLE"
echo "  Slug: $ITEM_SLUG"

# Wait a moment
sleep 2

# Step 2: Delete the item (should trigger DELETE webhook)
echo ""
echo "📝 Step 2: Deleting collection item (should trigger DELETE webhook)..."
echo "🚨 This should send a DELETE webhook to Community Jameel!"

DELETE_RESPONSE=$(curl -s -X DELETE $API_URL/$ITEM_ID)

echo "✅ Delete Response:"
echo $DELETE_RESPONSE | jq '.'

# Extract delete result
DELETE_SUCCESS=$(echo $DELETE_RESPONSE | jq -r '.success')
DELETE_MESSAGE=$(echo $DELETE_RESPONSE | jq -r '.message')

echo ""
echo "📋 Delete operation result:"
echo "  Success: $DELETE_SUCCESS"
echo "  Message: $DELETE_MESSAGE"

# Step 3: Verify the item is actually deleted
echo ""
echo "📝 Step 3: Verifying item is deleted..."
VERIFY_RESPONSE=$(curl -s -X GET $API_URL/$ITEM_ID)

echo "✅ Verification Response (should be 404):"
echo $VERIFY_RESPONSE | jq '.'

VERIFY_SUCCESS=$(echo $VERIFY_RESPONSE | jq -r '.success')

echo ""
echo "🔍 DELETE WEBHOOK TEST RESULTS:"
echo "================================================================="
echo "  Item Created: ✅ $ITEM_TITLE ($ITEM_SLUG)"
echo "  Delete API Call: $([ "$DELETE_SUCCESS" = "true" ] && echo "✅ Success" || echo "❌ Failed")"
echo "  Item Verification: $([ "$VERIFY_SUCCESS" = "false" ] && echo "✅ Item deleted" || echo "❌ Item still exists")"

echo ""
echo "📡 Expected DELETE Webhook:"
echo "  Endpoint: POST https://www.communityjameel.org/api/mnemo/delete-collection-item"
echo "  Payload:"
echo '  {'
echo '    "action": "delete",'
echo '    "collectionItem": {'
echo "      \"id\": \"$ITEM_ID\","
echo "      \"title\": \"$ITEM_TITLE\","
echo "      \"slug\": \"$ITEM_SLUG\","
echo '      "type": "tag",'
echo '      "status": "draft",'
echo '      "data": "...",''
echo '      "created_at": "...",''
echo '      "updated_at": "..."''
echo '    }'
echo '  }'

echo ""
echo "🎯 DELETE Webhook Test Complete!"
echo ""
echo "💡 Key Points:"
echo "  1. DELETE webhooks send the full item data before deletion"
echo "  2. Community Jameel should implement DELETE endpoint:"
echo "     POST /api/mnemo/delete-collection-item"
echo "  3. DELETE webhook includes all item data for reference"
echo "  4. Use item.id or item.slug to identify what to delete"
echo ""
echo "🔍 Check your webhook logs for:"
echo "  - '📤 Sending delete webhook to: ...'"
echo "  - '✅ Webhook delete successful'"
echo "  - Full payload logging with action: 'delete'"
