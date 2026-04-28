import 'dotenv/config';
import PgPromiseAdapter from "../../../src/infra/database/PgPromiseAdapter";
import AxiosAdapter from "../../../src/infra/http/client/AxiosAdapter";
import HttpClient from "../../../src/infra/http/client/HttpClient";
import DatabaseConnection from '../../../src/infra/database/DatabaseConnection';

let httpClient: HttpClient;
let url: string;
let roomId: string;
let connection: DatabaseConnection;

beforeEach(() => {
    httpClient = new AxiosAdapter();
    url = `http://localhost:${process.env.SERVER_PORT || 3000}`;
    connection = new PgPromiseAdapter(process.env.DATABASE_URL || "");
});

it("Should create a room", async () => {
    const body = {
        "number": 102,
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

afterEach(async () => {
    if (roomId) {
        await connection.query(`DELETE FROM hotel.rooms WHERE room_id = $1`, [roomId]);
        connection.close();
        roomId = "";
    }
});