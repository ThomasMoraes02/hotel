import { GetReservationQueryOutput } from "../../../application/queries/GetReservationQueryHandler";

export default interface ReservationQueryRepository {
    getReservationView(id: string): Promise<GetReservationQueryOutput | null>;
}