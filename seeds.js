const mongoose = require('mongoose');
const product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
.then( () => {
    console.log("MONGO CONNECTION OPENED");
})
.catch( err => {
    console.log("OH NO MONGO CONNECTION ERROR", err);
})

const seedProducts = [
    {
        name: 'Fairy Plant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Tomato',
        price: 4.99,
        category: 'fruit'
    }, {
        name: 'Onion',
        price: 8.99,
        category: 'vegetable'
    },
    {
        name:'Grape',
        price: 12.5,
        category: 'fruit'
    },
    {
        name: 'Carrot',
        price: 8.99,
        category: 'vegetable'
    },
    {
        name: 'Milk',
        price: 14.99,
        category: 'diary'
    }
];

Product.insertMany(seedProducts)
.then( res => {
    console.log(res)
})
.catch( err => {
    console.log(err)
})