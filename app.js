const express = require('express'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser'); 

const app = express()

const port = 3000
mongoose.connect('mongodb+srv://noamlugassi1:2EzrVHzJKRznFVb6@cluster0.sgohd8f.mongodb.net/'); 
const db = mongoose.connection; 
db.on('error', () => 
{console.log('connection failed') 
}); 

db.once('open', () => {
    console.log('the connection succedded'); 
}); 


app.set('view engine', 'ejs'); 
app.use(express.static('public')); 


app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json()); 


app.listen(port, () => console.log(`listening to port ${port}`)) 