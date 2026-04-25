import Reservation from "../entities/Reservation";
import ReservationPeriod from "../value-objects/ReservationPeriod";

export default interface ReservationRepository {
    save(reservation: Reservation): Promise<void>;
    findByUuid(uuid: string): Promise<Reservation | null>;
    findByGuestId(guestId: string): Promise<Reservation[]>;
    hasConflict(roomId: string, period: ReservationPeriod): Promise<boolean>;
}