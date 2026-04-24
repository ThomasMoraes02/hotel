import Guest from "../entities/Guest";
import Email from "../value-objects/Email";

export default interface GuestRepository {
    save(guest: Guest): Promise<void>;
    findByEmail(email: Email): Promise<Guest | null>;
}