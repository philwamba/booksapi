const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookModel = new Schema(
  {
    author: { type: String },
    country: { type: String },
    imageLink: { type: String },
    language: { type: String },
    link: { type: String },
    pages: { type: Number },
    title: { type: String },
    year: { type: Number },
  },
);

module.exports = mongoose.model('Book', bookModel);
