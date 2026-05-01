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
import ListRooms from './application/usecases/ListRooms';
import GetReservationQueryHandler from './application/queries/GetReservationQueryHandler';
import ReservationQueryRepositoryDatabase from './infra/repositories/queries/ReservationQueryRepositoryDatabase';
import SendEmailOnReservationCreated from './application/handlers/SendEmailOnReservationCreated';
import HealthCheck from './application/usecases/health/HealthCheck';
import HealthController from './infra/http/controllers/HealthController';
import PinoLogger from './infra/logging/PinoLogger';
import HmacTokenService from './infra/auth/HmacTokenService';
import SessionRepositoryDatabase from './infra/repositories/SessionRepositoryDatabase';
import SignUp from './application/usecases/auth/SignUp';
import SignIn from './application/usecases/auth/SignIn';
import Logout from './application/usecases/auth/Logout';
import Authenticate from './application/usecases/auth/Authenticate';
import AuthController from './infra/http/controllers/AuthController';

async function main() {
    const httpServer = new FastifyAdapter();
    const httpClient = new AxiosAdapter();
    const eventBus = new InMemoryEventBus();
    const logger = new PinoLogger();

    eventBus.subscribe("ReservationCreated", new SendEmailOnReservationCreated());

    Registry.getInstance().provide("HttpServer", httpServer);
    Registry.getInstance().provide("HttpClient", httpClient);
    Registry.getInstance().provide("DatabaseConnection", new PgPromiseAdapter(process.env.DATABASE_URL!));
    Registry.getInstance().provide("EventBus", eventBus);
    Registry.getInstance().provide("Logger", logger);
    Registry.getInstance().provide("TokenService", new HmacTokenService(process.env.AUTH_SECRET || "dev-secret"));

    Registry.getInstance().provide("GuestRepository", new GuestRepositoryDatabase());
    Registry.getInstance().provide("RoomRepository", new RoomRepositoryDatabase());
    Registry.getInstance().provide("ReservationRepository", new ReservationRepositoryDatabase());
    Registry.getInstance().provide("ReservationQueryRepository", new ReservationQueryRepositoryDatabase());
    Registry.getInstance().provide("SessionRepository", new SessionRepositoryDatabase());

    Registry.getInstance().provide("CreateGuest", new CreateGuest());
    Registry.getInstance().provide("GetGuest", new GetGuest());
    Registry.getInstance().provide("CreateRoom", new CreateRoom());
    Registry.getInstance().provide("GetRoom", new GetRoom());
    Registry.getInstance().provide("ListRooms", new ListRooms());
    Registry.getInstance().provide("CreateReservation", new CreateReservation());
    Registry.getInstance().provide("CancelReservation", new CancelReservation());
    Registry.getInstance().provide("GetReservationQueryHandler", new GetReservationQueryHandler());
    Registry.getInstance().provide("HealthCheck", new HealthCheck());
    Registry.getInstance().provide("SignUp", new SignUp());
    Registry.getInstance().provide("SignIn", new SignIn());
    Registry.getInstance().provide("Authenticate", new Authenticate());
    Registry.getInstance().provide("Logout", new Logout());

    new AuthController();
    new GuestController();
    new RoomController();
    new ReservationController();
    new HealthController();
    const port = Number(process.env.SERVER_PORT!);
    httpServer.listen(port);
}

main();