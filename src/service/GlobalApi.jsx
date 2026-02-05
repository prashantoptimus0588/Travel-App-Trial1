// GlobalApi.jsx - Google Places API Integration

import axios from "axios";

// Base URL for the new Places API
const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

// Photo reference URL
export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

// Configuration for API requests
const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
  }
};

/**
 * Get place details including photos
 * @param {Object} data - Search query data
 * @returns {Promise} - Place details
 */
export const GetPlaceDetails = async (data) => {
  try {
    const response = await axios.post(BASE_URL, data, config);
    return response;
  } catch (error) {
    console.error('❌ Places API Error:', error.response?.status, error.response?.data);
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      console.error('🚨 API Key Issue - Check:');
      console.error('1. Places API (New) is enabled in Google Cloud Console');
      console.error('2. Billing is set up');
      console.error('3. API key restrictions allow Places API');
      throw new Error('Places API access forbidden. Check console for details.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait and try again.');
    }
    
    throw error;
  }
};

/**
 * Get photo URL with fallback to placeholder
 * @param {string} placeName - Name of the place
 * @returns {Promise<string>} - Photo URL or placeholder
 */
export const GetPlacePhotoUrl = async (placeName) => {
  try {
    const data = { textQuery: placeName };
    const response = await GetPlaceDetails(data);
    
    const photos = response.data.places?.[0]?.photos;
    if (!photos || photos.length === 0) {
      console.warn(`No photos found for: ${placeName}`);
      return '/placeholder.jpeg';
    }
    
    const photoName = photos[0].name;
    return PHOTO_REF_URL.replace('{NAME}', photoName);
  } catch (error) {
    console.error(`Failed to get photo for ${placeName}:`, error.message);
    return '/placeholder.jpeg';
  }
};