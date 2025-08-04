// Simple script to test MongoDB connection and check places collection

require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/place');

async function testDbConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully!');
    
    // Count places in the database
    const placeCount = await Place.countDocuments();
    console.log(`There are ${placeCount} places in the database.`);
    
    // If there are places, show the first one as an example
    if (placeCount > 0) {
      const firstPlace = await Place.findOne();
      console.log('Example place from database:');
      console.log(JSON.stringify(firstPlace, null, 2));
    } else {
      console.log('No places found in the database. You may need to add some data.');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the test
testDbConnection();