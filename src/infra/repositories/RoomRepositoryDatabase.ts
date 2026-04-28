import Room from "../../domain/entities/Room";
import RoomRepository from "../../domain/repositories/RoomRepository";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default class RoomRepositoryDatabase implements RoomRepository {
    @inject("DatabaseConnection")
    private readonly connection!: DatabaseConnection;
    
    async save(room: Room): Promise<void> {
        await this.connection.query(
            `INSERT INTO hotel.rooms (room_id, number, capacity, price_per_night, status)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (room_id)
             DO UPDATE SET
                number = EXCLUDED.number,
                capacity = EXCLUDED.capacity,
                price_per_night = EXCLUDED.price_per_night,
                status = EXCLUDED.status`,
            [
                room.getUuid(),
                room.getNumber(),
                room.getCapacity(),
                room.getPricePerNight(),
                room.getStatus()
            ]
        );
    }
    
    async findByUuid(uuid: string): Promise<Room | null> {
        const result = await this.connection.query(
            `SELECT room_id, number, capacity, price_per_night, status
             FROM hotel.rooms
             WHERE room_id = $1`,
            [uuid]
        );
        if (result.length === 0) return null;
        const row = result[0];
        return Room.restore(
            row.room_id,
            row.number,
            row.capacity,
            parseFloat(row.price_per_night),
            row.status
        );
    }
    
    async findByNumber(number: number): Promise<Room | null> {
        const result = await this.connection.query(
            `SELECT room_id, number, capacity, price_per_night, status
             FROM hotel.rooms
             WHERE number = $1`,
            [number]
        );
        if (result.length === 0) return null;
        const row = result[0];
        return Room.restore(
            row.room_id,
            row.number,
            row.capacity,
            parseFloat(row.price_per_night),
            row.status
        );
    }
}
