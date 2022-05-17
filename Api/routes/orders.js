const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/products');

router.get('/', (req, res, next) => {
    Order.find().populate('Product').select('product quantity _id').exec().then(result => {
        res.status(200).json(
            {
                count: result.length, orders: result.map(doc => {
                    return {
                        _id: doc.id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            request: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id,
                        }
                    }
                })
            });
    }).catch(err => {
        res.status(500).json({
            error: err,
        })
    });

});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        if(!product){
            return res.status(404).json({
                message:'Product not found'
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity,
        })
        order.save().then(result => {
            console.log(result);
            res.status(201).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Product doesn\'t exist.',
            error: err,
        })
    });


});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).exec().then(doc => {
        res.status(200).json(doc);
    }).catch();
});


module.exports = router;