// // const Product = require('../models/product');

// exports.filterProducts = async (req, res) => {
//   try {
//     const { priceRange, organic, parve } = req.query;

//     // Build the filter object
//     let filter = {};

//     if (priceRange) {
//       const [min, max] = priceRange.split('-').map(Number);
//       filter.price = { $gte: min, $lte: max };
//     }

//     if (organic) {
//       filter.organic = organic === 'true';
//     }

//     if (parve) {
//       filter.parve = parve === 'true';
//     }

//     // Query the database with the filter object
//     const products = await Product.find(filter);

//     res.render('products', { products });
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// };






const { collection } = require('../models/category');
const getProductModel = require('../models/product');
const Product = require('../models/product');

exports.filterProducts = async (req, res) => {
    const { minPrice, maxPrice, organic, parve } = req.query;

    let filter = {
        price: {
            $gte: parseFloat(minPrice),
            $lte: parseFloat(maxPrice)
        }
    };

    // if (organic === 'true') {
    //     filter.organic = true;
    // }

    // if (parve === 'true') {
    //     filter.parve = true;
    // }

    try {
        const products = await Product.find(filter);
        res.json({ products });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

