'use strict';

const mongoose = require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.DB_URL);

const Book = require('./models/book.js');

async function seed() {
  // title: {type: String, required: true },
  // description: {type: String, required: true},
  // status: {type: String, required: true}

  await Book.create({
    title: 'Sandman Slim',
    description: 'Angel/human wrecks the planet',
    status: 'read',
  });

  console.log('Book One was created!');

  await Book.create({
    title: 'The Stand',
    description: 'A flu on steroids wipes out most of humanity',
    status: 'not read',
  });

  console.log('Book Two was added');

  await Book.create({
    title: 'The Dark Tower',
    description: 'Gunslinger chases man in black cape',
    status: 'read',
  });

  console.log('Book Three was added');

  mongoose.disconnect();
}

seed();