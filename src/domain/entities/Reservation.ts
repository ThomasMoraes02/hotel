import ReservationPeriod from "../value-objects/ReservationPeriod";
import Uuid from "../value-objects/Uuid";

export default class Reservation {
    constructor(
        readonly uuid: Uuid,
        readonly roomId: Uuid,
        readonly guestId: Uuid,
        readonly period: ReservationPeriod
    ) { }
    
    static create(roomId: string, guestId: string, checkIn: Date, checkOut: Date): Reservation {
        const uuid = Uuid.create();
        const period = new ReservationPeriod(checkIn, checkOut);
        const roomUuid = new Uuid(roomId);
        const guestUuid = new Uuid(guestId);
        return new Reservation(uuid, roomUuid, guestUuid, period);
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