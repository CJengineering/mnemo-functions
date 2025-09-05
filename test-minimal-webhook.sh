#!/bin/bash

echo "🔍 Testing webhook endpoint with minimal payload to isolate database issue"
echo "================================================================="

# Test with just the basic structure to see if it's a database issue
curl -X POST https://www.communityjameel.org/api/mnemo/create-collection-item \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: Mnemosyne-Webhook/1.0' \
  -d '{
    "action": "create",
    "collectionItem": {
      "id": "test-123",
      "title": "Test Item",
      "slug": "test-item",
      "type": "tag",
      "status": "published",
      "data": "{\"name\":\"Test\"}"
    }
  }' \
  -w "\n\nResponse Status: %{http_code}\n" \
  -s | jq '.'
