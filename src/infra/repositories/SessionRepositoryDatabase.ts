import SessionRepository, { Session } from "../../domain/repositories/SessionRepository";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default class SessionRepositoryDatabase implements SessionRepository {
    @inject("DatabaseConnection")
    private readonly connection!: DatabaseConnection;

    async save(session: Session): Promise<void> {
        await this.ensureTable();
        await this.connection.query(
            `INSERT INTO hotel.sessions (token_hash, guest_id, expires_at, revoked_at)
             VALUES ($1, $2, $3, $4)`,
            [session.tokenHash, session.guestId, session.expiresAt, session.revokedAt || null]
        );
    }

    async findActiveByTokenHash(tokenHash: string, now: Date): Promise<Session | null> {
        await this.ensureTable();
        const result = await this.connection.query(
            `SELECT token_hash, guest_id, expires_at, revoked_at
             FROM hotel.sessions
             WHERE token_hash = $1
               AND revoked_at IS NULL
               AND expires_at > $2`,
            [tokenHash, now]
        );
        if (result.length === 0) return null;
        const row = result[0];
        return {
            tokenHash: row.token_hash,
            guestId: row.guest_id,
            expiresAt: row.expires_at,
            revokedAt: row.revoked_at || undefined
        };
    }

    async revoke(tokenHash: string): Promise<void> {
        await this.ensureTable();
        await this.connection.query(
            `UPDATE hotel.sessions
             SET revoked_at = NOW()
             WHERE token_hash = $1`,
            [tokenHash]
        );
    }

    private async ensureTable(): Promise<void> {
        await this.connection.query(
            `CREATE TABLE IF NOT EXISTS hotel.sessions (
                token_hash TEXT PRIMARY KEY,
                guest_id UUID NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                revoked_at TIMESTAMP NULL,
                FOREIGN KEY (guest_id) REFERENCES hotel.guests(guest_id)
            )`
        );
    }
}
