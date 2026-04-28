import Reservation from "../../domain/entities/Reservation";
import EventBus from "../../domain/events/EventBus";
import GuestRepository from "../../domain/repositories/GuestRepository";
import ReservationRepository from "../../domain/repositories/ReservationRepository";
import RoomRepository from "../../domain/repositories/RoomRepository";
import ReservationPeriod from "../../domain/value-objects/ReservationPeriod";
import { inject } from "../../infra/di/Registry";

export default class CreateReservation {
    @inject("ReservationRepository")
    private reservationRepository!: ReservationRepository;
    @inject("RoomRepository")
    private roomRepository!: RoomRepository;
    @inject("GuestRepository")
    private guestRepository!: GuestRepository;
    @inject("EventBus")
    private eventBus!: EventBus;
    
    async execute(input: Input): Promise<Output> {
        // const guest = await this.guestRepository.findByUuid(input.guestId);
        // if (!guest) throw new Error("Guest not found");
        // const room = await this.roomRepository.findByUuid(input.roomId);
        // if (!room) throw new Error("Room not found");
        const [guest, room] = await Promise.all([
            this.guestRepository.findByUuid(input.guestId),
            this.roomRepository.findByUuid(input.roomId)
        ]);
        if (!guest) throw new Error("Guest not found");
        if (!room) throw new Error("Room not found");

        const hasConflict = await this.reservationRepository.hasConflict(
            input.roomId, new ReservationPeriod(input.checkInDate, input.checkOutDate)
        );
        if (hasConflict) throw new Error("The room is already booked for the selected period");
        const reservation = Reservation.create(input.roomId, input.guestId, input.checkInDate, input.checkOutDate);
        await this.reservationRepository.save(reservation);

        // Qual o problema? - O código acima pode ser ineficiente se houver muitos eventos, pois cada publicação é feita de forma sequencial, esperando a conclusão de cada uma antes de iniciar a próxima. Isso pode levar a um tempo total de execução significativamente maior, especialmente se o EventBus tiver latência ou se os handlers dos eventos realizarem operações demoradas.
        // Como resolver? - Para melhorar a eficiência, podemos publicar os eventos de forma paralela usando Promise.all. Isso permite que todas as publicações sejam iniciadas ao mesmo tempo, reduzindo o tempo total de execução.
        // const events = reservation.getDomainEvents();
        // for (const event of events) {
        //     await this.eventBus.publish(event);
        // }
        await Promise.all(reservation.getDomainEvents().map(event => this.eventBus.publish(event)));

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