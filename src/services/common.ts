import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const algorithm = "aes-256-cbc"; 
const key = "012345678901234567890123456789ab";
const iv = "0123456789abcdef";
const secret = "e-commerce";

// Encrypting text
export function encrypt(text: string) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
}

export async function passwordEncrypt(myPlaintextPassword:string) {
    const pass = await bcrypt.hash(myPlaintextPassword, 10).then((hash) => {
        return (hash);
    });
    return pass;
}

export const verifyAsync = (
    token: string,
) => new Promise((res, rej) => {
    const validate = jwt.verify(
        token,
        secret, (err, decoded) => {
            if (err) {
                return rej(err);
            }
            // Ensure that decoded.data exists
            if (decoded && typeof decoded === 'object' && 'data' in decoded) {
                return res(decoded.data);
            } else {
                return rej(new Error('Decoded data is invalid'));
            }
        });
    return validate;
});