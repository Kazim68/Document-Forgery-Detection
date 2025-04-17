// utils/crypto.js

export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
    );
    return keyPair;
}

export async function signData(privateKey, dataBuffer) {
    const signature = await window.crypto.subtle.sign(
        {
            name: "RSASSA-PKCS1-v1_5",
        },
        privateKey,
        dataBuffer
    );
    return signature;
}

export async function exportPublicKey(key) {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    return exported;
}

export async function hashBuffer(buffer) {
    return await window.crypto.subtle.digest("SHA-256", buffer);
}

export function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...bytes));
}
