import {
  mapIncomingEventToCollectionItem,
  mapIncomingProgrammeToCollectionItem,
  mapIncomingNewsToCollectionItem,
  mapIncomingPostToCollectionItem,
  mapIncomingSourceToCollectionItem,
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
} from "../collectionItemMapper";

import {
  IncomingEventData,
  IncomingProgrammeData,
  IncomingNewsData,
  IncomingPostData,
  IncomingSourceData,
  IncomingCollectionItem,
} from "../incomingInterfaces";

// Mock crypto.randomUUID for consistent testing
const mockUUID = "test-uuid-123";
global.crypto = {
  randomUUID: () => mockUUID,
} as any;

// Mock Date for consistent testing
const mockDate = "2025-07-03T10:00:00.000Z";
const originalDate = Date;
global.Date = class extends originalDate {
  constructor() {
    super();
    return new originalDate(mockDate);
  }
  static now() {
    return new originalDate(mockDate).getTime();
  }
  toISOString() {
    return mockDate;
  }
} as any;

describe("Collection Item Mappers", () => {
  describe("Event Mapper", () => {
    it("should map incoming event data to CollectionItemEvent format", () => {
      const incomingEvent: IncomingEventData = {
        title: "Test Event",
        description: "A test event description",
        slug: "test-event",
        status: "published",
        arabicTitle: "حدث تجريبي",
        eventDate: "2025-08-01",
        endDate: "2025-08-02",
        city: "Dubai",
        address: "Dubai World Trade Centre",
        featured: true,
        thumbnail: {
          url: "https://example.com/thumb.jpg",
          alt: "Event thumbnail",
        },
        heroImage: {
          url: "https://example.com/hero.jpg",
          alt: "Event hero image",
        },
        programmeLabel: {
          id: "prog-1",
          slug: "test-programme",
        },
        tags: [
          { id: "tag-1", slug: "innovation" },
          { id: "tag-2", slug: "technology" },
        ],
      };

      const result = mapIncomingEventToCollectionItem(incomingEvent);

      expect(result).toEqual({
        id: mockUUID,
        type: "event",
        status: "published",
        slug: "test-event",
        title: "Test Event",
        created_at: mockDate,
        updated_at: mockDate,
        data: {
          pushToGR: undefined,
          programmeLabel: { id: "prog-1", slug: "test-programme" },
          relatedProgrammes: undefined,
          videoAsHero: undefined,
          thumbnail: {
            url: "https://example.com/thumb.jpg",
            alt: "Event thumbnail",
          },
          heroImage: {
            url: "https://example.com/hero.jpg",
            alt: "Event hero image",
          },
          openGraphImage: {
            url: "https://example.com/hero.jpg",
            alt: "Event hero image",
          },
          featured: true,
          arabicTitle: "حدث تجريبي",
          seoMetaDescription: undefined,
          seoTitle: undefined,
          teaserText: undefined,
          shortDescription: undefined,
          eventDate: "2025-08-01",
          endDate: "2025-08-02",
          time: undefined,
          city: "Dubai",
          address: "Dubai World Trade Centre",
          locationLink: undefined,
          livestreamLink: undefined,
          attendanceType: undefined,
          contactDetails: undefined,
          rsvpLink: undefined,
          mainVideo: undefined,
          tags: [
            { id: "tag-1", slug: "innovation" },
            { id: "tag-2", slug: "technology" },
          ],
          relatedPeople: undefined,
        },
      });
    });

    it("should handle minimal event data with defaults", () => {
      const minimalEvent: IncomingEventData = {
        title: "Minimal Event",
        slug: "minimal-event",
      };

      const result = mapIncomingEventToCollectionItem(minimalEvent);

      expect(result.status).toBe("draft"); // default status
      expect(result.title).toBe("Minimal Event");
      expect(result.slug).toBe("minimal-event");
      expect(result.id).toBe(mockUUID);
    });
  });

  describe("Programme Mapper", () => {
    it("should map incoming programme data to CollectionItemProgramme format", () => {
      const incomingProgramme: IncomingProgrammeData = {
        title: "Test Programme",
        description: "A test programme",
        slug: "test-programme",
        status: "published",
        nameArabic: "برنامج تجريبي",
        missionEnglish: "To advance technology",
        yearEstablished: 2020,
        headquartersEnglish: "MIT",
        website: "https://example.com",
        lab: true,
        order: 1,
        logoSvgDark: {
          url: "https://example.com/logo-dark.svg",
          alt: "Dark logo",
        },
        partners: [{ id: "partner-1", slug: "partner-org" }],
      };

      const result = mapIncomingProgrammeToCollectionItem(incomingProgramme);

      expect(result.type).toBe("programme");
      expect(result.title).toBe("Test Programme");
      expect(result.data.nameArabic).toBe("برنامج تجريبي");
      expect(result.data.missionEnglish).toBe("To advance technology");
      expect(result.data.yearEstablished).toBe(2020);
      expect(result.data.lab).toBe(true);
      expect(result.data.order).toBe(1);
      expect(result.data.partners).toEqual([
        { id: "partner-1", slug: "partner-org" },
      ]);
    });
  });

  describe("News Mapper", () => {
    it("should map incoming news data to CollectionItemNews format", () => {
      const incomingNews: IncomingNewsData = {
        title: "Breaking News",
        slug: "breaking-news",
        status: "published",
        externalLink: "https://news.example.com/article",
        datePublished: "2025-07-01",
        sources: { id: "source-1", slug: "reuters" },
        programmeLabel: { id: "prog-1", slug: "tech-programme" },
        relatedProgrammes: [{ id: "prog-2", slug: "ai-programme" }],
        featured: true,
        summary: "Important technology breakthrough",
        thumbnail: {
          url: "https://example.com/news-thumb.jpg",
          alt: "News thumbnail",
        },
      };

      const result = mapIncomingNewsToCollectionItem(incomingNews);

      expect(result.type).toBe("news");
      expect(result.title).toBe("Breaking News");
      expect(result.data.externalLink).toBe("https://news.example.com/article");
      expect(result.data.datePublished).toBe("2025-07-01");
      expect(result.data.sources).toEqual({ id: "source-1", slug: "reuters" });
      expect(result.data.programmeLabel).toEqual({
        id: "prog-1",
        slug: "tech-programme",
      });
      expect(result.data.featured).toBe(true);
    });
  });

  describe("Post Mapper", () => {
    it("should map incoming post data to CollectionItemPost format", () => {
      const incomingPost: IncomingPostData = {
        title: "Technical Blog Post",
        slug: "technical-blog-post",
        status: "published",
        datePublished: "2025-07-01",
        seoTitle: "SEO Title",
        seoMeta: "SEO description",
        bodyEnglish: "Post content in English",
        thumbnail: {
          url: "https://example.com/post-thumb.jpg",
          alt: "Post thumbnail",
        },
        mainImage: {
          url: "https://example.com/post-main.jpg",
          alt: "Main image",
        },
        openGraphImage: {
          url: "https://example.com/post-og.jpg",
          alt: "Open graph image",
        },
        featured: true,
        tags: [{ id: "tag-1", slug: "tech" }],
      };

      const result = mapIncomingPostToCollectionItem(incomingPost);

      expect(result.type).toBe("post");
      expect(result.title).toBe("Technical Blog Post");
      expect(result.data.datePublished).toBe("2025-07-01");
      expect(result.data.seoTitle).toBe("SEO Title");
      expect(result.data.bodyEnglish).toBe("Post content in English");
      expect(result.data.thumbnail).toEqual({
        url: "https://example.com/post-thumb.jpg",
        alt: "Post thumbnail",
      });
      expect(result.data.featured).toBe(true);
    });
  });

  describe("Source Mapper", () => {
    it("should map incoming source data to CollectionItemSource format", () => {
      const incomingSource: IncomingSourceData = {
        title: "Reuters",
        slug: "reuters",
        status: "published",
        nameArabic: "رويترز",
        shortNameEnglish: "Reuters",
        logo: {
          url: "https://example.com/reuters-logo.jpg",
          alt: "Reuters logo",
        },
      };

      const result = mapIncomingSourceToCollectionItem(incomingSource);

      expect(result.type).toBe("source");
      expect(result.title).toBe("Reuters");
      expect(result.data.nameArabic).toBe("رويترز");
      expect(result.data.shortNameEnglish).toBe("Reuters");
      expect(result.data.logo).toEqual({
        url: "https://example.com/reuters-logo.jpg",
        alt: "Reuters logo",
      });
    });
  });

  describe("Main Mapper Function", () => {
    it("should route to correct mapper based on type", () => {
      const incomingEvent: IncomingCollectionItem = {
        type: "event",
        data: {
          title: "Test Event",
          slug: "test-event",
        } as IncomingEventData,
      };

      const result = mapIncomingCollectionItem(incomingEvent);
      expect(result.type).toBe("event");
      expect(result.title).toBe("Test Event");
    });

    it("should throw error for unknown type", () => {
      const invalidItem = {
        type: "unknown",
        data: {},
      } as any;

      expect(() => mapIncomingCollectionItem(invalidItem)).toThrow(
        "Unknown collection item type: unknown"
      );
    });
  });

  describe("Database Format Converter", () => {
    it("should convert mapped collection item to database format", () => {
      const mappedEvent = {
        id: "test-id",
        type: "event",
        status: "published",
        slug: "test-event",
        title: "Test Event",
        created_at: mockDate,
        updated_at: mockDate,
        data: {
          featured: true,
          eventDate: "2025-08-01",
        },
      };

      const dbFormat = collectionItemToDbFormat(mappedEvent);

      expect(dbFormat).toEqual({
        title: "Test Event",
        description: null,
        type: "event",
        data: JSON.stringify({
          featured: true,
          eventDate: "2025-08-01",
        }),
        metaData: JSON.stringify({
          slug: "test-event",
          status: "published",
          created_at: mockDate,
          updated_at: mockDate,
        }),
        status: "active", // published maps to active
      });
    });

    it("should map draft status to inactive", () => {
      const mappedItem = {
        type: "event",
        status: "draft",
        title: "Draft Event",
        data: {},
      };

      const dbFormat = collectionItemToDbFormat(mappedItem);
      expect(dbFormat.status).toBe("inactive");
    });

    it("should handle description fallbacks", () => {
      const mappedItem = {
        type: "news",
        title: "News Item",
        data: {
          summary: "News summary",
        },
      };

      const dbFormat = collectionItemToDbFormat(mappedItem);
      expect(dbFormat.description).toBe("News summary");
    });
  });
});

describe("Integration Test", () => {
  it("should handle complete flow from incoming data to database format", () => {
    const incomingData: IncomingCollectionItem = {
      type: "event",
      data: {
        title: "Complete Integration Event",
        description: "Full test event",
        slug: "integration-event",
        status: "published",
        eventDate: "2025-12-01",
        city: "Dubai",
        featured: true,
        thumbnail: {
          url: "https://example.com/thumb.jpg",
          alt: "Thumbnail",
        },
      } as IncomingEventData,
    };

    // Map incoming data to collection item format
    const mappedItem = mapIncomingCollectionItem(incomingData);

    // Convert to database format
    const dbFormat = collectionItemToDbFormat(mappedItem);

    // Verify the complete transformation
    expect(dbFormat.title).toBe("Complete Integration Event");
    expect(dbFormat.type).toBe("event");
    expect(dbFormat.status).toBe("active");

    const parsedData = JSON.parse(dbFormat.data);
    expect(parsedData.eventDate).toBe("2025-12-01");
    expect(parsedData.city).toBe("Dubai");
    expect(parsedData.featured).toBe(true);

    const parsedMetaData = JSON.parse(dbFormat.metaData);
    expect(parsedMetaData.slug).toBe("integration-event");
    expect(parsedMetaData.status).toBe("published");
  });
});
