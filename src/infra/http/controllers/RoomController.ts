import CreateRoom from "../../../application/usecases/CreateRoom";
import GetRoom from "../../../application/usecases/GetRoom";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class RoomController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("CreateRoom")
    private readonly createRoom!: CreateRoom;
    @inject("GetRoom")
    private readonly getRoom!: GetRoom;

    constructor() {
        this.httpServer.route("post", "/rooms", async (request: any, response: any) => {
            return await this.createRoom.execute(request.body);
        });
        this.httpServer.route("get", "/rooms/:id", async (request: any, response: any) => {
            return await this.getRoom.execute({ id: request.params.id });
        });
    }
}