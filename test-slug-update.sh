#!/bin/bash

# Test slug update functionality
echo "🧪 Testing Slug Update Functionality"
echo "================================================================="

API_URL="https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items"

# Step 1: Create a test item
echo "📝 Step 1: Creating test collection item..."
CREATE_RESPONSE=$(curl -s -X POST $API_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "tag",
    "data": {
      "title": "Slug Update Test Tag",
      "slug": "original-slug-test",
      "name": "Slug Update Test Tag",
      "name-arabic": "اختبار تحديث الرابط",
      "status": "draft"
    }
  }')

echo "✅ Create Response:"
echo $CREATE_RESPONSE | jq '.'

# Extract the item ID
ITEM_ID=$(echo $CREATE_RESPONSE | jq -r '.collectionItem.id')
ORIGINAL_SLUG=$(echo $CREATE_RESPONSE | jq -r '.collectionItem.slug')

if [ "$ITEM_ID" = "null" ] || [ -z "$ITEM_ID" ]; then
  echo "❌ Failed to create test item. Exiting."
  exit 1
fi

echo ""
echo "📋 Created item:"
echo "  ID: $ITEM_ID"
echo "  Original Slug: $ORIGINAL_SLUG"

# Wait a moment
sleep 2

# Step 2: Update the item with a new slug
echo ""
echo "📝 Step 2: Updating slug from '$ORIGINAL_SLUG' to 'updated-slug-test'..."
UPDATE_RESPONSE=$(curl -s -X PUT $API_URL/$ITEM_ID \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Updated Slug Test Tag",
    "slug": "updated-slug-test",
    "status": "published",
    "data": {
      "name": "Updated Slug Test Tag",
      "nameArabic": "اختبار تحديث الرابط المحدث"
    }
  }')

echo "✅ Update Response:"
echo $UPDATE_RESPONSE | jq '.'

# Extract the updated slug
UPDATED_SLUG=$(echo $UPDATE_RESPONSE | jq -r '.collectionItem.slug')

echo ""
echo "📋 Update result:"
echo "  Original Slug: $ORIGINAL_SLUG"
echo "  Updated Slug: $UPDATED_SLUG"

# Step 3: Verify the slug was actually updated
echo ""
echo "📝 Step 3: Verifying slug update by fetching item..."
VERIFY_RESPONSE=$(curl -s -X GET $API_URL/$ITEM_ID)

echo "✅ Verification Response:"
echo $VERIFY_RESPONSE | jq '.'

VERIFIED_SLUG=$(echo $VERIFY_RESPONSE | jq -r '.collectionItem.slug')

echo ""
echo "🔍 SLUG UPDATE TEST RESULTS:"
echo "================================================================="
echo "  Original Slug:  '$ORIGINAL_SLUG'"
echo "  Updated Slug:   '$UPDATED_SLUG'"
echo "  Verified Slug:  '$VERIFIED_SLUG'"

if [ "$VERIFIED_SLUG" = "updated-slug-test" ]; then
  echo "  ✅ SUCCESS: Slug was updated correctly!"
else
  echo "  ❌ FAILED: Slug was not updated correctly."
fi

# Step 4: Test fetching by old slug (should fail)
echo ""
echo "📝 Step 4: Testing old slug access (should return 404)..."
OLD_SLUG_RESPONSE=$(curl -s -X GET $API_URL/slug/$ORIGINAL_SLUG)
echo "Response for old slug '$ORIGINAL_SLUG':"
echo $OLD_SLUG_RESPONSE | jq '.'

# Step 5: Test fetching by new slug (should work)
echo ""
echo "📝 Step 5: Testing new slug access (should work)..."
NEW_SLUG_RESPONSE=$(curl -s -X GET $API_URL/slug/updated-slug-test)
echo "Response for new slug 'updated-slug-test':"
echo $NEW_SLUG_RESPONSE | jq '.'

# Cleanup
echo ""
echo "🗑️ Cleaning up test data..."
curl -s -X DELETE $API_URL/$ITEM_ID > /dev/null

echo ""
echo "🎯 Slug Update Test Complete!"
echo ""
echo "💡 Key Points:"
echo "  1. Slug updates should now work in both UPDATE endpoints"
echo "  2. Webhook payloads will include 'slug' in changed fields"
echo "  3. Community Jameel website should handle slug changes"
echo "  4. Old slug URLs will become invalid after slug changes"
