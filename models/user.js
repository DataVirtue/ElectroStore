const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('./order')
const passportLocalMongoose = require('passport-local-mongoose');

const addressSchema = new Schema({
    street: {
        type: String,
        maxlength: 50
    },
    city: {
        type: String,
        maxlength: 12
    },
    state: {
        type: String,
        maxlength: 12
    }
})

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: addressSchema
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]


})

userSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        const res = await Order.deleteMany({
            _id: {
                $in: doc.orders
            }
        })
        console.log(res)
    }
})



userSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('User', userSchema);