import SessionRepository, { Session } from "../../domain/repositories/SessionRepository";

export default class SessionRepositoryMemory implements SessionRepository {
    private sessions: Session[] = [];

    async save(session: Session): Promise<void> {
        this.sessions.push(session);
    }

    async findActiveByTokenHash(tokenHash: string, now: Date): Promise<Session | null> {
        const session = this.sessions.find(session =>
            session.tokenHash === tokenHash &&
            !session.revokedAt &&
            session.expiresAt > now
        );
        return session || null;
    }

    async revoke(tokenHash: string): Promise<void> {
        const session = this.sessions.find(session => session.tokenHash === tokenHash);
        if (session) session.revokedAt = new Date();
    }
}
