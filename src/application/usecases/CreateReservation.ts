import Reservation from "../../domain/entities/Reservation";
import GuestRepository from "../../domain/repositories/GuestRepository";
import ReservationRepository from "../../domain/repositories/ReservationRepository";
import RoomRepository from "../../domain/repositories/RoomRepository";
import ReservationPeriod from "../../domain/value-objects/ReservationPeriod";

export default class CreateReservation {
    constructor(
        private readonly reservationRepository: ReservationRepository,
        private readonly roomRepository: RoomRepository,
        private readonly guestRepository: GuestRepository
    ) { }
    
    async execute(input: Input): Promise<Output> {
        const guest = await this.guestRepository.findByUuid(input.guestId);
        if (!guest) throw new Error("Guest not found");
        const room = await this.roomRepository.findByUuid(input.roomId);
        if (!room) throw new Error("Room not found");
        const hasConflict = await this.reservationRepository.hasConflict(
            input.roomId, new ReservationPeriod(input.checkInDate, input.checkOutDate)
        );
        if (hasConflict) throw new Error("The room is already booked for the selected period");
        const reservation = Reservation.create(input.roomId, input.guestId, input.checkInDate, input.checkOutDate);
        await this.reservationRepository.save(reservation);

        const events = reservation.getDomainEvents();
        for (const event of events) {
            console.log(`Event: ${event.getEventName()} occurred on ${event.occurredOn.toISOString()}`);
        }
        reservation.clearDomainEvents();

        return { id: reservation.getUuid() };
    }
}

type Input = {
    guestId: string,
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date
};

type Output = {
    id: string
}