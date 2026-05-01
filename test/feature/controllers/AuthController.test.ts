import 'dotenv/config';
import PgPromiseAdapter from "../../../src/infra/database/PgPromiseAdapter";
import AxiosAdapter from "../../../src/infra/http/client/AxiosAdapter";
import HttpClient from "../../../src/infra/http/client/HttpClient";
import DatabaseConnection from '../../../src/infra/database/DatabaseConnection';
import { createValidCpf } from '../../helpers/cpf';

let httpClient: HttpClient;
let url: string;
let guestId: string;
let token: string;
let connection: DatabaseConnection;

beforeEach(() => {
    httpClient = new AxiosAdapter();
    url = `http://localhost:${process.env.SERVER_PORT || 3000}`;
    connection = new PgPromiseAdapter(process.env.DATABASE_URL || "");
});

it("Should sign up, sign in and logout a guest", async () => {
    const seed = Date.now();
    const body = {
        "name": `John Doe ${Math.random()}`,
        "email": `john${Math.random()}@example.com`,
        "document": createValidCpf(seed),
        "password": "password123"
    };

    const responseSignUp = await httpClient.post(`${url}/auth/signup`, body);
    guestId = responseSignUp.guest.id;
    expect(responseSignUp.token).toBeDefined();

    const responseSignIn = await httpClient.post(`${url}/auth/signin`, {
        email: body.email,
        password: body.password
    });
    token = responseSignIn.token;
    expect(token).toBeDefined();

    const responseLogout = await httpClient.post(`${url}/auth/logout`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    expect(responseLogout).toEqual({ success: true });

    await expect(httpClient.get(`${url}/guests/${guestId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })).rejects.toThrow();
});

afterEach(async () => {
    if (guestId) {
        await connection.query(`DELETE FROM hotel.reservations WHERE guest_id = $1`, [guestId]);
        await connection.query(`DELETE FROM hotel.sessions WHERE guest_id = $1`, [guestId]);
        await connection.query(`DELETE FROM hotel.guests WHERE guest_id = $1`, [guestId]);
        guestId = "";
    }
    await connection.close();
});
