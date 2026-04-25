import Guest from "../../domain/entities/Guest";
import GuestRepository from "../../domain/repositories/GuestRepository";
import Email from "../../domain/value-objects/Email";

export default class CreateGuest {
    constructor(private readonly guestRepository: GuestRepository) { }
    
    async execute(input: Input): Promise<Output> {
        const guestExists = await this.guestRepository.findByEmail(input.email);
        if (guestExists) throw new Error("Guest already exists with this email");
        const guest = Guest.create(input.name, input.email, input.document, input.password);
        await this.guestRepository.save(guest);
        return { id: guest.getUuid() };
    }
}

type Input = {
    name: string;
    email: string;
    document: string;
    password: string
};

type Output = {
    id: string
};