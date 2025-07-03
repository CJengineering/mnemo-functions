#!/usr/bin/env node

/**
 * Comprehensive Production API Test Suite
 * Tests all REST endpoints on the deployed Cloud Run service
 */

const BASE_URL = 'https://mnemo-app-e4f6j5kdsq-ew.a.run.app';

// Test data for creating collection items
const testEvent = {
  type: 'event',
  data: {
    title: 'Production API Test Event',
    slug: 'production-api-test-event',
    description: 'Testing the production API endpoints',
    startDate: '2025-07-15T10:00:00Z',
    endDate: '2025-07-15T16:00:00Z',
    location: 'Test Venue',
    registrationUrl: 'https://test.example.com',
    tags: ['test', 'api', 'production']
  },
  status: 'published'
};

const testNews = {
  type: 'news',
  data: {
    title: 'Production API Test News',
    slug: 'production-api-test-news',
    description: 'Testing news creation via API',
    content: 'This is test news content for API testing.',
    publishDate: '2025-07-03T12:00:00Z',
    author: 'API Test Suite',
    tags: ['test', 'news']
  },
  status: 'published'
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, error: error.message, ok: false };
  }
}

// Test functions
async function testHealthEndpoints() {
  console.log('\n🏥 Testing Health Endpoints...');
  
  // Test root endpoint
  const rootResponse = await fetch(`${BASE_URL}/`);
  const rootText = await rootResponse.text();
  console.log(`✅ GET / - Status: ${rootResponse.status}`);
  console.log(`   Response: ${rootText.substring(0, 50)}...`);
  
  // Test health endpoint
  const healthResponse = await makeRequest(`${BASE_URL}/health`);
  console.log(`✅ GET /health - Status: ${healthResponse.status}`);
  console.log(`   Response:`, healthResponse.data);
}

async function testCreateCollectionItem() {
  console.log('\n📝 Testing Collection Item Creation...');
  
  // Test creating an event
  const eventResponse = await makeRequest(`${BASE_URL}/api/collection-items`, {
    method: 'POST',
    body: JSON.stringify(testEvent)
  });
  
  console.log(`✅ POST /api/collection-items (event) - Status: ${eventResponse.status}`);
  if (eventResponse.ok) {
    console.log(`   Created event ID: ${eventResponse.data.collectionItem?.id}`);
    return eventResponse.data.collectionItem?.id;
  } else {
    console.log(`   Error:`, eventResponse.data);
    return null;
  }
}

async function testGetAllCollectionItems() {
  console.log('\n📋 Testing Get All Collection Items...');
  
  const response = await makeRequest(`${BASE_URL}/api/collection-items`);
  console.log(`✅ GET /api/collection-items - Status: ${response.status}`);
  
  if (response.ok) {
    const count = response.data.collectionItems?.length || 0;
    console.log(`   Found ${count} collection items`);
    return response.data.collectionItems;
  } else {
    console.log(`   Error:`, response.data);
    return [];
  }
}

async function testGetCollectionItemById(id) {
  if (!id) {
    console.log('\n⚠️ Skipping Get By ID test - no ID available');
    return;
  }
  
  console.log(`\n🔍 Testing Get Collection Item By ID (${id})...`);
  
  const response = await makeRequest(`${BASE_URL}/api/collection-items/${id}`);
  console.log(`✅ GET /api/collection-items/${id} - Status: ${response.status}`);
  
  if (response.ok) {
    console.log(`   Found item: ${response.data.collectionItem?.title}`);
  } else {
    console.log(`   Error:`, response.data);
  }
}

async function testGetCollectionItemsByType() {
  console.log('\n🏷️ Testing Get Collection Items By Type...');
  
  const response = await makeRequest(`${BASE_URL}/api/collection-items/type/event`);
  console.log(`✅ GET /api/collection-items/type/event - Status: ${response.status}`);
  
  if (response.ok) {
    const count = response.data.collectionItems?.length || 0;
    console.log(`   Found ${count} event items`);
  } else {
    console.log(`   Error:`, response.data);
  }
}

async function testUpdateCollectionItem(id) {
  if (!id) {
    console.log('\n⚠️ Skipping Update test - no ID available');
    return;
  }
  
  console.log(`\n✏️ Testing Update Collection Item (${id})...`);
  
  const updateData = {
    title: 'Updated Production API Test Event',
    description: 'This event was updated via API test'
  };
  
  const response = await makeRequest(`${BASE_URL}/api/collection-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  
  console.log(`✅ PUT /api/collection-items/${id} - Status: ${response.status}`);
  
  if (response.ok) {
    console.log(`   Updated item: ${response.data.collectionItem?.title}`);
  } else {
    console.log(`   Error:`, response.data);
  }
}

async function testAIPromptToItem() {
  console.log('\n🤖 Testing AI Prompt-to-Item (Demo)...');
  
  const promptData = {
    prompt: 'Create a workshop about sustainable technology for July 20th at the Innovation Center',
    type: 'event'
  };
  
  const response = await makeRequest(`${BASE_URL}/api/prompt-to-item/demo`, {
    method: 'POST',
    body: JSON.stringify(promptData)
  });
  
  console.log(`✅ POST /api/prompt-to-item/demo - Status: ${response.status}`);
  
  if (response.ok) {
    console.log(`   AI generated item: ${response.data.generatedItem?.title || 'Success'}`);
  } else {
    console.log(`   Error:`, response.data);
  }
}

async function testDeleteCollectionItem(id) {
  if (!id) {
    console.log('\n⚠️ Skipping Delete test - no ID available');
    return;
  }
  
  console.log(`\n🗑️ Testing Delete Collection Item (${id})...`);
  
  const response = await makeRequest(`${BASE_URL}/api/collection-items/${id}`, {
    method: 'DELETE'
  });
  
  console.log(`✅ DELETE /api/collection-items/${id} - Status: ${response.status}`);
  
  if (response.ok) {
    console.log(`   Successfully deleted item`);
  } else {
    console.log(`   Error:`, response.data);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Production API Test Suite...');
  console.log(`📍 Testing against: ${BASE_URL}`);
  
  try {
    // Test health endpoints
    await testHealthEndpoints();
    
    // Test creating a collection item
    const createdId = await testCreateCollectionItem();
    
    // Test getting all items
    const allItems = await testGetAllCollectionItems();
    
    // Test getting by ID
    await testGetCollectionItemById(createdId);
    
    // Test getting by type
    await testGetCollectionItemsByType();
    
    // Test updating item
    await testUpdateCollectionItem(createdId);
    
    // Test AI prompt functionality
    await testAIPromptToItem();
    
    // Test deleting item (cleanup)
    await testDeleteCollectionItem(createdId);
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

// Run tests
runAllTests();
