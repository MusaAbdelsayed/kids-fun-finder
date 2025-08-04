// Simplified controller for handling place-related requests

const Place = require('../models/place');
const { getKidsActivitiesByZipCode } = require('../services/googlePlacesService');

// Sample data for database seeding
const mockPlacesData = [
  // Manhattan - Upper West Side
  {
    id: 1,
    name: "Children's Museum of Manhattan",
    description: "Five floors of interactive exhibits focusing on arts, sciences, and humanities for children • Rated 4.3/5 stars • 1.2 miles away",
    address: "212 W 83rd St, New York, NY 10024",
    phone: "(212) 721-1223",
    website: "https://cmom.org",
    zipCode: "10024",
    budget: "medium",
    time: "morning",
    distance: 1.2,
    costInfo: "$15-25 per person",
    price: "$15 adults, $12 children (1-17), Free under 1",
    hours: "10:00 AM - 5:00 PM (Tue-Sun), Closed Mondays",
    ageRange: "0-10 years",
    rating: 4.3,
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Children's+Museum+Manhattan"
  },
  // Manhattan - Upper East Side
  {
    id: 2,
    name: "Central Park Zoo",
    description: "Small zoo in Central Park featuring seals, penguins, monkeys, and tropical birds • Rated 4.2/5 stars • 2.1 miles away",
    address: "64th St & 5th Ave, New York, NY 10021",
    phone: "(212) 439-6500",
    website: "https://centralparkzoo.com",
    zipCode: "10021",
    budget: "medium",
    time: "afternoon",
    distance: 2.1,
    costInfo: "$20-30 per person",
    price: "$18 adults, $13 children (3-12), $15 seniors (65+)",
    hours: "10:00 AM - 5:00 PM (Mon-Fri), 10:00 AM - 5:30 PM (Sat-Sun)",
    ageRange: "All ages",
    rating: 4.2,
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Central+Park+Zoo"
  },
  // Manhattan - Central Park
  {
    id: 3,
    name: "Central Park Playgrounds",
    description: "Multiple playgrounds throughout Central Park including Heckscher Playground and Diana Ross Playground",
    zipCode: "10019",
    budget: "free",
    time: "morning",
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Central+Park+Playgrounds"
  },
  // Brooklyn - Crown Heights
  {
    id: 4,
    name: "Brooklyn Children's Museum",
    description: "World's first children's museum with interactive exhibits and cultural programs for ages 6 months to 10 years",
    address: "145 Brooklyn Ave, Brooklyn, NY 11213",
    phone: "(718) 735-4400",
    website: "https://www.brooklynkids.org",
    zipCode: "11213",
    budget: "medium",
    time: "afternoon",
    price: "$15 adults, $11 children, Free for members",
    hours: "10:00 AM - 5:00 PM (Tue-Sun), Closed Mondays",
    ageRange: "6 months - 10 years",
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Brooklyn+Children's+Museum"
  },
  // Brooklyn - Prospect Heights
  {
    id: 5,
    name: "Prospect Park Zoo",
    description: "Small zoo featuring farm animals, sea lions, and a discovery trail perfect for young children",
    zipCode: "11225",
    budget: "medium",
    time: "morning",
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Prospect+Park+Zoo"
  },
  // Brooklyn - DUMBO
  {
    id: 6,
    name: "Brooklyn Bridge Park",
    description: "Waterfront park with multiple playgrounds, sports fields, and stunning views of Manhattan • Rated 4.6/5 stars • 3.2 miles away",
    zipCode: "11201",
    budget: "free",
    time: "afternoon",
    distance: 3.2,
    costInfo: "Free",
    rating: 4.6,
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Brooklyn+Bridge+Park"
  },
  // Brooklyn - Coney Island
  {
    id: 7,
    name: "New York Aquarium",
    description: "Ocean-themed aquarium featuring sea lions, sharks, and marine life exhibits • Rated 4.0/5 stars • 8.5 miles away",
    zipCode: "11224",
    budget: "high",
    time: "morning",
    distance: 8.5,
    costInfo: "$35-45 per person",
    rating: 4.0,
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=NY+Aquarium"
  },
  // Bronx - Bronx Park
  {
    id: 8,
    name: "Bronx Zoo",
    description: "One of the world's largest zoos with over 4,000 animals and immersive exhibits like Congo Gorilla Forest",
    zipCode: "10460",
    budget: "high",
    time: "morning",
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Bronx+Zoo"
  },
  // Queens - Flushing
  {
    id: 9,
    name: "Queens Zoo",
    description: "Small zoo focusing on North American animals including bison, bears, and farm animals",
    zipCode: "11368",
    budget: "medium",
    time: "afternoon",
    accessibility: {
      wheelchairAccessible: true
    },
    image: "https://via.placeholder.com/300x200?text=Queens+Zoo"
  },
  // Staten Island - West Brighton
   {
     id: 10,
     name: "Staten Island Zoo",
     description: "Compact zoo featuring reptiles, birds of prey, aquarium, and famous for Staten Island Chuck",
     zipCode: "10310",
     budget: "medium",
     time: "morning",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Staten+Island+Zoo"
   },
   // Manhattan - Financial District
   {
     id: 11,
     name: "Battery Park Playscape",
     description: "Large playground with climbing structures and water features overlooking New York Harbor",
     zipCode: "10004",
     budget: "free",
     time: "afternoon",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Battery+Park+Playscape"
   },
   // Manhattan - Midtown
   {
     id: 12,
     name: "Bryant Park",
     description: "Urban park with seasonal activities, reading room, and family-friendly events",
     zipCode: "10018",
     budget: "free",
     time: "morning",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Bryant+Park"
   },
   // Manhattan - Lower East Side
   {
     id: 13,
     name: "Tenement Museum",
     description: "Historical museum offering family programs about immigrant life in NYC",
     zipCode: "10002",
     budget: "medium",
     time: "afternoon",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Tenement+Museum"
   },
   // Brooklyn - Williamsburg
   {
     id: 14,
     name: "Domino Park",
     description: "Waterfront park with unique playground equipment and stunning Manhattan views",
     zipCode: "11249",
     budget: "free",
     time: "morning",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Domino+Park"
   },
   // Queens - Astoria
   {
     id: 15,
     name: "Museum of the Moving Image",
     description: "Interactive museum dedicated to film, television, and digital media with family programs",
     zipCode: "11106",
     budget: "medium",
     time: "afternoon",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Museum+Moving+Image"
   },
   // Bronx - Concourse
   {
     id: 16,
     name: "Yankee Stadium Tours",
     description: "Behind-the-scenes tours of the famous baseball stadium with family-friendly options",
     zipCode: "10451",
     budget: "medium",
     time: "morning",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Yankee+Stadium"
   },
   // Manhattan - Upper East Side
   {
     id: 17,
     name: "American Museum of Natural History",
     description: "World-renowned museum with dinosaur exhibits, planetarium, and discovery room for young children",
     zipCode: "10024",
     budget: "high",
     time: "morning",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Natural+History+Museum"
   },
   // Brooklyn - Park Slope
   {
     id: 18,
     name: "Prospect Park Carousel",
     description: "Historic 1912 carousel with hand-carved horses in beautiful Prospect Park",
     zipCode: "11215",
     budget: "free",
     time: "afternoon",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Prospect+Park+Carousel"
   },
   // Queens - Long Island City
   {
     id: 19,
     name: "Gantry Plaza State Park",
     description: "Waterfront park with playgrounds and spectacular views of Manhattan skyline",
     zipCode: "11101",
     budget: "free",
     time: "morning",
     accessibility: {
       wheelchairAccessible: true
     },
     image: "https://via.placeholder.com/300x200?text=Gantry+Plaza+Park"
   },
   // Staten Island - St. George
   {
      id: 20,
      name: "Staten Island Children's Museum",
      description: "Hands-on museum with interactive exhibits focusing on science, art, and culture for children",
      zipCode: "10301",
      budget: "medium",
      time: "afternoon",
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=SI+Children's+Museum"
    },
    // Popular Kids Entertainment Centers
    {
      id: 21,
      name: "Kids Empire",
      description: "Indoor family entertainment center with trampolines, arcade games, and birthday party packages • Rated 4.5/5 stars • 2.8 miles away",
      address: "2780 Flatbush Ave, Brooklyn, NY 11234",
      phone: "(718) 258-2873",
      website: "https://www.kidsempireny.com",
      zipCode: "11213",
      budget: "medium",
      time: "afternoon",
      distance: 2.8,
      costInfo: "$18-25 per person",
      price: "$25 weekdays, $30 weekends, Birthday packages from $350",
      hours: "10:00 AM - 9:00 PM (Mon-Thu), 10:00 AM - 10:00 PM (Fri-Sat), 10:00 AM - 8:00 PM (Sun)",
      ageRange: "2-12 years",
      rating: 4.5,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Kids+Empire"
    },
    {
      id: 22,
      name: "Urban Air Adventure Park",
      description: "Ultimate indoor adventure park featuring trampolines, obstacle courses, climbing walls, and virtual reality • Rated 4.4/5 stars • 3.5 miles away",
      zipCode: "11201",
      budget: "medium",
      time: "morning",
      distance: 3.5,
      costInfo: "$20-30 per person",
      rating: 4.4,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Urban+Air"
    },
    {
      id: 23,
      name: "Bounce! Trampoline Sports",
      description: "High-energy trampoline park with dodgeball courts, foam pits, and fitness classes for kids • Rated 4.3/5 stars • 4.2 miles away",
      address: "123 W 14th St, New York, NY 10011",
      phone: "(212) 555-JUMP",
      website: "https://bouncenyc.com",
      zipCode: "10001",
      budget: "medium",
      time: "afternoon",
      distance: 4.2,
      costInfo: "$16-22 per person",
      price: "$22 for 90 minutes, $16 for 60 minutes, Toddler time $12",
      hours: "10:00 AM - 10:00 PM (Mon-Thu), 10:00 AM - 11:00 PM (Fri-Sat), 10:00 AM - 9:00 PM (Sun)",
      ageRange: "3+ years",
      rating: 4.3,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Bounce+Trampoline"
    },
    {
      id: 24,
      name: "Laser Bounce",
      description: "Indoor entertainment center combining laser tag, trampolines, and arcade games in one location • Rated 4.2/5 stars • 5.1 miles away",
      zipCode: "10024",
      budget: "medium",
      time: "morning",
      distance: 5.1,
      costInfo: "$22-28 per person",
      rating: 4.2,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Laser+Bounce"
    },
    {
      id: 25,
      name: "Fun Station USA",
      description: "Family fun center with go-karts, mini golf, arcade, and indoor playground for all ages • Rated 4.1/5 stars • 6.3 miles away",
      zipCode: "11225",
      budget: "medium",
      time: "afternoon",
      distance: 6.3,
      costInfo: "$15-25 per person",
      rating: 4.1,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Fun+Station+USA"
    },
    {
      id: 26,
      name: "Brooklyn Boulders",
      description: "Indoor rock climbing gym with kids programs, birthday parties, and beginner-friendly walls • Rated 4.6/5 stars • 2.1 miles away",
      zipCode: "11213",
      budget: "medium",
      time: "morning",
      distance: 2.1,
      costInfo: "$20-30 per person",
      rating: 4.6,
      accessibility: {
        wheelchairAccessible: false
      },
      image: "https://via.placeholder.com/300x200?text=Brooklyn+Boulders"
    },
    {
      id: 27,
      name: "Adventure Zone Long Island",
      description: "Large indoor adventure park with trampolines, ninja courses, and climbing walls • Rated 4.3/5 stars • 18.5 miles away",
      zipCode: "10001",
      budget: "medium",
      time: "afternoon",
      distance: 18.5,
      costInfo: "$25-35 per person",
      rating: 4.3,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Adventure+Zone+LI"
    },
    {
      id: 28,
      name: "Sky Zone Trampoline Park",
      description: "Premier trampoline park with foam zones, dodgeball courts, and fitness programs • Rated 4.2/5 stars • 22.3 miles away",
      zipCode: "11213",
      budget: "medium",
      time: "morning",
      distance: 22.3,
      costInfo: "$20-28 per person",
      rating: 4.2,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Sky+Zone"
    },
    {
      id: 29,
      name: "Chuck E. Cheese",
      description: "Family entertainment center with arcade games, rides, and pizza • Rated 4.0/5 stars • 24.1 miles away",
      zipCode: "10001",
      budget: "medium",
      time: "afternoon",
      distance: 24.1,
      costInfo: "$15-25 per person",
      rating: 4.0,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Chuck+E+Cheese"
    },
    {
      id: 30,
      name: "Jump Zone Manhattan",
      description: "Indoor inflatable playground with bounce houses, slides, and obstacle courses • Rated 4.4/5 stars • 3.1 miles away",
      address: "456 W 23rd St, New York, NY 10011",
      phone: "(212) 555-JUMP",
      website: "https://jumpzone.com/manhattan",
      zipCode: "10001",
      budget: "medium",
      time: "morning",
      distance: 3.1,
      costInfo: "$18-24 per person",
      price: "$24 for 90 minutes, $18 for 60 minutes, Toddler sessions $15",
      hours: "9:00 AM - 8:00 PM (Mon-Thu), 9:00 AM - 9:00 PM (Fri-Sun)",
      ageRange: "1-12 years",
      rating: 4.4,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Jump+Zone"
    },
    {
      id: 31,
      name: "Little Gym NYC",
      description: "Children's gymnastics and fitness center with classes and open play sessions • Rated 4.5/5 stars • 2.8 miles away",
      address: "789 Broadway, New York, NY 10003",
      phone: "(212) 555-GYMS",
      website: "https://thelittlegym.com/nyc",
      zipCode: "10001",
      budget: "medium",
      time: "morning",
      distance: 2.8,
      costInfo: "$20-30 per person",
      price: "$30 per class, $25 open play session, Monthly packages available",
      hours: "9:00 AM - 6:00 PM (Mon-Fri), 9:00 AM - 4:00 PM (Sat-Sun)",
      ageRange: "4 months - 12 years",
      rating: 4.5,
      accessibility: {
        wheelchairAccessible: true
      },
      image: "https://via.placeholder.com/300x200?text=Little+Gym"
    }
  ];


// Simplified helper to check if an event's time matches the selected time filter
function matchesTime(event, selectedTime) {
    if (!selectedTime) return true;
    return event.time === selectedTime;
}


/**
 * Get all places based on query parameters.
 * This function is exported directly as a property of module.exports.
 */
// Simplified function to seed the database with mock data
const seedDatabase = async () => {
    try {
        const count = await Place.countDocuments();
        if (count === 0) {
            console.log('Seeding database with mock data...');
            const placesToInsert = mockPlacesData.map(({ id, ...place }) => {
                // Ensure required fields are present
                return {
                    ...place,
                    address: place.address || 'Address not available',
                    description: place.description || 'No description available'
                };
            });
            await Place.insertMany(placesToInsert);
            console.log('Database seeded successfully!');
        } else {
            console.log(`Database already contains ${count} places.`);
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// Call the seed function when the controller is loaded
seedDatabase();

exports.getPlaces = async (req, res) => {
    try {
        console.log('\n=== GET PLACES REQUEST ===');
        console.log('Query parameters:', req.query);
        
        const { zipCode, time, budget, handicapAccessible } = req.query;
        
        console.log('Extracted filters:', {
            zipCode,
            time,
            budget,
            handicapAccessible
        });
        
        let allPlaces = [];
        
        // Use Google Places API exclusively
        if (zipCode && zipCode.trim() !== '') {
            console.log(`Fetching real data from Google Places API for zip code: ${zipCode}`);
            try {
                const googlePlaces = await getKidsActivitiesByZipCode(zipCode);
                if (googlePlaces && googlePlaces.length > 0) {
                    console.log(`Google Places API returned ${googlePlaces.length} places`);
                    allPlaces = googlePlaces;
                } else {
                    console.log('No places found from Google Places API for this location');
                    return res.json({ 
                        places: [], 
                        total: 0,
                        zipCode: zipCode,
                        budget: budget || 'all',
                        message: 'No kid-friendly places found in this area. Try a different zip code.' 
                    });
                }
            } catch (apiError) {
                console.log('Google Places API error:', apiError.message);
                return res.status(500).json({ 
                    error: 'Unable to fetch places data. Please check your API configuration and try again.',
                    details: apiError.message 
                });
            }
        } else {
            return res.status(400).json({ 
                error: 'Zip code is required to search for places.',
                message: 'Please provide a valid zip code to find kid-friendly activities in your area.' 
            });
        }
        
        console.log('Total places from Google API:', allPlaces.length);
        let filteredPlaces = allPlaces;
        
        // Apply time filter if specified
        if (time) {
            filteredPlaces = filteredPlaces.filter(place => place.time === time);
            console.log(`After time filter (${time}):`, filteredPlaces.length);
        }
        
        // Apply budget filter if specified
        if (budget) {
            console.log('=== BUDGET FILTER DEBUG ===');
            console.log('Budget filter value:', budget);
            console.log('Places before budget filter:', filteredPlaces.length);
            // Debug: Log first few places to see their structure
            console.log('Sample places before budget filter:', filteredPlaces.slice(0, 3).map(p => ({
                name: p.name,
                priceLevel: p.priceLevel,
                price: p.price,
                types: p.types
            })));
            
            filteredPlaces = filteredPlaces.filter(place => {
                const priceLevel = place.priceLevel;
                const priceDescription = place.price;
                const placeName = place.name ? place.name.toLowerCase() : '';
                const placeTypes = place.types ? place.types.join(' ').toLowerCase() : '';
                
                // Map budget categories to price levels with more inclusive logic
                switch (budget.toLowerCase()) {
                    case 'free':
                        console.log(`Testing place: ${place.name}, priceLevel: ${priceLevel}, price: ${priceDescription}, types: ${place.types}`);
                        // Include only truly free places - be strict but not overly restrictive
                        // First, exclude obviously commercial places
                        // Exception: splash pads are often tagged as amusement_park but are typically free
                        const isSplashPad = placeName.includes('splash pad') || placeName.includes('splash park');
                        const isCommercial = !isSplashPad && (
                                           placeName.includes('escape room') ||
                                           placeName.includes('adventure park') ||
                                           placeName.includes('amusement') ||
                                           placeName.includes('entertainment') ||
                                           placeName.includes('indoor playground') ||
                                           placeName.includes('kidz klub') ||
                                           placeName.includes('kidszone') ||
                                           placeName.includes('fantasy forest') ||
                                           placeName.includes('carousel') ||
                                           placeTypes.includes('amusement_park') ||
                                           placeTypes.includes('bowling_alley') ||
                                           (placeTypes.includes('zoo') && !placeName.includes('public')));
                        
                        if (isCommercial) {
                            return false;
                        }
                        
                        const isFree = priceLevel === 0 || 
                                     priceDescription === 'Free' ||
                                     // Public spaces and facilities
                                     placeName.includes('park') && !placeName.includes('amusement') ||
                                     placeName.includes('playground') ||
                                     placeName.includes('splash pad') ||
                                     placeName.includes('splash park') ||
                                     placeName.includes('water park') && placeName.includes('public') ||
                                     placeName.includes('beach') ||
                                     placeName.includes('library') ||
                                     placeName.includes('community center') ||
                                     placeName.includes('recreation center') ||
                                     placeName.includes('nature center') ||
                                     placeName.includes('trail') ||
                                     placeName.includes('garden') && placeName.includes('public') ||
                                     // Place types that are typically free
                                     placeTypes.includes('library') ||
                                     placeTypes.includes('campground') ||
                                     placeTypes.includes('natural_feature') ||
                                     placeTypes.includes('park') && !placeTypes.includes('amusement_park') ||
                                     placeTypes.includes('establishment') && placeName.includes('splash');
                        console.log(`Place ${place.name} is free: ${isFree}`);
                        return isFree;
                    case 'low':
                        return priceLevel === 0 || priceLevel === 1 || 
                               priceDescription === 'Free' || priceDescription === '$' ||
                               priceDescription === 'Price not available';
                    case 'medium':
                        return priceLevel === 0 || priceLevel === 1 || priceLevel === 2 || 
                               priceDescription === 'Free' || priceDescription === '$' || priceDescription === '$$' || 
                               priceDescription === 'Price not available' || priceLevel === undefined;
                    case 'high':
                        return true; // Include all for high budget
                    default:
                        return true; // If budget filter is not recognized, include all
                }
            });
            console.log(`After budget filter (${budget}):`, filteredPlaces.length);
        }
        
        // Apply accessibility filter if specified
        if (handicapAccessible === 'true') {
            // For now, we'll assume all places need to be called for accessibility info
            // In a real implementation, you might want to make additional API calls
            console.log('Accessibility filter applied - please call venues directly for accessibility information');
        }
        
        console.log('Final filtered places:', filteredPlaces.length);
        res.json({ 
            places: filteredPlaces,
            total: filteredPlaces.length,
            zipCode: zipCode,
            budget: budget || 'all',
            message: filteredPlaces.length === 0 ? 'No places found matching your criteria. Try adjusting your filters.' : undefined
        });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ message: 'Error fetching places' });
    }
};

/**
 * Get a single place by ID.
 * This function is exported directly as a property of module.exports.
 */
// Get a place by ID
exports.getPlaceById = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).json({ message: 'Place not found' });
        res.json(place);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ message: 'Error fetching place' });
    }
};

// Create a new place
exports.createPlace = async (req, res) => {
    try {
        const newPlace = new Place(req.body);
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).json({ message: 'Error creating place', error: error.message });
    }
};

// Update a place
exports.updatePlace = async (req, res) => {
    try {
        const updatedPlace = await Place.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        if (!updatedPlace) return res.status(404).json({ message: 'Place not found' });
        res.json(updatedPlace);
    } catch (error) {
        console.error('Error updating place:', error);
        res.status(500).json({ message: 'Error updating place' });
    }
};

// Delete a place
exports.deletePlace = async (req, res) => {
    try {
        const deletedPlace = await Place.findByIdAndDelete(req.params.id);
        if (!deletedPlace) return res.status(404).json({ message: 'Place not found' });
        res.json({ message: 'Place deleted successfully' });
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ message: 'Error deleting place' });
    }
};
