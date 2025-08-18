// Incoming interfaces for frontend form data
// These represent the simplified data structure that the frontend will send

interface IncomingImageField {
  url: string;
  alt: string;
}

interface IncomingReferenceItem {
  id: string;
  slug: string;
}

// Incoming Event Data from Frontend Form
export interface IncomingEventData {
  openGraphImage: IncomingImageField;
  title: string;
  description?: string;
  slug: string;
  status?: 'published' | 'draft';

  // Event specific fields
  arabicTitle?: string;

  seoTitle?: string;
  seoMetaDescription?: string;
  teaserText?: string;
  shortDescription?: string;
  richText?: string;

  // Event details

  eventDate?: string;
  endDate?: string;
  time?: string;
  city?: string;
  address?: string;
  locationLink?: string;
  extraLocationInformation?: string;

  // Links and CTAs
  rsvpLink?: string;
  contactDetails?: string;
  livestreamLink?: string;
  ctaLink?: string;
  buttonCtaText?: string;
  attendanceType?: string;

  // Media
  thumbnail?: IncomingImageField;
  heroImage?: IncomingImageField;
  imageGallery?: IncomingImageField[];
  galleryPhotoCredits?: string;

  // Video fields
  videoAsHero?: boolean;
  mainVideo?: string;
  mainVideoEmbedCode?: string;
  video2?: string;
  video2EmbedCode?: string;
  video3?: string;
  video3EmbedCode?: string;

  // Rich text content fields
  signupEmbed?: string;
  moreInformation?: string;
  moreDetails?: string;
  relatedPeopleRichText?: string;
  inTheMedia?: string;
  customCodeForHidingWeglot?: string;

  // Boolean toggles
  pushToGr?: boolean;
  pushToGR?: boolean; // Keep both for compatibility
  newsOnOff?: boolean;
  moreDetailsOnOff?: boolean;
  inTheMediaOnOff?: boolean;
  featured?: boolean;

  // References
  group?: string;
  programmeLabel?: IncomingReferenceItem;
  relatedProgrammes?: IncomingReferenceItem[];
  tags?: IncomingReferenceItem[];
  relatedPeople?: IncomingReferenceItem[];
  organisers?: IncomingReferenceItem[];
  partners?: IncomingReferenceItem[];
  withRepresentativesFrom?: IncomingReferenceItem[];
}
// Incoming Programme Data from Frontend Form
export interface IncomingProgrammeData {
  title: string;
  description?: string;
  slug: string;
  status?: "published" | "draft";

  // Programme specific fields
  type?:
    | "Centre"
    | "Fund"
    | "Scholarship"
    | "Project"
    | "Programme"
    | "Lab"
    | "Community Jameel";
  nameArabic?: string;
  shortNameEnglish?: string;
  shortNameArabic?: string;

  // Content
  missionEnglish?: string;
  missionArabic?: string;
  summaryEnglish?: string;
  summaryArabic?: string;
  summaryLongEnglish?: string;
  summaryLongArabic?: string;
  oldMissionEnglish?: string;
  researchEnglish?: string;
  researchArabic?: string;

  // Details
  yearEstablished?: number;
  yearClosed?: number;
  headquartersEnglish?: string;
  headquartersArabic?: string;

  // Media
  logoSvgDark?: IncomingImageField;
  logoSvgLight?: IncomingImageField;
  logoSvgDarkOriginal?: IncomingImageField;
  logoSvgLightOriginal?: IncomingImageField;
  heroSquare?: IncomingImageField;
  heroWide?: IncomingImageField;
  hero1x1?: IncomingImageField;
  hero16x9?: IncomingImageField;
  heroImage?: IncomingImageField;
  thumbnail?: IncomingImageField;
  openGraph?: IncomingImageField;

  // Video & Links
  mainVideo?: string;
  customLink?: string;
  buttonText?: string;

  // Location
  longitude?: string;
  latitude?: string;

  // External links
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;

  // Relations
  partners?: IncomingReferenceItem[];
  leadership?: IncomingReferenceItem[];
  relatedProgrammes?: IncomingReferenceItem[];
  features?: IncomingReferenceItem[];

  // Impact metrics
  impact01?: string;
  impact01TitleArabic?: string;
  impact02?: string;
  impact02TitleArabic?: string;
  impact03?: string;
  impact03TitleArabic?: string;
  impact04?: string;
  impact04TitleArabic?: string;
  impact05?: string;
  impact05TitleArabic?: string;
  impact06?: string;
  impact06TitleArabic?: string;

  // Flags
  lab?: boolean;
  pushToGR?: boolean;
  order?: number;
}

// Incoming News Data from Frontend Form
export interface IncomingNewsData {
  title: string;
  description?: string;
  slug: string;
  status?: "published" | "draft";

  // News specific fields
  arabicTitle?: string;
  summary?: string;
  summaryArabic?: string;
  excerpt?: string;

  // External data
  externalLink: string;
  datePublished: string;

  // Media
  thumbnail?: IncomingImageField;
  heroImage?: IncomingImageField;

  // Relations (required for news)
  sources: IncomingReferenceItem;
  programmeLabel: IncomingReferenceItem;
  relatedProgrammes: IncomingReferenceItem[];

  // Optional relations
  people?: IncomingReferenceItem[];
  innovations?: IncomingReferenceItem[];
  relatedEvent?: IncomingReferenceItem;
  relatedEvents?: IncomingReferenceItem[];
  tags?: IncomingReferenceItem[];

  // Flags
  featured?: boolean;
  pushToGR?: boolean;
  removeFromNewsGrid?: boolean;
}

// Incoming Post Data from Frontend Form
export interface IncomingPostData {
  title: string;
  description?: string;
  slug: string;
  status?: "published" | "draft";

  // Post specific fields
  arabicTitle?: string;
  datePublished: string;
  location?: string;
  locationArabic?: string;

  // SEO
  seoTitle: string;
  seoTitleArabic?: string;
  seoMeta: string;
  seoMetaArabic?: string;

  // Content
  bodyEnglish?: string;
  bodyArabic?: string;
  bulletPointsEnglish?: string;
  bulletPointsArabic?: string;

  // Media (required for posts)
  thumbnail: IncomingImageField;
  mainImage: IncomingImageField;
  openGraphImage: IncomingImageField;

  // Video
  heroVideoYoutubeId?: string;
  heroVideoArabicYoutubeId?: string;

  // Relations
  programmeLabel?: IncomingReferenceItem;
  relatedProgrammes?: IncomingReferenceItem[];
  tags?: IncomingReferenceItem[];
  blogCategory?: IncomingReferenceItem;
  relatedEvent?: IncomingReferenceItem;
  people?: IncomingReferenceItem[];
  innovations?: IncomingReferenceItem[];

  // Image gallery
  imageCarousel?: IncomingImageField[];
  imageGalleryCredits?: string;
  imageGalleryCreditsArabic?: string;

  // Flags
  featured?: boolean;
  pushToGR?: boolean;
  videoAsHero?: boolean;
  arabicCompleteIncomplete?: boolean;
}

// Incoming Source Data from Frontend Form
export interface IncomingSourceData {
  title: string;
  description?: string;
  slug: string;
  status?: "published" | "draft";

  // Source specific fields
  nameArabic?: string;
  shortNameEnglish?: string;
  shortNameArabic?: string;

  // Media
  logo?: IncomingImageField;
  logoNative?: IncomingImageField;
}

// Incoming Team Data from Frontend Form
export interface IncomingTeamData {
  title: string; // This will map to both title and data.name
  slug: string;
  status?: "published" | "draft";

  // Team member specific fields
  name?: string; // Optional, will use title if not provided
  nameArabic?: string;
  position?: string;
  positionArabic?: string;
  paragraphDescription: string;
  biographyArabic?: string;
  metaDescription?: string;
  metaDescriptionArabic?: string;
  altTextImage?: string;
  altTextImageArabic?: string;
  filter?:
    | "Leadership"
    | "Team"
    | "Advisory Committee"
    | "Alumnus"
    | "COP27 Youth Delegate";
  order: number;
  newsOnOff?: boolean;

  // Media
  photo: IncomingImageField; // Required
  photoHires?: string; // URL

  // Relations
  tags?: IncomingReferenceItem[];
}

// Union type for all incoming data types
export type IncomingCollectionItemData =
  | IncomingEventData
  | IncomingProgrammeData
  | IncomingNewsData
  | IncomingPostData
  | IncomingSourceData
  | IncomingTeamData;

// Type discriminator for the frontend to specify which type they're sending
export interface IncomingCollectionItem {
  type: "event" | "programme" | "news" | "post" | "source" | "team";
  data: IncomingCollectionItemData;
}
