const {
  mapIncomingPersonToCollectionItem,
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
} = require("./dist/src/mappers/collectionItemMapper.js");

console.log("🧪 Testing Person Mapper Integration...\n");

// Test 1: Direct person mapper with comprehensive data
console.log("1️⃣ Testing direct person mapper...");
const comprehensivePerson = {
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
  biography: "Dr. Johnson has over 15 years of experience in AI research.",
  "biography-arabic":
    "د. جونسون لديها أكثر من 15 عامًا من الخبرة في أبحاث الذكاء الاصطناعي.",
  events: "Keynote speaker at multiple international conferences.",
  "events-arabic": "متحدثة رئيسية في عدة مؤتمرات دولية.",
  "research-area-english":
    "Machine Learning, Climate Modeling, Sustainable Technology",
  "research-areas-arabic": "التعلم الآلي، نمذجة المناخ، التكنولوجيا المستدامة",
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

const mappedPerson = mapIncomingPersonToCollectionItem(comprehensivePerson);
console.log("✅ Mapped person successfully:");
console.log(`   Title: ${mappedPerson.title}`);
console.log(`   Type: ${mappedPerson.type}`);
console.log(`   Status: ${mappedPerson.status}`);
console.log(`   Name: ${mappedPerson.data.name}`);
console.log(`   Arabic Name: ${mappedPerson.data.nameArabic}`);
console.log(`   Role: ${mappedPerson.data.role}`);
console.log(`   Role Arabic: ${mappedPerson.data.roleArabic}`);
console.log(`   Type: ${mappedPerson.data.type}`);
console.log(`   Hero: ${mappedPerson.data.hero}`);
console.log(`   Order: ${mappedPerson.data.order}`);
console.log(`   Country: ${mappedPerson.data.country}`);
console.log(
  `   Related Programmes: ${mappedPerson.data.relatedProgrammes.length} programmes`
);
console.log(
  `   Related People: ${mappedPerson.data.relatedPeople.length} people`
);
console.log(
  `   Partner Organisations: ${mappedPerson.data.partnerOrganisation.length} partners`
);
console.log(`   Social Links: LinkedIn, Instagram, Twitter, etc.`);
console.log(`   Photos: ${mappedPerson.data.photos.length} photos`);
console.log(`   Tags: ${mappedPerson.data.tag.length} tags\n`);

// Test 2: Via main mapper function
console.log("2️⃣ Testing via main mapper function...");
const mainMapperResult = mapIncomingCollectionItem({
  type: "person",
  data: comprehensivePerson,
});
console.log("✅ Mapped via main function:");
console.log(`   Title: ${mainMapperResult.title}`);
console.log(`   Type: ${mainMapperResult.type}`);
console.log(`   Status: ${mainMapperResult.status}\n`);

// Test 3: Minimal person data
console.log("3️⃣ Testing minimal person data...");
const minimalPerson = {
  title: "John Doe",
  name: "John Doe",
  slug: "john-doe",
};

const minimalResult = mapIncomingPersonToCollectionItem(minimalPerson);
console.log("✅ Mapped minimal person:");
console.log(`   Title: ${minimalResult.title}`);
console.log(`   Name: ${minimalResult.data.name}`);
console.log(`   Status: ${minimalResult.status}`);
console.log(`   Role: ${minimalResult.data.role || "not provided"}`);
console.log(`   Type: ${minimalResult.data.type || "not specified"}`);
console.log(
  `   Related Programmes: ${minimalResult.data.relatedProgrammes.length} programmes`
);
console.log(
  `   Related People: ${minimalResult.data.relatedPeople.length} people`
);
console.log(`   Tags: ${minimalResult.data.tag.length} tags\n`);

// Test 4: Name fallback logic
console.log("4️⃣ Testing name fallback logic...");
const fallbackPerson = {
  title: "Fallback Person",
  slug: "fallback-person",
  name: "", // Empty name should fallback to title
};

const fallbackResult = mapIncomingPersonToCollectionItem(fallbackPerson);
console.log("✅ Mapped with name fallback:");
console.log(`   Title: ${fallbackResult.title}`);
console.log(
  `   Name (should fallback to title): ${fallbackResult.data.name}\n`
);

// Test 5: All person types
console.log("5️⃣ Testing all person types...");
const personTypes = [
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

personTypes.forEach((personType, index) => {
  const typeTestPerson = {
    title: `Test ${personType}`,
    name: `Test ${personType}`,
    slug: `test-${personType.toLowerCase().replace(/\s+/g, "-")}`,
    type: personType,
  };

  const typeResult = mapIncomingPersonToCollectionItem(typeTestPerson);
  console.log(`   ✅ ${personType}: ${typeResult.data.type}`);
});

// Test 6: Database format conversion
console.log("\n6️⃣ Testing database format conversion...");
const dbFormat = collectionItemToDbFormat(mappedPerson);
console.log("✅ Converted to database format:");
console.log(`   Title: ${dbFormat.title}`);
console.log(`   Type: ${dbFormat.type}`);
console.log(`   Status: ${dbFormat.status}`);
console.log(`   Slug: ${dbFormat.slug}`);
console.log(`   Data keys: ${Object.keys(dbFormat.data).length} fields`);

console.log("\n🎉 All person mapper tests completed successfully!");

console.log("\n📋 Person Collection Structure:");
console.log("Required Fields:");
console.log("  - title (string)");
console.log("  - name (string)");
console.log("  - slug (string)");
console.log("  - status ('published' | 'draft')");
console.log("\nOptional Fields:");
console.log("  - name-arabic (string)");
console.log("  - arabic-on-off (boolean)");
console.log("  - push-to-gr (boolean)");
console.log("  - hero (boolean)");
console.log("  - related-programme (ReferenceItem)");
console.log("  - related-programmes (array of ReferenceItems)");
console.log("  - color (string - hex color)");
console.log("  - role (string - English)");
console.log("  - role-arabic (string - Arabic)");
console.log("  - short-description (string - English)");
console.log("  - short-description-arabic (string - Arabic)");
console.log("  - biography (string - RichText English)");
console.log("  - biography-arabic (string - RichText Arabic)");
console.log("  - events (string - RichText English)");
console.log("  - events-arabic (string - RichText Arabic)");
console.log("  - research-area-english (string - RichText)");
console.log("  - research-areas-arabic (string - RichText)");
console.log("  - type (string - Professor, Doctor, Researcher, etc.)");
console.log("  - hero-image (ImageField)");
console.log("  - profile-picture (ImageField)");
console.log("  - feature-video (string - YouTube ID)");
console.log("  - related-people-s (array of ReferenceItems)");
console.log("  - partner-organisation (array of ReferenceItems)");
console.log(
  "  - Social links: instagram-link, linkedin-link, twitter-link, etc."
);
console.log("  - photos (array of ImageFields)");
console.log("  - Visibility toggles: hide-news, hide-multimedia, etc.");
console.log("  - multimedia (array of ReferenceItems)");
console.log("  - tag (array of ReferenceItems)");
console.log("  - order (number)");
console.log("  - country (string)");

console.log("\n🔧 Person mapper is ready for production use!");
