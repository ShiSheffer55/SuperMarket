const {MongoClient} = require('mongodb');
const { show } = require('../public/products');


async function main(){
  const uri = "mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/"

  const client = new MongoClient(uri);

  try{
    await client.connect(); 

    await showAllProducts(client); 

    // await deleteListingsBeforeDate(client, new Date("2024-07-13")); 

    // await deleteListingByName(client, 'Moshe'); 

    // await updateAllToHaveLastName(client); 

    // await upsertListingByName(client, 'Moshe', {name: 'Moshik', age: 35}); 

    // await updateListingByName(client, 'Moshe' , {age: 36}); 

    // await findListingsByAge(client, {MininumAge: 16} ); 

//     await createMultipleListings(client, [
//     {

//       name: 'Maya',
//       age: 18
//     }, 
//     {
//       name: 'Guy',
//       age: 24
//     }, 
//     {
//       name: 'Tsipi',
//       age: 67
//     }, 
//     {
//       name: 'Rivka', 
//       age: 54
//     },
//     {
//       name: 'Moshe', 
//       age: 34
//     }
//   ]
//     )

  // await findOneListingByName(client, "Moshe"); 
  }
  catch (e){
    console.error(e); 
  } 
  finally{
    await client.close(); 
  }
}

main().catch(console.error); 



async function deleteListingsBeforeDate(client, date){
    const result = await client.db('cluster0').collection("Shira").deleteMany({"last_scraped": {$lt: date}}); 
  
    console.log(`${result.deletedCount} documents were deleted`); 
  }
  
  
  async function deleteListingByName(client, nameOfListing){
    const result = await client.db('cluster0').collection("Shira").deleteOne({name: nameOfListing});
  
    console.log(`${result.deletedCount} documents were deleted`); 
  } 
  
  
  
  //update----------------------------------------------------
  async function updateAllToHaveLastName(client){
  const result = await client.db("cluster0").collection("Shira").updateMany({last_name: {$exists: false}}, {$set: {last_name: "unknown"}}); 
  
  console.log(`${result.matchedCount} documents matched`); 
  console.log(`${result.modifiedCount} documents were updated`); 
  
  } 
  
  
  async function upsertListingByName(client, nameOfListing, updatedListing){
  
    const result = await client.db('cluser0').collection("Shira").updateOne({name: nameOfListing}, 
      {$set: updatedListing}, {upsert: true}); 
  
      console.log(`${result.matchedCount} documents matched`); 
  
      if(result.upsertedCount > 0  ){
        console.log(`one document was inserted with the id: ${result.insertedId}`) ; 
  
      }
      else{
        console.log(`${result.modifiedCount } documents were updated `); 
  
      }
  }
  
 
  
  async function updateListingByName(client, nameOfListing, updatedListing){
  
  const result = await client.db('cluser0').collection("Shira").updateOne({name: nameOfListing}, {$set: updatedListing}); 
  
  console.log(`${result.matchedCount} document(s) matched`); 
  console.log(`${result.modifiedCount} documents were updated`); 
  } 
  
  //find-------------------------------------------------- 
  
  async function findListingsByAge(client, {
    MininumAge = 0 
  }){
  
  const cursor = client.db('cluster0').collection("Shira").find({
    age: {$gte: MininumAge}
  }
  )
  const results = await cursor.toArray(); 
  }
  
  
  async function findOneListingByName(client, nameOfListing){
  
    const result = await client.db("cluster0").collection('Shira').findOne({name: nameOfListing})
  
    if(result){
      console.log(`found a listing with the name ${nameOfListing}`); 
      console.log(result); 
  
    }
    else{
      console.log(`No listing found with the name ${nameOfListing}`); 
  
    }
  }
  
  //create multiple----------------------------------
  async function createMultipleListings(client, newListings){
  const result = await client.db("cluster0").collection("Shira").insertMany(newListings);
  
  console.log(`${result.insertedCount} new listings created with the id: `);
  console.log(result.insertedIds); 
  

  }
  
  //create one----------------------------------------
  async function createListing(client, newListing){
    const result = await client.db("cluster0").collection("Shira").insertOne(newListing); 
    console.log(`New listing created with the id: ${result.insertedId}`);
  }
  
  //show the name of every database--------------------
  async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
  
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  };
  

async function showAllProducts(client){
    const allProductsArray = await client.db('cluster0').collection('Shira').find().toArray();
    console.log(allProductsArray); 
    return allProductsArray; 
  }

  module.exports = {showAllProducts}