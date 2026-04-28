import { GetReservationQueryOutput } from "../../../application/queries/GetReservationQueryHandler";
import ReservationQueryRepository from "../../../domain/repositories/queries/ReservationQueryRepository";
import DatabaseConnection from "../../database/DatabaseConnection";
import { inject } from "../../di/Registry";

export default class ReservationQueryRepositoryDatabase implements ReservationQueryRepository {
    @inject("DatabaseConnection")
    private readonly connection!: DatabaseConnection;

    async getReservationView(id: string): Promise<GetReservationQueryOutput | null> {
        const result = await this.connection.query(`SELECT
        r.reservation_id AS id,
        r.checkin_date AS "checkInDate",
        r.checkout_date AS "checkOutDate",
        (r.checkout_date - r.checkin_date) AS "totalNights",
        (rm.price_per_night * (r.checkout_date - r.checkin_date)) AS "totalPrice",
        r.status AS status,
        rm.room_id AS "room.id",
        rm.number AS "room.number",
        rm.capacity AS "room.capacity",
        rm.price_per_night AS "room.pricePerNight",
        rm.status AS "room.status",
        g.guest_id AS "guest.id",
        g.name AS "guest.name",
        g.email AS "guest.email",
        g.document AS "guest.document"
        FROM hotel.reservations r
        INNER JOIN hotel.rooms rm ON r.room_id = rm.room_id
        INNER JOIN hotel.guests g ON r.guest_id = g.guest_id
        WHERE r.reservation_id = $1`, [id]);
        if (result.length === 0) return null;
        
        const row = result[0];
        return {
            id: row.id,
            checkInDate: row.checkInDate,
            checkOutDate: row.checkOutDate,
            totalNights: parseInt(row.totalNights),
            totalPrice: parseFloat(row.totalPrice),
            status: row.status,
            room: {
                id: row["room.id"],
                number: row["room.number"],
                capacity: row["room.capacity"],
                pricePerNight: parseFloat(row["room.pricePerNight"]),
                status: row["room.status"]
            },
            guest: {
                id: row["guest.id"],
                name: row["guest.name"],
                email: row["guest.email"],
                document: row["guest.document"]
            }
        };
    }
}