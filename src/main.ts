import AxiosAdapter from "./infra/http/client/AxiosAdapter";
import FastifyAdapter from "./infra/http/server/FastifyAdapter";

async function main() {
    const httpServer = new FastifyAdapter();
    const httpClient = new AxiosAdapter();

    httpServer.route("get", "/healthy", async (request: any, response: any) => {
        return { status: "ok" };
    });

    httpServer.listen(3000);

    // const response = await httpClient.get("http://localhost:3000/healthy");
}

main();