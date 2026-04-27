import CreateRoom from "../../../application/usecases/CreateRoom";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class RoomController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateRoom")
    private readonly createRoom!: CreateRoom;

    constructor() {
        this.httpServer.route("post", "/rooms", async (request: any, response: any) => {
            return await this.createRoom.execute(request.body);
        });
    }
}