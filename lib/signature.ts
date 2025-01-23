import * as crypto from "crypto";

export const signPss = (privateKeyString: string, text: string) => {
    const key = crypto.createPrivateKey({
        key: privateKeyString,
        format: "pem",
    });
    try {
        const signature = crypto.sign("sha256", Buffer.from(text, "utf-8"), {
            key,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
        });
        return signature.toString("base64");
    } catch (e) {
        console.error(e);
    }
};