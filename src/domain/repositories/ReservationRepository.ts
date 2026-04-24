import Guest from "../entities/Guest";
import Reservation from "../entities/Reservation";
import Uuid from "../value-objects/Uuid";

export default interface GuestRepository {
    save(reservation: Reservation): Promise<void>;
    findByGuestId(guestId: Uuid): Promise<Reservation[]>;
}