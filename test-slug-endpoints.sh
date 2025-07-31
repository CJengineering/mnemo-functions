# 🔍 GET Collection Item by Slug
echo "=== Testing GET by slug ==="
curl -X GET http://localhost:8080/api/collection-items/slug/dr-sarah-johnson \
  -H "Accept: application/json" \
  --verbose

echo -e "\n\n"

# 📝 UPDATE Collection Item by Slug
echo "=== Testing PUT by slug ==="
curl -X PUT http://localhost:8080/api/collection-items/slug/dr-sarah-johnson \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Dr. Sarah Johnson - Updated",
    "status": "published",
    "data": {
      "position": "Chief Technology Officer & AI Research Director",
      "paragraphDescription": "Dr. Sarah Johnson is a pioneering researcher in artificial intelligence and machine learning, leading breakthrough innovations in community-driven technology solutions. Recently promoted to oversee all AI research initiatives.",
      "order": 1,
      "filter": "Leadership",
      "newsOnOff": true,
      "photo": {
        "url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        "alt": "Dr. Sarah Johnson profile photo - updated"
      }
    }
  }' \
  --verbose

echo -e "\n\n"

# 🔍 GET Updated Collection Item by Slug to verify changes
echo "=== Verifying update by getting item again ==="
curl -X GET http://localhost:8080/api/collection-items/slug/dr-sarah-johnson \
  -H "Accept: application/json" \
  --verbose
