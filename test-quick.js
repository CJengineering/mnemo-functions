#!/usr/bin/env node

/**
 * Quick Production API Test
 * Tests basic endpoints first
 */

const BASE_URL = 'https://mnemo-app-e4f6j5kdsq-ew.a.run.app';

async function quickTest() {
  console.log('🚀 Quick Production API Test...');
  console.log(`📍 Testing: ${BASE_URL}`);
  
  try {
    // Test health
    console.log('\n🏥 Testing health...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Health Status: ${healthResponse.status}`, healthData);
    
    // Test get all collection items
    console.log('\n📋 Testing get all collection items...');
    const allItemsResponse = await fetch(`${BASE_URL}/api/collection-items`);
    const allItemsData = await allItemsResponse.json();
    console.log(`✅ Get All Status: ${allItemsResponse.status}`);
    console.log(`   Items count: ${allItemsData.collectionItems?.length || 0}`);
    
    // Test get items by type
    console.log('\n🏷️ Testing get items by type (event)...');
    const typeResponse = await fetch(`${BASE_URL}/api/collection-items/type/event`);
    const typeData = await typeResponse.json();
    console.log(`✅ Get By Type Status: ${typeResponse.status}`);
    console.log(`   Event items: ${typeData.collectionItems?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
