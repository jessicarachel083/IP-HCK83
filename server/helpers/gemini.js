const { GoogleGenerativeAI } = require("@google/generative-ai");

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