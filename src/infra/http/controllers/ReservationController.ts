import CancelReservation from "../../../application/usecases/CancelReservation";
import CreateReservation from "../../../application/usecases/CreateReservation";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";
import GetReservationQueryHandler from "../../../application/queries/GetReservationQueryHandler";
import Authenticate from "../../../application/usecases/auth/Authenticate";

export default class ReservationController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateReservation")
    private readonly createReservation!: CreateReservation;
    @inject("CancelReservation")
    private readonly cancelReservation!: CancelReservation;
    @inject("GetReservationQueryHandler")
    private readonly getReservationQueryHandler!: GetReservationQueryHandler;
    @inject("Authenticate")
    private readonly authenticate!: Authenticate;

    constructor() {
        this.httpServer.route("post", "/reservations", async (request: any, response: any) => {
            const authentication = await this.authenticate.execute({ authorization: request.headers.authorization });
            return await this.createReservation.execute({ ...request.body, guestId: authentication.guestId });
        });
        this.httpServer.route("put", "/reservations/:id/cancel", async (request: any, response: any) => {
            const authentication = await this.authenticate.execute({ authorization: request.headers.authorization });
            return await this.cancelReservation.execute({
                ...request.body,
                reservationId: request.params.id,
                guestId: authentication.guestId
            });
        });
        this.httpServer.route("get", "/reservations/:id", async (request: any, response: any) => {
            const authentication = await this.authenticate.execute({ authorization: request.headers.authorization });
            const reservationId = request.params.id;
            const reservation = await this.getReservationQueryHandler.execute({ id: reservationId });
            if (reservation.guest.id !== authentication.guestId) throw new Error("Forbidden");
            return reservation;
        });
    }
}
