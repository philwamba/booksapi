const Book = require('../models/bookModel');

const findBook = (req, res, next) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (err) {
      next(err);
    }

    if (book) {
      next(book);
    }
    const error = new Error('Book not found!');
    next(error);
  });
};

module.exports = findBook;
