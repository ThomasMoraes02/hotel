import Guest from "../../domain/entities/Guest";
import GuestRepository from "../../domain/repositories/GuestRepository";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default class GuestRepositoryDatabase implements GuestRepository {
    @inject("DatabaseConnection")
    private readonly connection!: DatabaseConnection;
    
    async save(guest: Guest): Promise<void> {
        await this.connection.query(
            `INSERT INTO hotel.guests (guest_id, name, email, document, password)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (guest_id) 
             DO UPDATE SET 
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                document = EXCLUDED.document,
                password = EXCLUDED.password`,
            [
                guest.getUuid(),
                guest.getName(),
                guest.getEmail(),
                guest.getDocument(),
                guest.getPassword()
            ]
        );
    }
    
    async findByEmail(email: string): Promise<Guest | null> {
        const result = await this.connection.query(
            `SELECT guest_id, name, email, document, password FROM hotel.guests WHERE email = $1`, [email]
        );
        if (result.length === 0) return null;
        const row = result[0];
        return Guest.restore(row.guest_id,row.name,row.email,row.document,row.password);
    }
    
    async findByUuid(uuid: string): Promise<Guest | null> {
        const result = await this.connection.query(
            `SELECT guest_id, name, email, document, password FROM hotel.guests WHERE guest_id = $1`,
            [uuid]
        );
        if (result.length === 0) return null;
        const row = result[0];
        return Guest.restore(row.guest_id,row.name,row.email,row.document,row.password);
    }
}
