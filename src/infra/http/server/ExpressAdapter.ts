import HttpServer from "./HttpServer";
import express, { Request, Response } from 'express';
import cors from 'cors';

export default class ExpressAdapter implements HttpServer {
    private app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());
    }

    route(method: string, url: string, callback: Function): void {
        this.app[method](url, async (req: Request, res: Response) => {
            try {
                const request = { params: req.params, body: req.body };
                const result = await callback(request);
                res.send(result);
            } catch (e: any) {
                console.error(e);
                res.status(500).json({ error: e.message || "Internal Server Error" });
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Express: Server listening on http://localhost:${port}`);
        });
    }
}