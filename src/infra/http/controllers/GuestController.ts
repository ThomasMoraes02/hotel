import GetGuest from "../../../application/usecases/GetGuest";
import Authenticate from "../../../application/usecases/auth/Authenticate";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class GuestController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("GetGuest")
    private readonly getGuest!: GetGuest;
    @inject("Authenticate")
    private readonly authenticate!: Authenticate;

    constructor() {
        this.httpServer.route("get", "/guests/:id", async (request: any, response: any) => {
            const authentication = await this.authenticate.execute({ authorization: request.headers.authorization });
            if (authentication.guestId !== request.params.id) throw new Error("Forbidden");
            return await this.getGuest.execute({ id: request.params.id });
        });
    }
}
