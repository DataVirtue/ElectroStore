
require('dotenv').config();

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);
const endpointSecret = `${process.env.STRIPE_ENDPOINT_SECRET}`;

module.exports.stripe = stripe;
module.exports.endpointSecret = endpointSecret;
module.exports.cancelUrl = "https://evening-reef-33083.herokuapp.com//payments/cancel"
module.exports.successUrl = "https://evening-reef-33083.herokuapp.com//payments/success"