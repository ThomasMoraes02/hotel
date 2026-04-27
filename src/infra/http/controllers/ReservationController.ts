import CreateReservation from "../../../application/usecases/CreateReservation";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class ReservationController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateReservation")
    private readonly createReservation!: CreateReservation;

    constructor() {
        this.httpServer.route("post", "/reservations", async (request: any, response: any) => {
            return await this.createReservation.execute(request.body);
        });
    }
}