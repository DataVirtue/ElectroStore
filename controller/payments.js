
const mongoose = require('mongoose');


// requiring mongoose models
const Product = require('../models/product')
const User = require('../models/user');
const Order = require('../models/order')



// requiring stripe and stripe utils 
const { stripe, endpointSecret } = require('../stripeConfig')
const { fulfillOrder } = require('../helperFunctions')
const { createStripeArray } = require('../helperFunctions')





module.exports.renderSuccess = (req, res) => {
    res.render('payment/success')
}

module.exports.renderCancel = async (req, res) => {

    const currentUser = await User.findById(req.user._id)

    const result = await Order.findByIdAndDelete(req.session.orderId).populate('product');
    const indexOfOrder = currentUser.orders.indexOf(result._id);
    if (indexOfOrder > -1) {
        currentUser.orders.splice(indexOfOrder, 1);
    }
    await currentUser.save()
    if (req.session.orderType !== "retry" && req.session.orderType !== 'buyNow') {
        req.session.cart.push(...result.product)
    }
    delete req.session.orderId && req.session.orderType;

    res.render('payment/cancel')
}

module.exports.Webhook = async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;


    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    } catch (err) {
        console.log(err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event.type)


    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;

            if (session.payment_status === 'paid') {
                fulfillOrder(event);
                console.log(req.session.cart)
            }

            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object;

            // updating order as paid 
            fulfillOrder(session);

            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object;

            const id = mongoose.Types.ObjectId(event.data.object.metadata.order_id)
            console.log(id)
            const orderToUpdate = await Order.findById(id);
            order.paymentStatus = "Unpaid";

            break;
        }
    }
    res.status(200)
}

module.exports.retry = async (req, res) => {
    const { orderId } = req.params;
    const retryOrder = await Order.findById(orderId).populate('product');

    if (retryOrder.paymentStatus === "Unpaid") {
        console.log(retryOrder.product)

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:3000/payments/success',
            cancel_url: 'http://localhost:3000/payments/cancel',
            line_items: createStripeArray(retryOrder.product),
            mode: 'payment',
            metadata: {
                order_id: retryOrder._id.toString()
            }
        });

        req.session.orderId = orderId;
        req.session.orderType = "retry";
        return res.redirect(303, stripeSession.url)
    } else {

        req.flash('Error', 'Order Payment has already been made');
        res.redirect(`users/${req.user._id}`)
    }


}