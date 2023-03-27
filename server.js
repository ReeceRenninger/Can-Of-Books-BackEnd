'use strict';

//REQUIRE SECTION
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { application } = require('express');

//*** REQUIRE IN OUR MONGOOSE LIBRARY */
const mongoose = require ('mongoose');

//*** BRING IN MY BOOK MODEL */
const Book = require('./models/book.js')

const app = express();

// Middleware
app.use(cors());

// Define PORT validate env is working
const PORT = process.env.PORT || 3002;

// Listen
app.listen(PORT, () => console.log(`listening on ${PORT}`));


// *** CONNECT MONGODB USING MONGOOSE **
// *** PER THE MONGOOSE DOCS - PLUG AND PLAY CODE ***

mongoose.connect(process.env.DB_URL); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Mongoose is connected');
});


//END POINTS
app.get('/test', (request, response) => {
  response.send('test request received')
})

//** ENDPOINT TO RECEIVE ALL MY BOOKS FROM DATABASE */
app.get('/books', getBooks);

async function getBooks(request, response, next) {
  //TODO GET ALL BOOKS FROM DB
  try {
    let allBooks = await Book.find({}); // Model.find({}) retrieves all docs form database

    response.status(200).send(allBooks);
  } catch (error) {
    next(error);
  }
}

// Catch all error
app.get('*', (request, response)=> {
  response.status(404).send('Unavailable');
});

app.use((error, request, response, next)=>{
  console.log(error.message);
  response.status(500).send(error.message);
});
