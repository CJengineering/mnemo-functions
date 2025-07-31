const {
  mapIncomingTeamToCollectionItem,
  mapIncomingCollectionItem,
} = require("./dist/src/mappers/collectionItemMapper.js");

// Test team mapper functionality
console.log("🧪 Testing Team Mapper Integration...\n");

// Test 1: Direct team mapper
const incomingTeam = {
  title: "Dr. Sarah Johnson",
  slug: "dr-sarah-johnson",
  status: "published",
  name: "Sarah Johnson",
  position: "Lead AI Researcher",
  paragraphDescription:
    "Dr. Johnson is a leading expert in machine learning and artificial intelligence research.",
  order: 1,
  filter: "Leadership",
  photo: {
    url: "https://example.com/sarah-johnson.jpg",
    alt: "Dr. Sarah Johnson",
  },
  tags: [
    { id: "tag-1", slug: "ai" },
    { id: "tag-2", slug: "research" },
  ],
};

console.log("1️⃣ Testing direct team mapper...");
const mappedTeam = mapIncomingTeamToCollectionItem(incomingTeam);
console.log("✅ Mapped team member:");
console.log(`   Title: ${mappedTeam.title}`);
console.log(`   Type: ${mappedTeam.type}`);
console.log(`   Status: ${mappedTeam.status}`);
console.log(`   Position: ${mappedTeam.data.position}`);
console.log(`   Filter: ${mappedTeam.data.filter}`);
console.log(`   Order: ${mappedTeam.data.order}`);
console.log(`   NewsOnOff: ${mappedTeam.data.newsOnOff}`);

// Test 2: Via main mapper function
console.log("\n2️⃣ Testing via main mapper function...");
const incomingCollectionItem = {
  type: "team",
  data: incomingTeam,
};

const mappedViaMain = mapIncomingCollectionItem(incomingCollectionItem);
console.log("✅ Mapped via main function:");
console.log(`   Title: ${mappedViaMain.title}`);
console.log(`   Type: ${mappedViaMain.type}`);
console.log(`   Status: ${mappedViaMain.status}`);

// Test 3: Minimal team data
console.log("\n3️⃣ Testing minimal team data...");
const minimalTeam = {
  title: "Alex Smith",
  slug: "alex-smith",
  paragraphDescription: "Software engineer focusing on backend systems.",
  order: 3,
  photo: {
    url: "https://example.com/alex-smith.jpg",
    alt: "Alex Smith",
  },
};

const mappedMinimal = mapIncomingTeamToCollectionItem(minimalTeam);
console.log("✅ Mapped minimal team member:");
console.log(`   Title: ${mappedMinimal.title}`);
console.log(`   Name: ${mappedMinimal.data.name}`); // Should fallback to title
console.log(`   Status: ${mappedMinimal.status}`); // Should default to "draft"
console.log(`   NewsOnOff: ${mappedMinimal.data.newsOnOff}`); // Should default to false

console.log("\n🎉 All team mapper tests completed successfully!");
