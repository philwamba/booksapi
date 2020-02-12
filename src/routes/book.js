/* eslint-disable no-param-reassign */
const { Router } = require('express');

const bookRouter = Router();

const Book = require('../models/bookModel');

/**
 * @method - GET
 * @param - /books
 * @description - Return All Books
 */
bookRouter.get('/books', async (req, res, next) => {
  const query = {};

  if (req.query.country) {
    query.country = req.query.country;
  }

  if (req.query.language) {
    query.language = req.query.language;
  }

  try {
    const books = await Book.find(query);
    return res.json(books);
  } catch (error) {
    next(error);
  }
});

/**
 * @method - POST
 * @param - /books
 * @description - Insert Book
 */
bookRouter.post('/books', async (req, res, next) => {
  try {
    const book = new Book(req.body);
    const insertedBook = await book.save();
    return res.status(201).json(insertedBook);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

/**
 * @method - PUT
 * @param - /books/:bookId
 * @description - Replace A Book
 */
bookRouter.put('/books/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      next(new Error('Book not found!'));
    }

    book.author = req.body.author;
    book.country = req.body.country;
    book.imageLink = req.body.imageLink;
    book.language = req.body.language;
    book.link = req.body.link;
    book.pages = req.body.pages;
    book.title = req.body.title;
    book.year = req.body.year;

    const updatedBook = await book.save();
    return res.json(updatedBook);
  } catch (error) {
    next(error);
  }
});

/**
 * @method - PATCH
 * @param - /books/:bookId
 * @description - Update A Book
 */
bookRouter.patch('/books/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      next(new Error('Book not found!'));
    }

    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }

    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      book[key] = value;
    });

    const updatedBook = await book.save();
    return res.json(updatedBook);
  } catch (error) {
    next(error);
  }
});

/**
 * @method - GET
 * @param - /books/:bookId
 * @description - Return A Single Book
 */
bookRouter.get('/books/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      res.status(404);
      next(new Error('Book not found!'));
    }

    return res.json(book);
  } catch (error) {
    next(error);
  }
});

/**
 * @method - DELETE
 * @param - /books/:bookId
 * @description - Delete A Book
 */
bookRouter.delete('/books/:bookId', async (req, res, next) => {
  await Book.findByIdAndRemove(req.params.bookId, (err, book) => {
    if (!err) {
      next(err);
    }

    const response = {
      msg: 'Book successfully deleted',
      // eslint-disable-next-line no-underscore-dangle
      id: book._id,
    };
    return res.json(response);
  });
});

module.exports = bookRouter;
