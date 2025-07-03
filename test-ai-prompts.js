#!/usr/bin/env node

/**
 * Integration test script for AI Prompt-to-Collection Item endpoints
 * Tests both the demo and production endpoints with various prompts
 */

console.log("🤖 Testing AI Prompt-to-Collection Item Integration\n");

const testPrompts = [
  {
    name: "Event Creation",
    type: "event",
    prompt:
      "Create a Climate Innovation Summit happening on September 15, 2025 in Dubai. It should be a featured event focusing on sustainable technology breakthroughs. The event will run for 2 days with presentations from leading researchers.",
    context: "This is a high-profile event for the Community Jameel initiative",
  },
  {
    name: "Blog Post Creation",
    type: "post",
    prompt:
      "Write a blog post about artificial intelligence in healthcare, focusing on recent breakthroughs in medical diagnosis. It should be published on August 1, 2025 and featured on the homepage.",
    context: "Target audience: healthcare professionals and researchers",
  },
  {
    name: "News Article",
    type: "news",
    prompt:
      "Create a news article about a breakthrough in solar panel efficiency achieved by MIT researchers. The research was published today and shows 40% improvement in energy conversion.",
    context: "Breaking news item for immediate publication",
  },
  {
    name: "Programme Description",
    type: "programme",
    prompt:
      "Create a programme description for the 'Urban Innovation Lab' - a new initiative focused on smart city technologies, established in 2025, headquartered in Abu Dhabi.",
    context: "This is a major new research programme under Community Jameel",
  },
  {
    name: "Incomplete Event (Missing Fields)",
    type: "event",
    prompt: "Create an event called 'Innovation Workshop'",
    context: "Testing error handling for missing required fields",
  },
];

async function testPromptEndpoint(url, testCase, description) {
  console.log(`\n🔍 Testing ${description}: ${testCase.name}`);
  console.log(`📝 Prompt: "${testCase.prompt.substring(0, 80)}..."`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: testCase.prompt,
        type: testCase.type,
        context: testCase.context,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ Success!");
      console.log(`   - Type: ${result.data?.type}`);
      console.log(`   - Title: ${result.data?.data?.title}`);
      console.log(`   - Status: ${result.data?.data?.status}`);

      if (result.id) {
        console.log(`   - Database ID: ${result.id}`);
      }

      if (result.demo) {
        console.log(`   - Demo Mode: Data not saved`);
      }

      return { success: true, result };
    } else {
      console.log("⚠️ Failed - Missing Fields:");
      console.log(`   - Message: ${result.message}`);
      console.log(`   - Missing: ${result.missing?.join(", ")}`);
      if (result.suggestions) {
        console.log(
          `   - Suggestions: ${result.suggestions.slice(0, 2).join("; ")}`
        );
      }

      return { success: false, result };
    }
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runIntegrationTests() {
  console.log("🚀 Starting AI Prompt Integration Tests...\n");
  console.log(
    "⚠️  Note: These tests require a valid OpenAI API key in your .env file"
  );

  const results = {
    demo: { success: 0, failed: 0 },
    production: { success: 0, failed: 0 },
  };

  // Test demo endpoint
  console.log("\n" + "=".repeat(60));
  console.log("🧪 DEMO ENDPOINT TESTS (/api/prompt-to-item/demo)");
  console.log("=".repeat(60));

  for (const testCase of testPrompts) {
    const result = await testPromptEndpoint(
      "http://localhost:8080/api/prompt-to-item/demo",
      testCase,
      "Demo Endpoint"
    );

    if (result.success) {
      results.demo.success++;
    } else {
      results.demo.failed++;
    }
  }

  // Test production endpoint (only with complete prompts)
  console.log("\n" + "=".repeat(60));
  console.log("🚀 PRODUCTION ENDPOINT TESTS (/api/prompt-to-item)");
  console.log("=".repeat(60));

  const completePrompts = testPrompts.filter(
    (p) => p.name !== "Incomplete Event (Missing Fields)"
  );

  for (const testCase of completePrompts) {
    const result = await testPromptEndpoint(
      "http://localhost:8080/api/prompt-to-item",
      testCase,
      "Production Endpoint"
    );

    if (result.success) {
      results.production.success++;
    } else {
      results.production.failed++;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));

  console.log(`🧪 Demo Endpoint:`);
  console.log(`   ✅ Successful: ${results.demo.success}`);
  console.log(`   ❌ Failed: ${results.demo.failed}`);

  console.log(`🚀 Production Endpoint:`);
  console.log(`   ✅ Successful: ${results.production.success}`);
  console.log(`   ❌ Failed: ${results.production.failed}`);

  const totalSuccess = results.demo.success + results.production.success;
  const totalFailed = results.demo.failed + results.production.failed;

  console.log(`\n📈 Overall:`);
  console.log(`   ✅ Total Successful: ${totalSuccess}`);
  console.log(`   ❌ Total Failed: ${totalFailed}`);

  if (totalFailed === 0) {
    console.log("\n🎉 All AI prompt integration tests passed!");
    console.log(
      "🤖 The prompt-to-collection-item system is working correctly!"
    );
  } else {
    console.log("\n⚠️ Some tests failed. Check the output above for details.");
    if (totalFailed > totalSuccess) {
      console.log("💡 Make sure you have:");
      console.log("   1. A valid OpenAI API key in your .env file");
      console.log("   2. The server running on http://localhost:8080");
      console.log("   3. Database connection properly configured");
    }
  }
}

async function checkPrerequisites() {
  console.log("🔍 Checking prerequisites...\n");

  // Check server
  try {
    const response = await fetch("http://localhost:8080/health");
    if (response.ok) {
      console.log("✅ Server is running");
    } else {
      throw new Error("Server not healthy");
    }
  } catch (error) {
    console.log("❌ Server not running. Please start the server first:");
    console.log("   npm start");
    return false;
  }

  // Check OpenAI key (we can't directly check, but warn user)
  console.log("⚠️  Make sure OPENAI_API_KEY is set in your .env file");
  console.log("🔑 Without a valid API key, all tests will fail\n");

  return true;
}

// Main execution
checkPrerequisites().then((prereqsMet) => {
  if (prereqsMet) {
    runIntegrationTests();
  }
});
