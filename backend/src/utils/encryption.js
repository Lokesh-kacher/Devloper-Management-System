const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const KEY = process.env.ENCRYPTION_KEY || "a".repeat(32); // Fallback for dev, should be 32 chars
const IV_LENGTH = 16;

/**
 * Encrypts a string
 * @param {string} text 
 * @returns {string} format: iv:encryptedData
 */
const encrypt = (text) => {
  if (!text) return "";
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    console.error("Encryption error:", error);
    return text; // Return original on failure
  }
};

/**
 * Decrypts a string
 * @param {string} text format: iv:encryptedData
 * @returns {string}
 */
const decrypt = (text) => {
  if (!text || !text.includes(":")) return text; // If no IV separator, assume not encrypted
  
  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // If decryption fails, it might not be encrypted or key changed
    console.error("Decryption error:", error);
    return text;
  }
};

module.exports = { encrypt, decrypt };
