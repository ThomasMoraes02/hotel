import Guest from "../../domain/entities/Guest";
import GuestRepository from "../../domain/repositories/GuestRepository";

export default class GuestRepositoryMemory implements GuestRepository {
    private guests: Guest[] = [];

    async save(guest: Guest): Promise<void> {
        const index = this.guests.findIndex(g => g.getUuid() === guest.getUuid());
        if (index === -1) {
            this.guests.push(guest);
        } else {
            this.guests[index] = guest;
        }
    }

    async findByUuid(uuid: string): Promise<Guest | null> {
        const guest = this.guests.find(g => g.getUuid() === uuid);
        return guest || null;
    }

    async findByEmail(email: string): Promise<Guest | null> {
        const guest = this.guests.find(g => g.getEmail() === email);
        return guest || null;
    }
}