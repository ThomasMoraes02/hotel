import Guest from "../entities/Guest";

export default interface GuestRepository {
    save(guest: Guest): Promise<void>;
    findByUuid(uuid: string): Promise<Guest | null>;
    findByEmail(email: string): Promise<Guest | null>;
}