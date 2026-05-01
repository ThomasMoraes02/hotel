import TokenService from "../../../domain/auth/TokenService";
import SessionRepository from "../../../domain/repositories/SessionRepository";
import { inject } from "../../../infra/di/Registry";

export default class Authenticate {
    @inject("SessionRepository")
    private readonly sessionRepository!: SessionRepository;
    @inject("TokenService")
    private readonly tokenService!: TokenService;

    async execute(input: Input): Promise<Output> {
        const token = this.extractBearerToken(input.authorization);
        const payload = this.tokenService.verify(token);
        const session = await this.sessionRepository.findActiveByTokenHash(this.tokenService.hash(token), new Date());
        if (!session || session.guestId !== payload.sub) throw new Error("Unauthorized");
        return { guestId: payload.sub, token };
    }

    private extractBearerToken(authorization?: string): string {
        if (!authorization) throw new Error("Unauthorized");
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer" || !token) throw new Error("Unauthorized");
        return token;
    }
}

type Input = {
    authorization?: string;
}

type Output = {
    guestId: string;
    token: string;
}
