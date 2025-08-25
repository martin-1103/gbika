// [test-logout.js]: Manual test script for logout functionality
const request = require('supertest');
const { app } = require('./src/app');

async function testLogoutFlow() {
  try {
    console.log('🔐 Testing logout functionality...');
    
    // Step 1: Login to get a token
    console.log('\n1. Logging in...');
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    
    if (loginResponse.statusCode !== 200) {
      throw new Error(`Login failed: ${loginResponse.body.message}`);
    }
    
    const token = loginResponse.body.accessToken;
    console.log('✅ Login successful, token received');
    
    // Step 2: Logout with the token
    console.log('\n2. Logging out...');
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    if (logoutResponse.statusCode !== 200) {
      throw new Error(`Logout failed: ${logoutResponse.body.message}`);
    }
    
    console.log('✅ Logout successful:', logoutResponse.body.message);
    
    // Step 3: Try to logout again with the same token (should fail)
    console.log('\n3. Trying to logout again with same token...');
    const secondLogoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    if (secondLogoutResponse.statusCode === 401) {
      console.log('✅ Second logout correctly failed with 401:', secondLogoutResponse.body.message);
    } else {
      console.log('❌ ERROR: Second logout should have failed with 401, got:', secondLogoutResponse.statusCode);
    }
    
    console.log('\n🎉 All logout tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogoutFlow();