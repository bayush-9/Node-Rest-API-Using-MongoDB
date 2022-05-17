const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },  
    filename: function (req, file,cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const upload = multer({ storage: storage });


// const upload = multer({dest:'uploads/'});


const Product = require('../models/products');

router.get('/', (req, res, next) => {
    Product.find().select('name price _id').exec().then(
        result => {
            const response = {
                count: result.length,
                product: result.map(results => {
                    return {
                        name: results.name,
                        price: results.price,
                        id: results._id,
                        moreData: {
                            fetchType: 'GET',
                            url: 'http://localhost:3000/products/' + results._id,
                        }
                    }
                }),
            }
            res.status(200).json(response);
        }
    ).catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product.save()
        .then(result => {
            console.log(result); res.status(200).json({
                message: 'Handling POST creation successful',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    id: _result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id,
                    }
                },
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
    Product.findById(id).select('name price _id').exec().then(document => {
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
    Product.remove({ _id: req.params.productId }).then(result => {
        res.status(200).json(result);
    });

});

module.exports = router;