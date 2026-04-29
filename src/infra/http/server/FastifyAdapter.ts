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
                response.status(500).send({ error: e.message || "Internal Server Error" });
            }
        });
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