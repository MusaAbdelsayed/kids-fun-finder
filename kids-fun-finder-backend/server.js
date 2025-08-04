// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Use CORS to allow requests from the frontend
app.use(cors());
app.use(express.json());

// --- MOCK DATABASE OF ACTIVITIES IN NEW YORK ---
// This is a static data set. In a real application, this data would come from a database.
const activitiesData = [
    {
        id: 1,
        name: "Central Park Zoo",
        description: "A fun and educational trip to see animals in the heart of NYC.",
        category: "Animals & Outdoors",
        zipCode: "10021",
        age: { min: 2, max: 12 },
        budget: "medium",
        handicapAccess: true,
        image: "https://placehold.co/600x400/007bff/ffffff?text=Central+Park+Zoo",
        location: "Central Park, New York, NY",
    },
    {
        id: 2,
        name: "Intrepid Sea, Air & Space Museum",
        description: "Explore the historic aircraft carrier Intrepid, a space shuttle, and a submarine.",
        category: "Museum & History",
        zipCode: "10036",
        age: { min: 6, max: 18 },
        budget: "high",
        handicapAccess: true,
        image: "https://placehold.co/600x400/2ecc71/ffffff?text=Intrepid+Museum",
        location: "Pier 86, New York, NY",
    },
    {
        id: 3,
        name: "New York Hall of Science",
        description: "Interactive science exhibits perfect for curious young minds.",
        category: "Science & Education",
        zipCode: "11368", // Queens
        age: { min: 5, max: 15 },
        budget: "low",
        handicapAccess: true,
        image: "https://placehold.co/600x400/f39c12/ffffff?text=NY+Hall+of+Science",
        location: "47-01 111th St, Corona, NY",
    },
    {
        id: 4,
        name: "Brooklyn Bridge Park",
        description: "Enjoy playgrounds, a carousel, and stunning views of the city skyline.",
        category: "Outdoors",
        zipCode: "11201", // Brooklyn
        age: { min: 1, max: 16 },
        budget: "free",
        handicapAccess: true,
        image: "https://placehold.co/600x400/3498db/ffffff?text=Brooklyn+Bridge+Park",
        location: "334 Furman St, Brooklyn, NY",
    },
    {
        id: 5,
        name: "Bronx Zoo",
        description: "One of the largest zoos in the US, with a wide variety of animals and exhibits.",
        category: "Animals & Outdoors",
        zipCode: "10460", // The Bronx
        age: { min: 1, max: 18 },
        budget: "medium",
        handicapAccess: true,
        image: "https://placehold.co/600x400/9b59b6/ffffff?text=Bronx+Zoo",
        location: "2300 Southern Blvd, The Bronx, NY",
    },
    {
        id: 6,
        name: "Statue of Liberty & Ellis Island",
        description: "A ferry ride to see a historic national monument and learn about immigration history.",
        category: "History & Sightseeing",
        zipCode: "10004", // Lower Manhattan
        age: { min: 8, max: 18 },
        budget: "high",
        handicapAccess: true,
        image: "https://placehold.co/600x400/e74c3c/ffffff?text=Statue+of+Liberty",
        location: "New York, NY",
    },
    {
        id: 7,
        name: "Museum of Natural History",
        description: "Dinosaur skeletons and planetarium shows make this a must-see for all ages.",
        category: "Museum & Science",
        zipCode: "10024", // Upper West Side
        age: { min: 3, max: 18 },
        budget: "low",
        handicapAccess: true,
        image: "https://placehold.co/600x400/1abc9c/ffffff?text=Natural+History+Museum",
        location: "200 Central Park West, New York, NY",
    },
    {
        id: 8,
        name: "Gantry Plaza State Park",
        description: "Riverside park in Queens with playgrounds and iconic views of the Manhattan skyline.",
        category: "Outdoors",
        zipCode: "11101", // Queens
        age: { min: 1, max: 12 },
        budget: "free",
        handicapAccess: true,
        image: "https://placehold.co/600x400/f1c40f/ffffff?text=Gantry+Plaza+Park",
        location: "4-09 47th Rd, Long Island City, NY",
    },
    {
        id: 9,
        name: "Staten Island Greenbelt Nature Center",
        description: "Hiking trails, nature programs, and an environmental education center.",
        category: "Nature & Outdoors",
        zipCode: "10306", // Staten Island
        age: { min: 5, max: 18 },
        budget: "free",
        handicapAccess: false, // Example of no handicap access
        image: "https://placehold.co/600x400/8e44ad/ffffff?text=Greenbelt+Nature+Center",
        location: "700 Rockland Ave, Staten Island, NY",
    },
    {
        id: 10,
        name: "Governor's Island",
        description: "A seasonal destination with bike rentals, art, and fantastic skyline views.",
        category: "Outdoors & Sightseeing",
        zipCode: "10004", // Lower Manhattan
        age: { min: 5, max: 18 },
        budget: "low", // Ferry fee
        handicapAccess: true,
        image: "https://placehold.co/600x400/34495e/ffffff?text=Governors+Island",
        location: "New York, NY",
    },
];

// Define a map of NY borough zip codes for proximity filtering
const newYorkZips = {
    manhattan: ["10001", "10002", "10003", "10004", "10005", "10006", "10007", "10008", "10009", "10010", "10011", "10012", "10013", "10014", "10016", "10017", "10018", "10019", "10020", "10021", "10022", "10023", "10024", "10025", "10026", "10027", "10028", "10029", "10030", "10031", "10032", "10033", "10034", "10035", "10036", "10037", "10038", "10039", "10040"],
    bronx: ["10451", "10452", "10453", "10454", "10455", "10456", "10457", "10458", "10459", "10460", "10461", "10462", "10463", "10464", "10465", "10466", "10467", "10468", "10469", "10470", "10471", "10472", "10473", "10474", "10475"],
    brooklyn: ["11201", "11203", "11204", "11205", "11206", "11207", "11208", "11209", "11210", "11211", "11212", "11213", "11214", "11215", "11216", "11217", "11218", "11219", "11220", "11221", "11222", "11223", "11224", "11225", "11226", "11228", "11229", "11230", "11231", "11232", "11233", "11234", "11235", "11236", "11237", "11238", "11239", "11241", "11242", "11243", "11249", "11251", "11252"],
    queens: ["11101", "11102", "11103", "11104", "11105", "11106", "11109", "11354", "11355", "11356", "11357", "11358", "11359", "11360", "11361", "11362", "11363", "11364", "11365", "11366", "11367", "11368", "11369", "11370", "11371", "11372", "11373", "11374", "11375", "11377", "11378", "11379", "11385", "11411", "11412", "11413", "11414", "11415", "11416", "11417", "11418", "11419", "11420", "11421", "11422", "11423", "11426", "11427", "11428", "11429", "11430", "11432", "11433", "11434", "11435", "11436", "11451", "11457", "11499"],
    staten_island: ["10301", "10302", "10303", "10304", "10305", "10306", "10307", "10308", "10309", "10310", "10312", "10314"],
};

// Function to find the borough for a given zip code
function getBoroughByZip(zip) {
    for (const borough in newYorkZips) {
        if (newYorkZips[borough].includes(zip)) {
            return borough;
        }
    }
    return null;
}

// Function to get all zip codes in a given borough
function getZipsByBorough(borough) {
    return newYorkZips[borough] || [];
}

// The main API endpoint to get a list of filtered activities
app.get('/api/activities', (req, res) => {
    // Extract query parameters from the request
    const { zipCode, age, budget, handicapAccess, time } = req.query;

    console.log("Received a request with parameters:", req.query);

    // Get the borough for the provided zip code
    const userBorough = getBoroughByZip(zipCode);
    const nearbyZips = userBorough ? getZipsByBorough(userBorough) : [];

    // Filter the activities based on the provided criteria
    let filteredActivities = activitiesData.filter(activity => {
        // Zip code filter
        // If a zip code is provided, only show activities in the same borough.
        // If no zip code is provided, show all activities.
        const isNearby = !zipCode || nearbyZips.includes(activity.zipCode);

        // Age filter
        // If an age is provided, check if the activity's age range is suitable.
        const isAgeAppropriate = !age || (parseInt(age) >= activity.age.min && parseInt(age) <= activity.age.max);

        // Budget filter
        // If a budget is provided, check if it matches the activity's budget.
        const isBudgetMatch = !budget || budget === "any" || activity.budget === budget;

        // Handicap access filter
        // If the user requested handicap access, only show activities that have it.
        const isHandicapAccessible = !handicapAccess || handicapAccess === 'false' || activity.handicapAccess;
        
        // Time filter is not implemented in this mock backend, as it requires a real-time calendar and scheduling.
        // It's included in the prompt for demonstration of how to handle various inputs.

        // Return true if the activity meets all the criteria
        return isNearby && isAgeAppropriate && isBudgetMatch && isHandicapAccessible;
    });

    // Send the filtered data back as a JSON response
    res.json(filteredActivities);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
