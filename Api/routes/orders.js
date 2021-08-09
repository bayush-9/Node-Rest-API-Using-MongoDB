const express = require('express');
const router = express.Router();

router.get('/',(req,res, next)=>{
    res.status(200).json({
        message:'Getting orders.',
    });
});

router.post('/',(req,res, next)=>{
    res.status(201).json({
        message:'Posting orders.',
    });
});

router.get('/:orderId',(req,res, next)=>{
    res.status(201).json({
        message: 'fetch orders.',
        orderId:req.params.orderId ,
    });
});


module.exports = router;