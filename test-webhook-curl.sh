#!/bin/bash

# Test webhook endpoint with exact payload format that mnemosyne functions send

echo "🧪 Testing Community Jameel webhook endpoint with exact mnemosyne payload format"
echo "================================================================="

# Test the exact payload structure that the webhook service sends
curl -X POST https://www.communityjameel.org/api/mnemo/create-collection-item \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: Mnemosyne-Webhook/1.0' \
  -d '{
    "action": "create",
    "collectionItem": {
      "id": "46885c08-5361-4460-9ff5-a195ad931421",
      "title": "Jane Smith Webhook Test",
      "slug": "jane-smith-webhook-test", 
      "type": "team",
      "status": "published",
      "data": "{\"name\":\"Jane Smith Webhook Test\",\"nameArabic\":\"جين سميث اختبار\",\"position\":\"Test Position\",\"positionArabic\":\"منصب تجريبي\",\"photo\":{\"url\":\"https://example.com/jane-smith.jpg\",\"alt\":\"Jane Smith photo\"},\"photoHires\":\"https://example.com/jane-smith-hires.jpg\",\"altTextImage\":\"Professional headshot of Jane Smith\",\"altTextImageArabic\":\"صورة شخصية مهنية لجين سميث\",\"paragraphDescription\":\"Test description for Jane Smith\",\"biographyArabic\":\"وصف تجريبي لجين سميث\",\"metaDescription\":\"Test meta description\",\"metaDescriptionArabic\":\"وصف تجريبي\",\"filter\":\"Team\",\"order\":1,\"newsOnOff\":true,\"tags\":[]}",
      "created_at": "2025-09-03T14:15:30.123Z",
      "updated_at": "2025-09-03T14:15:30.123Z"
    }
  }' \
  -w "\n\nResponse Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s | jq '.'

echo ""
echo "================================================================="
echo "✅ This should match the exact webhook payload structure"
echo "🔍 Compare this result with your webhook logs in Vercel"
echo ""
echo "If this works but webhook fails, the issue is likely:"
echo "  1. Headers (User-Agent, etc.)"  
echo "  2. Request timing/timeout"
echo "  3. CORS issues"
echo "  4. Body parsing differences"
