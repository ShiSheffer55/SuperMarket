const Location = require('../models/location');
const fetch = require('node-fetch');

const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        console.log(JSON.stringify(locations, null, 2)); // לוג של הנתונים
        res.json(locations);
    } catch (err) {
        console.error('Error fetching locations:', err); // לוג של שגיאה
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
};


const renderLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        res.render('locations', { 
            locations,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY // Send API key to the view
        });
    } catch (err) {
        res.status(500).send('Failed to load locations');
    }
};


const renderWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).send('Latitude and Longitude are required');
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        res.json(data); // Return the data as JSON for the client-side script to handle
    } catch (err) {
        console.error('Error fetching weather data:', err);
        res.status(500).send('Failed to load weather data');
    }
};




module.exports = {
    getLocations,
    renderLocations, 
    renderWeather
};
