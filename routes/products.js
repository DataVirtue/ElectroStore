const express = require('express')
const router = express.Router();
const productController = require('../controller/products')



router.route('/')
    .get(productController.renderIndex)
    .post(productController.createNewProduct)

router.get('/new', productController.renderNew)

router.route('/:id')
    .get(productController.renderShow)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct)


router.get('/:id/edit', productController.renderEditForm);


router.post('/:id/reviews', productController.createReview)

router.delete('/:id/reviews/:reviewId', productController.deleteReview)




router.post('/:id/buy', productController.buyNow)

router.post('/:id/add-to-cart', productController.addToCart)

router.post('/:id/remove-from-cart', productController.removeFromCart)

module.exports = router;