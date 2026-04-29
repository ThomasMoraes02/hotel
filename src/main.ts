import 'dotenv/config';
import CreateGuest from "./application/usecases/CreateGuest";
import Registry from "./infra/di/Registry";
import AxiosAdapter from "./infra/http/client/AxiosAdapter";
import GuestController from "./infra/http/controllers/GuestController";
import FastifyAdapter from "./infra/http/server/FastifyAdapter";
import CreateRoom from './application/usecases/CreateRoom';
import RoomController from './infra/http/controllers/RoomController';
import CreateReservation from './application/usecases/CreateReservation';
import ReservationController from './infra/http/controllers/ReservationController';
import GuestRepositoryDatabase from './infra/repositories/GuestRepositoryDatabase';
import RoomRepositoryDatabase from './infra/repositories/RoomRepositoryDatabase';
import ReservationRepositoryDatabase from './infra/repositories/ReservationRepositoryDatabase';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import InMemoryEventBus from './infra/events/InMemoryEventBus';
import CancelReservation from './application/usecases/CancelReservation';
import GetGuest from './application/usecases/GetGuest';
import GetRoom from './application/usecases/GetRoom';
import GetReservationQueryHandler from './application/queries/GetReservationQueryHandler';
import ReservationQueryRepositoryDatabase from './infra/repositories/queries/ReservationQueryRepositoryDatabase';
import ExpressAdapter from './infra/http/server/ExpressAdapter';

async function main() {
    const httpServer = new FastifyAdapter();
    // const httpServer = new ExpressAdapter();

    Registry.getInstance().provide("HttpServer", httpServer);
    Registry.getInstance().provide("HttpClient", new AxiosAdapter());
    Registry.getInstance().provide("DatabaseConnection", new PgPromiseAdapter(process.env.DATABASE_URL || ""));
    Registry.getInstance().provide("EventBus", new InMemoryEventBus());

    Registry.getInstance().provide("GuestRepository", new GuestRepositoryDatabase());
    Registry.getInstance().provide("RoomRepository", new RoomRepositoryDatabase());
    Registry.getInstance().provide("ReservationRepository", new ReservationRepositoryDatabase());
    Registry.getInstance().provide("ReservationQueryRepository", new ReservationQueryRepositoryDatabase());

    Registry.getInstance().provide("CreateGuest", new CreateGuest());
    Registry.getInstance().provide("GetGuest", new GetGuest());
    Registry.getInstance().provide("CreateRoom", new CreateRoom());
    Registry.getInstance().provide("GetRoom", new GetRoom());
    Registry.getInstance().provide("CreateReservation", new CreateReservation());
    Registry.getInstance().provide("CancelReservation", new CancelReservation());
    Registry.getInstance().provide("GetReservationQueryHandler", new GetReservationQueryHandler());

    new GuestController();
    new RoomController();
    new ReservationController();
    const port = Number(process.env.SERVER_PORT || 3000);
    httpServer.listen(port);
}

main();