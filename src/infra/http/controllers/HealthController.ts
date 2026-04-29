import HealthCheck from "../../../application/usecases/health/HealthCheck";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class HealthController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;

    @inject("HealthCheck")
    private readonly healthCheck!: HealthCheck;

    constructor() {
        this.httpServer.route("get", "/health", async () => {
            return await this.healthCheck.execute();
        });
    }
}
