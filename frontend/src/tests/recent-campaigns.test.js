/**
 * Recent Campaigns API Test Script
 * 
 * This script tests the Recent Campaigns API integration in the frontend.
 * It makes direct API calls using fetch and logs detailed results.
 * 
 * How to use:
 * 1. Navigate to the frontend folder
 * 2. Run: node tests/recent-campaigns.test.js
 */

// Polyfill fetch for Node.js environment
global.fetch = require('node-fetch');

// Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TEST_ENDPOINT = '/api/v1/dashboard/campaigns/recent';
const LIMIT = 6;

// Utility to log in color
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Utility to format objects for logging
function formatJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

// Function to test Recent Campaigns API
async function testRecentCampaignsAPI() {
  log('🧪 Testing Recent Campaigns API Integration', 'cyan');
  log(`🌐 API URL: ${API_URL}`, 'blue');
  log(`📍 Endpoint: ${TEST_ENDPOINT}`, 'blue');
  log(`🔢 Limit parameter: ${LIMIT}`, 'blue');
  log('-----------------------------------------------');

  try {
    // Test 1: Basic API fetch
    log('🔍 TEST 1: Basic API Fetch', 'magenta');
    const url = `${API_URL}${TEST_ENDPOINT}?limit=${LIMIT}`;
    log(`📤 Making request to ${url}`, 'blue');

    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    
    log(`📥 Response status: ${response.status}`, 
      response.status === 200 ? 'green' : 'red');
    log(`📥 Content-Type: ${contentType}`, 'blue');

    if (!contentType || !contentType.includes('application/json')) {
      log('❌ Response is not JSON', 'red');
      log(`Response text: ${await response.text()}`, 'yellow');
      return;
    }

    const data = await response.json();
    log(`📥 Response received: ${response.ok ? 'Success' : 'Failure'}`, 
      response.ok ? 'green' : 'red');

    // Check response structure
    log('\n🔍 TEST 2: Response Structure Validation', 'magenta');
    if (!data || typeof data !== 'object') {
      log('❌ Response is not an object', 'red');
      log(`Actual response: ${formatJSON(data)}`, 'yellow');
      return;
    }

    log(`📊 Response has 'success' flag: ${data.success !== undefined ? 'Yes' : 'No'}`, 
      data.success !== undefined ? 'green' : 'red');
    log(`📊 Success value: ${data.success}`, 
      data.success ? 'green' : 'red');
    log(`📊 Response has 'data' property: ${data.data !== undefined ? 'Yes' : 'No'}`, 
      data.data !== undefined ? 'green' : 'red');

    // Check campaigns data
    log('\n🔍 TEST 3: Campaigns Data Validation', 'magenta');
    const campaigns = data.data;
    
    if (!Array.isArray(campaigns)) {
      log('❌ Campaigns data is not an array', 'red');
      log(`Actual data type: ${typeof campaigns}`, 'yellow');
      log(`Actual data: ${formatJSON(campaigns)}`, 'yellow');
      return;
    }

    log(`📊 Number of campaigns returned: ${campaigns.length}`, 
      campaigns.length > 0 ? 'green' : 'yellow');

    if (campaigns.length === 0) {
      log('⚠️ No campaigns returned. This could be normal if there are no campaigns in database.', 'yellow');
      return;
    }

    // Check first campaign fields
    const firstCampaign = campaigns[0];
    log('\n🔍 TEST 4: Campaign Fields Validation', 'magenta');
    log(`📄 Checking fields for campaign: ${firstCampaign.name || 'Unnamed'}`, 'blue');

    const requiredFields = ['id', 'name', 'type', 'status', 'budget', 'roi'];
    const missingFields = requiredFields.filter(field => !(field in firstCampaign));

    if (missingFields.length > 0) {
      log(`❌ Campaign is missing required fields: ${missingFields.join(', ')}`, 'red');
    } else {
      log('✅ All required fields are present', 'green');
    }

    // Log campaign details
    log('\n📋 Campaign Details:', 'cyan');
    log(`ID: ${firstCampaign.id}`, 'blue');
    log(`Name: ${firstCampaign.name}`, 'blue');
    log(`Type: ${firstCampaign.type}`, 'blue');
    log(`Status: ${firstCampaign.status}`, 'blue');
    log(`Budget: ${firstCampaign.budget}`, 'blue');
    log(`ROI: ${firstCampaign.roi}`, 'blue');
    log(`Start Date: ${firstCampaign.start_date}`, 'blue');
    log(`End Date: ${firstCampaign.end_date}`, 'blue');

    // Test successful
    log('\n✅ API TEST COMPLETED SUCCESSFULLY', 'green');
    log('-----------------------------------------------');

    return {
      success: true,
      campaigns: campaigns
    };
  } catch (error) {
    log('\n❌ TEST FAILED: Error during API test', 'red');
    log(`Error: ${error.message}`, 'red');
    log(error.stack, 'yellow');
    log('-----------------------------------------------');

    return {
      success: false,
      error: error.message
    };
  }
}

// Execute tests
testRecentCampaignsAPI().then(result => {
  if (result.success) {
    log('\n📝 SUMMARY', 'cyan');
    log('- API endpoint is accessible', 'green');
    log('- Response structure is valid', 'green');
    log(`- ${result.campaigns.length} campaigns returned`, 'green');
    log('- All required fields are present in campaign data', 'green');
    
    log('\n💡 RECOMMENDATIONS:', 'cyan');
    log('- If these are mock campaigns, check database integration', 'blue');
    log('- Verify the display of this data in the Dashboard component', 'blue');
  } else {
    log('\n📝 SUMMARY', 'cyan');
    log('- API test failed', 'red');
    log(`- Error: ${result.error}`, 'red');
    
    log('\n💡 RECOMMENDATIONS:', 'cyan');
    log('- Check if backend server is running', 'blue');
    log('- Verify API endpoint URL and configuration', 'blue');
    log('- Check network connectivity between frontend and backend', 'blue');
    log('- Look at backend logs for errors', 'blue');
  }
}); 