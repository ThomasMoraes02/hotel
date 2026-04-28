import CreateGuest from "../../../application/usecases/CreateGuest";
import GetGuest from "../../../application/usecases/GetGuest";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class GuestController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateGuest")
    private readonly createGuest!: CreateGuest;
    @inject("GetGuest")
    private readonly getGuest!: GetGuest;

    constructor() {
        this.httpServer.route("post", "/guests", async (request: any, response: any) => {
            return await this.createGuest.execute(request.body);
        });
        this.httpServer.route("get", "/guests/:id", async (request: any, response: any) => {
            return await this.getGuest.execute({ id: request.params.id });
        });
    }
}