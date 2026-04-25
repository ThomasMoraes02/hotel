import DomainEvent from "./DomainEvent";

export default class ReservationCreated extends DomainEvent {
    constructor(
        readonly reservationId: string,
        readonly roomId: string,
        readonly guestId: string,
        readonly checkInDate: Date,
        readonly checkOutDate: Date
    ) {
        super();
    }
        
    getEventName(): string {
        return "ReservationCreated";
    }
}