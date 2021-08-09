const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../models/products');

router.get('/', (req, res, next) => {
    Product.find().exec().then(
        result => {
            console.log(result);
            res.status(200).json(result);
        }
    ).catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
});

router.post('/', (req, res, next) => {

    var product = Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product.save()
        .then(result => {
            console.log(result); res.status(200).json({
                message: 'Handling POST',
                createdProduct: result,
            })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err,
                    });
                });

        })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then(document => {
        console.log(document);
        if (document != null) {
            res.status(200).json({ document });
        }
        else {
            res.status(404).json({ message: "NO VALID ENTRY POINT." });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    let updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
        console.log(updateOps[ops.propName]
        );
        console.log(ops.value);

    }
    Product.updateOne({
        _id: id,
    }, { $set: updateOps }).exec().then(result => {
        console.log(result);
        res.status(200).json(result)
    }).catch(err => { console.log(err) });

});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'delete product',
    })
});

module.exports = router;