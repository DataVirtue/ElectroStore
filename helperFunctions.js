const mongoose = require('mongoose');
const Order = require('./models/order')

const createStripeObject = (product) => {

    return {
        price_data: {
            currency: 'USD',

            product_data: {
                name: product.name,
                images: [product.image[0]],
                metadata: {
                    productId: product._id
                }
            },
            unit_amount_decimal: product.price * 100

        },
        quantity: 1
    }
}
const createStripeArray = function (cartArray) {
    const newStripeArray = [];
    cartArray.forEach(function (product) {
        newStripeArray.push(createStripeObject(product))
    })
    return newStripeArray
};

const fulfillOrder = async (event) => {

    const id = mongoose.Types.ObjectId(event.data.object.metadata.order_id)
    console.log(id)
    const newOrder = await Order.findById(id);
    newOrder.paymentStatus = 'Paid';
    console.log(newOrder, typeof newOrder)
    await newOrder.save()
}

module.exports.fulfillOrder = fulfillOrder;

module.exports.createStripeArray = createStripeArray;
