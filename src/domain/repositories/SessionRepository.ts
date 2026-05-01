export type Session = {
    tokenHash: string;
    guestId: string;
    expiresAt: Date;
    revokedAt?: Date;
}

export default interface SessionRepository {
    save(session: Session): Promise<void>;
    findActiveByTokenHash(tokenHash: string, now: Date): Promise<Session | null>;
    revoke(tokenHash: string): Promise<void>;
}
