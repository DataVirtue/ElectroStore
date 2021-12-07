
const express = require('express')
const router = express.Router();
const userController = require('../controller/users')
const passport = require('passport');



router.route('/register')
    .get(userController.renderRegister)
    .post(userController.register)

router.route('/login')
    .get(userController.renderLogin)
    .post(
        passport.authenticate('local', {
            failureRedirect: '/users/login',
            failureFlash: true,
            successFlash: true

        }), userController.login)

router.post('/logout', userController.logout)

router.get('/cart', userController.renderCart)

router.post('/checkout', userController.checkout)

router.get('/:userId', userController.renderShow)

module.exports = router;