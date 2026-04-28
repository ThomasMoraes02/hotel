import 'dotenv/config';
import GetReservationQueryHandler from "../../../src/application/queries/GetReservationQueryHandler";
import PgPromiseAdapter from "../../../src/infra/database/PgPromiseAdapter";
import Registry from "../../../src/infra/di/Registry";
import ReservationQueryRepositoryDatabase from "../../../src/infra/repositories/queries/ReservationQueryRepositoryDatabase";
import Guest from '../../../src/domain/entities/Guest';
import Room from '../../../src/domain/entities/Room';
import Reservation from '../../../src/domain/entities/Reservation';
import GuestRepositoryDatabase from '../../../src/infra/repositories/GuestRepositoryDatabase';
import RoomRepositoryDatabase from '../../../src/infra/repositories/RoomRepositoryDatabase';
import ReservationRepositoryDatabase from '../../../src/infra/repositories/ReservationRepositoryDatabase';
import DatabaseConnection from '../../../src/infra/database/DatabaseConnection';

let guest: Guest;
let room: Room;
let reservation: Reservation;
let connection: DatabaseConnection;

beforeEach(async () => {
    connection = new PgPromiseAdapter(process.env.DATABASE_URL || "");
    Registry.getInstance().provide("DatabaseConnection", connection);
    Registry.getInstance().provide("ReservationQueryRepository", new ReservationQueryRepositoryDatabase());
    const GuestRepository = new GuestRepositoryDatabase();
    const RoomRepository = new RoomRepositoryDatabase();
    const ReservationRepository = new ReservationRepositoryDatabase();

    guest = Guest.create("John Doe", `john${Math.random()}@gmail.com`, "123.456.789-09", "password123");
    room = Room.create(101, 2, 150.00, "available");
    reservation = Reservation.create(room.getUuid(), guest.getUuid(), new Date("2024-05-01"), new Date("2024-05-05"));

    await GuestRepository.save(guest);
    await RoomRepository.save(room);
    await ReservationRepository.save(reservation);
});

it("Should return reservation details for a valid reservation ID", async () => {
    const reservationQuery = new GetReservationQueryHandler(); 
    const output = await reservationQuery.execute({
        id: reservation.getUuid()
    });

    expect(output).toEqual({
        id: reservation.getUuid(),
        checkInDate: reservation.period.checkIn,
        checkOutDate: reservation.period.checkOut,
        totalNights: reservation.getTotalNights(),
        totalPrice: reservation.getTotalPrice(room.getPricePerNight()),
        status: 'pending',
        room: {
            id: room.getUuid(),
            number: room.number,
            capacity: room.capacity,
            pricePerNight: room.pricePerNight,
            status: 'available'
        },
        guest: {
            id: guest.getUuid(),
            name: guest.getName(),
            email: guest.getEmail(),
            document: guest.getDocument()
        }
    });
});

afterEach(async () => {
    await connection.query('DELETE FROM hotel.reservations WHERE reservation_id = $1', [reservation.getUuid()]);
    await connection.query('DELETE FROM hotel.rooms WHERE room_id = $1', [room.getUuid()]);
    await connection.query('DELETE FROM hotel.guests WHERE guest_id = $1', [guest.getUuid()]);
    await connection.close();
});