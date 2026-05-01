import 'dotenv/config';
import PgPromiseAdapter from "../../../src/infra/database/PgPromiseAdapter";
import AxiosAdapter from "../../../src/infra/http/client/AxiosAdapter";
import HttpClient from "../../../src/infra/http/client/HttpClient";
import DatabaseConnection from '../../../src/infra/database/DatabaseConnection';

let httpClient: HttpClient;
let url: string;
let roomId: string;
let occupiedRoomId: string;
let connection: DatabaseConnection;

beforeEach(() => {
    httpClient = new AxiosAdapter();
    url = `http://localhost:${process.env.SERVER_PORT || 3000}`;
    connection = new PgPromiseAdapter(process.env.DATABASE_URL || "");
});

it("Should create a room", async () => {
    const body = {
        "number": Date.now() % 1000000,
        "capacity": 4,
        "pricePerNight": 250.00,
        "status": "available"
    };

    const responseCreateRoom = await httpClient.post(`${url}/rooms`, body);
    roomId = responseCreateRoom.id;
    const responseGetRoom = await httpClient.get(`${url}/rooms/${roomId}`);

    expect(responseGetRoom).toEqual({
        id: roomId,
        number: body.number,
        capacity: body.capacity,
        pricePerNight: body.pricePerNight,
        status: body.status
    });
});

it("Should list only available rooms", async () => {
    const seed = Date.now() % 1000000;
    const availableRoom = {
        "number": seed,
        "capacity": 4,
        "pricePerNight": 250.00,
        "status": "available"
    };
    const occupiedRoom = {
        "number": seed + 1,
        "capacity": 2,
        "pricePerNight": 150.00,
        "status": "occupied"
    };

    const responseCreateAvailableRoom = await httpClient.post(`${url}/rooms`, availableRoom);
    roomId = responseCreateAvailableRoom.id;
    const responseCreateOccupiedRoom = await httpClient.post(`${url}/rooms`, occupiedRoom);
    occupiedRoomId = responseCreateOccupiedRoom.id;

    const responseListAvailableRooms = await httpClient.get(`${url}/rooms?status=available`);

    expect(responseListAvailableRooms.rooms).toEqual(expect.arrayContaining([
        expect.objectContaining({
            id: roomId,
            number: availableRoom.number,
            capacity: availableRoom.capacity,
            pricePerNight: availableRoom.pricePerNight,
            status: "available"
        })
    ]));
    expect(responseListAvailableRooms.rooms).not.toEqual(expect.arrayContaining([
        expect.objectContaining({
            id: occupiedRoomId
        })
    ]));
});

afterEach(async () => {
    if (occupiedRoomId) {
        await connection.query(`DELETE FROM hotel.rooms WHERE room_id = $1`, [occupiedRoomId]);
        occupiedRoomId = "";
    }
    if (roomId) {
        await connection.query(`DELETE FROM hotel.rooms WHERE room_id = $1`, [roomId]);
        connection.close();
        roomId = "";
    }
});
