import CreateGuest from "../../../application/usecases/CreateGuest";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class GuestController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateGuest")
    private readonly createGuest!: CreateGuest;

    constructor() {
        this.httpServer.route("post", "/guests", async (request: any, response: any) => {
            return await this.createGuest.execute(request.body);
        });
    }
}