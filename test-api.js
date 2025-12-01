// Quick test script to check the API
const fetch = require('node-fetch');

async function testAPI() {
  try {
    // Test 1: Health check
    console.log('Testing health endpoint...');
    const health = await fetch('http://172.16.220.179:5000/health');
    console.log('Health:', await health.json());

    // Test 2: Try to get complaints (will fail without auth)
    console.log('\nTesting complaints endpoint (without auth - should fail)...');
    const complaints = await fetch('http://172.16.220.179:5000/api/complaints');
    const result = await complaints.json();
    console.log('Status:', complaints.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
