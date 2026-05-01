export type TokenPayload = {
    sub: string;
    exp: number;
    jti: string;
}

export default interface TokenService {
    sign(guestId: string): string;
    verify(token: string): TokenPayload;
    hash(token: string): string;
}
