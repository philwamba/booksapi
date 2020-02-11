/* eslint-disable no-param-reassign */
const express = require('express');
const Book = require('../models/bookModel');

const bookRouter = express.Router();

bookRouter.post('/books', (req, res) => {
  const book = new Book(req.body);
  book.save();
  return res.status(201).json(book);
});

bookRouter.get('/books', (req, res) => {
  const query = {};

  if (req.query.country) {
    query.country = req.query.country;
  }

  if (req.query.language) {
    query.language = req.query.language;
  }

  Book.find(query, (error, books) => {
    if (!error) {
      return res.json(books);
    }
    return res.json({
      error,
    });
  });
});

bookRouter.get('/books/:bookId', (req, res) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (!err) {
      return res.json(book);
    }
    return res.json({ error: err });
  });
});

bookRouter.put('/books/:bookId', (req, res) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (!err) {
      book.author = req.body.author;
      book.country = req.body.country;
      book.imageLink = req.body.imageLink;
      book.language = req.body.language;
      book.link = req.body.link;
      book.pages = req.body.pages;
      book.title = req.body.title;
      book.year = req.body.year;
      book.save();
      return res.json(book);
    }
    return res.json({ error: err });
  });
});

module.exports = bookRouter;
