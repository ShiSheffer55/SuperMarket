const Location = require('../models/location'); 

// בדוק את הפורמט של הנתונים המוחזרים מהשרת
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        console.log(JSON.stringify(locations, null, 2)); // בדיקה נוספת של הפורמט
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
};


// Render map page with locations
const renderLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        res.render('location', { locations });
    } catch (err) {
        res.status(500).send('Failed to load locations');
    }
}

module.exports = {
    getLocations,
    renderLocations
};
