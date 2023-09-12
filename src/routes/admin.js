const express = require('express');
const prodController = require('../controllers/product');
const router = express.Router();
const { body } = require('express-validator');

router.post('/add-product',[
    body('title').isString().trim().isLength({min: 3}),
    body('price').trim().isLength({min: 3}),
    body('price').trim().isInt(),
], prodController.postAddProduct);

router.get('/get-product' , prodController.getProducts);
router.get('/get-products' , prodController.getProductsbyQuery);

module.exports = router;