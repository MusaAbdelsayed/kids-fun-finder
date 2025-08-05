# Kids Fun Finder 🎈

A web application designed to help parents quickly discover personalized, local activities for their children. This platform addresses the challenge of finding suitable family entertainment by offering dynamic search and filtering based on criteria like zip code, age, budget, and handicap accessibility.

## 🌟 Features

- **Location-Based Search**: Find kid-friendly activities by zip code
- **Budget Filtering**: Filter activities by price range (free, moderate, expensive)
- **Real-Time Data**: Integration with Google Places API for up-to-date information
- **Comprehensive Information**: Get details including ratings, hours, contact info, and photos
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Robust error handling for invalid inputs and API failures

## 🚀 Live Demo

The application runs on:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Modern CSS** with responsive design
- **Component-based architecture**

### Backend
- **Node.js** with Express.js framework
- **MongoDB Atlas** for data storage
- **Google Places API** for real-time place data
- **Google Geocoding API** for zip code to coordinates conversion

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Google Places API key
- MongoDB Atlas account (or local MongoDB)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/MusaAbdelsayed/kids-fun-finder.git
cd kids-fun-finder
```

### 2. Backend Setup
```bash
cd kids-fun-finder-backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env file with your API keys and database URL
```

### 3. Frontend Setup
```bash
cd ../kids-fun-finder-frontend
npm install
```

### 4. Google Places API Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Places API (New)**
   - **Geocoding API**
4. Create an API key and add it to your `.env` file:
   ```
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

For detailed setup instructions, see [GOOGLE_PLACES_SETUP.md](kids-fun-finder-backend/GOOGLE_PLACES_SETUP.md)

### 5. Database Configuration

Update your `.env` file with MongoDB connection details:
```
MONGODB_URI=your_mongodb_connection_string
MONGODB_NAME=fun-finder
```

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd kids-fun-finder-backend
npm start
```
Backend will run on http://localhost:3001

### Start Frontend Development Server
```bash
cd kids-fun-finder-frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Alternative: Simple HTML Server
For a simple static version:
```bash
# From project root
node serve-html.js
```
This serves the basic HTML version on http://localhost:8080

## 📡 API Endpoints

### Get Places
```
GET /api/places?zipCode={zipCode}&budget={budget}&time={time}
```

**Parameters:**
- `zipCode` (required): 5-digit US zip code
- `budget` (optional): 'free', 'moderate', 'expensive', or 'all'
- `time` (optional): Filter by time preference

**Example:**
```
GET /api/places?zipCode=10001&budget=free
```

**Response:**
```json
{
  "places": [
    {
      "id": "place_id",
      "name": "Central Park Playground",
      "description": "park, point_of_interest, establishment",
      "address": "New York, NY, USA",
      "rating": 4.5,
      "price": "Free",
      "hours": "Open 24 hours",
      "phone": "(212) 310-6600",
      "website": "https://www.centralparknyc.org/",
      "image": "photo_url",
      "distance": 2.3
    }
  ],
  "total": 15,
  "zipCode": "10001",
  "budget": "free"
}
```

## 🧪 Testing

Test the API endpoints:

```bash
# Test valid request
curl "http://localhost:3001/api/places?zipCode=11208&budget=free"

# Test error handling
curl "http://localhost:3001/api/places?zipCode=&budget=free"
```

## 📁 Project Structure

```
kids-fun-finder/
├── kids-fun-finder-backend/     # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic & external APIs
│   │   └── app.js              # Express app configuration
│   ├── server.js               # Server entry point
│   └── package.json
├── kids-fun-finder-frontend/    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.jsx             # Main App component
│   │   └── main.jsx            # React entry point
│   ├── public/                 # Static assets
│   └── package.json
├── index.html                  # Simple HTML version
├── serve-html.js              # Static server for HTML version
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Google Places API
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_NAME=fun-finder

# Server
PORT=3001
```

## 🚨 Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your Google Places API key is valid
   - Check that Places API and Geocoding API are enabled
   - Verify API key restrictions if any

2. **Database Connection**
   - Verify MongoDB URI is correct
   - Check network connectivity to MongoDB Atlas
   - Ensure database user has proper permissions

3. **CORS Issues**
   - Backend includes CORS middleware for frontend communication
   - Check if frontend URL is allowed in CORS configuration

4. **No Results Found**
   - Try different zip codes
   - Check if the area has kid-friendly places
   - Verify API quota hasn't been exceeded

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Musa Abdelsayed**
- GitHub: [@MusaAbdelsayed](https://github.com/MusaAbdelsayed)

## 🙏 Acknowledgments

- Google Places API for providing comprehensive location data
- React and Vite teams for excellent development tools
- MongoDB for reliable database services
- All contributors and testers who helped improve this application

---

**Happy exploring! 🎉** Help parents discover amazing activities for their kids in their local area.