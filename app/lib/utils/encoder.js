const crypto = require("crypto");

const CONVERSE_DATA_CRYPTO_SECRET = process.env.CONVERSE_DATA_CRYPTO_SECRET;

// Function to encrypt JSON data
export function encryptJson(data) {
	const cipher = crypto.createCipher("aes-256-cbc", CONVERSE_DATA_CRYPTO_SECRET);
	let encryptedData = cipher.update(JSON.stringify(data), "utf8", "hex");
	encryptedData += cipher.final("hex");
	return encryptedData;
}

// Function to decrypt encrypted JSON data
export function decryptJson(encryptedData) {
	const decipher = crypto.createDecipher("aes-256-cbc", CONVERSE_DATA_CRYPTO_SECRET);
	let decryptedData = decipher.update(encryptedData, "hex", "utf8");
	decryptedData += decipher.final("utf8");
	return JSON.parse(decryptedData);
}
