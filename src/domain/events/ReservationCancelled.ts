import DomainEvent from "./DomainEvent";

export default class ReservationCancelled extends DomainEvent {
    constructor(
        readonly reservationId: string,
        readonly roomId: string,
        readonly guestId: string,
        readonly reason: string,
        readonly cancelledBy: string
    ) {
        super();
    }
        
    getEventName(): string {
        return "ReservationCancelled";
    }
}