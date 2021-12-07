const User = require('../models/user')
const Order = require('../models/order')

const { stripe } = require('../stripeConfig')
const { createStripeArray } = require('../helperFunctions')



module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res) => {

    const registerUser = new User({ username: req.body.username, email: req.body.email, address: req.body.address })
    await User.register(registerUser, req.body.password)
    console.log(registerUser)
    req.login(registerUser, () => {
        res.redirect('/products')
    })
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', "Login Successful")
    res.redirect('/products')

    console.log('success')
}

module.exports.logout = async (req, res) => {
    const user = req.user;
    await req.logout()
    res.redirect('/products')
}

module.exports.renderCart = async (req, res) => {

    const cartContent = req.session.cart || null;
    // if (!req.session.cart) return res.render('users/cart');

    return res.render('users/cart', { cartContent })
}

module.exports.checkout = async (req, res) => {
    if (req.user) {
        if (req.session.cart) {

            const cartContent = req.session.cart;
            const totalPrice = cartContent.reduce((sum, product) => sum + product.price, 0)
            const newOrder = new Order({ product: cartContent, user: req.user, date: Date.now(), totalPrice: totalPrice, paymentStatus: 'Unpaid' });
            const currentUser = await User.findById(req.user._id);
            currentUser.orders.push(newOrder)
            await currentUser.save();
            await newOrder.save();
            req.session.orderId = newOrder._id;

            const stripeSession = await stripe.checkout.sessions.create({
                success_url: 'http://localhost:3000/payments/success',
                cancel_url: 'http://localhost:3000/payments/cancel',
                line_items: createStripeArray(cartContent),
                mode: 'payment',
                metadata: {
                    order_id: newOrder._id.toString()
                }
            });
            req.session.cart.length = 0;
            return res.redirect(303, stripeSession.url)

        }
        req.flash('error', 'Cannot Checkout with empty cart')
        return res.redirect(`/products`)
    }
    req.flash('error', 'You Need to Login Before Checkout')
    return res.redirect('/users/login')
}

module.exports.renderShow = async (req, res) => {

    const { userId } = req.params;
    if (req.user && req.user.id === userId) {
        const foundUser = await User.findById(userId).populate({
            path: 'orders',
            populate: {
                path: 'product'
            }
        });

        return res.render('users/show', { foundUser })
    }
    req.flash('error', 'Not Authorised')
    res.redirect('/users/login')

}