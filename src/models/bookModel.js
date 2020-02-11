const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};
const requiredNumber = {
  type: Number,
  required: true,
};

const bookModel = new Schema(
  {
    author: requiredString,
    country: requiredString,
    imageLink: requiredString,
    language: requiredString,
    link: requiredString,
    pages: requiredNumber,
    title: requiredString,
    year: requiredNumber,
  },
);

module.exports = mongoose.model('Book', bookModel);
