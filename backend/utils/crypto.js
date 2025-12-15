const EC = require('elliptic').ec;
const ec = new EC('p256');

// Generate keys for demo (in prod, load from env/secret)
const key = ec.genKeyPair();
const privateKey = key.getPrivate('hex');
const publicKey = key.getPublic('hex');

console.log("--- ECDSA KEYS GENERATED (DEMO) ---");
console.log("Public Key:", publicKey);
console.log("-----------------------------------");

/**
 * Sign ticket data
 * @param {Object} ticketData - The ticket object (subset of fields)
 * @returns {String} base64 signature
 */
function signTicket(ticketData) {
  // Configurable: Select fields to sign
  const payload = [
    ticketData.ticket_id,
    ticketData.user_id,
    ticketData.bus_id,
    ticketData.pickup_id,
    ticketData.drop_id,
    ticketData.date
  ].join('|');

  const signature = key.sign(payload);
  return signature.toDER('hex');
}

/**
 * Verify ticket signature
 * @param {Object} ticketData 
 * @param {String} signatureHex 
 * @returns {Boolean}
 */
function verifyTicket(ticketData, signatureHex) {
  const payload = [
    ticketData.ticket_id,
    ticketData.user_id,
    ticketData.bus_id,
    ticketData.pickup_id,
    ticketData.drop_id,
    ticketData.date
  ].join('|');

  try {
    return key.verify(payload, signatureHex);
  } catch (e) {
    return false;
  }
}

module.exports = { signTicket, verifyTicket, publicKey };
