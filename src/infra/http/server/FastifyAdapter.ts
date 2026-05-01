import HttpServer from "./HttpServer";
import Fastify from "fastify";
import cors from "@fastify/cors";

export default class FastifyAdapter implements HttpServer {
    private app: any;

    constructor() {
        this.app = Fastify({
            logger: false
        });
    }

    route(method: string, url: string, callback: Function): void {
        this.app[method](url, async (request: any, response: any) => {
            try {
                const result = await callback(request);
                response.send(result);
            } catch (e: any) {
                this.app.log.error(e);
                response.status(this.getStatusCode(e)).send({ error: e.message || "Internal Server Error" });
            }
        });
    }

    private getStatusCode(error: any): number {
        if (error.message === "Unauthorized" || error.message === "Invalid credentials" || error.message === "Invalid token" || error.message === "Token expired") return 401;
        if (error.message === "Forbidden") return 403;
        if (error.message?.includes("not found")) return 404;
        return 500;
    }

    listen(port: number): void {
        try {
            this.app.register(cors, {
                origin: true
            });
            this.app.listen({ port, host: '0.0.0.0' });
            console.log(`Fastify: Server listening on http://localhost:${port}`);
        } catch (e: any) {
            this.app.log.error(e);
            process.exit(1);
        }
    }
}
