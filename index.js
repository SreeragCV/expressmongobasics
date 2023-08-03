const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const product = require('./models/product');
const AppError = require('./AppError');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
.then( () => {
    console.log("MONGO CONNECTION OPENED");
})
.catch( err => {
    console.log("OH NO MONGO CONNECTION ERROR", err);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

function wrapAsync(fn){
    return (req, res, next) => {
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/allproducts', wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    if(category){
        allproducts = await product.find({ category })
        res.render('products/index', { allproducts, category })
    }else{
        const allproducts = await product.find({});
        res.render('products/index', { allproducts, category : 'ALL' })
    } 
}))

app.get('/allproducts/new', (req, res) => {
    res.render('products/new')
})

app.post('/allproducts', wrapAsync(async (req, res, next) => {
   const newproduct = new product(req.body);
   await newproduct.save();
   res.redirect('/allproducts');
   
}))

app.get('/allproducts/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundproduct = await product.findById(id);
    if(!foundproduct){
       throw new AppError('Cannot find the Product by this id', 404);
    }
    res.render('products/show', { foundproduct })
}))

app.get('/allproducts/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundproduct = await product.findById(id);
    if(!foundproduct){
        throw new AppError('Product not found', 404);
    }
    res.render('products/edit', { foundproduct });
}))

app.put('/allproducts/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedproduct = await product.findByIdAndUpdate(id, req.body, { runValidators: true, new : true })
    res.redirect(`/allproducts/${updatedproduct._id}`);
   
}))

app.delete('/allproducts/:id', async (req, res) => {
    const {id} = req.params;
    const deletedproduct = await product.findByIdAndDelete(id);
    res.redirect('/allproducts');
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong'} = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("APP LISTENING ON PORT 3000")
})