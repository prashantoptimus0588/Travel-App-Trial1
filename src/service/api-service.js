// api-service.js - Gemini API Integration

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate travel plan using Gemini API
 * @param {string} prompt - The formatted prompt for trip generation
 * @returns {Promise<string>} - JSON string with trip data
 */
export const generateTravelPlan = async (prompt) => {
  try {
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    
    // Use gemini-pro for free-tier friendly responses
    // Note: Model names changed - use "gemini-pro" instead of "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    console.log("🚀 Sending request to Gemini API...");

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("✅ Received response from Gemini");

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    // Validate it's proper JSON
    try {
      JSON.parse(cleanedText);
      return cleanedText;
    } catch (parseError) {
      console.error("❌ Invalid JSON response:", cleanedText);
      throw new Error("Invalid JSON response from API");
    }

  } catch (error) {
    console.error("❌ Gemini API Error:", error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      throw new Error("Invalid API key. Please check your Gemini API key.");
    }
    
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error("Too many requests. Please wait a minute and try again.");
    }

    if (error.message?.includes('SAFETY')) {
      throw new Error("Content was flagged by safety filters. Please try different inputs.");
    }

    // Generic error
    throw new Error(error.message || "Failed to generate trip. Please try again.");
  }
};