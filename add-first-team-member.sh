#!/bin/bash

# 🧑‍💼 Add First Team Member - Dr. Sarah Johnson
# Testing our newly integrated team mapper functionality

echo "🚀 Adding first team member..."
echo "Using endpoint: POST /api/collection-items"
echo "Format: IncomingCollectionItem with team type"
echo ""

# Localhost endpoint (development)
ENDPOINT="http://localhost:8080/api/collection-items"

# Production endpoint (uncomment when ready to test production)
# ENDPOINT="https://your-production-url.com/api/collection-items"

curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "type": "team",
    "data": {
      "title": "Dr. Sarah Johnson",
      "slug": "dr-sarah-johnson",
      "status": "published",
      "name": "Sarah Johnson",
      "nameArabic": "سارة جونسون",
      "position": "Chief Technology Officer",
      "positionArabic": "كبير موظفي التكنولوجيا",
      "paragraphDescription": "Dr. Sarah Johnson is a pioneering researcher in artificial intelligence and machine learning, leading breakthrough innovations in community-driven technology solutions.",
      "biographyArabic": "الدكتورة سارة جونسون باحثة رائدة في الذكاء الاصطناعي والتعلم الآلي، تقود الابتكارات الرائدة في حلول التكنولوجيا المجتمعية.",
      "metaDescription": "CTO and AI research leader at Community Jameel",
      "metaDescriptionArabic": "كبير موظفي التكنولوجيا وقائد أبحاث الذكاء الاصطناعي في مجتمع جميل",
      "altTextImage": "Professional headshot of Dr. Sarah Johnson",
      "altTextImageArabic": "صورة مهنية للدكتورة سارة جونسون",
      "filter": "Leadership",
      "order": 1,
      "newsOnOff": true,
      "photo": {
        "url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        "alt": "Dr. Sarah Johnson profile photo"
      },
      "photoHires": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=800&fit=crop&crop=face",
      "tags": [
        { "id": "tag-ai", "slug": "artificial-intelligence" },
        { "id": "tag-leadership", "slug": "leadership" },
        { "id": "tag-research", "slug": "research" }
      ]
    }
  }' \
  --verbose

echo ""
echo "✅ Team member creation request sent!"
echo ""
echo "Expected response structure:"
echo "{"
echo '  "success": true,'
echo '  "collectionItem": {'
echo '    "id": "generated-uuid",'
echo '    "title": "Dr. Sarah Johnson",'
echo '    "type": "team",'
echo '    "status": "published",'
echo '    "slug": "dr-sarah-johnson",'
echo '    "data": { ... },'
echo '    "created_at": "timestamp",'
echo '    "updated_at": "timestamp"'
echo "  }"
echo "}"
