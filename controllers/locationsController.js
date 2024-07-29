const Location = require('../models/location'); 

// Fetch all locations
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
};

const renderLocations = async (req, res) => {
    res.render('location'); 
}

module.exports = {
    getLocations,
    renderLocations
};
