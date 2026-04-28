import GuestRepository from "../../domain/repositories/GuestRepository";
import { inject } from "../../infra/di/Registry";

export default class GetGuest {
    @inject("GuestRepository")
    private readonly guestRepository!: GuestRepository;

    async execute(input: Input): Promise<Output> {
        const guest = await this.guestRepository.findByUuid(input.id);
        if (!guest) throw new Error("Guest not found");
        return {
            id: guest.getUuid(),
            name: guest.getName(),
            email: guest.getEmail(),
            document: guest.getDocument()
        }
    }
}

type Input = {
    id: string
}

type Output = {
    id: string,
    name: string,
    email: string,
    document: string
}