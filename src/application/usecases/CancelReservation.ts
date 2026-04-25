import ReservationRepository from "../../domain/repositories/ReservationRepository";

export default class CancelReservation {
    constructor(private readonly reservationRepository: ReservationRepository) { }
    
    async execute(input: Input): Promise<void> {
        const reservation = await this.reservationRepository.findByUuid(input.reservationId);
        if (!reservation) throw new Error("Reservation not found");
        reservation.cancel(input.reason, input.cancelledBy);
        await this.reservationRepository.save(reservation);

        const events = reservation.getDomainEvents();
        for (const event of events) {
            console.log(`Event: ${event.getEventName()} occurred on ${event.occurredOn.toISOString()}`);
        }
        reservation.clearDomainEvents();
    }
}

type Input = {
    reservationId: string,
    reason: string,
    cancelledBy: "guest" | "admin" | "system"
};