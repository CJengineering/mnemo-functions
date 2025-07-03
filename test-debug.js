#!/usr/bin/env node

/**
 * Debug Production API Test
 * Check response details
 */

const BASE_URL = "https://mnemo-app-e4f6j5kdsq-ew.a.run.app";

async function debugTest() {
  console.log("🔍 Debug Production API Test...");
  console.log(`📍 Testing: ${BASE_URL}`);

  try {
    // Test get all collection items with detailed response
    console.log("\n📋 Testing get all collection items...");
    const response = await fetch(`${BASE_URL}/api/collection-items`);
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);

    const responseText = await response.text();
    console.log(`Response length: ${responseText.length}`);
    console.log(`First 200 chars: ${responseText.substring(0, 200)}`);

    // Also test the health endpoint for comparison
    console.log("\n🏥 Testing health for comparison...");
    const healthResponse = await fetch(`${BASE_URL}/health`);
    console.log(`Health Status: ${healthResponse.status}`);
    console.log(
      `Health Content-Type: ${healthResponse.headers.get("content-type")}`
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

debugTest();
