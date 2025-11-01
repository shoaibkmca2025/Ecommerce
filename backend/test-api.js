const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await axios.get(`${API_URL}/products`);
    console.log('✅ Products fetched:', productsResponse.data.length, 'products');

    // Test user registration
    console.log('\n3. Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: process.env.TEST_EMAIL || 'test@example.com',
      password: process.env.TEST_PASSWORD || 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${API_URL}/users/register`, testUser);
      console.log('✅ User registered:', registerResponse.data.name);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message === 'User already exists') {
        console.log('ℹ️  User already exists (expected)');
      } else {
        throw error;
      }
    }

    // Test user login
    console.log('\n4. Testing user login...');
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User logged in:', loginResponse.data.name);

    console.log('\n🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
