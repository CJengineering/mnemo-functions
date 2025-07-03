# Collection Item Mapper System

## Overview

This mapper system transforms frontend form data into the correct database format for collection items. It bridges the gap between what your frontend sends and what your database expects.

## 🎯 What Problem It Solves

**Before**: Frontend would need to know the exact database schema and handle complex transformations
**After**: Frontend sends simple, structured data and the mapper handles all transformations

## 📁 File Structure

```
src/mappers/
├── index.ts                           # Main exports
├── incomingInterfaces.ts             # Frontend form interfaces
├── collectionItemMapper.ts           # Transformation logic
├── examples.ts                       # Usage examples
└── __tests__/
    └── collectionItemMapper.test.ts  # Comprehensive tests
```

## 🔄 Data Flow

```
Frontend Form Data → Incoming Interface → Mapper → Collection Item → Database Format
```

1. **Frontend Form Data**: Simple form fields from your UI
2. **Incoming Interface**: TypeScript interfaces that validate incoming data
3. **Mapper**: Transforms data structure and adds defaults
4. **Collection Item**: Matches your interface.ts definitions
5. **Database Format**: Ready for PostgreSQL insertion

## 🚀 Quick Start

### 1. Import the mapper

```typescript
import { mapIncomingCollectionItem, collectionItemToDbFormat } from "./mappers";
```

### 2. Use in your Express route

```typescript
app.post("/api/collection-items/form", async (req, res) => {
  try {
    // Frontend sends this format
    const incomingData = req.body; // { type: "event", data: { title: "...", ... } }

    // Transform using mapper
    const mappedItem = mapIncomingCollectionItem(incomingData);
    const dbFormat = collectionItemToDbFormat(mappedItem);

    // Insert into database
    const result = await pool.query(
      `INSERT INTO collection_item (title, description, type, data, meta_data, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        dbFormat.title,
        dbFormat.description,
        dbFormat.type,
        dbFormat.data,
        dbFormat.metaData,
        dbFormat.status,
      ]
    );

    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 📝 Supported Collection Types

### 1. Events (`type: "event"`)

```typescript
{
  type: "event",
  data: {
    title: "AI Summit 2025",
    slug: "ai-summit-2025",
    eventDate: "2025-09-15",
    city: "Dubai",
    featured: true,
    // ... more fields
  }
}
```

### 2. News (`type: "news"`)

```typescript
{
  type: "news",
  data: {
    title: "Breakthrough Research",
    slug: "breakthrough-research",
    externalLink: "https://news.example.com/article",
    datePublished: "2025-07-01",
    sources: { id: "source-1", slug: "nature" },
    // ... more fields
  }
}
```

### 3. Posts (`type: "post"`)

```typescript
{
  type: "post",
  data: {
    title: "Technical Blog Post",
    slug: "technical-blog",
    seoTitle: "SEO Title",
    seoMeta: "SEO Description",
    thumbnail: { url: "...", alt: "..." },
    mainImage: { url: "...", alt: "..." },
    // ... more fields
  }
}
```

### 4. Programmes (`type: "programme"`)

```typescript
{
  type: "programme",
  data: {
    title: "Climate Innovation Lab",
    slug: "climate-lab",
    missionEnglish: "Mission statement",
    yearEstablished: 2023,
    // ... more fields
  }
}
```

### 5. Sources (`type: "source"`)

```typescript
{
  type: "source",
  data: {
    title: "Reuters",
    slug: "reuters",
    nameArabic: "رويترز",
    logo: { url: "...", alt: "..." },
    // ... more fields
  }
}
```

## 🔧 Key Features

### ✅ **Type Safety**

- Full TypeScript support
- Compile-time validation
- IntelliSense support

### ✅ **Automatic Defaults**

- Generates UUIDs
- Sets timestamps
- Applies status mappings (`published` → `active`, `draft` → `inactive`)

### ✅ **Flexible Validation**

- Required field validation per type
- Optional field handling
- Graceful fallbacks

### ✅ **Status Mapping**

- Interface status: `"published" | "draft"`
- Database status: `"active" | "inactive" | "archived"`
- Automatic conversion

### ✅ **Comprehensive Testing**

- 12 test cases covering all scenarios
- Integration tests
- Error handling tests

## 🎨 Frontend Integration

Your frontend forms can be much simpler now:

```html
<!-- Event Form Example -->
<form id="eventForm">
  <input name="title" placeholder="Event Title" required />
  <input name="slug" placeholder="event-slug" required />
  <input name="eventDate" type="date" />
  <input name="city" placeholder="City" />
  <textarea name="description" placeholder="Description"></textarea>
  <input name="featured" type="checkbox" />
  <button type="submit">Create Event</button>
</form>

<script>
  document.getElementById("eventForm").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      type: "event",
      data: Object.fromEntries(formData),
    };

    const response = await fetch("/api/collection-items/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Created:", result);
  };
</script>
```

## 🧪 Testing

Run the tests:

```bash
npm test src/mappers/__tests__/collectionItemMapper.test.ts
```

All tests are passing:

- ✅ Event mapping
- ✅ Programme mapping
- ✅ News mapping
- ✅ Post mapping
- ✅ Source mapping
- ✅ Error handling
- ✅ Database format conversion
- ✅ Integration workflow

## 📖 Examples

See `src/mappers/examples.ts` for complete working examples of:

- Creating events
- Creating news items
- Creating blog posts
- Error handling
- Complete integration workflow

## 🔄 Migration from Old System

If you have existing code using the old `createCollectionItem` function, you can gradually migrate:

1. **Keep old function** for backward compatibility
2. **Add new function** `createCollectionItemFromForm` for new frontend
3. **Update frontend** to use new format
4. **Remove old function** when ready

## 🚨 Error Handling

The mapper includes comprehensive error handling:

```typescript
try {
  const mappedItem = mapIncomingCollectionItem(incomingData);
} catch (error) {
  if (error.message.includes("Unknown collection item type")) {
    // Handle invalid type
  }
  // Handle other validation errors
}
```

## 🔗 Integration Points

1. **Express Routes**: Use in your API endpoints
2. **Frontend Forms**: Send structured data
3. **Database**: Automatic format conversion
4. **Testing**: Comprehensive test coverage
5. **CI/CD**: Already integrated with your pipeline

This system makes your collection item creation process much more maintainable and type-safe! 🎉
