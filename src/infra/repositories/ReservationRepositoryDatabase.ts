import Reservation from "../../domain/entities/Reservation";
import ReservationRepository from "../../domain/repositories/ReservationRepository";
import ReservationPeriod from "../../domain/value-objects/ReservationPeriod";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default class ReservationRepositoryDatabase implements ReservationRepository {
    @inject("DatabaseConnection")
    private readonly connection!: DatabaseConnection;
    
    async save(reservation: Reservation): Promise<void> {
        const period = reservation.period;
        await this.connection.query(
            `INSERT INTO hotel.reservations (reservation_id, room_id, guest_id, checkin_date, checkout_date, status)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (reservation_id)
             DO UPDATE SET
                room_id = EXCLUDED.room_id,
                guest_id = EXCLUDED.guest_id,
                checkin_date = EXCLUDED.checkin_date,
                checkout_date = EXCLUDED.checkout_date,
                status = EXCLUDED.status`,
            [
                reservation.getUuid(),
                reservation.getRoomId(),
                reservation.getGuestId(),
                period.checkIn,
                period.checkOut,
                reservation.getStatus()
            ]
        );
    }
    
    async findByUuid(uuid: string): Promise<Reservation | null> {
        const result = await this.connection.query(
            `SELECT reservation_id, room_id, guest_id, checkin_date, checkout_date, status
             FROM hotel.reservations
             WHERE reservation_id = $1`,
            [uuid]
        );
        
        if (result.length === 0) return null;
        
        const row = result[0];
        return Reservation.restore(
            row.reservation_id,
            row.room_id,
            row.guest_id,
            new Date(row.checkin_date),
            new Date(row.checkout_date),
            row.status
        );
    }
    
    async findByGuestId(guestId: string): Promise<Reservation[]> {
        const result = await this.connection.query(
            `SELECT reservation_id, room_id, guest_id, checkin_date, checkout_date, status
             FROM hotel.reservations
             WHERE guest_id = $1
             ORDER BY checkin_date DESC`,
            [guestId]
        );
        
        return result.map((row: any) => Reservation.restore(
            row.reservation_id,
            row.room_id,
            row.guest_id,
            new Date(row.checkin_date),
            new Date(row.checkout_date),
            row.status
        ));
    }
    
    async hasConflict(roomId: string, period: ReservationPeriod): Promise<boolean> {
        const result = await this.connection.query(
            `SELECT COUNT(*) as count
             FROM hotel.reservations
             WHERE room_id = $1
               AND status != 'cancelled'
               AND (
                   (checkin_date <= $2 AND checkout_date > $2)
                   OR (checkin_date < $3 AND checkout_date >= $3)
                   OR (checkin_date >= $2 AND checkout_date <= $3)
               )`,
            [roomId, period.checkIn, period.checkOut]
        );
        
        return parseInt(result[0].count) > 0;
    }
}
