'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { application } = require('express');

const app = express();

// Middleware
app.use(cors());

// Define PORT validate env is working
const PORT = process.env.PORT || 3002;

// Listen
app.listen(PORT, () => console.log(`listening on ${PORT}`));


// mongo url mongodb+srv://renningerreece:<password>@codingzone.didehis.mongodb.net/?retryWrites=true&w=majority


//test route
app.get('/test', (request, response) => {

  response.send('test request received')

})

// Catch all error
app.get('*', (request, response)=> {
  response.status(404).send('Unavailable');
});

app.use((error, request, response, next)=>{
  console.log(error.message);
  response.status(500).send(error.message);
});
