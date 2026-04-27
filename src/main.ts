import 'dotenv/config';
import CreateGuest from "./application/usecases/CreateGuest";
import Registry from "./infra/di/Registry";
import AxiosAdapter from "./infra/http/client/AxiosAdapter";
import GuestController from "./infra/http/controllers/GuestController";
import FastifyAdapter from "./infra/http/server/FastifyAdapter";
import GuestRepositoryMemory from "./infra/repositories/GuestRepositoryMemory";
import RoomRepositoryMemory from './infra/repositories/RoomRepositoryMemory';
import CreateRoom from './application/usecases/CreateRoom';
import RoomController from './infra/http/controllers/RoomController';
import ReservationRepositoryMemory from './infra/repositories/ReservationRepositoryMemory';
import CreateReservation from './application/usecases/CreateReservation';
import ReservationController from './infra/http/controllers/ReservationController';

async function main() {
    const httpServer = new FastifyAdapter();
    Registry.getInstance().provide("HttpServer", httpServer);
    Registry.getInstance().provide("HttpClient", new AxiosAdapter());
    Registry.getInstance().provide("GuestRepository", new GuestRepositoryMemory());
    Registry.getInstance().provide("RoomRepository", new RoomRepositoryMemory());
    Registry.getInstance().provide("ReservationRepository", new ReservationRepositoryMemory());
    Registry.getInstance().provide("CreateGuest", new CreateGuest());
    Registry.getInstance().provide("CreateRoom", new CreateRoom());
    Registry.getInstance().provide("CreateReservation", new CreateReservation());
    new GuestController();
    new RoomController();
    new ReservationController();
    const port = Number(process.env.SERVER_PORT);
    await httpServer.listen(port);
}

main();