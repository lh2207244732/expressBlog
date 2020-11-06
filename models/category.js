//models/category.js mongodb的schema模型文件
const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        requires: true,
    },
    order: {
        type: Number,
    },
})
const Category = mongoose.model('category', categorySchema)
module.exports = Category