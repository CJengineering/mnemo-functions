#!/bin/bash

# Test DELETE webhook endpoint on Community Jameel website
echo "🧪 Testing Community Jameel DELETE webhook endpoint"
echo "================================================================="

# Test the DELETE endpoint specifically
echo "📝 Testing DELETE endpoint..."
curl -X POST https://www.communityjameel.org/api/mnemo/delete-collection-item \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: Mnemosyne-Webhook/1.0' \
  -d '{
    "action": "delete",
    "collectionItem": {
      "id": "test-delete-webhook-123",
      "title": "Test Delete Webhook Item",
      "slug": "test-delete-webhook-item", 
      "type": "tag",
      "status": "published",
      "data": "{\"name\":\"Test Delete Webhook Item\",\"nameArabic\":\"اختبار حذف العنصر\"}",
      "created_at": "2025-09-05T08:30:00.123Z",
      "updated_at": "2025-09-05T08:30:00.123Z"
    }
  }' \
  -w "\n\nResponse Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s | jq '.'

echo ""
echo "================================================================="
echo "🔍 DELETE ENDPOINT TEST RESULTS:"
echo ""
echo "Expected DELETE webhook implementation on Community Jameel side:"
echo ""
echo "🎯 ENDPOINT TO IMPLEMENT:"
echo "  POST /api/mnemo/delete-collection-item"
echo ""
echo "📦 EXPECTED PAYLOAD:"
echo '{'
echo '  "action": "delete",'
echo '  "collectionItem": {'
echo '    "id": "uuid",'
echo '    "title": "Item Title",'
echo '    "slug": "item-slug",'
echo '    "type": "tag|team|etc",'
echo '    "status": "published|draft",'
echo '    "data": "{...json string...}",'
echo '    "created_at": "ISO timestamp",'
echo '    "updated_at": "ISO timestamp"'
echo '  }'
echo '}'
echo ""
echo "🔧 IMPLEMENTATION NOTES:"
echo "  1. Use collectionItem.id or collectionItem.slug to identify item"
echo "  2. Delete corresponding record from Community Jameel database"
echo "  3. Return success response: { \"success\": true, \"message\": \"Item deleted\" }"
echo "  4. Handle case where item doesn't exist (already deleted)"
echo "  5. Clean up any related data (cache, CDN, etc.)"
echo ""
echo "💡 WEBHOOK SEQUENCE:"
echo "  1. User deletes item in mnemosyne"
echo "  2. mnemosyne captures item data before deletion"
echo "  3. mnemosyne deletes item from database"
echo "  4. mnemosyne sends DELETE webhook to Community Jameel"
echo "  5. Community Jameel deletes corresponding item"
echo "  6. Both databases stay synchronized"
