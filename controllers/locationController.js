const Location = require('../models/location');

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

module.exports = {
    getLocations,
    renderLocations
};
