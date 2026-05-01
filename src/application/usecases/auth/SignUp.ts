import TokenService from "../../../domain/auth/TokenService";
import GuestRepository from "../../../domain/repositories/GuestRepository";
import SessionRepository from "../../../domain/repositories/SessionRepository";
import { inject } from "../../../infra/di/Registry";
import CreateGuest from "../CreateGuest";

export default class SignUp {
    @inject("CreateGuest")
    private readonly createGuest!: CreateGuest;
    @inject("GuestRepository")
    private readonly guestRepository!: GuestRepository;
    @inject("SessionRepository")
    private readonly sessionRepository!: SessionRepository;
    @inject("TokenService")
    private readonly tokenService!: TokenService;

    async execute(input: Input): Promise<Output> {
        const output = await this.createGuest.execute(input);
        const guest = await this.guestRepository.findByUuid(output.id);
        if (!guest) throw new Error("Guest not found");
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
    name: string;
    email: string;
    document: string;
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
