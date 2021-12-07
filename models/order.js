const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    totalPrice: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    date: {
        type: Date,
        required: true
    },
    paymentStatus: String


})


module.exports = mongoose.model('Order', orderSchema)