//model imports 
const Product = require('../models/product')
const User = require('../models/user');
const Order = require('../models/order')
const Review = require('../models/review')


// requiring stripe
const { stripe } = require('../stripeConfig')
const { createStripeArray } = require('../helperFunctions')





module.exports.renderIndex = async (req, res) => {
    const allProducts = await Product.find({})
    res.render('products/index', { allProducts })
}

module.exports.createNewProduct = async (req, res) => {
    const newProduct = new Product(req.body.product)
    const result = await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
}

module.exports.renderNew = (req, res) => {
    res.render('products/new')
}

module.exports.renderShow = async (req, res) => {
    const { id } = req.params;
    foundProduct = await Product.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    res.render('products/show', { foundProduct })
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { product } = req.body;
    foundProduct = await Product.findByIdAndUpdate(id, product, { returnDocument: 'after' })
    res.redirect(`/products/${foundProduct._id}`)
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    console.log(result);
    res.redirect('/products')
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    foundProduct = await Product.findById(id);
    res.render('products/edit', { foundProduct })
}

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    if (req.user) {
        foundProduct = await Product.findById(id);
        newReview = new Review({ body: req.body.review.body, rating: req.body.review.rating, })
        newReview.author = req.user;
        await newReview.save()
        await foundProduct.reviews.push(newReview)
        await foundProduct.save()
        return res.redirect(`/products/${id}`)
    } else {
        req.flash('error', 'Login to post review')
        res.redirect('/users/login')
    }
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('author')
    if (req.user && review.author.equals(req.user._id)) {
        const foundProduct = await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        const foundReview = await Review.findByIdAndDelete(reviewId);

        req.flash('success', 'Successfully deleted a review');
    } else {
        req.flash('error', 'Not authorised to delete this review')
    }
    res.redirect(`/products/${id}`);

}


module.exports.addToCart = async (req, res) => {
    const { id } = req.params;
    const cartedProduct = await Product.findById(id);
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(cartedProduct);
    req.flash('success', 'Item Successfully added to the cart')
    return res.redirect(`/products/${id}`)

}
module.exports.removeFromCart = (req, res) => {
    const { id } = req.params;
    req.session.cart.splice(req.session.cart.findIndex(product => product._id === id), 1) // removes from the session cart array by finding the index by checking the id splicing 
    req.flash('success', 'Product removed from your cart');
    res.redirect('/users/cart')

}

module.exports.buyNow = async (req, res) => {

    if (req.user) {
        const { id } = req.params;
        const orderedProduct = await Product.findById(id);

        const cartContent = [orderedProduct];
        const totalPrice = cartContent.reduce((sum, product) => sum + product.price, 0)
        const newOrder = new Order({ product: cartContent, user: req.user, date: Date.now(), totalPrice: totalPrice, paymentStatus: 'Unpaid' });
        const currentUser = await User.findById(req.user._id);
        currentUser.orders.push(newOrder)
        await currentUser.save();
        await newOrder.save();
        req.session.orderId = newOrder._id;
        req.session.orderType = "buyNow";


        const stripeSession = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:3000/payments/success',
            cancel_url: 'http://localhost:3000/payments/cancel',
            line_items: createStripeArray(cartContent),
            mode: 'payment',
            metadata: {
                order_id: newOrder._id.toString()
            }
        })
        return res.redirect(303, stripeSession.url)

    }

    req.flash('error', 'You need to login first')
    res.redirect('/users/login')

}