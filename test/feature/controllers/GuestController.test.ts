import 'dotenv/config';
import PgPromiseAdapter from "../../../src/infra/database/PgPromiseAdapter";
import AxiosAdapter from "../../../src/infra/http/client/AxiosAdapter";
import HttpClient from "../../../src/infra/http/client/HttpClient";
import DatabaseConnection from '../../../src/infra/database/DatabaseConnection';
import { createValidCpf } from '../../helpers/cpf';

let httpClient: HttpClient;
let url: string;
let guestId: string;
let connection: DatabaseConnection;

beforeEach(() => {
    httpClient = new AxiosAdapter();
    url = `http://localhost:${process.env.SERVER_PORT || 3000}`;
    connection = new PgPromiseAdapter(process.env.DATABASE_URL || "");
});

it("Should create a guest", async () => {
    const seed = Date.now();
    const body = {
        "name": `John Doe ${Math.random()}`,
        "email": `john${Math.random()}@example.com`,
        "document": createValidCpf(seed),
        "password": "password123"
    }

    const responseCreateGuest = await httpClient.post(`${url}/guests`, body);
    guestId = responseCreateGuest.id;
    const responseGetGuest = await httpClient.get(`${url}/guests/${guestId}`);

    expect(responseGetGuest).toEqual({
        id: guestId,
        name: body.name,
        email: body.email,
        document: body.document
    });
});

afterEach(async () => {
    if (guestId) {
        await connection.query(`DELETE FROM hotel.reservations WHERE guest_id = $1`, [guestId]);
        await connection.query(`DELETE FROM hotel.guests WHERE guest_id = $1`, [guestId]);
        connection.close();
        guestId = "";
    }
});
