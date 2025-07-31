import {
  CollectionItemEvent,
  CollectionItemProgramme,
  CollectionItemNews,
  CollectionItemPost,
  CollectionItemSource,
  CollectionItemTeam,
} from "../../interface";
import {
  IncomingEventData,
  IncomingProgrammeData,
  IncomingNewsData,
  IncomingPostData,
  IncomingSourceData,
  IncomingTeamData,
  IncomingCollectionItem,
} from "./incomingInterfaces";

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
      pushToGR: incoming.pushToGR,
      programmeLabel: incoming.programmeLabel,
      relatedProgrammes: incoming.relatedProgrammes,
      videoAsHero: incoming.videoAsHero,
      thumbnail: incoming.thumbnail,
      heroImage: incoming.heroImage,
      openGraphImage: incoming.heroImage, // fallback to heroImage if not provided
      featured: incoming.featured,
      arabicTitle: incoming.arabicTitle,
      seoMetaDescription: incoming.seoMetaDescription,
      seoTitle: incoming.seoTitle,
      teaserText: incoming.teaserText,
      shortDescription: incoming.shortDescription,
      eventDate: incoming.eventDate,
      endDate: incoming.endDate,
      time: incoming.time,
      city: incoming.city,
      address: incoming.address,
      locationLink: incoming.locationLink,
      livestreamLink: incoming.livestreamLink,
      attendanceType: incoming.attendanceType,
      contactDetails: incoming.contactDetails,
      rsvpLink: incoming.rsvpLink,
      mainVideo: incoming.mainVideo,
      tags: incoming.tags,
      relatedPeople: incoming.relatedPeople,
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
    status: incoming.status || "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      lab: incoming.lab,
      pushToGR: incoming.pushToGR,
      nameArabic: incoming.nameArabic,
      shortNameEnglish: incoming.shortNameEnglish,
      shortNameArabic: incoming.shortNameArabic,
      missionEnglish: incoming.missionEnglish,
      missionArabic: incoming.missionArabic,
      description: incoming.description,
      summaryEnglish: incoming.summaryEnglish,
      summaryArabic: incoming.summaryArabic,
      researchEnglish: incoming.researchEnglish,
      researchArabic: incoming.researchArabic,
      yearEstablished: incoming.yearEstablished,
      yearClosed: incoming.yearClosed,
      headquartersArabic: incoming.headquartersArabic,
      headquartersEnglish: incoming.headquartersEnglish,
      logoSvgDark: incoming.logoSvgDark,
      logoSvgLight: incoming.logoSvgLight,
      heroSquare: incoming.heroSquare,
      heroWide: incoming.heroWide,
      openGraph: incoming.heroWide, // fallback to heroWide if not provided
      partners: incoming.partners,
      leadership: incoming.leadership,
      relatedProgrammes: incoming.relatedProgrammes,
      longitude: incoming.longitude,
      latitude: incoming.latitude,
      website: incoming.website,
      linkedin: incoming.linkedin,
      instagram: incoming.instagram,
      twitter: incoming.twitter,
      order: incoming.order,
    },
  };
}

// News Mapper
export function mapIncomingNewsToCollectionItem(
  incoming: IncomingNewsData
): CollectionItemNews {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "news",
    status: incoming.status || "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      arabicTitle: incoming.arabicTitle,
      pushToGR: incoming.pushToGR,
      featured: incoming.featured,
      externalLink: incoming.externalLink,
      datePublished: incoming.datePublished,
      sources: incoming.sources,
      programmeLabel: incoming.programmeLabel,
      relatedProgrammes: incoming.relatedProgrammes,
      people: incoming.people,
      innovations: incoming.innovations,
      relatedEvent: incoming.relatedEvent,
      relatedEvents: incoming.relatedEvents,
      summary: incoming.summary,
      summaryArabic: incoming.summaryArabic,
      excerpt: incoming.excerpt,
      thumbnail: incoming.thumbnail,
      heroImage: incoming.heroImage,
      tags: incoming.tags,
      removeFromNewsGrid: incoming.removeFromNewsGrid,
    },
  };
}

// Post Mapper
export function mapIncomingPostToCollectionItem(
  incoming: IncomingPostData
): CollectionItemPost {
  const defaults = generateCollectionItemDefaults();

  return {
    ...defaults,
    type: "post",
    status: incoming.status || "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      arabicCompleteIncomplete: incoming.arabicCompleteIncomplete,
      arabicTitle: incoming.arabicTitle,
      pushToGR: incoming.pushToGR,
      programmeLabel: incoming.programmeLabel,
      relatedProgrammes: incoming.relatedProgrammes,
      bulletPointsEnglish: incoming.bulletPointsEnglish,
      bulletPointsArabic: incoming.bulletPointsArabic,
      videoAsHero: incoming.videoAsHero,
      heroVideoYoutubeId: incoming.heroVideoYoutubeId,
      heroVideoArabicYoutubeId: incoming.heroVideoArabicYoutubeId,
      thumbnail: incoming.thumbnail,
      mainImage: incoming.mainImage,
      openGraphImage: incoming.openGraphImage,
      datePublished: incoming.datePublished,
      location: incoming.location,
      locationArabic: incoming.locationArabic,
      seoTitle: incoming.seoTitle,
      seoTitleArabic: incoming.seoTitleArabic,
      seoMeta: incoming.seoMeta,
      seoMetaArabic: incoming.seoMetaArabic,
      bodyEnglish: incoming.bodyEnglish,
      bodyArabic: incoming.bodyArabic,
      tags: incoming.tags,
      blogCategory: incoming.blogCategory,
      featured: incoming.featured,
      imageCarousel: incoming.imageCarousel,
      imageGalleryCreditsArabic: incoming.imageGalleryCreditsArabic,
      imageGalleryCredits: incoming.imageGalleryCredits,
      relatedEvent: incoming.relatedEvent,
      people: incoming.people,
      innovations: incoming.innovations,
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

  return {
    ...defaults,
    type: "team",
    status: incoming.status || "draft",
    slug: incoming.slug,
    title: incoming.title,
    data: {
      name: incoming.name || incoming.title, // Use name if provided, otherwise use title
      nameArabic: incoming.nameArabic,
      position: incoming.position,
      positionArabic: incoming.positionArabic,
      photo: incoming.photo,
      photoHires: incoming.photoHires,
      paragraphDescription: incoming.paragraphDescription,
      biographyArabic: incoming.biographyArabic,
      metaDescription: incoming.metaDescription,
      metaDescriptionArabic: incoming.metaDescriptionArabic,
      altTextImage: incoming.altTextImage,
      altTextImageArabic: incoming.altTextImageArabic,
      filter: incoming.filter,
      order: incoming.order,
      newsOnOff: incoming.newsOnOff || false, // Default to false if not provided
      tags: incoming.tags,
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
  | CollectionItemTeam {
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
