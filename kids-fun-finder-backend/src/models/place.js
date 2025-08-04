// models/Place.js
// Simplified Mongoose schema for a Place document

const mongoose = require('mongoose');

// Simplified schema with only essential fields
const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    description: { type: String },
    budget: { type: String, enum: ['free', 'low', 'medium', 'high'], required: true },
    accessibility: {
        wheelchairAccessible: { type: Boolean, default: false },
        sensoryFriendly: { type: Boolean, default: false }
    },
    // Simplified events structure
    events: [{
        name: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, enum: ['morning', 'afternoon', 'evening', 'weekend'], required: true }
    }],
    image: { type: String },
    location: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Place', placeSchema);
