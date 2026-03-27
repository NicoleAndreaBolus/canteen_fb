const express = require('express');
const router = express.Router();

const { addFeedback, getAllFeedback } = require('./db');
const { signFeedback, verifySignature } = require('./eddsa');

// Load EdDSA keys (only publicKey is exposed, privateKey is secure)
const { keyPair } = require('./keypair');

// Helper: minimal validation of feedback fields
function validateFeedback(data) {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
        return 'Rating must be 1..5';
    }
    if (typeof data.comment !== 'string' || !data.comment.trim()) {
        return 'Comment required';
    }
    return null;
}

// POST /api/feedback - Customer submits
router.post('/feedback', async (req, res) => {
    const { customer_name, rating, comment } = req.body;
    const err = validateFeedback({ rating, comment });
    if (err) return res.status(400).json({ error: err });

    // Prepare feedback object for signing
    const feedbackForSign = { customer_name, rating, comment };
    const signature = signFeedback(keyPair.secretKey, feedbackForSign);

    try {
        const inserted = await addFeedback({
            customer_name, rating, comment,
            signature,
            public_key: Buffer.from(keyPair.publicKey).toString('base64'), // For verifying later
        });
        res.status(201).json({ ...inserted, signature }); // Return saved feedback (+ signature)
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal error." });
    }
});

// GET /api/feedbacks - Admin dashboard
router.get('/feedbacks', async (req, res) => {
    try {
        const rows = await getAllFeedback();
        res.json(rows);
    } catch {
        res.status(500).json({ error: "Couldn't fetch feedback." });
    }
});

// POST /api/verify - Verify a feedback signature
router.post('/verify', async (req, res) => {
    const { customer_name, rating, comment, signature, public_key } = req.body;
    const feedbackForVerify = { customer_name, rating, comment };
    try {
        // Decode public key
        const pubKeyBin = Buffer.from(public_key, 'base64');
        const valid = verifySignature(pubKeyBin, feedbackForVerify, signature);
        res.json({ valid });
    } catch (e) {
        res.json({ valid: false, error: e.message });
    }
});

module.exports = router;