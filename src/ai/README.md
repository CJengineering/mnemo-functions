# AI Prompt-to-Collection Item System

## 🤖 Overview

This system allows users to create collection items using natural language prompts. Instead of manually filling complex forms, users can describe what they want to create, and AI will parse the description into structured data.

## 🔄 How It Works

```
User Prompt → AI Processing → Structured Data → Database Save
```

1. **User Input**: Natural language description
2. **AI Analysis**: ChatGPT extracts required fields
3. **Validation**: Check if all required fields are present
4. **Response**: Either success with data or error with missing fields
5. **Database**: Save to PostgreSQL if successful

## 📡 API Endpoints

### Production Endpoint

```
POST /api/prompt-to-item
```

**Request Body:**

```json
{
  "prompt": "Create a Climate Innovation Summit happening on September 15, 2025 in Dubai. It should be featured and run for 2 days.",
  "type": "event",
  "context": "This is a high-profile event for Community Jameel"
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "type": "event",
    "data": {
      "title": "Climate Innovation Summit",
      "slug": "climate-innovation-summit",
      "status": "published",
      "eventDate": "2025-09-15",
      "city": "Dubai",
      "featured": true
    }
  },
  "id": "database-generated-id"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Missing required information for event creation",
  "missing": ["eventDate", "city"],
  "suggestions": [
    "Please specify when this event will take place",
    "Please mention the city or location where this will happen"
  ],
  "partialData": {
    "title": "Some Event",
    "status": "draft"
  }
}
```

### Demo Endpoint

```
POST /api/prompt-to-item/demo
```

Same format as production but doesn't save to database.

## 🎯 Supported Collection Types

### Events

**Keywords**: event, conference, workshop, meeting, summit
**Required Fields**: title, slug, eventDate, city, status

### Posts

**Keywords**: blog, post, article, write
**Required Fields**: title, slug, datePublished, status

### News

**Keywords**: news, announcement, press, breaking
**Required Fields**: title, slug, datePublished, status

### Programmes

**Keywords**: programme, program, initiative, project
**Required Fields**: title, slug, status

### Sources

**Keywords**: source, publication, journal, magazine
**Required Fields**: title, slug, status

## 💬 Example Prompts

### Event Examples

```
"Create a Climate Innovation Summit happening on September 15, 2025 in Dubai"
"Schedule a workshop on AI applications for healthcare next month in Abu Dhabi"
"Plan a technology conference for December 2025, make it featured"
```

### Blog Post Examples

```
"Write a blog post about sustainable energy innovations, publish it on August 1st"
"Create a technical article on machine learning in healthcare"
"Draft a post about urban planning trends, make it featured"
```

### News Examples

```
"Breaking news: MIT researchers achieve 40% improvement in solar panel efficiency"
"Create a news article about the new research collaboration announced today"
"Write about the recent breakthrough in quantum computing"
```

## 🔧 Configuration

### Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### System Prompts

Each collection type has a specific system prompt that:

- Defines required and optional fields
- Provides formatting guidelines
- Explains response structure
- Gives examples

## 🚨 Error Handling

### Common Scenarios

1. **Missing Required Fields**

   - AI identifies what's missing
   - Provides specific suggestions
   - Returns partial data if available

2. **Invalid Prompts**

   - Too short prompts (< 10 characters)
   - Unclear descriptions
   - Conflicting information

3. **API Errors**
   - OpenAI API key missing/invalid
   - Rate limiting
   - Network issues

### Response Codes

- `201` - Success (item created)
- `400` - Missing fields or invalid input
- `500` - Server/API errors

## 🧪 Testing

### Core Functionality Test

```bash
node test-ai-core.js
```

### Integration Tests

```bash
node test-ai-prompts.js
```

### Manual Testing

```bash
curl -X POST http://localhost:8080/api/prompt-to-item/demo \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a tech summit on AI innovations in Dubai next year",
    "type": "event"
  }'
```

## 🔄 Integration with Existing System

The AI system integrates seamlessly with the existing mapper system:

```
Prompt → AI → IncomingCollectionItem → Mapper → Database Format → PostgreSQL
```

1. AI converts prompt to `IncomingCollectionItem` format
2. Existing mapper transforms to collection item
3. Database formatter prepares for PostgreSQL
4. Standard database insertion process

## 🎨 Frontend Integration

### Simple Form

```html
<form id="aiForm">
  <textarea
    name="prompt"
    placeholder="Describe what you want to create..."
    required
  ></textarea>
  <select name="type">
    <option value="">Auto-detect</option>
    <option value="event">Event</option>
    <option value="post">Blog Post</option>
    <option value="news">News</option>
    <option value="programme">Programme</option>
  </select>
  <button type="submit">Create with AI</button>
</form>

<script>
  document.getElementById("aiForm").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch("/api/prompt-to-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: formData.get("prompt"),
        type: formData.get("type") || undefined,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Created:", result.id);
    } else {
      console.log("Missing:", result.missing);
      console.log("Suggestions:", result.suggestions);
    }
  };
</script>
```

### Advanced with Error Handling

```javascript
async function createWithAI(prompt, type, context) {
  try {
    const response = await fetch("/api/prompt-to-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, type, context }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, id: result.id, data: result.data };
    } else {
      // Handle missing fields
      return {
        success: false,
        missing: result.missing,
        suggestions: result.suggestions,
        partialData: result.partialData,
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 🔐 Security & Privacy

- All prompts are sent to OpenAI for processing
- No sensitive data should be included in prompts
- API key is stored securely in environment variables
- Rate limiting applies based on OpenAI plan

## 📈 Performance

- Average response time: 2-5 seconds
- Depends on OpenAI API latency
- Cached responses for common patterns (future enhancement)
- Async processing for better UX

## 🚀 Future Enhancements

1. **Caching**: Cache common prompt patterns
2. **Learning**: Improve prompts based on usage
3. **Multi-language**: Support Arabic prompts
4. **Batch Processing**: Multiple items from one prompt
5. **Image Analysis**: Extract data from uploaded images
6. **Voice Input**: Convert speech to text to prompts

This AI system provides a powerful, user-friendly way to create structured content using natural language! 🎉
