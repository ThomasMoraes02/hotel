import CancelReservation from "../../../application/usecases/CancelReservation";
import CreateReservation from "../../../application/usecases/CreateReservation";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class ReservationController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateReservation")
    private readonly createReservation!: CreateReservation;
    @inject("CancelReservation")
    private readonly cancelReservation!: CancelReservation;

    constructor() {
        this.httpServer.route("post", "/reservations", async (request: any, response: any) => {
            return await this.createReservation.execute(request.body);
        });
        this.httpServer.route("put", "/reservations/:id/cancel", async (request: any, response: any) => {
            request.body.reservationId = request.params.id;
            return await this.cancelReservation.execute(request.body);
        });
    }
}