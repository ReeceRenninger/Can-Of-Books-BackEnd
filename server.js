'use strict';

//REQUIRE SECTION
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { application, response } = require('express');

//*** REQUIRE IN OUR MONGOOSE LIBRARY */
const mongoose = require ('mongoose');

//*** BRING IN MY BOOK MODEL */
const Book = require('./models/book.js')

const app = express();

// Middleware
app.use(cors());

// ! DON'T FORGET TO BRING THIS IN!!!!
app.use(express.json());

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
    let allBooks = await Book.find({}); // Model.find({}) retrieves all docs from database

    response.status(200).send(allBooks);
  } catch (error) {
    next(error);
  }
}



//*** ENDPOINT TO DELETE A BOOK FROM MY DATABASE */
//!! WE MUST HAVE A PATH PARAMETER
//!! PATH PARAMETER IS GOING TO BE SET WITH A VARIABLE TO CAPTURE THE ID
//!! WE USE ':' TO SIGNIFY THAT IT IS A PATH PARAMETER

app.delete('/books/:bookID', deleteBook);

async function deleteBook(request, response, next){
  try {
    let id = request.params.bookID; // request.params gives an object holding the values at endpoint, adding the bookID presents just the value
    await Book.findByIdAndDelete(id);

    response.status(200).send('Book deleted!');
  } catch (error) {
    next(error);
  }
}

//** ENDPOINT TO ADD A BOOK TO MY DATABASE */
app.post('/books', postBook); // post is add

async function postBook(request, response, next){
  try {
    let createdBook = await Book.create(request.body);

    response.status(201).send(createdBook);
  } catch (error) {
    next(error);
  }
}

//*** END POINT TO UPDATE BOOK */
app.put('/books/:bookID', modifyBook);

async function modifyBook(request, response, next){
  try {
    // id = the cat to update, data = information to update the cat with
    let id = request.params.bookID;
    let data = request.body;

    //! 3 Arguments
    //! 1st - the id
    //! 2nd - data
    //! 3rd - options object { new: true, overwrite: true }

    const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true, overwrite: true });
    
    response.status(200).send(updatedBook);
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