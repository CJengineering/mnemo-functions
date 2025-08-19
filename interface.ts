interface ImageField {
  url: string;
  alt: string;
}

interface ReferenceItem {
  id: string;
  slug: string;
}
export interface CollectionItemEvent {
  id: string;
  type: "event";
  status: "published" | "draft";
  slug: string;
  title: string; // maps to "name"
  created_at: string;
  updated_at: string;

  data: {
    pushToGR?: boolean;

    programmeLabel?: ReferenceItem;
    relatedProgrammes?: ReferenceItem[];

    videoAsHero?: boolean;

    thumbnail?: ImageField;
    heroImage?: ImageField;
    openGraphImage?: ImageField;

    heroImageCaption?: string;
    featured?: boolean;

    arabicTitle?: string;

    seoMetaDescription?: string;
    seoTitle?: string;

    teaserText?: string;
    signupEmbed?: string;
    shortDescription?: string;

    eventDate?: string;
    endDate?: string;
    time?: string;

    city?: string;
    address?: string;
    locationLink?: string;
    extraLocationInformation?: string;

    livestreamLink?: string;
    attendanceType?: string;
    contactDetails?: string;

    buttonCtaText?: string;
    rsvpLink?: string;

    mainVideo?: string;
    mainVideoEmbedCode?: string;
    video2?: string;
    video2EmbedCode?: string;
    video3?: string;
    video3EmbedCode?: string;

    tags?: ReferenceItem[];
    relatedPeople?: ReferenceItem[];
    relatedPeopleRichText?: string;

    organisers?: ReferenceItem[];
    partners?: ReferenceItem[];
    participantsAffiliatedInstitutions?: ReferenceItem[];
    withRepresentativesFrom?: ReferenceItem[];

    moreDetails?: string;
    moreInformation?: string;
    imageGallery?: ImageField[];
    galleryPhotoCredits?: string;

    newsOn?: boolean;
    customCodeForHidingWeglot?: string;

    group?: string;

    inTheMedia?: string;

    moreDetailsOn?: boolean;
    inTheMediaOn?: boolean;
  };
}
interface ImageField {
  url: string;
  alt: string;
}

interface ReferenceItem {
  id: string;
  slug: string;
}
export interface CollectionItemTeam {
  id: string;
  type: "team";
  status: "published" | "draft";
  slug: string;
  title: string; // maps to "name"
  created_at: string;
  updated_at: string;

  data: {
    // Personal
    name: string;
    nameArabic?: string;
    position?: string;
    positionArabic?: string;

    // Images (photo required)
    photo: ImageField;
    photoHires?: string; // URL
    altTextImage?: string;
    altTextImageArabic?: string;

    // Bio
    paragraphDescription: string;
    biographyArabic?: string;

    // Meta
    metaDescription?: string;
    metaDescriptionArabic?: string;

    // Categorization
    filter?:
      | "Leadership"
      | "Team"
      | "Advisory Committee"
      | "Alumnus"
      | "COP27 Youth Delegate";
    order: number;

    // Settings
    newsOnOff?: boolean;
    tags?: ReferenceItem[];
  };
}
type ProgrammeType =
  | "Centre"
  | "Fund"
  | "Scholarship"
  | "Project"
  | "Programme"
  | "Lab"
  | "Community Jameel";

export interface CollectionItemProgramme {
  id: string;
  type: "programme";
  status: "published" | "draft";
  slug: string;
  title: string; // maps to "name"
  created_at: string;
  updated_at: string;

  data: {
    lab?: boolean;
    pushToGR?: boolean;

    // Programme classification (kept as 'type' inside data)
    type?: ProgrammeType;
    customLink?: string;

    nameArabic?: string;
    shortNameEnglish?: string;
    shortNameArabic?: string;

    missionEnglish?: string;
    missionArabic?: string;
    /** Deprecated */
    description?: string;
    oldMissionEnglish?: string;

    summaryEnglish?: string;
    summaryArabic?: string;
    summaryLongEnglish?: string;
    summaryLongArabic?: string;

    researchEnglish?: string;
    researchArabic?: string;

    yearEstablished?: number;
    yearClosed?: number;

    headquartersArabic?: string;
    headquartersEnglish?: string;

    // Logos
    logoSvgDark?: ImageField;
    logoSvgLight?: ImageField;
    logoSvgDarkOriginal?: ImageField; // ✅ align with mapper
    logoSvgLightOriginal?: ImageField; // ✅ align with mapper

    // Hero / images
    heroSquare?: ImageField; // 1x1
    heroWide?: ImageField; // 16x9
    hero1x1?: ImageField; // additional 1x1 format
    hero16x9?: ImageField; // additional 16x9 format
    heroImage?: ImageField; // ✅ mapper uses this
    thumbnail?: ImageField; // additional thumbnail field
    openGraph?: ImageField;

    // Video & links
    mainVideo?: string;

    // Relations
    features?: ReferenceItem[];
    partners?: ReferenceItem[];
    leadership?: ReferenceItem[];
    relatedProgrammes?: ReferenceItem[];

    // Location
    longitude?: string;
    latitude?: string;

    // External links
    website?: string;
    buttonText?: string;

    linkedin?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;

    // Ordering
    order?: number;

    // Impact metrics
    impact01?: string;
    impact01Title?: string;
    impact01TitleArabic?: string;

    impact02?: string;
    impact02Title?: string;
    impact02TitleArabic?: string;

    impact03?: string;
    impact03Title?: string;
    impact03TitleArabic?: string;

    impact04?: string;
    impact04Title?: string;
    impact04TitleArabic?: string;

    impact05?: string;
    impact05Title?: string;
    impact05TitleArabic?: string;

    impact06?: string;
    impact06Title?: string;
    impact06TitleArabic?: string;
  };
}

export interface CollectionItemNews {
  id: string;
  type: "news";
  status: "published" | "draft";
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;

  data: {
    arabicTitle?: string;
    pushToGR?: boolean;
    featured?: boolean;

    externalLink: string;
    datePublished: string;

    // Optional to align with incoming payloads
    sources?: ReferenceItem;
    programmeLabel?: ReferenceItem;
    relatedProgrammes?: ReferenceItem[];

    people?: ReferenceItem[];
    innovations?: ReferenceItem[];
    relatedEvent?: ReferenceItem;
    relatedEvents?: ReferenceItem[];

    summary?: string;
    summaryArabic?: string;
    excerpt?: string;

    thumbnail?: ImageField;
    heroImage?: ImageField;

    imageAltTextEnglish?: string; // also copied into image.alt if not provided
    imageAltTextArabic?: string;

    relatedTeamMembers?: ReferenceItem[]; // from incoming.relatedCjTeamMembers
    tags?: ReferenceItem[];

    removeFromNewsGrid?: boolean;
  };
}

export interface CollectionItemSource {
  id: string;
  type: "source";
  status: "published" | "draft";
  slug: string;
  title: string; // maps from "name"
  created_at: string;
  updated_at: string;

  data: {
    nameArabic?: string;
    shortNameEnglish?: string;
    shortNameArabic?: string;

    logo?: ImageField;
    logoNative?: ImageField;
  };
}
export interface CollectionItemPost {
  id: string;
  type: "post";
  status: "published" | "draft";
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;

  data: {
    // Flags
    arabicCompleteIncomplete?: boolean;
    pushToGR?: boolean;
    featured?: boolean;
    sitemapIndexing?: boolean;

    // Titles / relations
    arabicTitle?: string;
    programmeLabel?: ReferenceItem;
    relatedProgrammes?: ReferenceItem[];

    // Content
    bulletPointsEnglish?: string;
    bulletPointsArabic?: string;
    bodyEnglish?: string;
    bodyArabic?: string;

    // Video
    videoAsHero?: boolean;
    heroVideoYoutubeId?: string;
    heroVideoArabicYoutubeId?: string;

    // Media (required)
    thumbnail: ImageField;
    mainImage: ImageField;
    openGraphImage: ImageField;
    // Also keep the source hero image you receive (useful for fallbacks/edits)
    heroImage?: ImageField;

    // Dates / location
    datePublished: string;
    location?: string;
    locationArabic?: string;

    // SEO
    seoTitle: string;
    seoTitleArabic?: string;
    seoMeta: string;
    seoMetaArabic?: string;

    // Image metadata
    altTextHeroImage?: string;
    altTextHeroImageArabic?: string;
    photoCreditHeroImage?: string;
    photoCreditHeroImageArabic?: string;

    // Taxonomy / relations
    tags?: ReferenceItem[];
    blogCategory?: ReferenceItem;
    relatedEvent?: ReferenceItem;
    people?: ReferenceItem[];
    innovations?: ReferenceItem[];

    // Gallery
    imageCarousel?: ImageField[];
    imageGalleryCredits?: string;
    imageGalleryCreditsArabic?: string;
  };
}
