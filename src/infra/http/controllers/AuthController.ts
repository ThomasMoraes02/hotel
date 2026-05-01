import SignIn from "../../../application/usecases/auth/SignIn";
import SignUp from "../../../application/usecases/auth/SignUp";
import Logout from "../../../application/usecases/auth/Logout";
import { inject } from "../../di/Registry";
import HttpServer from "../server/HttpServer";

export default class AuthController {
    @inject("HttpServer")
    private readonly httpServer!: HttpServer;
    @inject("SignUp")
    private readonly signUp!: SignUp;
    @inject("SignIn")
    private readonly signIn!: SignIn;
    @inject("Logout")
    private readonly logout!: Logout;

    constructor() {
        this.httpServer.route("post", "/auth/signup", async (request: any) => {
            return await this.signUp.execute(request.body);
        });
        this.httpServer.route("post", "/auth/signin", async (request: any) => {
            return await this.signIn.execute(request.body);
        });
        this.httpServer.route("post", "/auth/logout", async (request: any) => {
            await this.logout.execute({ authorization: request.headers.authorization });
            return { success: true };
        });
    }
}
