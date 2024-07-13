const database = 'products';
const collection = 'Shira';

// The current database to use.
use(database);

// Create a new collection.
db.createCollection(collection);


function findAllProducts(){
    arr = db.Shira.find().toArray()
    document.getElementById('prods').innerHTML = arr
    return arr;
    console.log(arr)
}
findAllProducts()

exports = {findAllProducts}

