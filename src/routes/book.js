/* eslint-disable no-param-reassign */
const { Router } = require('express')

const bookRouter = Router()

const Book = require('../models/bookModel')

/**
 * @method - GET
 * @param - /books
 * @description - Return All Books with Pagination, Sorting, Search, and Filtering
 */
bookRouter.get('/books', async (req, res, next) => {
    try {
        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'q']
        excludedFields.forEach(el => delete queryObj[el])

        // Advanced filtering (e.g. >=, <=) could be added here if needed
        // For now, simple exact match on remaining fields

        // Search
        if (req.query.q) {
            queryObj.$text = { $search: req.query.q }
        }

        let query = Book.find(queryObj)

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-year') // Default sort
        }

        // Pagination
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 10
        const skip = (page - 1) * limit

        query = query.skip(skip).limit(limit)

        const books = await query
        const count = await Book.countDocuments(queryObj)

        return res.json({
            status: 'success',
            results: books.length,
            total: count,
            data: books,
        })
    } catch (error) {
        next(error)
    }
})

/**
 * @method - POST
 * @param - /books
 * @description - Insert Book
 */
bookRouter.post('/books', async (req, res, next) => {
    try {
        const book = new Book(req.body)
        const insertedBook = await book.save()
        return res.status(201).json(insertedBook)
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422)
        }
        next(error)
    }
})

/**
 * @method - PUT
 * @param - /books/:bookId
 * @description - Replace A Book
 */
bookRouter.put('/books/:bookId', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId)

        if (!book) {
            return next(new Error('Book not found!'))
        }

        // Update all fields
        const fields = [
            'author',
            'country',
            'imageLink',
            'language',
            'link',
            'pages',
            'title',
            'year',
            'summary',
            'rating',
        ]
        fields.forEach(field => {
            book[field] = req.body[field] || book[field]
        })

        const updatedBook = await book.save()
        return res.json(updatedBook)
    } catch (error) {
        next(error)
    }
})

/**
 * @method - PATCH
 * @param - /books/:bookId
 * @description - Update A Book
 */
bookRouter.patch('/books/:bookId', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId)

        if (!book) {
            return next(new Error('Book not found!'))
        }

        // eslint-disable-next-line no-underscore-dangle
        if (req.body._id) {
            // eslint-disable-next-line no-underscore-dangle
            delete req.body._id
        }

        Object.entries(req.body).forEach(item => {
            const key = item[0]
            const value = item[1]
            book[key] = value
        })

        const updatedBook = await book.save()
        return res.json(updatedBook)
    } catch (error) {
        next(error)
    }
})

/**
 * @method - GET
 * @param - /books/:bookId
 * @description - Return A Single Book
 */
bookRouter.get('/books/:bookId', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId)

        if (!book) {
            res.status(404)
            return next(new Error('Book not found!'))
        }

        return res.json(book)
    } catch (error) {
        next(error)
    }
})

/**
 * @method - DELETE
 * @param - /books/:bookId
 * @description - Delete A Book
 */
bookRouter.delete('/books/:bookId', async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.bookId)
        if (!book) {
            res.status(404)
            return next(new Error('Book not found!'))
        }

        const response = {
            msg: 'Book successfully deleted',
            // eslint-disable-next-line no-underscore-dangle
            id: book._id,
        }
        return res.json(response)
    } catch (err) {
        next(err)
    }
})

/**
 * @method - POST
 * @param - /books/:bookId/reviews
 * @description - Add a review to a book
 */
bookRouter.post('/books/:bookId/reviews', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId)
        if (!book) {
            res.status(404)
            return next(new Error('Book not found!'))
        }

        const { user, comment, rating } = req.body
        const review = { user, comment, rating }

        book.reviews.push(review)

        // Recalculate average rating
        if (book.reviews.length > 0) {
            const total = book.reviews.reduce(
                (acc, curr) => acc + curr.rating,
                0,
            )
            book.rating = total / book.reviews.length
        }

        await book.save()
        return res.status(201).json(book)
    } catch (error) {
        next(error)
    }
})

module.exports = bookRouter
