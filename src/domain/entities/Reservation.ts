import DomainEvent from "../events/DomainEvent";
import ReservationCancelled from "../events/ReservationCancelled";
import ReservationCreated from "../events/ReservationCreated";
import ReservationPeriod from "../value-objects/ReservationPeriod";
import Uuid from "../value-objects/Uuid";

export default class Reservation {
    private domainEvents: DomainEvent[] = [];

    constructor(
        readonly uuid: Uuid,
        readonly roomId: Uuid,
        readonly guestId: Uuid,
        readonly period: ReservationPeriod,
        private status: "pending" | "confirmed" | "cancelled"
    ) { }
    
    static create(roomId: string, guestId: string, checkIn: Date, checkOut: Date): Reservation {
        const uuid = Uuid.create();
        const period = new ReservationPeriod(checkIn, checkOut);
        const roomUuid = new Uuid(roomId);
        const guestUuid = new Uuid(guestId);
        const reservation = new Reservation(uuid, roomUuid, guestUuid, period, "pending");

        reservation.addDomainEvent(new ReservationCreated(
            reservation.getUuid(),
            reservation.getRoomId(),
            reservation.getGuestId(),
            checkIn,
            checkOut
        ));

        return reservation;
    }

    static restore(id: string, roomId: string, guestId: string, checkIn: Date, checkOut: Date, status: string): Reservation {
        const uuid = new Uuid(id);
        const period = new ReservationPeriod(checkIn, checkOut);
        const roomUuid = new Uuid(roomId);
        const guestUuid = new Uuid(guestId);
        return new Reservation(uuid, roomUuid, guestUuid, period, status as "pending" | "confirmed" | "cancelled");
    }

    cancel(reason: string, cancelledBy: "guest" | "admin" | "system"): void {
        if(this.status === "cancelled") throw new Error("Reservation is already cancelled");
        this.status = "cancelled";

        this.addDomainEvent(new ReservationCancelled(
            this.getUuid(),
            this.getRoomId(),
            this.getGuestId(),
            reason,
            cancelledBy
        ));
    }

    private addDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }

    public getDomainEvents(): DomainEvent[] {
        return this.domainEvents;
    }

    public clearDomainEvents(): void {
        this.domainEvents = [];
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

    getStatus(): string {
        return this.status;
    }

    getTotalNights(): number {
        return this.period.getTotalNights();
    }
}