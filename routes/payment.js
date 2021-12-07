const express = require('express')
const router = express.Router();

const paymentController = require('../controller/payments')


router.get('/success', paymentController.renderSuccess)

router.get('/cancel', paymentController.renderCancel)

// stripe payment confirmation webhook 
router.post('/confirmation', express.raw({ type: 'application/json' }), paymentController.Webhook)

router.post('/retry/:orderId', paymentController.retry)

module.exports = router;