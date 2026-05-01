import TokenService from "../../../domain/auth/TokenService";
import SessionRepository from "../../../domain/repositories/SessionRepository";
import { inject } from "../../../infra/di/Registry";
import Authenticate from "./Authenticate";

export default class Logout {
    @inject("Authenticate")
    private readonly authenticate!: Authenticate;
    @inject("SessionRepository")
    private readonly sessionRepository!: SessionRepository;
    @inject("TokenService")
    private readonly tokenService!: TokenService;

    async execute(input: Input): Promise<void> {
        const authentication = await this.authenticate.execute(input.authorization ? { authorization: input.authorization } : {});
        await this.sessionRepository.revoke(this.tokenService.hash(authentication.token));
    }
}

type Input = {
    authorization?: string;
}
