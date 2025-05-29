/**
 * Frontend API Test Script
 * 
 * This Node.js script tests the API connectivity from the frontend to the backend.
 * It specifically tests the Recent Campaigns endpoint.
 * 
 * Run with: node src/tests/test_api.js
 */

// Import fetch for Node.js environment
const fetch = require('node-fetch');

// API URL configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CAMPAIGNS_ENDPOINT = '/api/v1/dashboard/campaigns/recent';

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Print colored log message
 */
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Format JSON for nicer display
 */
function formatJson(obj) {
  return JSON.stringify(obj, null, 2);
}

/**
 * Test the Recent Campaigns API endpoint
 */
async function testRecentCampaignsApi() {
  const url = `${API_URL}${CAMPAIGNS_ENDPOINT}?limit=10`;
  
  log('🔍 Testing Recent Campaigns API', colors.blue);
  log(`URL: ${url}`, colors.cyan);
  
  try {
    // Make API request
    log('Making API request...', colors.yellow);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Check response status
    const status = response.status;
    log(`Status code: ${status}`, status === 200 ? colors.green : colors.red);
    
    if (status !== 200) {
      log(`❌ API request failed with status ${status}`, colors.red);
      const text = await response.text();
      log(`Response: ${text}`, colors.red);
      return false;
    }
    
    // Parse JSON response
    const data = await response.json();
    log('📊 Response data:', colors.green);
    console.log(formatJson(data));
    
    // Validate response structure
    if (!data.success) {
      log('❌ API response indicates failure (success: false)', colors.red);
      return false;
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      log('❌ Missing or invalid data array in response', colors.red);
      return false;
    }
    
    const campaigns = data.data;
    log(`✅ Successfully retrieved ${campaigns.length} campaigns`, colors.green);
    
    // Check campaign data
    if (campaigns.length > 0) {
      const firstCampaign = campaigns[0];
      log('📋 First campaign details:', colors.magenta);
      console.log(formatJson(firstCampaign));
      
      // Check required fields
      const requiredFields = ['id', 'name', 'type', 'status', 'budget'];
      const missingFields = requiredFields.filter(field => !firstCampaign.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        log(`❌ Campaign missing required fields: ${missingFields.join(', ')}`, colors.red);
        return false;
      }
      
      log('✅ Campaign has all required fields', colors.green);
      return true;
    } else {
      log('⚠️ No campaigns returned', colors.yellow);
      return true; // Success, just no campaigns
    }
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  log('🚀 Starting Frontend API Test', colors.magenta);
  log('='.repeat(50), colors.white);
  
  const result = await testRecentCampaignsApi();
  
  log('='.repeat(50), colors.white);
  if (result) {
    log('✅ API Test PASSED!', colors.green);
    log('The Recent Campaigns API is working correctly.', colors.green);
    log('If you\'re not seeing data in the frontend, check:', colors.cyan);
    log('1. Frontend console logs for errors', colors.cyan);
    log('2. Network tab in dev tools to see if API calls are being made', colors.cyan);
    log('3. Authentication state in the frontend', colors.cyan);
  } else {
    log('❌ API Test FAILED!', colors.red);
    log('Try troubleshooting:', colors.yellow);
    log('1. Is the backend server running?', colors.yellow);
    log('2. Check backend logs for errors', colors.yellow);
    log('3. Verify the API endpoint URL is correct', colors.yellow);
    log('4. Check network connectivity between frontend and backend', colors.yellow);
  }
}

// Run the test
main().catch(error => {
  log(`❌ Unhandled error: ${error.message}`, colors.red);
  process.exit(1);
}); 