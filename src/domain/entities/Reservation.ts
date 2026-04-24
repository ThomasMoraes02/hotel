import ReservationPeriod from "../value-objects/ReservationPeriod";
import Uuid from "../value-objects/Uuid";

export default class Reservation {
    constructor(readonly uuid: Uuid, readonly roomId: Uuid, readonly guestId: Uuid, readonly period: ReservationPeriod) { }
    
    static create(roomId: Uuid, guestId: Uuid, period: ReservationPeriod): Reservation {
        const uuid = Uuid.create();
        return new Reservation(uuid, roomId, guestId, period);
    }

    getUuid(): string {
        return this.uuid.getValue();
    }

    getRoomId(): string {
        return this.roomId.getValue();
    }

    getGuestId(): string {
        return this.guestId.getValue();
    }

    getTotalNights(): number {
        return this.period.getTotalNights();
    }
}