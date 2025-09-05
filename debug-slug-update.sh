#!/bin/bash

# Debug slug update with detailed logging
echo "🔍 Debugging Slug Update Issue"
echo "================================================================="

API_URL="https://mnemo-app-e4f6j5kdsq-ew.a.run.app/api/collection-items"

# Create a test item first
echo "📝 Creating test item..."
CREATE_RESPONSE=$(curl -s -X POST $API_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "tag",
    "data": {
      "title": "Debug Slug Test",
      "slug": "debug-original-slug",
      "name": "Debug Slug Test"
    }
  }')

ITEM_ID=$(echo $CREATE_RESPONSE | jq -r '.collectionItem.id')
echo "Created item ID: $ITEM_ID"

# Test 1: Update with verbose logging
echo ""
echo "🔧 Test 1: Update request with full payload logging..."
curl -X PUT $API_URL/$ITEM_ID \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "title": "Debug Updated Title",
    "slug": "debug-updated-slug",
    "status": "published",
    "data": {
      "name": "Debug Updated Name"
    }
  }' \
  -v | jq '.'

echo ""
echo "🔧 Test 2: Check what the server actually received..."
echo "Fetching the updated item to see current state:"
curl -s -X GET $API_URL/$ITEM_ID | jq '.'

# Cleanup
echo ""
echo "🗑️ Cleaning up..."
curl -s -X DELETE $API_URL/$ITEM_ID > /dev/null

echo ""
echo "💡 Analysis:"
echo "  - If title/status updated but slug didn't, the slug parameter isn't being processed"
echo "  - Check server logs for 'slug' in the changed fields list"
echo "  - Verify the slug field is being extracted from req.body correctly"
