import TokenService from "../../../domain/auth/TokenService";
import GuestRepository from "../../../domain/repositories/GuestRepository";
import SessionRepository from "../../../domain/repositories/SessionRepository";
import { inject } from "../../../infra/di/Registry";

export default class SignIn {
    @inject("GuestRepository")
    private readonly guestRepository!: GuestRepository;
    @inject("SessionRepository")
    private readonly sessionRepository!: SessionRepository;
    @inject("TokenService")
    private readonly tokenService!: TokenService;

    async execute(input: Input): Promise<Output> {
        const guest = await this.guestRepository.findByEmail(input.email);
        if (!guest || guest.getPassword() !== input.password) throw new Error("Invalid credentials");
        const token = this.tokenService.sign(guest.getUuid());
        const payload = this.tokenService.verify(token);
        await this.sessionRepository.save({
            tokenHash: this.tokenService.hash(token),
            guestId: guest.getUuid(),
            expiresAt: new Date(payload.exp * 1000)
        });
        return {
            token,
            guest: {
                id: guest.getUuid(),
                name: guest.getName(),
                email: guest.getEmail(),
                document: guest.getDocument()
            }
        };
    }
}

type Input = {
    email: string;
    password: string;
}

type Output = {
    token: string;
    guest: {
        id: string;
        name: string;
        email: string;
        document: string;
    }
}
