import { request } from "axios";
import CancelReservation from "../../../application/usecases/CancelReservation";
import CreateReservation from "../../../application/usecases/CreateReservation";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";
import GetReservationQueryHandler from "../../../application/queries/GetReservationQueryHandler";

export default class ReservationController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateReservation")
    private readonly createReservation!: CreateReservation;
    @inject("CancelReservation")
    private readonly cancelReservation!: CancelReservation;
    @inject("GetReservationQueryHandler")
    private readonly getReservationQueryHandler!: GetReservationQueryHandler;

    constructor() {
        this.httpServer.route("post", "/reservations", async (request: any, response: any) => {
            return await this.createReservation.execute(request.body);
        });
        this.httpServer.route("put", "/reservations/:id/cancel", async (request: any, response: any) => {
            request.body.reservationId = request.params.id;
            return await this.cancelReservation.execute(request.body);
        });
        this.httpServer.route("get", "/reservations/:id", async (request: any, response: any) => {
            const reservationId = request.params.id;
            return await this.getReservationQueryHandler.execute({ id: reservationId });
        });
    }
}