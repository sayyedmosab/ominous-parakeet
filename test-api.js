// Test API configuration
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_KEY = process.env.API_KEY;
console.log('API Key loaded:', API_KEY ? 'YES' : 'NO');
console.log('API Key prefix:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NONE');

// Test Gemini API
async function testGeminiAPI() {
  try {
    if (!API_KEY) {
      throw new Error('API_KEY environment variable not found');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('Testing Gemini API connection...');
    
    const prompt = "Say hello and confirm you can respond to API requests.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Test Successful!');
    console.log('Response:', text);
    
    return true;
  } catch (error) {
    console.error('❌ Gemini API Test Failed:', error.message);
    return false;
  }
}

// Test function
async function runTests() {
  console.log('=== API Configuration Test ===\n');
  
  const geminiTest = await testGeminiAPI();
  
  console.log('\n=== Test Summary ===');
  console.log('Gemini API:', geminiTest ? '✅ Working' : '❌ Failed');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}
