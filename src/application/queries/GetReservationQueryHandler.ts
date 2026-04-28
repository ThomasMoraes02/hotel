import ReservationQueryRepository from "../../domain/repositories/queries/ReservationQueryRepository";
import { inject } from "../../infra/di/Registry";

export default class GetReservationQueryHandler {
    @inject("ReservationQueryRepository")
    private readonly reservationQueryRepository!: ReservationQueryRepository;

    async execute(input: Input): Promise<any> {
        const view = await this.reservationQueryRepository.getReservationView(input.id);
        if (!view) throw new Error("Reservation not found");
        return view;
    }
}

type Input = {
    id: string;
}

export type GetReservationQueryOutput = {
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    totalNights: number;
    totalPrice: number;
    status: string;
    room: {
        id: string;
        number: number;
        capacity: number;
        pricePerNight: number;
        status: string;
    }
    guest: {
        id: string;
        name: string;
        email: string;
        document: string;
    }
}