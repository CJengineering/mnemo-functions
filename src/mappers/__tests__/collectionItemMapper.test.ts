import {
  mapIncomingEventToCollectionItem,
  mapIncomingProgrammeToCollectionItem,
  mapIncomingNewsToCollectionItem,
  mapIncomingPostToCollectionItem,
  mapIncomingSourceToCollectionItem,
  mapIncomingTeamToCollectionItem,
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
} from "../collectionItemMapper";

import {
  IncomingEventData,
  IncomingProgrammeData,
  IncomingNewsData,
  IncomingPostData,
  IncomingSourceData,
  IncomingTeamData,
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

  describe("Team Mapper", () => {
    it("should map incoming team data to CollectionItemTeam format", () => {
      const incomingTeam: IncomingTeamData = {
        title: "Dr. John Smith",
        slug: "dr-john-smith",
        status: "published",
        name: "John Smith",
        nameArabic: "جون سميث",
        position: "Chief Technology Officer",
        positionArabic: "كبير موظفي التكنولوجيا",
        paragraphDescription:
          "Dr. Smith is a leading expert in AI and machine learning.",
        biographyArabic:
          "الدكتور سميث خبير رائد في الذكاء الاصطناعي والتعلم الآلي.",
        metaDescription: "CTO and AI expert",
        metaDescriptionArabic: "كبير موظفي التكنولوجيا وخبير الذكاء الاصطناعي",
        altTextImage: "Dr. John Smith profile photo",
        altTextImageArabic: "صورة الدكتور جون سميث الشخصية",
        filter: "Leadership",
        order: 1,
        newsOnOff: true,
        photo: {
          url: "https://example.com/john-smith.jpg",
          alt: "Dr. John Smith",
        },
        photoHires: "https://example.com/john-smith-hires.jpg",
        tags: [
          { id: "tag-1", slug: "ai" },
          { id: "tag-2", slug: "leadership" },
        ],
      };

      const result = mapIncomingTeamToCollectionItem(incomingTeam);

      expect(result).toEqual({
        id: mockUUID,
        type: "team",
        status: "published",
        slug: "dr-john-smith",
        title: "Dr. John Smith",
        created_at: mockDate,
        updated_at: mockDate,
        data: {
          name: "John Smith",
          nameArabic: "جون سميث",
          position: "Chief Technology Officer",
          positionArabic: "كبير موظفي التكنولوجيا",
          paragraphDescription:
            "Dr. Smith is a leading expert in AI and machine learning.",
          biographyArabic:
            "الدكتور سميث خبير رائد في الذكاء الاصطناعي والتعلم الآلي.",
          metaDescription: "CTO and AI expert",
          metaDescriptionArabic:
            "كبير موظفي التكنولوجيا وخبير الذكاء الاصطناعي",
          altTextImage: "Dr. John Smith profile photo",
          altTextImageArabic: "صورة الدكتور جون سميث الشخصية",
          filter: "Leadership",
          order: 1,
          newsOnOff: true,
          photo: {
            url: "https://example.com/john-smith.jpg",
            alt: "Dr. John Smith",
          },
          photoHires: "https://example.com/john-smith-hires.jpg",
          tags: [
            { id: "tag-1", slug: "ai" },
            { id: "tag-2", slug: "leadership" },
          ],
        },
      });
    });

    it("should handle minimal team data with defaults", () => {
      const minimalTeam: IncomingTeamData = {
        title: "Jane Doe",
        slug: "jane-doe",
        paragraphDescription: "Software Engineer at our organization.",
        order: 2,
        photo: {
          url: "https://example.com/jane-doe.jpg",
          alt: "Jane Doe",
        },
      };

      const result = mapIncomingTeamToCollectionItem(minimalTeam);

      expect(result.status).toBe("draft"); // default status
      expect(result.title).toBe("Jane Doe");
      expect(result.slug).toBe("jane-doe");
      expect(result.data.name).toBe("Jane Doe"); // Uses title when name not provided
      expect(result.data.paragraphDescription).toBe(
        "Software Engineer at our organization."
      );
      expect(result.data.order).toBe(2);
      expect(result.data.photo).toEqual({
        url: "https://example.com/jane-doe.jpg",
        alt: "Jane Doe",
      });
      expect(result.data.newsOnOff).toBe(false); // default value
      expect(result.id).toBe(mockUUID);
    });

    it("should handle team member with all possible filter types", () => {
      const filters: Array<IncomingTeamData["filter"]> = [
        "Leadership",
        "Team",
        "Advisory Committee",
        "Alumnus",
        "COP27 Youth Delegate",
      ];

      filters.forEach((filter, index) => {
        const teamMember: IncomingTeamData = {
          title: `Person ${index + 1}`,
          slug: `person-${index + 1}`,
          paragraphDescription: `Description for person ${index + 1}`,
          order: index + 1,
          filter: filter,
          photo: {
            url: `https://example.com/person-${index + 1}.jpg`,
            alt: `Person ${index + 1}`,
          },
        };

        const result = mapIncomingTeamToCollectionItem(teamMember);
        expect(result.data.filter).toBe(filter);
      });
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
        slug: "test-event",
        type: "event",
        status: "published", // Direct mapping
        data: {
          featured: true,
          eventDate: "2025-08-01",
        },
      });
    });

    it("should map draft status correctly", () => {
      const mappedItem = {
        type: "event",
        status: "draft",
        title: "Draft Event",
        slug: "draft-event",
        data: {},
      };

      const dbFormat = collectionItemToDbFormat(mappedItem);
      expect(dbFormat.status).toBe("draft");
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
    expect(dbFormat.status).toBe("published");

    expect(dbFormat.data.eventDate).toBe("2025-12-01");
    expect(dbFormat.data.city).toBe("Dubai");
    expect(dbFormat.data.featured).toBe(true);
  });

  it("should handle complete flow for team data from incoming to database format", () => {
    const incomingData: IncomingCollectionItem = {
      type: "team",
      data: {
        title: "Integration Test Team Member",
        slug: "integration-team-member",
        status: "published",
        paragraphDescription: "A team member for integration testing",
        order: 5,
        filter: "Team",
        photo: {
          url: "https://example.com/integration-member.jpg",
          alt: "Integration team member",
        },
      } as IncomingTeamData,
    };

    // Map incoming data to collection item format
    const mappedItem = mapIncomingCollectionItem(incomingData);

    // Convert to database format
    const dbFormat = collectionItemToDbFormat(mappedItem);

    // Verify the complete transformation
    expect(dbFormat.title).toBe("Integration Test Team Member");
    expect(dbFormat.type).toBe("team");
    expect(dbFormat.status).toBe("published");

    expect(dbFormat.data.paragraphDescription).toBe(
      "A team member for integration testing"
    );
    expect(dbFormat.data.order).toBe(5);
    expect(dbFormat.data.filter).toBe("Team");
    expect(dbFormat.data.photo).toEqual({
      url: "https://example.com/integration-member.jpg",
      alt: "Integration team member",
    });
  });
});
