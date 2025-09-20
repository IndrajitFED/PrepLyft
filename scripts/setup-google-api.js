#!/usr/bin/env node

/**
 * Google API Setup Helper Script
 * This script helps you set up Google Calendar API for automatic Google Meet creation
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Google API Setup Helper');
console.log('============================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupGoogleAPI() {
  try {
    console.log('This script will help you set up Google Calendar API for automatic Google Meet creation.\n');

    // Check if .env file exists
    const envPath = path.join(__dirname, '..', 'backend', '.env');
    const envExists = fs.existsSync(envPath);
    
    if (!envExists) {
      console.log('❌ .env file not found in backend directory');
      console.log('Please create a .env file first with your basic configuration.\n');
      rl.close();
      return;
    }

    console.log('✅ Found .env file\n');

    // Ask for setup method
    console.log('Choose your setup method:');
    console.log('1. Service Account (Recommended for production)');
    console.log('2. OAuth2 with Refresh Token (Good for development)');
    console.log('3. Skip setup (use fallback mode)\n');

    const setupMethod = await askQuestion('Enter your choice (1-3): ');

    switch (setupMethod) {
      case '1':
        await setupServiceAccount();
        break;
      case '2':
        await setupOAuth2();
        break;
      case '3':
        console.log('✅ Skipping Google API setup. The system will use fallback mode.');
        break;
      default:
        console.log('❌ Invalid choice. Please run the script again.');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

async function setupServiceAccount() {
  console.log('\n📋 Service Account Setup');
  console.log('========================\n');

  console.log('To set up Service Account:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing');
  console.log('3. Enable Google Calendar API');
  console.log('4. Create a Service Account');
  console.log('5. Download the JSON key file\n');

  const hasKeyFile = await askQuestion('Do you have the service account JSON key file? (y/n): ');

  if (hasKeyFile.toLowerCase() === 'y') {
    const keyFilePath = await askQuestion('Enter the path to your JSON key file: ');
    
    try {
      const keyContent = fs.readFileSync(keyFilePath, 'utf8');
      const keyData = JSON.parse(keyContent);
      
      // Add to .env file
      const envPath = path.join(__dirname, '..', 'backend', '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Remove existing GOOGLE_SERVICE_ACCOUNT_KEY if present
      envContent = envContent.replace(/^GOOGLE_SERVICE_ACCOUNT_KEY=.*$/m, '');
      
      // Add new service account key
      envContent += `\n# Google Service Account Key\nGOOGLE_SERVICE_ACCOUNT_KEY='${JSON.stringify(keyData)}'\n`;
      
      fs.writeFileSync(envPath, envContent);
      
      console.log('✅ Service account key added to .env file');
      console.log('🚀 Google Meet automation is now enabled!');
      
    } catch (error) {
      console.log('❌ Failed to read or parse the JSON file:', error.message);
    }
  } else {
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Follow the steps above to create a service account');
    console.log('2. Download the JSON key file');
    console.log('3. Add this line to your .env file:');
    console.log('   GOOGLE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account",...}\'');
    console.log('4. Restart your backend server');
  }
}

async function setupOAuth2() {
  console.log('\n📋 OAuth2 Setup');
  console.log('===============\n');

  console.log('To set up OAuth2:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create OAuth2 credentials');
  console.log('3. Get authorization code');
  console.log('4. Exchange for tokens\n');

  const clientId = await askQuestion('Enter your Google Client ID: ');
  const clientSecret = await askQuestion('Enter your Google Client Secret: ');
  const refreshToken = await askQuestion('Enter your Refresh Token (optional, press Enter to skip): ');

  if (clientId && clientSecret) {
    // Add to .env file
    const envPath = path.join(__dirname, '..', 'backend', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Remove existing Google OAuth2 variables
    envContent = envContent.replace(/^GOOGLE_CLIENT_ID=.*$/m, '');
    envContent = envContent.replace(/^GOOGLE_CLIENT_SECRET=.*$/m, '');
    envContent = envContent.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, '');
    
    // Add new OAuth2 variables
    envContent += `\n# Google OAuth2 Configuration\n`;
    envContent += `GOOGLE_CLIENT_ID=${clientId}\n`;
    envContent += `GOOGLE_CLIENT_SECRET=${clientSecret}\n`;
    envContent += `GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback\n`;
    
    if (refreshToken) {
      envContent += `GOOGLE_REFRESH_TOKEN=${refreshToken}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ OAuth2 configuration added to .env file');
    
    if (refreshToken) {
      console.log('🚀 Google Meet automation is now enabled!');
    } else {
      console.log('⚠️  You still need to get a refresh token to enable automation.');
      console.log('   Visit the authorization URL and complete the OAuth flow.');
    }
  }
}

// Test function to verify setup
async function testSetup() {
  console.log('\n🧪 Testing Google API Setup');
  console.log('============================\n');

  try {
    const response = await fetch('http://localhost:5000/api/smart-booking/test-google-meet', {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_TOKEN || 'test'}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Google Meet service is working!');
      console.log('🔗 Test meeting link:', result.data.meetingLink);
    } else {
      console.log('❌ Google Meet service test failed:', result.message);
    }
  } catch (error) {
    console.log('❌ Test failed - make sure your backend server is running');
  }
}

// Main execution
if (require.main === module) {
  setupGoogleAPI().then(() => {
    console.log('\n📚 Next Steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test the setup with: npm run test:google-meet');
    console.log('3. Book a session to see automatic Google Meet creation');
    console.log('\n📖 For detailed setup instructions, see: GOOGLE_API_SETUP.md');
  });
}

module.exports = { setupGoogleAPI, testSetup };

