const mongoose = require('mongoose')

const { Schema } = mongoose

const requiredString = {
    type: String,
    required: true,
}
const requiredNumber = {
    type: Number,
    required: true,
}

const bookModel = new Schema({
    author: requiredString,
    country: requiredString,
    imageLink: requiredString,
    language: requiredString,
    link: requiredString,
    pages: requiredNumber,
    title: requiredString,
    year: requiredNumber,
    summary: { type: String },
    rating: { type: Number, default: 0 },
    reviews: [
        {
            user: String,
            comment: String,
            rating: Number,
        },
    ],
})

bookModel.index({ title: 'text', author: 'text' })

module.exports = mongoose.model('Book', bookModel)
