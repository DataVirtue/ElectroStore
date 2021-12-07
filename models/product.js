const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const productSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true,
    },
    description: String,
    image: [String],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]

})

module.exports = mongoose.model('Product', productSchema);