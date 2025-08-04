# Kids Fun Finder Backend - Simplified MongoDB Integration

This is a simplified version of the Kids Fun Finder backend with MongoDB integration. The application allows you to store and retrieve places for kids' activities.

## Setup

1. Make sure MongoDB Atlas is set up and you have your connection string
2. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   PORT=3000
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Testing the Database Connection

To test if your MongoDB connection is working properly:

```
npm run test-db
```

This will connect to your database, check if there are any places, and display an example if available.

## API Endpoints

- **GET /api/places** - Get all places (with optional filtering)
  - Query parameters: zipCode, time, budget, handicapAccessible
- **GET /api/places/:id** - Get a specific place by ID
- **POST /api/places** - Create a new place
- **PUT /api/places/:id** - Update an existing place
- **DELETE /api/places/:id** - Delete a place

## Data Model

The simplified Place model includes:

```javascript
{
  name: String,           // required
  address: String,        // required
  zipCode: String,        // required
  description: String,
  budget: String,         // required, one of: 'free', 'low', 'medium', 'high'
  accessibility: {
    wheelchairAccessible: Boolean,
    sensoryFriendly: Boolean
  },
  events: [{
    name: String,         // required
    date: String,         // required, format: 'YYYY-MM-DD'
    time: String          // required, one of: 'morning', 'afternoon', 'evening', 'weekend'
  }],
  image: String,
  location: String
}
```

## Adding Places Manually

You can add places to the database in two ways:

1. **Automatic Seeding**: The first time you start the server, it will automatically check if the database is empty and seed it with sample data if needed.

2. **API Endpoint**: Use the POST /api/places endpoint to add new places. Example:

```bash
curl -X POST http://localhost:3000/api/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kids Play Zone",
    "address": "123 Fun Street",
    "zipCode": "10001",
    "description": "Indoor playground with slides and ball pits",
    "budget": "medium",
    "accessibility": {
      "wheelchairAccessible": true,
      "sensoryFriendly": false
    },
    "events": [
      {
        "name": "Open Play",
        "date": "2023-08-15",
        "time": "morning"
      }
    ]
  }'
```