#!/bin/bash

# Test UPDATE webhook endpoint with exact payload format that mnemosyne functions send

echo "🧪 Testing Community Jameel UPDATE webhook endpoint"
echo "================================================================="

# Test the UPDATE endpoint specifically
echo "📝 Testing UPDATE endpoint..."
curl -X POST https://www.communityjameel.org/api/mnemo/update-collection \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: Mnemosyne-Webhook/1.0' \
  -d '{
    "action": "update",
    "collectionItem": {
      "id": "68ba978900029be327ec4e23",
      "title": "Tim Hyuk Updated",
      "slug": "tim-hyuk", 
      "type": "team",
      "status": "published",
      "data": "{\"name\":\"Tim Hyuk Updated\",\"nameArabic\":\"تيم هيوك محدث\",\"position\":\"Updated Position\",\"positionArabic\":\"منصب محدث\",\"photo\":{\"url\":\"https://example.com/tim-hyuk.jpg\",\"alt\":\"Tim Hyuk photo\"},\"photoHires\":\"https://example.com/tim-hyuk-hires.jpg\",\"altTextImage\":\"Professional headshot of Tim Hyuk\",\"altTextImageArabic\":\"صورة شخصية مهنية لتيم هيوك\",\"paragraphDescription\":\"Updated description for Tim Hyuk\",\"biographyArabic\":\"وصف محدث لتيم هيوك\",\"metaDescription\":\"Updated meta description\",\"metaDescriptionArabic\":\"وصف محدث\",\"filter\":\"Team\",\"order\":1,\"newsOnOff\":true,\"tags\":[]}",
      "created_at": "2025-09-03T14:15:30.123Z",
      "updated_at": "2025-09-05T07:55:50.123Z"
    }
  }' \
  -w "\n\nResponse Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s | jq '.'

echo ""
echo "================================================================="

# Compare with CREATE endpoint (which works)
echo ""
echo "📝 Testing CREATE endpoint for comparison..."
curl -X POST https://www.communityjameel.org/api/mnemo/create-collection-item \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: Mnemosyne-Webhook/1.0' \
  -d '{
    "action": "create",
    "collectionItem": {
      "id": "test-create-comparison-123",
      "title": "Test Create Comparison",
      "slug": "test-create-comparison", 
      "type": "team",
      "status": "published",
      "data": "{\"name\":\"Test Create Comparison\",\"nameArabic\":\"اختبار مقارنة الإنشاء\",\"position\":\"Test Position\",\"positionArabic\":\"منصب تجريبي\",\"photo\":{\"url\":\"https://example.com/test.jpg\",\"alt\":\"Test photo\"},\"photoHires\":\"https://example.com/test-hires.jpg\",\"altTextImage\":\"Test image\",\"altTextImageArabic\":\"صورة تجريبية\",\"paragraphDescription\":\"Test description\",\"biographyArabic\":\"وصف تجريبي\",\"metaDescription\":\"Test meta\",\"metaDescriptionArabic\":\"وصف تجريبي\",\"filter\":\"Team\",\"order\":1,\"newsOnOff\":true,\"tags\":[]}",
      "created_at": "2025-09-05T08:00:00.123Z",
      "updated_at": "2025-09-05T08:00:00.123Z"
    }
  }' \
  -w "\n\nResponse Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s | jq '.'

echo ""
echo "================================================================="
echo "🔍 COMPARISON RESULTS:"
echo "  - If CREATE works (200/201) but UPDATE fails (500), the issue is:"
echo "    1. UPDATE endpoint doesn't exist or has different requirements"
echo "    2. UPDATE endpoint expects different payload structure"
echo "    3. UPDATE endpoint has database/logic issues"
echo ""
echo "💡 DEBUGGING STEPS:"
echo "  1. Check if /api/mnemo/update-collection endpoint exists"
echo "  2. Compare CREATE vs UPDATE endpoint implementations"
echo "  3. Check UPDATE endpoint error logs on Community Jameel side"
echo "  4. Verify UPDATE endpoint accepts same payload structure as CREATE"
