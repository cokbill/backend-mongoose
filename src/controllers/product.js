const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const error = validationResult(req);
        if(!error.isEmpty()) {
            const error = new Error('Validation gagal.. input data salah')
            error.statusCode = 422;
            res.send({gagal : error.message});
        };

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save().then( result => {
        console.log(result);
        console.log(`created product`);
        res.json({
            message : 'product created',
            data : result });
    }).catch(err => {
        console.log(err);
    })
}

exports.getProducts = (req, res, next) => {
    const search = req.query.search;
    const price = req.query.price;

    let myquery = Product.find().select('title price -_id')
    if(search) {
        // Product.find({title : {$regex: search}}, 'title price')
        myquery.where('title').equals({$regex: search})
    } 
    if (price) {
        myquery.where('price').gt(price)
    }

    myquery.populate('userId')
    myquery.then(products => {
        res.json(products);
    }).catch(err => {
        console.log(err);
    })
}

exports.getProductsbyQuery = (req, res, next) => {
    const title = req.query.title;
    if(title) {
        Product.find({title : {$regex: search}}, 'title price').then(products => {
            res.json(products);
        }).catch(err => {
            console.log(err);
        })
    } else {
        Product.find().then(products => {
            res.json(products);
        }).catch(err => {
            console.log(err);
        })

    }
}