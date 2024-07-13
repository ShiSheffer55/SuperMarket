/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
const database = 'products';
const collection = 'Shira';

// The current database to use.
use(database)

// Create a new collection.
db.createCollection(collection);

arr = db.Shira.find().toArray()
console.log(arr)

