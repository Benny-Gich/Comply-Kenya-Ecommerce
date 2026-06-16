const express = require('express');
const { initiateSTKPush, mpesaCallback, checkPaymentStatus } = require('../controllers/paymentController');

const router = express.Router();

// Initiate M-Pesa STK push (called by the frontend at checkout)
router.post('/mpesa/stkpush', initiateSTKPush);

// Safaricom calls this URL after the customer enters their PIN
// Must be publicly reachable (use ngrok in development)
router.post('/mpesa/callback', mpesaCallback);

// Frontend polls this to know when payment is confirmed/failed
router.get('/mpesa/status/:checkoutRequestId', checkPaymentStatus);

module.exports = router;
