const mongoose = require('mongoose');

productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        uppercase: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        enum:['fruit', 'vegetable', 'diary']
    }
})

const product = mongoose.model('Product', productSchema)

module.exports = product;