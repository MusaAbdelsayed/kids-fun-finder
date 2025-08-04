import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react'; // Import the Search icon from lucide-react

const App = () => {
  // State to manage the search input value
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    zipCode: '',
    budget: 'medium',
    time: '',
    handicapAccessible: false
  });
  const [currentBackground, setCurrentBackground] = useState('');

  // Array of background images
  const backgroundImages = [
    '/background-example-1.svg',
    '/background-example-2.svg',
    '/background-example-3.svg'
  ];

  // Function to randomly select a background
  const selectRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentBackground(backgroundImages[randomIndex]);
  };

  // Select initial background on component mount
  useEffect(() => {
    selectRandomBackground();
  }, []);

  // Fetch places from the API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        // Select a new random background when filters change
        selectRandomBackground();
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.zipCode) params.append('zipCode', filters.zipCode);
        if (filters.budget) params.append('budget', filters.budget);
        if (filters.time) params.append('time', filters.time);
        if (filters.handicapAccessible) params.append('handicapAccessible', 'true');
        
        const response = await fetch(`http://localhost:3001/api/places?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data = await response.json();
        // Handle both old array format and new object format
        const places = Array.isArray(data) ? data : (data.places || []);
        setActivities(places);
        setError(data.message || null);
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('Failed to load activities. Please try again later.');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [filters]);

  // Filter activities based on the search term
  const filteredActivities = activities.filter(activity =>
    activity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="min-h-screen font-sans p-4 sm:p-8 relative"
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-white bg-opacity-70 pointer-events-none"></div>
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
      {/* Header section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2" style={{
          fontFamily: 'Fredoka One, cursive'
        }}>
          <span style={{color: '#ff6b6b'}}>K</span>
          <span style={{color: '#4ecdc4'}}>i</span>
          <span style={{color: '#45b7d1'}}>d</span>
          <span style={{color: '#96ceb4'}}>s</span>
          <span style={{color: '#feca57'}}> </span>
          <span style={{color: '#ff9ff3'}}>F</span>
          <span style={{color: '#54a0ff'}}>u</span>
          <span style={{color: '#5f27cd'}}>n</span>
          <span style={{color: '#00d2d3'}}> </span>
          <span style={{color: '#ff9f43'}}>F</span>
          <span style={{color: '#ee5a24'}}>i</span>
          <span style={{color: '#0abde3'}}>n</span>
          <span style={{color: '#10ac84'}}>d</span>
          <span style={{color: '#f368e0'}}>e</span>
          <span style={{color: '#ff3838'}}>r</span>
        </h1>
        <p className="text-lg" style={{
          fontFamily: 'Bubblegum Sans, cursive',
          color: '#2196F3',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          animation: 'bounce-text 2s ease-in-out infinite'
        }}>
          Find the perfect activity for your family!
        </p>
      </header>

      {/* Filter section */}
      <div className="max-w-4xl mx-auto mb-8 rounded-xl shadow-md p-6" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h2 className="text-xl font-bold mb-4" style={{
          fontFamily: 'Fredoka One, cursive',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>Find Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{
              fontFamily: 'Comic Neue, cursive',
              color: 'white',
              fontWeight: '700'
            }}>Zip Code</label>
            <input
              type="text"
              placeholder="Enter zip code"
              value={filters.zipCode}
              onChange={(e) => setFilters({...filters, zipCode: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{
              fontFamily: 'Comic Neue, cursive',
              color: 'white',
              fontWeight: '700'
            }}>Budget</label>
            <select
              value={filters.budget}
              onChange={(e) => setFilters({...filters, budget: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Budget</option>
              <option value="free">Free</option>
              <option value="low">Low (0-15)</option>
              <option value="medium">Medium (15-30)</option>
              <option value="high">High (30+)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{
              fontFamily: 'Comic Neue, cursive',
              color: 'white',
              fontWeight: '700'
            }}>Time</label>
            <select
              value={filters.time}
              onChange={(e) => setFilters({...filters, time: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="all day">All Day</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.handicapAccessible}
                onChange={(e) => setFilters({...filters, handicapAccessible: e.target.checked})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium" style={{
                fontFamily: 'Comic Neue, cursive',
                color: 'white',
                fontWeight: '700'
              }}>Handicap Accessible</span>
            </label>
          </div>
        </div>
        
        {/* Find Activities Button */}
        <div className="mt-6">
          <button
            onClick={() => {
              // Trigger a re-fetch of activities with current filters
              const fetchPlaces = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  
                  // Build query parameters
                  const params = new URLSearchParams();
                  if (filters.zipCode) params.append('zipCode', filters.zipCode);
                  if (filters.budget) params.append('budget', filters.budget);
                  if (filters.time) params.append('time', filters.time);
                  if (filters.handicapAccessible) params.append('handicapAccessible', 'true');
                  
                  console.log('Fetching with params:', params.toString());
                  const response = await fetch(`http://localhost:3001/api/places?${params.toString()}`);
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  const data = await response.json();
                  console.log('API Response:', data);
                  // Handle both old array format and new object format
                  const places = Array.isArray(data) ? data : (data.places || []);
                  console.log('Extracted places:', places);
                  setActivities(places);
                  setError(data.message || null);
                } catch (err) {
                  console.error('Error fetching places:', err);
                  setError('Failed to fetch activities. Please try again.');
                } finally {
                  setLoading(false);
                }
              };
              
              fetchPlaces();
            }}
            className="w-full text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              fontFamily: 'Comic Neue, cursive',
              fontSize: '18px',
              fontWeight: '700'
            }}
          >
            🔍 Find Activities
          </button>
        </div>
      </div>

      {/* Search bar section */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative flex items-center bg-white rounded-xl shadow-md p-2">
          <Search className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search for activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading activities...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Activities grid */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <div key={activity._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 activity-card">
                <img
                  src={activity.imageUrl || `https://placehold.co/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(activity.name)}`}
                  alt={activity.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x200/6B7280/FFFFFF?text=Image+Not+Found';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 activity-title">
                    {activity.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {activity.description}
                  </p>
                  
                  {/* Venue Information */}
                  <div className="mb-3 space-y-2">
                    {activity.address && (
                      <div className="flex items-start text-sm text-gray-700">
                        <span className="font-medium min-w-[60px]">Address:</span>
                        <span className="ml-2">{activity.address}</span>
                      </div>
                    )}
                    <div className="flex items-start text-sm">
                      <span className="font-medium min-w-[60px] text-gray-700">Pricing:</span>
                      <span className="ml-2 text-green-600 font-bold text-base">
                        {activity.price || "N/A"}
                      </span>
                    </div>
                    {activity.phone && (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[60px]">Phone:</span>
                        <a href={`tel:${activity.phone}`} className="ml-2 text-blue-600 hover:underline">{activity.phone}</a>
                      </div>
                    )}
                    {activity.website && (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[60px]">Website:</span>
                        <a href={activity.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">Visit Website</a>
                      </div>
                    )}
                    {activity.hours && (
                      <div className="flex items-start text-sm text-gray-700">
                        <span className="font-medium min-w-[60px]">Hours:</span>
                        <span className="ml-2">{activity.hours}</span>
                      </div>
                    )}
                    {activity.ageRange && (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[60px]">Age:</span>
                        <span className="ml-2 text-purple-600 font-semibold">{activity.ageRange}</span>
                      </div>
                    )}
                    {activity.distance && (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[60px]">Distance:</span>
                        <span className="ml-2 text-blue-600 font-semibold">{activity.distance} miles away</span>
                      </div>
                    )}
                    {activity.rating && activity.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[60px]">Rating:</span>
                        <span className="ml-2 text-yellow-600 font-semibold">{activity.rating}/5 ⭐</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="fun-tag">
                      {activity.budget ? activity.budget.charAt(0).toUpperCase() + activity.budget.slice(1) : 'Any Budget'}
                    </span>
                    {activity.accessibility && activity.accessibility.wheelchairAccessible && (
                      <span className="fun-tag">
                        ♿ Accessible
                      </span>
                    )}
                    {activity.time && (
                      <span className="fun-tag">
                        {activity.time.charAt(0).toUpperCase() + activity.time.slice(1)}
                      </span>
                    )}
                    {activity.openNow !== null && (
                      <span className="fun-tag">
                        {activity.openNow ? '🟢 Open Now' : '🔴 Closed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No places found matching your criteria. Try adjusting your filters.
            </p>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default App;
