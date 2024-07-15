const express = require('express')
const productsController = require('../services/products');

const {MongoClient} = require('mongodb');


async function main(){
  const uri = "mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/"

  const client = new MongoClient(uri);

  try{
    await client.connect(); 
  }
  catch (e){
    console.error(e); 
  } 
  finally{
    await client.close(); 
  }
}

main().catch(console.error); 

function show(){
    const arr = showAllProducts(client); 
    document.getElementById('showAll').innerHTML = arr;  
    return arr; 
    
}

module.exports = {show}
