const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

router.post('/add-product',shopController.postItemCart);

module.exports = router;