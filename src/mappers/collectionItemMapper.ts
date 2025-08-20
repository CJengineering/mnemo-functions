import {
  CollectionItemEvent,
  CollectionItemProgramme,
  CollectionItemNews,
  CollectionItemPost,
  CollectionItemSource,
  CollectionItemTeam,
  CollectionItemPartner,
  CollectionItemPerson,
  CollectionItemTag,
} from "../../interface";
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
} from "./incomingInterfaces";

// Import ImageField type (need to check if it's exported or define it locally)
type ImageField = {
  url: string;
  alt: string;
};

// Helper function to generate ID and timestamps
function generateCollectionItemDefaults() {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };
}

// Event Mapper
export function mapIncomingEventToCollectionItem(
  incoming: IncomingEventData
): CollectionItemEvent {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "event",
    status: incoming.status || "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      // Boolean toggles
      pushToGR: incoming.pushToGR,
      featured: incoming.featured,
      videoAsHero: incoming.videoAsHero,
      newsOn: incoming.newsOnOff,
      moreDetailsOn: incoming.moreDetailsOnOff,
      inTheMediaOn: incoming.inTheMediaOnOff,

      // Core references
      programmeLabel: incoming.programmeLabel,
      relatedProgrammes: incoming.relatedProgrammes || [],
      relatedPeople: incoming.relatedPeople || [],
      organisers: incoming.organisers || [],
      partners: incoming.partners || [],
      withRepresentativesFrom: incoming.withRepresentativesFrom || [],
      tags: incoming.tags || [],

      // Images
      thumbnail: incoming.thumbnail,
      heroImage: incoming.heroImage,
      openGraphImage: incoming.openGraphImage || incoming.heroImage,
      imageGallery: incoming.imageGallery || [],
      galleryPhotoCredits: incoming.galleryPhotoCredits,

      // Textual content
      arabicTitle: incoming.arabicTitle,
      seoMetaDescription: incoming.seoMetaDescription,
      seoTitle: incoming.seoTitle,
      teaserText: incoming.teaserText,
      shortDescription: incoming.shortDescription,
      moreDetails: incoming.moreDetails,
      moreInformation: incoming.moreInformation,
      signupEmbed: incoming.signupEmbed,
      relatedPeopleRichText: incoming.relatedPeopleRichText,
      inTheMedia: incoming.inTheMedia,
      customCodeForHidingWeglot: incoming.customCodeForHidingWeglot,

      // Dates / location
      eventDate: incoming.eventDate,
      endDate: incoming.endDate,
      time: incoming.time,
      city: incoming.city,
      address: incoming.address,
      locationLink: incoming.locationLink,
      livestreamLink: incoming.livestreamLink,
      attendanceType: incoming.attendanceType,
      contactDetails: incoming.contactDetails,

      // Videos
      rsvpLink: incoming.rsvpLink,
      buttonCtaText: incoming.buttonCtaText,
      mainVideo: incoming.mainVideo,
      mainVideoEmbedCode: incoming.mainVideoEmbedCode,
      video2: incoming.video2,
      video2EmbedCode: incoming.video2EmbedCode,
      video3: incoming.video3,
      video3EmbedCode: incoming.video3EmbedCode,

      // Dropdowns
      group: incoming.group,
    },
  };
}

// Programme Mapper
export function mapIncomingProgrammeToCollectionItem(
  incoming: IncomingProgrammeData
): CollectionItemProgramme {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "programme",
    status: incoming.status ?? "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      // Flags / order
      lab: incoming.lab ?? false,
      pushToGR: incoming.pushToGR ?? false,
      order: incoming.order,

      // Programme classification (avoid clashing with top-level "type")
      type: incoming.type,

      // Names
      nameArabic: incoming.nameArabic,
      shortNameEnglish: incoming.shortNameEnglish,
      shortNameArabic: incoming.shortNameArabic,

      // Content
      missionEnglish: incoming.missionEnglish,
      missionArabic: incoming.missionArabic,
      summaryEnglish: incoming.summaryEnglish,
      summaryArabic: incoming.summaryArabic,
      summaryLongEnglish: incoming.summaryLongEnglish,
      summaryLongArabic: incoming.summaryLongArabic,
      oldMissionEnglish: incoming.oldMissionEnglish,
      researchEnglish: incoming.researchEnglish,
      researchArabic: incoming.researchArabic,
      description: incoming.description,

      // Details
      yearEstablished: incoming.yearEstablished,
      yearClosed: incoming.yearClosed,
      headquartersEnglish: incoming.headquartersEnglish,
      headquartersArabic: incoming.headquartersArabic,

      // Media (logos)
      logoSvgDark: incoming.logoSvgDark,
      logoSvgLight: incoming.logoSvgLight,
      logoSvgDarkOriginal: incoming.logoSvgDarkOriginal,
      logoSvgLightOriginal: incoming.logoSvgLightOriginal,

      // Media (hero / images)
      heroSquare: incoming.heroSquare,
      heroWide: incoming.heroWide,
      hero1x1: incoming.hero1x1,
      hero16x9: incoming.hero16x9,
      heroImage: incoming.heroImage,
      thumbnail: incoming.thumbnail,
      openGraph: incoming.openGraph || incoming.heroImage || incoming.heroWide, // ✅ correct fallback

      // Video & links
      mainVideo: incoming.mainVideo,
      customLink: incoming.customLink,
      buttonText: incoming.buttonText,

      // Location
      longitude: incoming.longitude,
      latitude: incoming.latitude,

      // External links
      website: incoming.website,
      linkedin: incoming.linkedin,
      instagram: incoming.instagram,
      twitter: incoming.twitter,
      youtube: incoming.youtube,
      facebook: incoming.facebook,

      // Relations
      partners: incoming.partners ?? [],
      leadership: incoming.leadership ?? [],
      relatedProgrammes: incoming.relatedProgrammes ?? [],
      features: incoming.features ?? [],

      // Impact metrics
      impact01: incoming.impact01,
      impact01TitleArabic: incoming.impact01TitleArabic,
      impact02: incoming.impact02,
      impact02TitleArabic: incoming.impact02TitleArabic,
      impact03: incoming.impact03,
      impact03TitleArabic: incoming.impact03TitleArabic,
      impact04: incoming.impact04,
      impact04TitleArabic: incoming.impact04TitleArabic,
      impact05: incoming.impact05,
      impact05TitleArabic: incoming.impact05TitleArabic,
      impact06: incoming.impact06,
      impact06TitleArabic: incoming.impact06TitleArabic,
    },
  };
}

// News Mapper
export function mapIncomingNewsToCollectionItem(
  incoming: IncomingNewsData
): CollectionItemNews {
  const defaults = generateCollectionItemDefaults();

  // Merge alt text if image.alt not provided
  const thumbnail: ImageField | undefined = incoming.thumbnail
    ? {
        url: incoming.thumbnail.url,
        alt: incoming.thumbnail.alt ?? incoming.imageAltTextEnglish ?? "",
      }
    : undefined;

  const heroImage: ImageField | undefined = incoming.heroImage
    ? {
        url: incoming.heroImage.url,
        alt: incoming.heroImage.alt ?? incoming.imageAltTextEnglish ?? "",
      }
    : undefined;

  return {
    ...defaults,
    type: "news",
    status: incoming.status ?? "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      // titles / flags
      arabicTitle: incoming.arabicTitle,
      pushToGR: incoming.pushToGR ?? false,
      featured: incoming.featured ?? false,

      // required meta
      externalLink: incoming.externalLink,
      datePublished: incoming.datePublished,

      // relations (kept optional)
      sources: incoming.sources,
      programmeLabel: incoming.programmeLabel,
      relatedProgrammes: incoming.relatedProgrammes ?? [],

      // people & misc relations
      people: incoming.people ?? [],
      relatedTeamMembers: incoming.relatedCjTeamMembers ?? [],
      innovations: incoming.innovations ?? [],
      relatedEvent: incoming.relatedEvent,
      relatedEvents: incoming.relatedEvents ?? [],
      tags: incoming.tags ?? [],

      // content
      summary: incoming.summary,
      summaryArabic: incoming.summaryArabic,
      excerpt: incoming.excerpt,

      // media
      thumbnail,
      heroImage,
      imageAltTextEnglish: incoming.imageAltTextEnglish,
      imageAltTextArabic: incoming.imageAltTextArabic,

      // view flags
      removeFromNewsGrid: incoming.removeFromNewsGrid ?? false,

      // If your backend requires duplication inside data:
      // title: incoming.title,
      // slug: incoming.slug,
    },
  };
}

// Post Mapper
export function mapIncomingPostToCollectionItem(
  incoming: IncomingPostData
): CollectionItemPost {
  const defaults = generateCollectionItemDefaults();

  // Helper to merge a provided ImageField with an alt fallback
  const withAlt = (
    img?: ImageField,
    altFallback?: string
  ): ImageField | undefined =>
    img ? { url: img.url, alt: img.alt ?? altFallback ?? "" } : undefined;

  // Prefer English alt text as a generic fallback (adjust if you want Arabic per locale)
  const heroAltEn = incoming.altTextHeroImageEnglish;
  const heroAltAr = incoming.altTextHeroImageArabic;

  const thumbnail: ImageField | undefined = withAlt(
    incoming.thumbnail,
    heroAltEn
  );
  const mainImage: ImageField | undefined = withAlt(
    incoming.mainImage,
    heroAltEn
  );

  // Choose the best available Open Graph image (explicit → main → hero → thumb)
  const openGraphImage: ImageField | undefined =
    withAlt(incoming.openGraphImage, heroAltEn) ??
    withAlt(incoming.mainImage, heroAltEn) ??
    withAlt(incoming.heroImage, heroAltEn) ??
    withAlt(incoming.thumbnail, heroAltEn);

  return {
    ...defaults,
    type: "post",
    status: incoming.status ?? "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      // Flags
      pushToGR: incoming.pushToGR ?? false,
      featured: incoming.featured ?? false,
      arabicCompleteIncomplete: incoming.arabicCompleteIncomplete ?? false,

      // Relations
      programmeLabel: incoming.programmeLabel,
      relatedProgrammes: incoming.relatedProgrammes ?? [],
      tags: incoming.tags ?? [],
      blogCategory: incoming.blogCategory,
      relatedEvent: incoming.relatedEvent,
      people: incoming.people ?? [],
      innovations: incoming.innovations ?? [],

      // Content
      arabicTitle: incoming.arabicTitle,
      bulletPointsEnglish: incoming.bulletPointsEnglish,
      bulletPointsArabic: incoming.bulletPointsArabic,
      bodyEnglish: incoming.bodyEnglish,
      bodyArabic: incoming.bodyArabic,

      // Video
      videoAsHero: incoming.videoAsHero ?? false,
      heroVideoYoutubeId: incoming.heroVideoYoutubeId,
      heroVideoArabicYoutubeId: incoming.heroVideoArabicYoutubeId,

      // Images (required in CollectionItemPost)
      thumbnail: thumbnail ?? {
        url: incoming.thumbnail?.url,
        alt: heroAltEn ?? "",
      },
      mainImage: mainImage ?? {
        url: incoming.mainImage?.url,
        alt: heroAltEn ?? "",
      },
      openGraphImage: openGraphImage ?? {
        url:
          incoming.openGraphImage?.url ??
          incoming.mainImage?.url ??
          incoming.heroImage?.url ??
          incoming.thumbnail?.url,
        alt: heroAltEn ?? "",
      },

      // Image credits / alt fields (also kept separately)
      altTextHeroImage: heroAltEn,
      altTextHeroImageArabic: heroAltAr,
      photoCreditHeroImage: incoming.photoCreditHeroImageEnglish,
      photoCreditHeroImageArabic: incoming.photoCreditHeroImageArabic,

      // Dates / place
      datePublished: incoming.datePublished,
      location: incoming.location,
      locationArabic: incoming.locationArabic,

      // SEO
      seoTitle: incoming.seoTitle,
      seoTitleArabic: incoming.seoTitleArabic,
      seoMeta: incoming.seoMeta,
      seoMetaArabic: incoming.seoMetaArabic,

      // Gallery
      imageCarousel: (incoming.imageCarousel as ImageField[] | undefined) ?? [],
      imageGalleryCredits: incoming.imageGalleryCredits,
      imageGalleryCreditsArabic: incoming.imageGalleryCreditsArabic,

      // (Optional) if you later add this to the interface:
      // sitemapIndexing: incoming.sitemapIndexing ?? true,
    },
  };
}

// Source Mapper
export function mapIncomingSourceToCollectionItem(
  incoming: IncomingSourceData
): CollectionItemSource {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "source",
    status: incoming.status || "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      nameArabic: incoming.nameArabic,
      shortNameEnglish: incoming.shortNameEnglish,
      shortNameArabic: incoming.shortNameArabic,
      logo: incoming.logo,
      logoNative: incoming.logoNative,
    },
  };
}

// Team Mapper
export function mapIncomingTeamToCollectionItem(
  incoming: IncomingTeamData
): CollectionItemTeam {
  const defaults = generateCollectionItemDefaults();

  // Ensure photo.alt is populated from altTextImage if missing
  const photo: ImageField = {
    url: incoming.photo?.url,
    alt: incoming.photo?.alt ?? incoming.altTextImage ?? "",
  };

  return {
    ...defaults,
    type: "team",
    status: incoming.status ?? "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      // Personal
      name: incoming.name || incoming.title,
      nameArabic: incoming.nameArabic,
      position: incoming.position,
      positionArabic: incoming.positionArabic,

      // Images
      photo,
      photoHires: incoming.photoHires,
      altTextImage: incoming.altTextImage,
      altTextImageArabic: incoming.altTextImageArabic,

      // Bio
      paragraphDescription: incoming.paragraphDescription,
      biographyArabic: incoming.biographyArabic,

      // Meta
      metaDescription: incoming.metaDescription,
      metaDescriptionArabic: incoming.metaDescriptionArabic,

      // Categorization
      filter: incoming.filter,
      order: incoming.order,

      // Settings
      newsOnOff: incoming.newsOnOff ?? false,
      tags: incoming.tags ?? [],
    },
  };
}

// Partner Mapper
export function mapIncomingPartnerToCollectionItem(
  incoming: IncomingPartnerData
): CollectionItemPartner {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "partner",
    status: incoming.status ?? "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      // Core information
      name: incoming.name || incoming.title, // Use name field, fallback to title
      nameArabic: incoming["arabic-name"],

      // Description
      shortDescription: incoming["short-description"],
      shortDescriptionArabic: incoming["short-description-arabic"],

      // Links
      website: incoming.website,

      // Media
      logo: incoming.logo,

      // Categorization
      group: incoming.group,

      // Relations
      tags: incoming.tags ?? [],
    },
  };
}

// Person Mapper
export function mapIncomingPersonToCollectionItem(
  incoming: IncomingPersonData
): CollectionItemPerson {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "person",
    status: incoming.status ?? "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      name: incoming.name || incoming.title, // Required - fallback to title
      nameArabic: incoming["name-arabic"],
      arabicOnOff: incoming["arabic-on-off"],
      pushToGR: incoming["push-to-gr"],
      hero: incoming.hero,
      relatedProgramme: incoming["related-programme"],
      relatedProgrammes: incoming["related-programmes"] ?? [],
      color: incoming.color,
      role: incoming.role,
      roleArabic: incoming["role-arabic"],
      shortDescription: incoming["short-description"],
      shortDescriptionArabic: incoming["short-description-arabic"],
      biography: incoming.biography,
      biographyArabic: incoming["biography-arabic"],
      events: incoming.events,
      eventsArabic: incoming["events-arabic"],
      researchAreaEnglish: incoming["research-area-english"],
      researchAreasArabic: incoming["research-areas-arabic"],
      type: incoming.type,
      heroImage: incoming["hero-image"],
      profilePicture: incoming["profile-picture"],
      featureVideo: incoming["feature-video"],
      relatedPeople: incoming["related-people-s"] ?? [],
      partnerOrganisation: incoming["partner-organisation"] ?? [],
      instagramLink: incoming["instagram-link"],
      linkedinLink: incoming["linkedin-link"],
      twitterLink: incoming["twitter-link"],
      facebook: incoming.facebook,
      youtubeLink: incoming["youtube-link"],
      github: incoming.github,
      websiteLink: incoming["website-link"],
      shop: incoming.shop,
      photos: incoming.photos ?? [],
      hideNews: incoming["hide-news"],
      hideMultimedia: incoming["hide-multimedia"],
      hideEvents: incoming["hide-events"],
      hidePublications: incoming["hide-publications"],
      hidePhotos: incoming["hide-photos"],
      hideEventsRichText: incoming["hide-events-rich-text"],
      multimedia: incoming.multimedia ?? [],
      tag: incoming.tag ?? [],
      order: incoming.order,
      country: incoming.country,
    },
  };
}

// Tag Mapper
export function mapIncomingTagToCollectionItem(
  incoming: IncomingTagData
): CollectionItemTag {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "tag",
    status: incoming.status ?? "draft",
    slug: incoming.slug,
    title: incoming.name || incoming.title, // Use name as title, fallback to title
    data: {
      name: incoming.name || incoming.title, // Required - fallback to title if name is missing
      nameArabic: incoming["name-arabic"],
    },
  };
}

// Main mapper function that handles all types
export function mapIncomingCollectionItem(
  incoming: IncomingCollectionItem
):
  | CollectionItemEvent
  | CollectionItemProgramme
  | CollectionItemNews
  | CollectionItemPost
  | CollectionItemSource
  | CollectionItemTeam
  | CollectionItemPartner
  | CollectionItemPerson
  | CollectionItemTag {
  switch (incoming.type) {
    case "event":
      return mapIncomingEventToCollectionItem(
        incoming.data as IncomingEventData
      );
    case "programme":
      return mapIncomingProgrammeToCollectionItem(
        incoming.data as IncomingProgrammeData
      );
    case "news":
      return mapIncomingNewsToCollectionItem(incoming.data as IncomingNewsData);
    case "post":
      return mapIncomingPostToCollectionItem(incoming.data as IncomingPostData);
    case "source":
      return mapIncomingSourceToCollectionItem(
        incoming.data as IncomingSourceData
      );
    case "team":
      return mapIncomingTeamToCollectionItem(incoming.data as IncomingTeamData);
    case "partner":
      return mapIncomingPartnerToCollectionItem(
        incoming.data as IncomingPartnerData
      );
    case "person":
      return mapIncomingPersonToCollectionItem(
        incoming.data as IncomingPersonData
      );
    case "tag":
      return mapIncomingTagToCollectionItem(incoming.data as IncomingTagData);
    default:
      throw new Error(
        `Unknown collection item type: ${(incoming as any).type}`
      );
  }
}

// Helper function to convert mapped collection item to database format
export function collectionItemToDbFormat(item: any) {
  return {
    title: item.title,
    slug: item.slug,
    type: item.type,
    status: item.status, // Direct mapping: "draft" | "published"
    data: item.data, // Pass object directly, Drizzle will handle JSON serialization
  };
}
