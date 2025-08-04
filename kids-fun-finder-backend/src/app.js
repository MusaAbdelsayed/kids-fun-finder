// C:\Users\12016\Desktop\ai-native-journey\KidsFunFinderWebApp\kids-fun-finder-backend\src\app.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes and origins, including file:// protocol
app.use(cors({
    origin: true,
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB using environment variable
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Using mock data instead of MongoDB');
});

// Import routes
const placesRoutes = require('./routes/places');

// Use routes
app.use('/api/places', placesRoutes);

// For reference only - this was the old in-memory database
/*
const activities = [
    {
        id: 1,
        title: "Children's Discovery Museum",
        description: "An interactive museum with hands-on exhibits for kids of all ages.",
        address: "123 Discovery Lane",
        zipCode: "10001",
        budget: "$$",
        handicapAccessible: true,
        availableTime: "Afternoon"
    },
    {
        id: 2,
        title: "Adventure Playground Park",
        description: "A large public park with a playground, swings, and climbing structures.",
        address: "456 Park Avenue",
        zipCode: "10001",
        budget: "Free",
        handicapAccessible: true,
        availableTime: "Afternoon"
    },
    {
        id: 3,
        title: "Local Library Story Time",
        description: "Free weekly story time for young children with a librarian.",
        address: "789 Bookish Blvd",
        zipCode: "10001",
        budget: "Free",
        handicapAccessible: true,
        availableTime: "Afternoon"
    },
    {
        id: 4,
        title: "Community Pool Day",
        description: "Cool off at the community pool with designated swim times for families.",
        address: "101 Swim Street",
        zipCode: "10001",
        budget: "$",
        handicapAccessible: false,
        availableTime: "Morning"
    }
];

/**
 * API Endpoint to get all activities.
 * This endpoint will be used by the frontend to fetch the list of available activities.
 * The `req` object holds information about the incoming request.
 * The `res` object is used to send a response back to the client.
 */
app.get('/activities', (req, res) => {
    // Send the activities array as a JSON response
    res.send(activities);
});

// Start the server and listen for requests on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port} with Google Places API integration`);
});
