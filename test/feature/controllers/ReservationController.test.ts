import 'dotenv/config';
import PgPromiseAdapter from "../../../src/infra/database/PgPromiseAdapter";
import AxiosAdapter from "../../../src/infra/http/client/AxiosAdapter";
import HttpClient from "../../../src/infra/http/client/HttpClient";
import DatabaseConnection from '../../../src/infra/database/DatabaseConnection';

let httpClient: HttpClient;
let url: string;
let reservationId: string;
let guestId: string;
let roomId: string;
let connection: DatabaseConnection;

beforeEach(() => {
    httpClient = new AxiosAdapter();
    url = `http://localhost:${process.env.SERVER_PORT || 3000}`;
    connection = new PgPromiseAdapter(process.env.DATABASE_URL || "");
});

it("Should create a reservation", async () => {
    const responseCreateGuest = await httpClient.post(`${url}/guests`, {
        "name": `John Doe ${Math.random()}`,
        "email": `john${Math.random()}@example.com`,
        "document": "222.570.890-81",
        "password": "password123"
    });
    guestId = responseCreateGuest.id;

    const responseCreateRoom = await httpClient.post(`${url}/rooms`, {
        "number": 102,
        "capacity": 4,
        "pricePerNight": 250.00,
        "status": "available"
    });
    roomId = responseCreateRoom.id;

    const responseCreateReservation = await httpClient.post(`${url}/reservations`, {
        "guestId": guestId,
        "roomId": roomId,
        "checkInDate": "2024-07-01 15:00:00",
        "checkOutDate": "2024-07-05 12:00:00"
    });

    reservationId = responseCreateReservation.id;
    expect(reservationId).toBeDefined();
});

afterEach(async () => {
    if (reservationId) {
        await connection.query(`DELETE FROM hotel.reservations WHERE reservation_id = $1`, [reservationId]);
        await connection.query(`DELETE FROM hotel.guests WHERE guest_id = $1`, [guestId]);
        await connection.query(`DELETE FROM hotel.rooms WHERE room_id = $1`, [roomId]);
        connection.close();
        reservationId = "";
        guestId = "";
        roomId = "";
    }
});