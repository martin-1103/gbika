// [test-blacklist.js]: Test script to verify token blacklisting prevents access to protected endpoints
const request = require('supertest');
const { app } = require('./src/app');

async function testTokenBlacklisting() {
  try {
    console.log('🔒 Testing token blacklisting on protected endpoints...');
    
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
    
    // Step 2: Test access to protected endpoint with valid token
    console.log('\n2. Testing access to protected endpoint with valid token...');
    const validAccessResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    if (validAccessResponse.statusCode === 200) {
      console.log('✅ Protected endpoint accessible with valid token');
    } else {
      console.log('ℹ️  /auth/me endpoint not available, testing with logout endpoint instead');
    }
    
    // Step 3: Logout to blacklist the token
    console.log('\n3. Logging out to blacklist token...');
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    if (logoutResponse.statusCode !== 200) {
      throw new Error(`Logout failed: ${logoutResponse.body.message}`);
    }
    
    console.log('✅ Logout successful, token should now be blacklisted');
    
    // Step 4: Try to access protected endpoint with blacklisted token
    console.log('\n4. Testing access to protected endpoint with blacklisted token...');
    const blacklistedAccessResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    if (blacklistedAccessResponse.statusCode === 401) {
      console.log('✅ Protected endpoint correctly rejected blacklisted token:', blacklistedAccessResponse.body.message);
    } else if (blacklistedAccessResponse.statusCode === 404) {
      console.log('ℹ️  /auth/me endpoint not found, testing with another logout attempt...');
      
      // Test with logout endpoint instead
      const secondLogoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      
      if (secondLogoutResponse.statusCode === 401) {
        console.log('✅ Logout endpoint correctly rejected blacklisted token:', secondLogoutResponse.body.message);
      } else {
        console.log('❌ ERROR: Blacklisted token was not rejected, got status:', secondLogoutResponse.statusCode);
      }
    } else {
      console.log('❌ ERROR: Blacklisted token was not rejected, got status:', blacklistedAccessResponse.statusCode);
    }
    
    console.log('\n🎉 Token blacklisting verification completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTokenBlacklisting();