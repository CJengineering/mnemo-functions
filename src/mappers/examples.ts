/**
 * Example usage of the Collection Item Mapper System
 *
 * This file demonstrates how to use the mapper functions to transform
 * frontend form data into the correct database format.
 */

import {
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
  IncomingCollectionItem,
  IncomingEventData,
  IncomingNewsData,
  IncomingPostData,
} from "./index";

// Example 1: Creating an Event from Frontend Form Data
function createEventExample() {
  console.log("=== Event Creation Example ===");

  // This is what your frontend would send
  const frontendEventData: IncomingCollectionItem = {
    type: "event",
    data: {
      title: "AI Innovation Summit 2025",
      description: "A summit about AI innovations",
      slug: "ai-innovation-summit-2025",
      status: "published",

      // Event specific fields
      arabicTitle: "قمة الابتكار في الذكاء الاصطناعي 2025",
      eventDate: "2025-09-15",
      endDate: "2025-09-17",
      time: "09:00 AM",
      city: "Dubai",
      address: "Dubai World Trade Centre",

      // Media
      thumbnail: {
        url: "https://example.com/ai-summit-thumb.jpg",
        alt: "AI Summit thumbnail",
      },
      heroImage: {
        url: "https://example.com/ai-summit-hero.jpg",
        alt: "AI Summit hero image",
      },

      // Relations
      programmeLabel: {
        id: "ai-programme-1",
        slug: "artificial-intelligence",
      },
      tags: [
        { id: "tag-ai", slug: "artificial-intelligence" },
        { id: "tag-innovation", slug: "innovation" },
      ],

      // Flags
      featured: true,
      pushToGR: true,

      // Contact
      rsvpLink: "https://events.example.com/rsvp/ai-summit",
      contactDetails: "contact@example.com",
    } as IncomingEventData,
  };

  // Transform using mapper
  const mappedEvent = mapIncomingCollectionItem(frontendEventData);
  const dbFormat = collectionItemToDbFormat(mappedEvent);

  console.log("Frontend Data:", JSON.stringify(frontendEventData, null, 2));
  console.log("Mapped Event:", JSON.stringify(mappedEvent, null, 2));
  console.log("Database Format:", JSON.stringify(dbFormat, null, 2));

  return dbFormat;
}

// Example 2: Creating a News Item from Frontend Form Data
function createNewsExample() {
  console.log("\n=== News Creation Example ===");

  const frontendNewsData: IncomingCollectionItem = {
    type: "news",
    data: {
      title: "Breakthrough in Renewable Energy Research",
      slug: "renewable-energy-breakthrough",
      status: "published",

      // News specific fields
      arabicTitle: "اختراق في أبحاث الطاقة المتجددة",
      summary: "Scientists achieve 50% efficiency in solar panels",
      externalLink: "https://news.example.com/renewable-breakthrough",
      datePublished: "2025-07-01",

      // Required relations for news
      sources: { id: "source-nature", slug: "nature-journal" },
      programmeLabel: { id: "energy-prog", slug: "clean-energy" },
      relatedProgrammes: [
        { id: "solar-prog", slug: "solar-research" },
        { id: "sustain-prog", slug: "sustainability" },
      ],

      // Media
      thumbnail: {
        url: "https://example.com/solar-news-thumb.jpg",
        alt: "Solar panel research",
      },

      // Optional relations
      people: [{ id: "scientist-1", slug: "dr-sarah-ahmed" }],
      tags: [
        { id: "tag-solar", slug: "solar-energy" },
        { id: "tag-research", slug: "research" },
      ],

      // Flags
      featured: true,
      pushToGR: false,
    } as IncomingNewsData,
  };

  const mappedNews = mapIncomingCollectionItem(frontendNewsData);
  const dbFormat = collectionItemToDbFormat(mappedNews);

  console.log("Database Format:", JSON.stringify(dbFormat, null, 2));

  return dbFormat;
}

// Example 3: Creating a Blog Post from Frontend Form Data
function createPostExample() {
  console.log("\n=== Blog Post Creation Example ===");

  const frontendPostData: IncomingCollectionItem = {
    type: "post",
    data: {
      title: "The Future of Sustainable Cities",
      slug: "future-sustainable-cities",
      status: "draft",

      // Post specific fields
      arabicTitle: "مستقبل المدن المستدامة",
      datePublished: "2025-07-15",
      location: "MIT Campus",

      // SEO (required for posts)
      seoTitle: "Sustainable Cities: Building Tomorrow's Urban Environments",
      seoMeta:
        "Explore innovative approaches to sustainable urban development and smart city technologies.",

      // Content
      bodyEnglish:
        "As urbanization accelerates globally, the need for sustainable city planning has never been more critical...",
      bodyArabic:
        "مع تسارع التحضر عالمياً، لم تكن الحاجة إلى التخطيط المستدام للمدن أكثر أهمية من أي وقت مضى...",

      // Required media for posts
      thumbnail: {
        url: "https://example.com/sustainable-city-thumb.jpg",
        alt: "Sustainable city thumbnail",
      },
      mainImage: {
        url: "https://example.com/sustainable-city-main.jpg",
        alt: "Futuristic sustainable city",
      },
      openGraphImage: {
        url: "https://example.com/sustainable-city-og.jpg",
        alt: "Sustainable city social share",
      },

      // Relations
      programmeLabel: { id: "urban-prog", slug: "urban-planning" },
      tags: [
        { id: "tag-sustainability", slug: "sustainability" },
        { id: "tag-urban", slug: "urban-development" },
      ],
      blogCategory: { id: "cat-research", slug: "research-insights" },

      // Image gallery
      imageCarousel: [
        {
          url: "https://example.com/gallery1.jpg",
          alt: "Smart traffic system",
        },
        {
          url: "https://example.com/gallery2.jpg",
          alt: "Green building architecture",
        },
      ],
      imageGalleryCredits: "Photos courtesy of Urban Planning Institute",

      // Flags
      featured: false,
      videoAsHero: false,
    } as IncomingPostData,
  };

  const mappedPost = mapIncomingCollectionItem(frontendPostData);
  const dbFormat = collectionItemToDbFormat(mappedPost);

  console.log("Database Format:", JSON.stringify(dbFormat, null, 2));

  return dbFormat;
}

// Example 4: Handling Validation Errors
function validationExample() {
  console.log("\n=== Validation Example ===");

  try {
    // This should throw an error due to unknown type
    const invalidData = {
      type: "unknown_type",
      data: {
        title: "Invalid Item",
      },
    } as any;

    mapIncomingCollectionItem(invalidData);
  } catch (error) {
    console.log("Caught validation error:", (error as Error).message);
  }
}

// Example 5: Complete Integration Workflow
function completeWorkflowExample() {
  console.log("\n=== Complete Integration Workflow ===");

  // Simulate receiving data from frontend form
  const formData = {
    type: "programme",
    data: {
      title: "Climate Innovation Lab",
      slug: "climate-innovation-lab",
      status: "published",
      nameArabic: "مختبر الابتكار المناخي",
      missionEnglish:
        "Developing breakthrough technologies for climate solutions",
      yearEstablished: 2023,
      headquartersEnglish: "MIT Climate Portal",
      website: "https://climate.mit.edu",
      lab: true,
      order: 1,
    },
  };

  console.log("1. Received from frontend:", JSON.stringify(formData, null, 2));

  // Map to collection item format
  const mapped = mapIncomingCollectionItem(formData as IncomingCollectionItem);
  console.log("2. Mapped to collection item format");

  // Convert to database format
  const dbFormat = collectionItemToDbFormat(mapped);
  console.log("3. Converted to database format");

  // This is what you would insert into your database
  console.log("4. Ready for database insertion:", {
    title: dbFormat.title,
    slug: dbFormat.slug,
    type: dbFormat.type,
    status: dbFormat.status,
    dataSize: JSON.stringify(dbFormat.data).length + " characters",
  });

  return dbFormat;
}

// Run examples
if (require.main === module) {
  createEventExample();
  createNewsExample();
  createPostExample();
  validationExample();
  completeWorkflowExample();
}

export {
  createEventExample,
  createNewsExample,
  createPostExample,
  validationExample,
  completeWorkflowExample,
};
