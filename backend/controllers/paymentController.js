const axios = require('axios');
const {
    formatPhone,
    getAccessToken,
    buildPasswordAndTimestamp,
    querySTKPushStatus,
    MPESA_BASE_URL,
} = require('../config/mpesa');

/**
 * In-memory store for STK push results keyed by CheckoutRequestID.
 * In production, replace with a database collection or Redis.
 */
const paymentResults = new Map();

// ─── STK Push ────────────────────────────────────────────────────────────────

const initiateSTKPush = async (req, res) => {
    try {
        const { phone, amount, orderId, accountRef } = req.body;

        if (!phone || !amount) {
            return res.status(400).json({ success: false, message: 'Phone number and amount are required.' });
        }

        const formattedPhone = formatPhone(phone);

        // Accept both 2547XXXXXXXX and 2541XXXXXXXX (Safaricom ranges)
        if (!/^254[71]\d{8}$/.test(formattedPhone)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid Safaricom number (07XX or 01XX).' });
        }

        const parsedAmount = Math.ceil(Number(amount));
        if (isNaN(parsedAmount) || parsedAmount < 1) {
            return res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
        }

        const accessToken = await getAccessToken();

        const { MPESA_SHORTCODE, MPESA_CALLBACK_URL } = process.env;

        if (!MPESA_SHORTCODE || !process.env.MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
            console.error('Missing M-Pesa env vars: MPESA_SHORTCODE, MPESA_PASSKEY or MPESA_CALLBACK_URL');
            return res.status(500).json({ success: false, message: 'Payment gateway not configured. Contact support.' });
        }

        const { password, timestamp } = buildPasswordAndTimestamp();

        const payload = {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: parsedAmount,
            PartyA: formattedPhone,
            PartyB: MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: `${MPESA_CALLBACK_URL}/api/payments/mpesa/callback`,
            AccountReference: accountRef || orderId || 'ComplyKenya',
            TransactionDesc: 'Payment for Comply Kenya order',
        };

        const { data } = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
            payload,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (data.ResponseCode === '0') {
            paymentResults.set(data.CheckoutRequestID, { status: 'pending' });
            return res.json({
                success: true,
                checkoutRequestId: data.CheckoutRequestID,
                message: 'STK push sent. Enter your M-Pesa PIN on your phone to complete payment.',
            });
        }

        return res.status(400).json({
            success: false,
            message: data.ResponseDescription || 'Failed to initiate STK push.',
        });
    } catch (err) {
        const apiError = err?.response?.data;
        console.error('STK Push error:', apiError || err.message);
        res.status(500).json({
            success: false,
            message: apiError?.errorMessage || 'Failed to initiate M-Pesa payment. Please try again.',
        });
    }
};

// ─── Daraja Callback ─────────────────────────────────────────────────────────

const mpesaCallback = (req, res) => {
    try {
        const stk = req.body?.Body?.stkCallback;
        if (!stk?.CheckoutRequestID) {
            return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
        }

        const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stk;

        if (ResultCode === 0) {
            const items = CallbackMetadata?.Item || [];
            const get = (name) => items.find((i) => i.Name === name)?.Value;

            paymentResults.set(CheckoutRequestID, {
                status: 'success',
                mpesaReceiptNumber: get('MpesaReceiptNumber'),
                amount: get('Amount'),
                phone: String(get('PhoneNumber')),
                transactionDate: get('TransactionDate'),
            });
        } else {
            paymentResults.set(CheckoutRequestID, {
                status: 'failed',
                message: ResultDesc || 'Payment was cancelled or failed.',
            });
        }

        res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } catch (err) {
        console.error('M-Pesa callback error:', err.message);
        // Always respond 200 so Safaricom doesn't retry indefinitely
        res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }
};

// ─── Status polling ───────────────────────────────────────────────────────────

const checkPaymentStatus = async (req, res) => {
    const { checkoutRequestId } = req.params;

    if (!checkoutRequestId || checkoutRequestId.length > 200) {
        return res.status(400).json({ status: 'error', message: 'Invalid request ID.' });
    }

    // 1. Check in-memory store from callback
    const cached = paymentResults.get(checkoutRequestId);
    if (cached && cached.status !== 'pending') {
        paymentResults.delete(checkoutRequestId);
        return res.json(cached);
    }

    // 2. Fallback: query Daraja directly (works even without a reachable callback URL)
    try {
        const data = await querySTKPushStatus(checkoutRequestId);
        const code = Number(data.ResultCode);

        if (code === 0) {
            const result = { status: 'success', mpesaReceiptNumber: data.MpesaReceiptNumber || null };
            paymentResults.delete(checkoutRequestId);
            return res.json(result);
        }

        // Non-zero = terminal failure
        if (code !== undefined && !isNaN(code)) {
            const result = { status: 'failed', message: data.ResultDesc || 'Payment failed.' };
            paymentResults.delete(checkoutRequestId);
            return res.json(result);
        }
    } catch (err) {
        // Daraja returns an error body when the transaction is still in-flight;
        // treat that as still pending.
        const apiErr = err?.response?.data;
        if (apiErr?.errorCode !== '500.001.1001') {
            console.error('STK query error:', apiErr || err.message);
        }
    }

    res.json({ status: 'pending' });
};

module.exports = { initiateSTKPush, mpesaCallback, checkPaymentStatus };
