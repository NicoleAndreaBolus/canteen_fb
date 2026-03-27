// EdDSA helper functions using tweetnacl
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

/**
 * Load EdDSA keypair from a 32-byte hex seed (for reproducibility).
 */
function keyPairFromSeed(hexSeed) {
    const seed = Buffer.from(hexSeed, 'hex');
    return nacl.sign.keyPair.fromSeed(seed);
}

/**
 * Sign feedback data
 */
function signFeedback(privateKey, feedbackObj) {
    // Canonical JSON serialization for deterministic signatures
    const message = nacl.util.decodeUTF8(JSON.stringify(feedbackObj));
    const signature = nacl.sign.detached(message, privateKey);
    return nacl.util.encodeBase64(signature);
}

/**
 * Verify feedback signature
 */
function verifySignature(publicKey, feedbackObj, signatureB64) {
    const message = nacl.util.decodeUTF8(JSON.stringify(feedbackObj));
    const signature = nacl.util.decodeBase64(signatureB64);
    return nacl.sign.detached.verify(message, signature, publicKey);
}

module.exports = {
    keyPairFromSeed,
    signFeedback,
    verifySignature,
};