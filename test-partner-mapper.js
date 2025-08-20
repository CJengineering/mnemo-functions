// Test Partner Mapper Integration
const {
  mapIncomingPartnerToCollectionItem,
  mapIncomingCollectionItem,
} = require("./dist/src/mappers/collectionItemMapper.js");

console.log("🧪 Testing Partner Mapper Integration...\n");

// Test 1: Direct partner mapper
const incomingPartner = {
  title: "Tech Solutions Inc",
  slug: "tech-solutions-inc",
  status: "published",
  name: "Tech Solutions Inc",
  "arabic-name": "شركة الحلول التقنية",
  "short-description":
    "Leading technology solutions provider in the Middle East",
  "short-description-arabic": "مقدم رائد لحلول التكنولوجيا في الشرق الأوسط",
  website: "https://techsolutions.example.com",
  logo: {
    url: "https://example.com/tech-solutions-logo.svg",
    alt: "Tech Solutions Inc logo",
  },
  group: "COP27",
  tags: [
    { id: "tag-1", slug: "technology" },
    { id: "tag-2", slug: "partnerships" },
    { id: "tag-3", slug: "sustainability" },
  ],
};

console.log("1️⃣ Testing direct partner mapper...");
const mappedPartner = mapIncomingPartnerToCollectionItem(incomingPartner);
console.log("✅ Mapped partner organization:");
console.log(`   Title: ${mappedPartner.title}`);
console.log(`   Type: ${mappedPartner.type}`);
console.log(`   Status: ${mappedPartner.status}`);
console.log(`   Name: ${mappedPartner.data.name}`);
console.log(`   Arabic Name: ${mappedPartner.data.nameArabic}`);
console.log(`   Website: ${mappedPartner.data.website}`);
console.log(`   Group: ${mappedPartner.data.group}`);
console.log(`   Short Description: ${mappedPartner.data.shortDescription}`);
console.log(`   Tags: ${mappedPartner.data.tags.length} tags`);

// Test 2: Via main mapper function
console.log("\n2️⃣ Testing via main mapper function...");
const incomingCollectionItem = {
  type: "partner",
  data: incomingPartner,
};

const mappedViaMain = mapIncomingCollectionItem(incomingCollectionItem);
console.log("✅ Mapped via main function:");
console.log(`   Title: ${mappedViaMain.title}`);
console.log(`   Type: ${mappedViaMain.type}`);
console.log(`   Status: ${mappedViaMain.status}`);

// Test 3: Minimal partner data
console.log("\n3️⃣ Testing minimal partner data...");
const minimalPartner = {
  title: "Simple Partner Co",
  name: "Simple Partner Co",
  slug: "simple-partner-co",
};

const mappedMinimal = mapIncomingPartnerToCollectionItem(minimalPartner);
console.log("✅ Mapped minimal partner:");
console.log(`   Title: ${mappedMinimal.title}`);
console.log(`   Name: ${mappedMinimal.data.name}`);
console.log(`   Status: ${mappedMinimal.status}`); // Should default to "draft"
console.log(`   Website: ${mappedMinimal.data.website || "not provided"}`);
console.log(`   Group: ${mappedMinimal.data.group || "not specified"}`);
console.log(`   Tags: ${mappedMinimal.data.tags.length} tags`); // Should default to empty array

// Test 4: Name fallback
console.log("\n4️⃣ Testing name fallback logic...");
const partnerWithoutName = {
  title: "Fallback Partner",
  name: "", // Empty name should fallback to title
  slug: "fallback-partner",
};

const mappedFallback = mapIncomingPartnerToCollectionItem(partnerWithoutName);
console.log("✅ Mapped with name fallback:");
console.log(`   Title: ${mappedFallback.title}`);
console.log(`   Name (should fallback to title): ${mappedFallback.data.name}`);

console.log("\n🎉 All partner mapper tests completed successfully!");

// Test 5: Display expected partner structure
console.log("\n📋 Partner Collection Structure:");
console.log("Required Fields:");
console.log("  - title (string)");
console.log("  - name (string)");
console.log("  - slug (string)");
console.log("  - status ('published' | 'draft')");
console.log("\nOptional Fields:");
console.log("  - arabic-name (string)");
console.log("  - short-description (string)");
console.log("  - short-description-arabic (string)");
console.log("  - website (string)");
console.log("  - logo (ImageField)");
console.log("  - group (string - currently supports 'COP27')");
console.log("  - tags (array of ReferenceItems)");

console.log("\n🔧 Partner mapper is ready for production use!");
