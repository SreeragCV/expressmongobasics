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

app.get('/allproducts', async (req, res, next) => {
    try{
    const { category } = req.query;
    if(category){
        allproducts = await product.find({ category })
        res.render('products/index', { allproducts, category })
    }else{
        const allproducts = await product.find({});
        res.render('products/index', { allproducts, category : 'ALL' })
    } 
      } catch(e){
         next(e)
    }
})

app.get('/allproducts/new', (req, res) => {
    res.render('products/new')
})

app.post('/allproducts', async (req, res, next) => {
   try{const newproduct = new product(req.body);
   await newproduct.save();
   res.redirect('/allproducts');
   } catch(e){
    next(e)
   }
})

app.get('/allproducts/:id', async (req, res, next) => {
    try {const { id } = req.params;
    const foundproduct = await product.findById(id);
    if(!foundproduct){
       throw new AppError('Cannot find the Product by this id', 404);
    }
    res.render('products/show', { foundproduct })
} catch(e){
    next(e);
}
})

app.get('/allproducts/:id/edit', async (req, res, next) => {
   try{ 
    const { id } = req.params;
    const foundproduct = await product.findById(id);
    if(!foundproduct){
        throw new AppError('Product not found', 404);
    }
    res.render('products/edit', { foundproduct });
} catch(e){
    next(e);
}
})

app.put('/allproducts/:id', async (req, res, next) => {
   try{
    const { id } = req.params;
    const updatedproduct = await product.findByIdAndUpdate(id, req.body, { runValidators: true, new : true })
    res.redirect(`/allproducts/${updatedproduct._id}`);
   } catch(e){
    next(e)
   }
})

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