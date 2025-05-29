const { GoogleGenerativeAI } = require('@google/generative-ai');

// Temporary debug log - remove after testing
console.log('🔑 API Key loaded:', process.env.GOOGLE_GENAI_API_KEY ? 'YES' : 'NO');
console.log('🔑 API Key length:', process.env.GOOGLE_GENAI_API_KEY?.length);
console.log('🔑 API Key starts with:', process.env.GOOGLE_GENAI_API_KEY?.substring(0, 10));

const GOOGLE_GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;

const ai = new GoogleGenerativeAI(GOOGLE_GENAI_API_KEY);

async function generateContent(prompt) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // Free model
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
    
  } catch (error) {
    console.error("Error generating content:", error);
    
    // Handle service unavailable (like your pattern)
    if (error.response && error.response.status === 503) {
      throw new Error("Service Unavailable: Please try again later.");
    }
    
    throw error;
  }
}

module.exports = {
  generateContent,
};