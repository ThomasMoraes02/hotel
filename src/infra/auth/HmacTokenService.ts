import crypto from "crypto";
import TokenService, { TokenPayload } from "../../domain/auth/TokenService";

export default class HmacTokenService implements TokenService {
    constructor(
        private readonly secret: string,
        private readonly expiresInSeconds = 60 * 60 * 24
    ) {
        if (!secret) throw new Error("AUTH_SECRET is required");
    }

    sign(guestId: string): string {
        const payload: TokenPayload = {
            sub: guestId,
            exp: Math.floor(Date.now() / 1000) + this.expiresInSeconds,
            jti: crypto.randomUUID()
        };
        const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
        const signature = this.signPayload(encodedPayload);
        return `${encodedPayload}.${signature}`;
    }

    verify(token: string): TokenPayload {
        const [encodedPayload, signature] = token.split(".");
        if (!encodedPayload || !signature) throw new Error("Invalid token");
        const expectedSignature = this.signPayload(encodedPayload);
        if (signature.length !== expectedSignature.length) throw new Error("Invalid token");
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
            throw new Error("Invalid token");
        }
        const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString()) as TokenPayload;
        if (payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("Token expired");
        return payload;
    }

    hash(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    private signPayload(payload: string): string {
        return crypto.createHmac("sha256", this.secret).update(payload).digest("base64url");
    }

    private base64UrlEncode(value: string): string {
        return Buffer.from(value).toString("base64url");
    }
}
