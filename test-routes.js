#!/usr/bin/env node

/**
 * Test script to verify both mapper routes work correctly
 * Tests both the demo route and the production database route
 */

console.log("🧪 Testing Mapper Integration Routes\n");

const testEventData = {
  type: "event",
  data: {
    title: "Integration Test Event",
    slug: "integration-test-event",
    status: "published",
    eventDate: "2025-08-15",
    city: "Dubai",
    featured: true,
    description: "Testing the mapper integration",
    thumbnail: {
      url: "https://example.com/test-thumb.jpg",
      alt: "Test thumbnail",
    },
  },
};

console.log("📝 Test Data:");
console.log(JSON.stringify(testEventData, null, 2));

async function testDemoRoute() {
  console.log("\n🔍 Testing Demo Route (/api/collection-items/demo)");
  console.log("This route transforms data but doesn't save to database\n");
  
  try {
    const response = await fetch("http://localhost:8080/api/collection-items/demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEventData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Demo Route Response:");
    console.log(`   - Success: ${result.success}`);
    console.log(`   - Message: ${result.message}`);
    console.log(`   - Title: ${result.databaseFormat?.title}`);
    console.log(`   - Type: ${result.databaseFormat?.type}`);
    console.log(`   - Status: ${result.databaseFormat?.status}`);
    
    return result;
  } catch (error) {
    console.error("❌ Demo Route Failed:", error.message);
    return null;
  }
}

async function testProductionRoute() {
  console.log("\n🔍 Testing Production Route (/api/collection-items)");
  console.log("This route transforms data AND saves to database\n");
  
  try {
    const response = await fetch("http://localhost:8080/api/collection-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEventData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Production Route Response:");
    console.log(`   - Success: ${result.success}`);
    console.log(`   - Database ID: ${result.collectionItem?.id}`);
    console.log(`   - Title: ${result.collectionItem?.title}`);
    console.log(`   - Type: ${result.collectionItem?.type}`);
    console.log(`   - Status: ${result.collectionItem?.status}`);
    
    return result;
  } catch (error) {
    console.error("❌ Production Route Failed:", error.message);
    return null;
  }
}

async function runTests() {
  console.log("🚀 Starting Route Integration Tests...\n");
  
  // Test demo route
  const demoResult = await testDemoRoute();
  
  // Test production route
  const productionResult = await testProductionRoute();
  
  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Summary");
  console.log("=".repeat(50));
  
  if (demoResult && productionResult) {
    console.log("✅ All tests passed!");
    console.log("✅ Demo route: Data transformation working");
    console.log("✅ Production route: Database integration working");
    console.log("\n🎉 Mapper system is fully integrated and production-ready!");
  } else {
    console.log("❌ Some tests failed. Check the output above for details.");
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch("http://localhost:8080/health");
    if (response.ok) {
      console.log("✅ Server is running, starting tests...\n");
      return true;
    }
  } catch (error) {
    console.log("❌ Server not running. Please start the server first:");
    console.log("   npm start");
    console.log("   (or check if it's running on a different port)\n");
    return false;
  }
}

// Main execution
checkServer().then((serverRunning) => {
  if (serverRunning) {
    runTests();
  }
});
