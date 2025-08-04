// Script to test MongoDB connection
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

// Get the MongoDB URI from environment variables
const uri = process.env.DATABASE_URL;

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    
    console.log('Successfully connected to MongoDB!');
    console.log('Connection details:');
    console.log(`- Database name: ${mongoose.connection.name}`);
    console.log(`- Host: ${mongoose.connection.host}`);
    console.log(`- Port: ${mongoose.connection.port}`);
    
    // Test if we can perform a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    console.log('\nConnection test completed successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

// Run the test
testConnection();