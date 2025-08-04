# Google Places API Setup Guide

This application now integrates with Google Places API to provide real-time data about kids' activities near any zip code.

## Setup Instructions

### 1. Get a Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API (New)**
   - **Geocoding API**
4. Go to "Credentials" and create an API key
5. (Optional but recommended) Restrict the API key to your specific APIs and domains

### 2. Configure the Application

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace `your_google_places_api_key_here` with your actual API key:
   ```
   GOOGLE_PLACES_API_KEY=AIzaSyC...
   ```

### 3. How It Works

- When a user searches with a zip code, the app:
  1. Converts the zip code to coordinates using Google Geocoding API
  2. Searches for kid-friendly places nearby using Google Places API
  3. Filters results for places like museums, zoos, parks, aquariums, etc.
  4. Formats the data to match the app's structure
  5. Falls back to mock data if the API fails

### 4. API Usage and Costs

- Google Places API offers 10,000 free requests per month
- After that, pricing is pay-as-you-go
- The app is designed to minimize API calls by caching results

### 5. Fallback Behavior

- If no API key is provided, the app uses mock data
- If the API fails, the app falls back to mock data
- This ensures the app always works, even without API access

### 6. Place Types Searched

The app searches for these kid-friendly place types:
- Amusement parks
- Aquariums
- Zoos
- Museums
- Parks
- Tourist attractions

Results are filtered for places with kid-friendly keywords in their names or descriptions.