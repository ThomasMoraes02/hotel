import CancelReservation from "../../../src/application/usecases/CancelReservation";
import Guest from "../../../src/domain/entities/Guest";
import Reservation from "../../../src/domain/entities/Reservation";
import Room from "../../../src/domain/entities/Room";
import GuestRepository from "../../../src/domain/repositories/GuestRepository";
import ReservationRepository from "../../../src/domain/repositories/ReservationRepository";
import RoomRepository from "../../../src/domain/repositories/RoomRepository";
import Registry from "../../../src/infra/di/Registry";
import GuestRepositoryMemory from "../../../src/infra/repositories/GuestRepositoryMemory";
import ReservationRepositoryMemory from "../../../src/infra/repositories/ReservationRepositoryMemory";
import RoomRepositoryMemory from "../../../src/infra/repositories/RoomRepositoryMemory";

let reservationRepository: ReservationRepository;
let roomRepository: RoomRepository;
let guestRepository: GuestRepository;
let cancelReservationUseCase: CancelReservation;
let guest: Guest;
let room: Room;
let reservation: Reservation;

beforeEach(() => {
    reservationRepository = new ReservationRepositoryMemory();
    roomRepository = new RoomRepositoryMemory();
    guestRepository = new GuestRepositoryMemory();
    guest = Guest.create("John Doe", "johndoe@gmail.com", "123.456.789-09", "password123");
    guestRepository.save(guest);
    room = Room.create(101, 2, 100, "available");
    roomRepository.save(room);
    reservation = Reservation.create(room.getUuid(), guest.getUuid(), new Date("2026-07-01"), new Date("2026-07-05"));
    reservationRepository.save(reservation);
    Registry.getInstance().provide("ReservationRepository", reservationRepository);
    cancelReservationUseCase = new CancelReservation();
});

it("Should cancel a reservation", async () => {
    const input = {
        reservationId: reservation.getUuid(),
        reason: "Change of plans",
        cancelledBy: "guest" as const
    };
    await cancelReservationUseCase.execute(input);
    const cancelledReservation = await reservationRepository.findByUuid(reservation.getUuid());
    expect(cancelledReservation?.getStatus()).toBe("cancelled");
});

it("Should not cancel a non-existing reservation", async () => {
    const input = {
        reservationId: "non-existing-reservation-id",
        reason: "Change of plans",
        cancelledBy: "guest" as const
    };
    await expect(cancelReservationUseCase.execute(input)).rejects.toThrow("Reservation not found");
});

it("Should not cancel an already cancelled reservation", async () => {
    const input = {
        reservationId: reservation.getUuid(),
        reason: "Change of plans",
        cancelledBy: "guest" as const
    };
    await cancelReservationUseCase.execute(input);
    await expect(cancelReservationUseCase.execute(input)).rejects.toThrow("Reservation is already cancelled");
});