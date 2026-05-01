import 'dotenv/config';
import PgPromiseAdapter from "../../../src/infra/database/PgPromiseAdapter";
import AxiosAdapter from "../../../src/infra/http/client/AxiosAdapter";
import HttpClient from "../../../src/infra/http/client/HttpClient";
import DatabaseConnection from '../../../src/infra/database/DatabaseConnection';
import { createValidCpf } from '../../helpers/cpf';

let httpClient: HttpClient;
let url: string;
let reservationId: string;
let guestId: string;
let otherGuestId: string;
let roomId: string;
let token: string;
let otherToken: string;
let connection: DatabaseConnection;

beforeEach(() => {
    httpClient = new AxiosAdapter();
    url = `http://localhost:${process.env.SERVER_PORT || 3000}`;
    connection = new PgPromiseAdapter(process.env.DATABASE_URL || "");
});

it("Should create a reservation", async () => {
    const seed = Date.now();
    const responseSignUp = await httpClient.post(`${url}/auth/signup`, {
        "name": `John Doe ${Math.random()}`,
        "email": `john${Math.random()}@examples.com`,
        "document": createValidCpf(seed),
        "password": "password123"
    });
    guestId = responseSignUp.guest.id;
    token = responseSignUp.token;

    const responseCreateRoom = await httpClient.post(`${url}/rooms`, {
        "number": seed % 1000000,
        "capacity": 4,
        "pricePerNight": 250.00,
        "status": "available"
    });
    roomId = responseCreateRoom.id;

    const responseCreateReservation = await httpClient.post(`${url}/reservations`, {
        "roomId": roomId,
        "checkInDate": "2024-07-01 15:00:00",
        "checkOutDate": "2024-07-05 12:00:00"
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    reservationId = responseCreateReservation.id;
    expect(reservationId).toBeDefined();
});

it("Should not allow a guest to cancel another guest reservation", async () => {
    const seed = Date.now();
    const responseSignUp = await httpClient.post(`${url}/auth/signup`, {
        "name": `John Doe ${Math.random()}`,
        "email": `john${Math.random()}@examples.com`,
        "document": createValidCpf(seed),
        "password": "password123"
    });
    guestId = responseSignUp.guest.id;
    token = responseSignUp.token;

    const responseOtherSignUp = await httpClient.post(`${url}/auth/signup`, {
        "name": `Jane Doe ${Math.random()}`,
        "email": `jane${Math.random()}@examples.com`,
        "document": createValidCpf(seed + 1),
        "password": "password123"
    });
    otherGuestId = responseOtherSignUp.guest.id;
    otherToken = responseOtherSignUp.token;

    const responseCreateRoom = await httpClient.post(`${url}/rooms`, {
        "number": seed % 1000000,
        "capacity": 4,
        "pricePerNight": 250.00,
        "status": "available"
    });
    roomId = responseCreateRoom.id;

    const responseCreateReservation = await httpClient.post(`${url}/reservations`, {
        "roomId": roomId,
        "checkInDate": "2024-07-01 15:00:00",
        "checkOutDate": "2024-07-05 12:00:00"
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    reservationId = responseCreateReservation.id;

    await expect(httpClient.put(`${url}/reservations/${reservationId}/cancel`, {
        "reason": "Change of plans",
        "cancelledBy": "guest"
    }, {
        headers: {
            Authorization: `Bearer ${otherToken}`
        }
    })).rejects.toThrow();
});

afterEach(async () => {
    if (reservationId) {
        await connection.query(`DELETE FROM hotel.reservations WHERE reservation_id = $1`, [reservationId]);
        reservationId = "";
    }
    if (guestId) {
        await connection.query(`DELETE FROM hotel.sessions WHERE guest_id = $1`, [guestId]);
        await connection.query(`DELETE FROM hotel.guests WHERE guest_id = $1`, [guestId]);
        guestId = "";
    }
    if (otherGuestId) {
        await connection.query(`DELETE FROM hotel.sessions WHERE guest_id = $1`, [otherGuestId]);
        await connection.query(`DELETE FROM hotel.guests WHERE guest_id = $1`, [otherGuestId]);
        otherGuestId = "";
    }
    if (roomId) {
        await connection.query(`DELETE FROM hotel.rooms WHERE room_id = $1`, [roomId]);
        roomId = "";
    }
    await connection.close();
});
