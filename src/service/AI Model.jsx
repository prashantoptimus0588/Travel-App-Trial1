import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateTravelPlan(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text(); // Gemini returns string text
  } catch (err) {
    console.error("AI error:", err);
    throw err;
  }
}
