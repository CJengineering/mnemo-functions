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

    moreDetails?: string;
    imageGallery?: ImageField[];
    galleryPhotoCredits?: string;

    newsOn?: boolean;
    customCodeForHidingWeglot?: string;

    group?: "COP27" | "Jameel House" | "COP28";

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
    name: string;
    nameArabic?: string;
    position?: string;
    positionArabic?: string;
    photo: ImageField; // ✅ required
    photoHires?: string; // URL
    paragraphDescription: string; // ✅ required
    biographyArabic?: string;
    metaDescription?: string;
    metaDescriptionArabic?: string;
    altTextImage?: string;
    altTextImageArabic?: string;
    filter?: 'Leadership' | 'Team' | 'Advisory Committee' | 'Alumnus' | 'COP27 Youth Delegate';
    order: number; // ✅ required
    newsOnOff?: boolean;
    tags?: { id: string; slug: string }[]; // multi-reference
  };
}
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

    type?: string; // one of: Centre, Fund, Scholarship, Project, Programme, Lab, Community Jameel
    customLink?: string;

    nameArabic?: string;
    shortNameEnglish?: string;
    shortNameArabic?: string;

    missionEnglish?: string;
    missionArabic?: string;
    description?: string; // deprecated

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

    logoSvgDark?: ImageField;
    logoSvgLight?: ImageField;
    logoSvgDarkOriginalRatio?: ImageField;
    logoSvgLightOriginalRatio?: ImageField;

    heroSquare?: ImageField; // 1x1
    heroWide?: ImageField; // 16x9
    openGraph?: ImageField;

    mainVideo?: string;

    features?: ReferenceItem[];
    partners?: ReferenceItem[];
    leadership?: ReferenceItem[];
    relatedProgrammes?: ReferenceItem[];

    longitude?: string;
    latitude?: string;

    website?: string;
    buttonText?: string;

    linkedin?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;

    order?: number;

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

    sources: ReferenceItem;
    programmeLabel: ReferenceItem;
    relatedProgrammes: ReferenceItem[];

    people?: ReferenceItem[];
    innovations?: ReferenceItem[];
    relatedEvent?: ReferenceItem;
    relatedEvents?: ReferenceItem[];

    summary?: string;
    summaryArabic?: string;
    excerpt?: string;

    thumbnail?: ImageField;
    heroImage?: ImageField;

    imageAltTextEnglish?: string; // optionally part of `thumbnail.alt`
    imageAltTextArabic?: string;

    relatedTeamMembers?: ReferenceItem[];
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
    arabicCompleteIncomplete?: boolean;
    arabicTitle?: string;
    pushToGR?: boolean;

    programmeLabel?: ReferenceItem;
    relatedProgrammes?: ReferenceItem[];

    bulletPointsEnglish?: string;
    bulletPointsArabic?: string;

    videoAsHero?: boolean;
    heroVideoYoutubeId?: string;
    heroVideoArabicYoutubeId?: string;

    thumbnail: ImageField;
    mainImage: ImageField;
    openGraphImage: ImageField;

    datePublished: string;

    location?: string;
    locationArabic?: string;

    seoTitle: string;
    seoTitleArabic?: string;
    seoMeta: string;
    seoMetaArabic?: string;

    bodyEnglish?: string;
    bodyArabic?: string;

    altTextHeroImage?: string; // optional: could be merged with mainImage.alt
    altTextHeroImageArabic?: string;

    photoCreditHeroImage?: string;
    photoCreditHeroImageArabic?: string;

    tags?: ReferenceItem[];
    blogCategory?: ReferenceItem;

    featured?: boolean;

    imageCarousel?: ImageField[];
    imageGalleryCreditsArabic?: string;
    imageGalleryCredits?: string;

    relatedEvent?: ReferenceItem;
    people?: ReferenceItem[];
    innovations?: ReferenceItem[];
  };
}
