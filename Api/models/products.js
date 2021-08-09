const mongoose =require('mongoose');

const productSchema= mongoose.Schema({
    _id:mongoose.Schema.ObjectId,
    name:String,
    price: Number,
});

module.exports = mongoose.model('Product', productSchema);
