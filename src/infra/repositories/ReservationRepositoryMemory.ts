import Reservation from "../../domain/entities/Reservation";
import ReservationRepository from "../../domain/repositories/ReservationRepository";
import ReservationPeriod from "../../domain/value-objects/ReservationPeriod";
import Uuid from "../../domain/value-objects/Uuid";

export default class ReservationRepositoryMemory implements ReservationRepository {
    private reservations: Reservation[] = [];

    async save(reservation: Reservation): Promise<void> {
        const index = this.reservations.findIndex(r => r.getUuid() === reservation.getUuid());
        if (index === -1) {
            this.reservations.push(reservation);
        } else {
            this.reservations[index] = reservation;
        }
    }

    async findByGuestId(guestId: string): Promise<Reservation[]> {
        return this.reservations.filter(reservation => reservation.getGuestId() === guestId);
    }

    async hasConflict(roomId: string, period: ReservationPeriod): Promise<boolean> {
        return this.reservations.some(reservation => {
            if (reservation.getRoomId() !== roomId) return false;
            return reservation.period.overlapsWith(period);
        });
    }
}