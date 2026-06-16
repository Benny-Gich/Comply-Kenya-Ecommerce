const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MPESA_BASE_URL =
    process.env.MPESA_ENV === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

/**
 * Normalise a Kenyan phone number to the 2547XXXXXXXX format Daraja expects.
 * Accepts: 07XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
 */
const formatPhone = (phone) => {
    const cleaned = String(phone).replace(/\s+/g, '').replace(/^\+/, '');
    if (cleaned.startsWith('0')) return `254${cleaned.slice(1)}`;
    return cleaned;
};

/**
 * Fetch a short-lived OAuth access token from the Daraja API.
 */
const getAccessToken = async () => {
    const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;

    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
        throw new Error('M-Pesa consumer key/secret not configured in environment.');
    }

    const credentials = Buffer.from(
        `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const { data } = await axios.get(
        `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        { headers: { Authorization: `Basic ${credentials}` } }
    );

    return data.access_token;
};

/**
 * Build the Password + Timestamp pair used in STK push and STK query requests.
 */
const buildPasswordAndTimestamp = () => {
    const { MPESA_SHORTCODE, MPESA_PASSKEY } = process.env;
    const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, 14);
    const password = Buffer.from(
        `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    return { password, timestamp };
};

/**
 * Encrypt an initiator password using the Safaricom public-key certificate.
 * The resulting SecurityCredential is required for B2C, reversal, and
 * transaction-status API calls.
 *
 * Certificate used:
 *   sandbox  → SandboxCertificate.cer  (included in repo)
 *   production → ProductionCertificate.cer (add to backend/config/ before going live)
 */
const generateSecurityCredential = (initiatorPassword) => {
    const certFile =
        process.env.MPESA_ENV === 'production'
            ? 'ProductionCertificate.cer'
            : 'SandboxCertificate.cer';

    const certPath = path.join(__dirname, certFile);

    if (!fs.existsSync(certPath)) {
        throw new Error(`Certificate not found at ${certPath}`);
    }

    const cert = fs.readFileSync(certPath);

    const encrypted = crypto.publicEncrypt(
        { key: cert, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.from(initiatorPassword)
    );

    return encrypted.toString('base64');
};

/**
 * Query Daraja directly for the status of an STK push request.
 * This is a reliable fallback when the callback URL is not reachable
 * (e.g., during local development without ngrok).
 *
 * ResultCode meanings:
 *   0    – Success (payment received)
 *   1032 – Cancelled by user
 *   1037 – User unreachable / DS timeout
 *   2001 – Wrong PIN
 *   1    – Insufficient funds
 *   1019 – Transaction expired
 */
const querySTKPushStatus = async (checkoutRequestId) => {
    const accessToken = await getAccessToken();
    const { MPESA_SHORTCODE } = process.env;
    const { password, timestamp } = buildPasswordAndTimestamp();

    const { data } = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
        {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return data;
};

module.exports = {
    formatPhone,
    getAccessToken,
    buildPasswordAndTimestamp,
    generateSecurityCredential,
    querySTKPushStatus,
    MPESA_BASE_URL,
};
