const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

// You'll need to get a Google Places API key from Google Cloud Console
// For now, we'll use a placeholder - replace with your actual API key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY_HERE';

/**
 * Get detailed information for a place using Place Details API
 */
async function getPlaceDetails(placeId) {
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                fields: [
                    'name',
                    'formatted_address',
                    'formatted_phone_number',
                    'website',
                    'opening_hours',
                    'price_level',
                    'rating',
                    'user_ratings_total',
                    'photos',
                    'types',
                    'geometry',
                    'business_status'
                ].join(','),
                key: GOOGLE_PLACES_API_KEY,
            },
        });
        
        return response.data.result;
    } catch (error) {
        console.error(`Error fetching place details for ${placeId}:`, error.message);
        return null;
    }
}

/**
 * Convert zip code to coordinates using Google Geocoding API
 */
async function getCoordinatesFromZipCode(zipCode) {
    try {
        const response = await client.geocode({
            params: {
                address: zipCode,
                key: GOOGLE_PLACES_API_KEY,
            },
        });
        
        if (response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        }
        return null;
    } catch (error) {
        console.error('Error geocoding zip code:', error);
        return null;
    }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Search for kids' activities near a location
 */
async function searchKidsActivities(coordinates, radius = 25000) { // Increased radius to 25km
    try {
        // Define place types that are suitable for kids
        const kidsPlaceTypes = [
            'amusement_park',
            'aquarium',
            'zoo',
            'museum',
            'park',
            'library',
            'tourist_attraction',
            'bowling_alley',
            'movie_theater',
            'gym',
            'establishment',
            'point_of_interest',
            'store'
        ];
        
        const allPlaces = [];
        
        // Search for each place type
        for (const placeType of kidsPlaceTypes) {
            try {
                const response = await client.placesNearby({
                    params: {
                        location: coordinates,
                        radius: radius,
                        type: placeType,
                        key: GOOGLE_PLACES_API_KEY,
                    },
                });
                
                // Filter and format results
                const places = response.data.results
                    .filter(place => {
                        // Filter for places that are likely kid-friendly
                        const name = place.name.toLowerCase();
                        const types = place.types || [];
                        
                        // Exclude inappropriate venues for kids
                        const excludedTypes = [
                            'bar', 'night_club', 'liquor_store', 'casino', 
                            'adult_entertainment', 'spa', 'beauty_salon', 
                            'real_estate_agency', 'lawyer', 'doctor', 'hospital',
                            'gas_station', 'car_dealer', 'car_repair', 'bank',
                            'atm', 'pharmacy', 'grocery_or_supermarket',
                            'moving_company', 'storage', 'self_storage_facility',
                            'clothing_store', 'shoe_store', 'jewelry_store',
                            'electronics_store', 'furniture_store', 'home_goods_store',
                            'department_store', 'shopping_mall', 'finance',
                            'accounting', 'insurance_agency', 'travel_agency',
                            'airport', 'parking', 'lodging', 'car_rental',
                            'health', 'dentist', 'physiotherapist', 'veterinary_care',
                            'restaurant', 'food', 'meal_takeaway', 'meal_delivery',
                            'movie_theater', 'movie_rental'
                        ];
                        
                        const excludedKeywords = [
                            'bar', 'pub', 'nightclub', 'casino', 'adult', 'spa',
                            'salon', 'clinic', 'hospital', 'urgent care', 'dentist',
                            'attorney', 'lawyer', 'real estate', 'insurance',
                            'bank', 'credit union', 'pharmacy', 'cvs', 'walgreens',
                            'grocery', 'supermarket', 'gas station', 'auto repair',
                            'u-haul', 'uhaul', 'moving', 'storage', 'truck rental',
                            'self storage', 'mini storage', 'warehouse',
                            'closet', 'clothing', 'fashion', 'boutique', 'apparel',
                            'shoes', 'jewelry', 'electronics', 'furniture', 'mattress',
                            'office', 'business', 'corporate', 'professional',
                            'retail', 'shopping', 'store', 'shop',
                            'airport', 'parking', 'motel', 'hotel', 'inn', 'lodge',
                            'car rental', 'rental car', 'ewr', 'jfk', 'lga',
                            'health services', 'medical', 'healthcare', 'wellness',
                            'therapy', 'rehabilitation', 'physical therapy', 'mental health',
                            'hammerstein ballroom', 'manhattan center', 'ballroom', 'concert hall',
                            'restaurant', 'dining', 'food', 'cafe', 'bistro', 'grill',
                            'pizza', 'burger', 'sandwich', 'takeout', 'delivery',
                            'movie theater', 'cinema', 'theater', 'theatre', 'amc', 'regal',
                            'agency', 'services', 'consulting', 'management', 'company',
                            'corporation', 'llc', 'inc', 'ltd', 'group', 'associates',
                            'pro of the game', 'dawn animal', 'animal agency', 'pet services',
                            'veterinary', 'vet', 'animal hospital', 'pet store', 'pet shop',
                            'training', 'lessons', 'classes', 'academy',
                            'studio', 'institute', 'foundation'
                        ];
                        
                        // Check if place should be excluded
                        const hasExcludedType = types.some(type => excludedTypes.includes(type));
                        const hasExcludedKeyword = excludedKeywords.some(keyword => name.includes(keyword));
                        
                        if (hasExcludedType || hasExcludedKeyword) {
                            return false;
                        }
                        
                        // Only include places that are genuinely fun and entertaining for kids
                        const kidFriendlyKeywords = [
                            'children', 'kids', 'playground', 'trampoline', 'bounce', 'jump',
                            'arcade', 'laser tag', 'mini golf', 'skating', 'climbing',
                            'indoor play', 'family fun', 'entertainment center', 'adventure',
                            'discovery', 'science center', 'interactive', 'hands-on'
                        ];
                        
                        const educationalKeywords = [
                            'children\'s museum', 'kids museum', 'science museum', 'discovery center',
                            'learning center', 'educational center', 'interactive museum'
                        ];
                        
                        const entertainmentKeywords = [
                            'amusement', 'theme park', 'water park', 'fun center', 'play center',
                            'entertainment', 'recreation', 'activity center', 'adventure park'
                        ];
                        
                        // Check for specific kid-friendly keywords in name
                        const hasKidKeyword = kidFriendlyKeywords.some(keyword => name.includes(keyword));
                        const hasEducationalKeyword = educationalKeywords.some(keyword => name.includes(keyword));
                        const hasEntertainmentKeyword = entertainmentKeywords.some(keyword => name.includes(keyword));
                        
                        // Include only specific types that are genuinely kid-friendly
                        const kidFriendlyTypes = [
                            'amusement_park', 'zoo', 'aquarium', 'bowling_alley'
                        ];
                        
                        const hasKidFriendlyType = types.some(type => kidFriendlyTypes.includes(type));
                        
                        // Special handling for museums - only include if they're specifically for kids/families
                        const isKidMuseum = types.includes('museum') && (
                            name.includes('children') || name.includes('kids') || name.includes('family') ||
                            name.includes('science') || name.includes('discovery') || name.includes('interactive') ||
                            name.includes('natural history') || name.includes('planetarium')
                        );
                        
                        // Special handling for parks - include all parks as they're generally kid-friendly
                        const isKidPark = types.includes('park');
                        
                        // Special handling for libraries - include all libraries as they're kid-friendly
                        const isLibrary = types.includes('library');
                        
                        // Special handling for gyms - only include if they're specifically for kids activities
                        const isKidGym = types.includes('gym') && (
                            name.includes('kids') || name.includes('children') || name.includes('family') ||
                            name.includes('gymnastics') || name.includes('martial arts') || name.includes('dance') ||
                            name.includes('tumbling') || name.includes('little gym')
                        );
                        
                        return (
                            hasKidKeyword || hasEducationalKeyword || hasEntertainmentKeyword ||
                            hasKidFriendlyType || isKidMuseum || isKidPark || isLibrary || isKidGym
                        );
                    })
                    .map(place => {
                        const distance = calculateDistance(
                            coordinates.lat, coordinates.lng,
                            place.geometry.location.lat, place.geometry.location.lng
                        );
                        
                        return {
                            place_id: place.place_id,
                            name: place.name,
                            basic_types: place.types || [],
                            basic_rating: place.rating || 0,
                            basic_price_level: place.price_level,
                            location: place.geometry.location,
                            distance: distance
                        };
                    })
                    .filter(place => place.distance <= 25); // Only include places within 25 miles
                
                allPlaces.push(...places);
            } catch (typeError) {
                console.error(`Error searching for ${placeType}:`, typeError.message);
                // Continue with other place types even if one fails
            }
        }
        
        // Add text search for specific kids entertainment venues
        const textSearchQueries = [
            'children\'s museum',
            'kids museum',
            'trampoline park',
            'indoor playground',
            'family fun center',
            'bounce house',
            'laser tag kids',
            'kids arcade',
            'mini golf family',
            'rock climbing kids',
            'indoor play center',
            'children\'s entertainment',
            'kids activity center',
            'family entertainment center',
            'children\'s discovery center',
            'kids science center',
            'interactive museum kids',
            'children\'s zoo',
            'petting zoo',
            'aquarium kids',
            'planetarium children',
            'public library',
            'library',
            'public park',
            'playground',
            'recreation center',
            'community center'
        ];
        
        for (const query of textSearchQueries) {
            try {
                const response = await client.textSearch({
                    params: {
                        query: `${query} near ${coordinates.lat},${coordinates.lng}`,
                        radius: radius,
                        key: GOOGLE_PLACES_API_KEY,
                    },
                });
                
                const places = response.data.results
                    .filter(place => {
                        const name = place.name.toLowerCase();
                        const types = place.types || [];
                        
                        // Apply same exclusion criteria as nearby search
                        const excludedTypes = [
                            'bar', 'night_club', 'liquor_store', 'casino', 
                            'adult_entertainment', 'spa', 'beauty_salon', 
                            'real_estate_agency', 'lawyer', 'doctor', 'hospital',
                            'gas_station', 'car_dealer', 'car_repair', 'bank',
                            'atm', 'pharmacy', 'grocery_or_supermarket',
                            'moving_company', 'storage', 'self_storage_facility',
                            'clothing_store', 'shoe_store', 'jewelry_store',
                            'electronics_store', 'furniture_store', 'home_goods_store',
                            'department_store', 'shopping_mall', 'finance',
                            'accounting', 'insurance_agency', 'travel_agency',
                            'airport', 'parking', 'lodging', 'car_rental',
                            'health', 'dentist', 'physiotherapist', 'veterinary_care',
                            'restaurant', 'food', 'meal_takeaway', 'meal_delivery',
                            'movie_theater', 'movie_rental'
                        ];
                        
                        const excludedKeywords = [
                            'bar', 'pub', 'nightclub', 'casino', 'adult', 'spa',
                            'salon', 'clinic', 'hospital', 'urgent care', 'dentist',
                            'attorney', 'lawyer', 'real estate', 'insurance',
                            'bank', 'credit union', 'pharmacy', 'cvs', 'walgreens',
                            'grocery', 'supermarket', 'gas station', 'auto repair',
                            'u-haul', 'uhaul', 'moving', 'storage', 'truck rental',
                            'self storage', 'mini storage', 'warehouse',
                            'closet', 'clothing', 'fashion', 'boutique', 'apparel',
                            'shoes', 'jewelry', 'electronics', 'furniture', 'mattress',
                            'office', 'business', 'corporate', 'professional',
                            'retail', 'shopping', 'store', 'shop',
                            'airport', 'parking', 'motel', 'hotel', 'inn', 'lodge',
                            'car rental', 'rental car', 'ewr', 'jfk', 'lga',
                            'health services', 'medical', 'healthcare', 'wellness',
                            'therapy', 'rehabilitation', 'physical therapy', 'mental health',
                            'hammerstein ballroom', 'manhattan center', 'ballroom', 'concert hall',
                            'restaurant', 'dining', 'food', 'cafe', 'bistro', 'grill',
                            'pizza', 'burger', 'sandwich', 'takeout', 'delivery',
                            'movie theater', 'cinema', 'theater', 'theatre', 'amc', 'regal',
                            'agency', 'services', 'consulting', 'management', 'company',
                            'corporation', 'llc', 'inc', 'ltd', 'group', 'associates',
                            'pro of the game', 'dawn animal', 'animal agency', 'pet services',
                            'veterinary', 'vet', 'animal hospital', 'pet store', 'pet shop',
                            'training', 'lessons', 'classes', 'academy',
                            'studio', 'institute', 'foundation'
                        ];
                        
                        // Check if place should be excluded
                        const hasExcludedType = types.some(type => excludedTypes.includes(type));
                        const hasExcludedKeyword = excludedKeywords.some(keyword => name.includes(keyword));
                        
                        if (hasExcludedType || hasExcludedKeyword) {
                            return false;
                        }
                        
                        // Apply same strict kid-friendly filtering as nearby search
                        const kidFriendlyKeywords = [
                            'children', 'kids', 'playground', 'trampoline', 'bounce', 'jump',
                            'arcade', 'laser tag', 'mini golf', 'skating', 'climbing',
                            'indoor play', 'family fun', 'entertainment center', 'adventure',
                            'discovery', 'science center', 'interactive', 'hands-on'
                        ];
                        
                        const educationalKeywords = [
                            'children\'s museum', 'kids museum', 'science museum', 'discovery center',
                            'learning center', 'educational center', 'interactive museum'
                        ];
                        
                        const entertainmentKeywords = [
                            'amusement', 'theme park', 'water park', 'fun center', 'play center',
                            'entertainment', 'recreation', 'activity center', 'adventure park'
                        ];
                        
                        // Check for specific kid-friendly keywords in name
                        const hasKidKeyword = kidFriendlyKeywords.some(keyword => name.includes(keyword));
                        const hasEducationalKeyword = educationalKeywords.some(keyword => name.includes(keyword));
                        const hasEntertainmentKeyword = entertainmentKeywords.some(keyword => name.includes(keyword));
                        
                        // Include only specific types that are genuinely kid-friendly
                        const kidFriendlyTypes = [
                            'amusement_park', 'zoo', 'aquarium', 'bowling_alley'
                        ];
                        
                        const hasKidFriendlyType = types.some(type => kidFriendlyTypes.includes(type));
                        
                        // Special handling for museums - only include if they're specifically for kids/families
                        const isKidMuseum = types.includes('museum') && (
                            name.includes('children') || name.includes('kids') || name.includes('family') ||
                            name.includes('science') || name.includes('discovery') || name.includes('interactive') ||
                            name.includes('natural history') || name.includes('planetarium')
                        );
                        
                        // Special handling for parks - include all parks as they're generally kid-friendly
                        const isKidPark = types.includes('park');
                        
                        // Special handling for libraries - include all libraries as they're kid-friendly
                        const isLibrary = types.includes('library');
                        
                        // Special handling for gyms - only include if they're specifically for kids activities
                        const isKidGym = types.includes('gym') && (
                            name.includes('kids') || name.includes('children') || name.includes('family') ||
                            name.includes('gymnastics') || name.includes('martial arts') || name.includes('dance') ||
                            name.includes('tumbling') || name.includes('little gym')
                        );
                        
                        return (
                            hasKidKeyword || hasEducationalKeyword || hasEntertainmentKeyword ||
                            hasKidFriendlyType || isKidMuseum || isKidPark || isLibrary || isKidGym
                        );
                    })
                    .map(place => {
                        const distance = calculateDistance(
                            coordinates.lat, coordinates.lng,
                            place.geometry.location.lat, place.geometry.location.lng
                        );
                        
                        return {
                            place_id: place.place_id,
                            name: place.name,
                            basic_types: place.types || [],
                            basic_rating: place.rating || 0,
                            basic_price_level: place.price_level,
                            location: place.geometry.location,
                            distance: distance
                        };
                    })
                    .filter(place => place.distance <= 25); // Only include places within 25 miles
                
                allPlaces.push(...places);
            } catch (textError) {
                console.error(`Error searching for "${query}":`, textError.message);
                // Continue with other queries even if one fails
            }
        }
        
        // Remove duplicates based on place_id
        const uniquePlaces = allPlaces.filter((place, index, self) => 
            index === self.findIndex(p => p.place_id === place.place_id)
        );
        
        // Sort by distance (closest first)
        uniquePlaces.sort((a, b) => a.distance - b.distance);
        
        // Return top 20 results to provide variety
        return uniquePlaces.slice(0, 20);
    } catch (error) {
        console.error('Error searching for kids activities:', error);
        return [];
    }
}



/**
 * Enhance places with detailed information from Place Details API
 */
async function enhancePlacesWithDetails(places) {
    const enhancedPlaces = [];
    
    for (const place of places) {
        try {
            const details = await getPlaceDetails(place.place_id);
            if (details) {
                const enhancedPlace = {
                    id: place.place_id,
                    name: details.name || place.name,
                    description: details.types ? details.types.join(', ') : 'Family-friendly activity',
                    address: details.formatted_address || 'Address not available',
                    phone: details.formatted_phone_number || 'Phone not available',
                    website: details.website || 'Website not available',
                    rating: details.rating || place.basic_rating || 0,
                    priceLevel: details.price_level !== undefined ? details.price_level : place.basic_price_level,
                    price: getPriceDescription(details.price_level !== undefined ? details.price_level : place.basic_price_level),
                    hours: formatOpeningHours(details.opening_hours),
                    ageRange: determineAgeRange(details.types, details.name),
                    location: place.location,
                    distance: place.distance,
                    types: details.types || place.basic_types,
                    photos: details.photos || [],
                    openNow: details.opening_hours ? details.opening_hours.open_now : null,
                    businessStatus: details.business_status || 'OPERATIONAL'
                };
                enhancedPlaces.push(enhancedPlace);
            }
        } catch (error) {
            console.error(`Error enhancing place ${place.place_id}:`, error.message);
            // Continue with other places even if one fails
        }
    }
    
    return enhancedPlaces;
}

/**
 * Helper function to get price description from price level
 */
function getPriceDescription(priceLevel) {
    switch (priceLevel) {
        case 0: return 'Free';
        case 1: return '$';
        case 2: return '$$';
        case 3: return '$$$';
        case 4: return '$$$$';
        default: return 'Price not available';
    }
}

/**
 * Helper function to format opening hours
 */
function formatOpeningHours(openingHours) {
    if (!openingHours || !openingHours.weekday_text) {
        return 'Hours not available';
    }
    return openingHours.weekday_text.join('; ');
}

/**
 * Helper function to determine age range based on place type and name
 */
function determineAgeRange(types, name) {
    const nameStr = name.toLowerCase();
    const typeStr = types ? types.join(' ').toLowerCase() : '';
    
    if (nameStr.includes('toddler') || nameStr.includes('baby')) {
        return '0-3 years';
    } else if (nameStr.includes('preschool') || nameStr.includes('little')) {
        return '3-6 years';
    } else if (typeStr.includes('museum') || typeStr.includes('zoo') || typeStr.includes('aquarium')) {
        return 'All ages';
    } else if (nameStr.includes('teen') || nameStr.includes('youth')) {
        return '10+ years';
    } else {
        return '5-12 years';
    }
}

/**
 * Main function to get kids activities by zip code
 */
async function getKidsActivitiesByZipCode(zipCode, options = {}) {
    try {
        console.log(`Searching for kids activities near zip code: ${zipCode}`);
        
        // Get coordinates from zip code
        const coordinates = await getCoordinatesFromZipCode(zipCode);
        if (!coordinates) {
            console.log('Could not geocode zip code:', zipCode);
            return [];
        }
        
        console.log(`Found coordinates for ${zipCode}:`, coordinates);
        
        // Search for kids activities
        const googlePlaces = await searchKidsActivities(coordinates, options.radius);
        console.log(`Found ${googlePlaces.length} potential kids activities`);
        
        // Remove duplicates based on place_id
        const uniquePlaces = googlePlaces.filter((place, index, self) => 
            index === self.findIndex(p => p.place_id === place.place_id)
        );
        console.log(`After removing duplicates: ${uniquePlaces.length} unique places`);
        
        // Enhance places with detailed information
        const enhancedPlaces = await enhancePlacesWithDetails(uniquePlaces);
        console.log(`Enhanced ${enhancedPlaces.length} places with detailed information`);
        
        // Format places for our app
        const formattedPlaces = [];
        
        enhancedPlaces.forEach(place => {
            // Add required fields for our app
            const formattedPlace = {
                ...place,
                zipCode: zipCode,
                budget: place.price || 'Price not available',
                accessibility: 'Please call to confirm accessibility',
                image: place.photos && place.photos.length > 0 ? 
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}` : 
                    '/api/placeholder/400/300',
                time: 'all-day' // Default time, can be filtered later if needed
            };
            
            formattedPlaces.push(formattedPlace);
        });
        
        console.log(`Formatted ${formattedPlaces.length} place entries with time slots`);
        return formattedPlaces;
        
    } catch (error) {
        console.error('Error in getKidsActivitiesByZipCode:', error);
        return [];
    }
}

module.exports = {
    getKidsActivitiesByZipCode,
    getCoordinatesFromZipCode,
    searchKidsActivities
};