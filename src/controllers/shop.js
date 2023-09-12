const Product = require('../models/product');


exports.postItemCart = (req, res, next) => {
    const prodId = req.body.productId;
    
    Product.findById(prodId).then(resproduct => {
        return req.user.addToCart(resproduct)
    }).then(resultPost => {
        res.json(resultPost);
    }).catch(err => {
        console.log(err);
    })
}