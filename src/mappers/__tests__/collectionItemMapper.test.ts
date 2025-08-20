import {
  mapIncomingEventToCollectionItem,
  mapIncomingProgrammeToCollectionItem,
  mapIncomingNewsToCollectionItem,
  mapIncomingPostToCollectionItem,
  mapIncomingSourceToCollectionItem,
  mapIncomingTeamToCollectionItem,
  mapIncomingPartnerToCollectionItem,
  mapIncomingPersonToCollectionItem,
  mapIncomingTagToCollectionItem,
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
  IncomingPartnerData,
  IncomingPersonData,
  IncomingTagData,
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
        openGraphImage: {
          url: "https://example.com/hero.jpg",
          alt: "Event hero image",
        },
        relatedProgrammes: undefined,
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
          featured: true,
          videoAsHero: undefined,
          newsOn: undefined,
          moreDetailsOn: undefined,
          inTheMediaOn: undefined,
          programmeLabel: { id: "prog-1", slug: "test-programme" },
          relatedProgrammes: [],
          relatedPeople: [],
          organisers: [],
          partners: [],
          withRepresentativesFrom: [],
          tags: [
            { id: "tag-1", slug: "innovation" },
            { id: "tag-2", slug: "technology" },
          ],
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
          imageGallery: [],
          galleryPhotoCredits: undefined,
          arabicTitle: "حدث تجريبي",
          seoMetaDescription: undefined,
          seoTitle: undefined,
          teaserText: undefined,
          shortDescription: undefined,
          moreDetails: undefined,
          moreInformation: undefined,
          signupEmbed: undefined,
          relatedPeopleRichText: undefined,
          inTheMedia: undefined,
          customCodeForHidingWeglot: undefined,
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
          buttonCtaText: undefined,
          mainVideo: undefined,
          mainVideoEmbedCode: undefined,
          video2: undefined,
          video2EmbedCode: undefined,
          video3: undefined,
          video3EmbedCode: undefined,
          group: undefined,
        },
      });
    });

    it("should handle minimal event data with defaults", () => {
      const minimalEvent: IncomingEventData = {
        title: "Minimal Event",
        slug: "minimal-event",
        openGraphImage: {
          url: "https://example.com/hero.jpg",
          alt: "Event hero image",
        },
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
        heroImage: {
          url: "https://example.com/post-hero.jpg",
          alt: "Hero image",
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
        name: "Jane Doe",
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
          name: `Person ${index + 1}`,
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

  describe("Partner Mapper", () => {
    it("should map incoming partner data to CollectionItemPartner format", () => {
      const incomingPartner: IncomingPartnerData = {
        title: "Tech Solutions Inc",
        slug: "tech-solutions-inc",
        status: "published",
        name: "Tech Solutions Inc",
        "arabic-name": "شركة الحلول التقنية",
        "short-description": "Leading technology solutions provider",
        "short-description-arabic": "مقدم رائد لحلول التكنولوجيا",
        website: "https://techsolutions.example.com",
        logo: {
          url: "https://example.com/tech-solutions-logo.svg",
          alt: "Tech Solutions Inc logo",
        },
        group: "COP27",
        tags: [
          { id: "tag-1", slug: "technology" },
          { id: "tag-2", slug: "partnerships" },
        ],
      };

      const result = mapIncomingPartnerToCollectionItem(incomingPartner);

      expect(result).toEqual({
        id: mockUUID,
        type: "partner",
        status: "published",
        slug: "tech-solutions-inc",
        title: "Tech Solutions Inc",
        created_at: mockDate,
        updated_at: mockDate,
        data: {
          name: "Tech Solutions Inc",
          nameArabic: "شركة الحلول التقنية",
          shortDescription: "Leading technology solutions provider",
          shortDescriptionArabic: "مقدم رائد لحلول التكنولوجيا",
          website: "https://techsolutions.example.com",
          logo: {
            url: "https://example.com/tech-solutions-logo.svg",
            alt: "Tech Solutions Inc logo",
          },
          group: "COP27",
          tags: [
            { id: "tag-1", slug: "technology" },
            { id: "tag-2", slug: "partnerships" },
          ],
        },
      });
    });

    it("should handle minimal partner data with defaults", () => {
      const minimalPartner: IncomingPartnerData = {
        title: "Simple Partner",
        name: "Simple Partner",
        slug: "simple-partner",
      };

      const result = mapIncomingPartnerToCollectionItem(minimalPartner);

      expect(result.status).toBe("draft"); // default status
      expect(result.title).toBe("Simple Partner");
      expect(result.slug).toBe("simple-partner");
      expect(result.data.name).toBe("Simple Partner");
      expect(result.data.nameArabic).toBeUndefined();
      expect(result.data.shortDescription).toBeUndefined();
      expect(result.data.website).toBeUndefined();
      expect(result.data.logo).toBeUndefined();
      expect(result.data.group).toBeUndefined();
      expect(result.data.tags).toEqual([]); // default empty array
      expect(result.id).toBe(mockUUID);
    });

    it("should handle partner with name fallback to title", () => {
      const partnerData: IncomingPartnerData = {
        title: "Partner Without Name",
        slug: "partner-without-name",
        name: "", // Empty name should fallback to title
      };

      const result = mapIncomingPartnerToCollectionItem(partnerData);

      expect(result.data.name).toBe("Partner Without Name"); // Should use title as fallback
    });
  });

  describe("Person Mapper", () => {
    it("should map incoming person data to CollectionItemPerson format", () => {
      const incomingPerson: IncomingPersonData = {
        title: "Dr. Sarah Johnson",
        slug: "dr-sarah-johnson",
        status: "published",
        name: "Sarah Johnson",
        "name-arabic": "سارة جونسون",
        "arabic-on-off": true,
        "push-to-gr": false,
        hero: true,
        "related-programme": {
          id: "prog-1",
          slug: "ai-research",
        },
        "related-programmes": [
          { id: "prog-1", slug: "ai-research" },
          { id: "prog-2", slug: "climate-tech" },
        ],
        color: "#FF6B35",
        role: "Chief Research Scientist",
        "role-arabic": "كبير العلماء الباحثين",
        "short-description": "Leading AI researcher and climate tech expert",
        "short-description-arabic":
          "باحث رائد في الذكاء الاصطناعي وخبير في تكنولوجيا المناخ",
        biography:
          "Dr. Johnson has over 15 years of experience in AI research.",
        "biography-arabic":
          "د. جونسون لديها أكثر من 15 عامًا من الخبرة في أبحاث الذكاء الاصطناعي.",
        events: "Keynote speaker at multiple international conferences.",
        "events-arabic": "متحدثة رئيسية في عدة مؤتمرات دولية.",
        "research-area-english":
          "Machine Learning, Climate Modeling, Sustainable Technology",
        "research-areas-arabic":
          "التعلم الآلي، نمذجة المناخ، التكنولوجيا المستدامة",
        type: "Professor",
        "hero-image": {
          url: "https://example.com/sarah-hero.jpg",
          alt: "Dr. Sarah Johnson hero image",
        },
        "profile-picture": {
          url: "https://example.com/sarah-profile.jpg",
          alt: "Dr. Sarah Johnson",
        },
        "feature-video": "abc123xyz",
        "related-people-s": [
          { id: "person-1", slug: "john-smith" },
          { id: "person-2", slug: "maria-garcia" },
        ],
        "partner-organisation": [
          { id: "partner-1", slug: "mit" },
          { id: "partner-2", slug: "stanford" },
        ],
        "instagram-link": "https://instagram.com/sarahjohnson",
        "linkedin-link": "https://linkedin.com/in/sarahjohnson",
        "twitter-link": "https://twitter.com/sarahjohnson",
        facebook: "https://facebook.com/sarahjohnson",
        "youtube-link": "https://youtube.com/c/sarahjohnson",
        github: "https://github.com/sarahjohnson",
        "website-link": "https://sarahjohnson.com",
        shop: "https://shop.sarahjohnson.com",
        photos: [
          { url: "https://example.com/photo1.jpg", alt: "Photo 1" },
          { url: "https://example.com/photo2.jpg", alt: "Photo 2" },
        ],
        "hide-news": false,
        "hide-multimedia": false,
        "hide-events": false,
        "hide-publications": false,
        "hide-photos": false,
        "hide-events-rich-text": false,
        multimedia: [{ id: "media-1", slug: "interview-2024" }],
        tag: [
          { id: "tag-1", slug: "ai" },
          { id: "tag-2", slug: "climate" },
          { id: "tag-3", slug: "research" },
        ],
        order: 1,
        country: "United States",
      };

      const result = mapIncomingPersonToCollectionItem(incomingPerson);

      expect(result).toEqual({
        id: mockUUID,
        type: "person",
        status: "published",
        slug: "dr-sarah-johnson",
        title: "Dr. Sarah Johnson",
        created_at: mockDate,
        updated_at: mockDate,
        data: {
          name: "Sarah Johnson",
          nameArabic: "سارة جونسون",
          arabicOnOff: true,
          pushToGR: false,
          hero: true,
          relatedProgramme: { id: "prog-1", slug: "ai-research" },
          relatedProgrammes: [
            { id: "prog-1", slug: "ai-research" },
            { id: "prog-2", slug: "climate-tech" },
          ],
          color: "#FF6B35",
          role: "Chief Research Scientist",
          roleArabic: "كبير العلماء الباحثين",
          shortDescription: "Leading AI researcher and climate tech expert",
          shortDescriptionArabic:
            "باحث رائد في الذكاء الاصطناعي وخبير في تكنولوجيا المناخ",
          biography:
            "Dr. Johnson has over 15 years of experience in AI research.",
          biographyArabic:
            "د. جونسون لديها أكثر من 15 عامًا من الخبرة في أبحاث الذكاء الاصطناعي.",
          events: "Keynote speaker at multiple international conferences.",
          eventsArabic: "متحدثة رئيسية في عدة مؤتمرات دولية.",
          researchAreaEnglish:
            "Machine Learning, Climate Modeling, Sustainable Technology",
          researchAreasArabic:
            "التعلم الآلي، نمذجة المناخ، التكنولوجيا المستدامة",
          type: "Professor",
          heroImage: {
            url: "https://example.com/sarah-hero.jpg",
            alt: "Dr. Sarah Johnson hero image",
          },
          profilePicture: {
            url: "https://example.com/sarah-profile.jpg",
            alt: "Dr. Sarah Johnson",
          },
          featureVideo: "abc123xyz",
          relatedPeople: [
            { id: "person-1", slug: "john-smith" },
            { id: "person-2", slug: "maria-garcia" },
          ],
          partnerOrganisation: [
            { id: "partner-1", slug: "mit" },
            { id: "partner-2", slug: "stanford" },
          ],
          instagramLink: "https://instagram.com/sarahjohnson",
          linkedinLink: "https://linkedin.com/in/sarahjohnson",
          twitterLink: "https://twitter.com/sarahjohnson",
          facebook: "https://facebook.com/sarahjohnson",
          youtubeLink: "https://youtube.com/c/sarahjohnson",
          github: "https://github.com/sarahjohnson",
          websiteLink: "https://sarahjohnson.com",
          shop: "https://shop.sarahjohnson.com",
          photos: [
            { url: "https://example.com/photo1.jpg", alt: "Photo 1" },
            { url: "https://example.com/photo2.jpg", alt: "Photo 2" },
          ],
          hideNews: false,
          hideMultimedia: false,
          hideEvents: false,
          hidePublications: false,
          hidePhotos: false,
          hideEventsRichText: false,
          multimedia: [{ id: "media-1", slug: "interview-2024" }],
          tag: [
            { id: "tag-1", slug: "ai" },
            { id: "tag-2", slug: "climate" },
            { id: "tag-3", slug: "research" },
          ],
          order: 1,
          country: "United States",
        },
      });
    });

    it("should handle minimal person data with defaults", () => {
      const minimalPerson: IncomingPersonData = {
        title: "John Doe",
        name: "John Doe",
        slug: "john-doe",
      };

      const result = mapIncomingPersonToCollectionItem(minimalPerson);

      expect(result.status).toBe("draft"); // default status
      expect(result.title).toBe("John Doe");
      expect(result.slug).toBe("john-doe");
      expect(result.data.name).toBe("John Doe");
      expect(result.data.nameArabic).toBeUndefined();
      expect(result.data.role).toBeUndefined();
      expect(result.data.shortDescription).toBeUndefined();
      expect(result.data.biography).toBeUndefined();
      expect(result.data.relatedProgrammes).toEqual([]); // default empty array
      expect(result.data.relatedPeople).toEqual([]); // default empty array
      expect(result.data.partnerOrganisation).toEqual([]); // default empty array
      expect(result.data.photos).toEqual([]); // default empty array
      expect(result.data.multimedia).toEqual([]); // default empty array
      expect(result.data.tag).toEqual([]); // default empty array
      expect(result.id).toBe(mockUUID);
    });

    it("should handle person with name fallback to title", () => {
      const personData: IncomingPersonData = {
        title: "Person Without Name",
        slug: "person-without-name",
        name: "", // Empty name should fallback to title
      };

      const result = mapIncomingPersonToCollectionItem(personData);

      expect(result.data.name).toBe("Person Without Name"); // Should use title as fallback
    });

    it("should handle person with all person types", () => {
      const types = [
        "Professor",
        "Doctor",
        "Economist",
        "Researcher",
        "Engineer",
        "Diplomat",
        "Government official",
        "Organisational leadership",
        "Art curator",
        "Artist",
        "Musician",
        "Filmmaker",
        "Photographer",
      ];

      types.forEach((personType, index) => {
        const personData: IncomingPersonData = {
          title: `Person ${index + 1}`,
          name: `Person ${index + 1}`,
          slug: `person-${index + 1}`,
          type: personType,
        };

        const result = mapIncomingPersonToCollectionItem(personData);
        expect(result.data.type).toBe(personType);
      });
    });
  });

  describe("Tag Mapper", () => {
    it("should map incoming tag data to CollectionItemTag format", () => {
      const incomingTag: IncomingTagData = {
        title: "Machine Learning",
        name: "Machine Learning",
        slug: "machine-learning",
        status: "published",
        "name-arabic": "التعلم الآلي",
      };

      const result = mapIncomingTagToCollectionItem(incomingTag);

      expect(result).toEqual({
        id: mockUUID,
        type: "tag",
        status: "published",
        slug: "machine-learning",
        title: "Machine Learning",
        created_at: mockDate,
        updated_at: mockDate,
        data: {
          name: "Machine Learning",
          nameArabic: "التعلم الآلي",
        },
      });
    });

    it("should handle minimal tag data with defaults", () => {
      const minimalTag: IncomingTagData = {
        title: "AI Research",
        name: "AI Research",
        slug: "ai-research",
      };

      const result = mapIncomingTagToCollectionItem(minimalTag);

      expect(result.status).toBe("draft"); // default status
      expect(result.title).toBe("AI Research");
      expect(result.slug).toBe("ai-research");
      expect(result.data.name).toBe("AI Research");
      expect(result.data.nameArabic).toBeUndefined();
      expect(result.id).toBe(mockUUID);
    });

    it("should handle tag with name fallback to title", () => {
      const tagData: IncomingTagData = {
        title: "Climate Technology",
        name: "", // Empty name should fallback to title
        slug: "climate-tech",
      };

      const result = mapIncomingTagToCollectionItem(tagData);

      expect(result.data.name).toBe("Climate Technology"); // Should use title as fallback
      expect(result.title).toBe("Climate Technology"); // Title should also use the fallback
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

    it("should route to partner mapper correctly", () => {
      const incomingPartner: IncomingCollectionItem = {
        type: "partner",
        data: {
          title: "Test Partner",
          name: "Test Partner",
          slug: "test-partner",
        } as IncomingPartnerData,
      };

      const result = mapIncomingCollectionItem(incomingPartner);
      expect(result.type).toBe("partner");
      expect(result.title).toBe("Test Partner");
    });

    it("should route to person mapper correctly", () => {
      const incomingPerson: IncomingCollectionItem = {
        type: "person",
        data: {
          title: "Test Person",
          name: "Test Person",
          slug: "test-person",
        } as IncomingPersonData,
      };

      const result = mapIncomingCollectionItem(incomingPerson);
      expect(result.type).toBe("person");
      expect(result.title).toBe("Test Person");
    });

    it("should route to tag mapper correctly", () => {
      const incomingTag: IncomingCollectionItem = {
        type: "tag",
        data: {
          title: "Test Tag",
          name: "Test Tag",
          slug: "test-tag",
        } as IncomingTagData,
      };

      const result = mapIncomingCollectionItem(incomingTag);
      expect(result.type).toBe("tag");
      expect(result.title).toBe("Test Tag");
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

  it("should handle complete flow for partner data from incoming to database format", () => {
    const incomingData: IncomingCollectionItem = {
      type: "partner",
      data: {
        title: "Integration Test Partner",
        name: "Integration Test Partner",
        slug: "integration-test-partner",
        status: "published",
        "short-description": "A partner organization for integration testing",
        website: "https://integration-partner.example.com",
        logo: {
          url: "https://example.com/integration-partner-logo.png",
          alt: "Integration partner logo",
        },
        group: "COP27",
        tags: [
          { id: "tag-integration", slug: "integration" },
          { id: "tag-testing", slug: "testing" },
        ],
      } as IncomingPartnerData,
    };

    // Map incoming data to collection item format
    const mappedItem = mapIncomingCollectionItem(incomingData);

    // Convert to database format
    const dbFormat = collectionItemToDbFormat(mappedItem);

    // Verify the complete transformation
    expect(dbFormat.title).toBe("Integration Test Partner");
    expect(dbFormat.type).toBe("partner");
    expect(dbFormat.status).toBe("published");

    expect(dbFormat.data.name).toBe("Integration Test Partner");
    expect(dbFormat.data.shortDescription).toBe(
      "A partner organization for integration testing"
    );
    expect(dbFormat.data.website).toBe(
      "https://integration-partner.example.com"
    );
    expect(dbFormat.data.group).toBe("COP27");
    expect(dbFormat.data.logo).toEqual({
      url: "https://example.com/integration-partner-logo.png",
      alt: "Integration partner logo",
    });
    expect(dbFormat.data.tags).toEqual([
      { id: "tag-integration", slug: "integration" },
      { id: "tag-testing", slug: "testing" },
    ]);
  });

  it("should handle complete flow for person data from incoming to database format", () => {
    const incomingData: IncomingCollectionItem = {
      type: "person",
      data: {
        title: "Integration Test Person",
        name: "Integration Test Person",
        slug: "integration-test-person",
        status: "published",
        "name-arabic": "شخص اختبار التكامل",
        role: "Senior Research Scientist",
        "role-arabic": "كبير العلماء الباحثين",
        "short-description":
          "A person for integration testing of the mapper system",
        "short-description-arabic": "شخص لاختبار تكامل نظام المعالج",
        biography: "This person is used for comprehensive integration testing.",
        "biography-arabic": "يستخدم هذا الشخص لاختبار التكامل الشامل.",
        type: "Researcher",
        "profile-picture": {
          url: "https://example.com/integration-person.jpg",
          alt: "Integration test person",
        },
        "related-programmes": [
          { id: "prog-integration", slug: "integration-program" },
        ],
        "linkedin-link": "https://linkedin.com/in/integration-person",
        "website-link": "https://integration-person.example.com",
        tag: [
          { id: "tag-integration", slug: "integration" },
          { id: "tag-testing", slug: "testing" },
          { id: "tag-research", slug: "research" },
        ],
        order: 5,
        country: "Test Country",
      } as IncomingPersonData,
    };

    // Map incoming data to collection item format
    const mappedItem = mapIncomingCollectionItem(incomingData);

    // Convert to database format
    const dbFormat = collectionItemToDbFormat(mappedItem);

    // Verify the complete transformation
    expect(dbFormat.title).toBe("Integration Test Person");
    expect(dbFormat.type).toBe("person");
    expect(dbFormat.status).toBe("published");

    expect(dbFormat.data.name).toBe("Integration Test Person");
    expect(dbFormat.data.nameArabic).toBe("شخص اختبار التكامل");
    expect(dbFormat.data.role).toBe("Senior Research Scientist");
    expect(dbFormat.data.roleArabic).toBe("كبير العلماء الباحثين");
    expect(dbFormat.data.shortDescription).toBe(
      "A person for integration testing of the mapper system"
    );
    expect(dbFormat.data.shortDescriptionArabic).toBe(
      "شخص لاختبار تكامل نظام المعالج"
    );
    expect(dbFormat.data.biography).toBe(
      "This person is used for comprehensive integration testing."
    );
    expect(dbFormat.data.biographyArabic).toBe(
      "يستخدم هذا الشخص لاختبار التكامل الشامل."
    );
    expect(dbFormat.data.type).toBe("Researcher");
    expect(dbFormat.data.profilePicture).toEqual({
      url: "https://example.com/integration-person.jpg",
      alt: "Integration test person",
    });
    expect(dbFormat.data.relatedProgrammes).toEqual([
      { id: "prog-integration", slug: "integration-program" },
    ]);
    expect(dbFormat.data.linkedinLink).toBe(
      "https://linkedin.com/in/integration-person"
    );
    expect(dbFormat.data.websiteLink).toBe(
      "https://integration-person.example.com"
    );
    expect(dbFormat.data.tag).toEqual([
      { id: "tag-integration", slug: "integration" },
      { id: "tag-testing", slug: "testing" },
      { id: "tag-research", slug: "research" },
    ]);
    expect(dbFormat.data.order).toBe(5);
    expect(dbFormat.data.country).toBe("Test Country");
  });

  it("should handle complete flow for tag data from incoming to database format", () => {
    const incomingData: IncomingCollectionItem = {
      type: "tag",
      data: {
        title: "Integration Test Tag",
        name: "Integration Test Tag",
        slug: "integration-test-tag",
        status: "published",
        "name-arabic": "علامة اختبار التكامل",
      } as IncomingTagData,
    };

    // Map incoming data to collection item format
    const mappedItem = mapIncomingCollectionItem(incomingData);

    // Convert to database format
    const dbFormat = collectionItemToDbFormat(mappedItem);

    // Verify the complete transformation
    expect(dbFormat.title).toBe("Integration Test Tag");
    expect(dbFormat.type).toBe("tag");
    expect(dbFormat.status).toBe("published");
    expect(dbFormat.slug).toBe("integration-test-tag");

    expect(dbFormat.data.name).toBe("Integration Test Tag");
    expect(dbFormat.data.nameArabic).toBe("علامة اختبار التكامل");
  });
});
