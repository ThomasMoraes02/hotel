import CreateReservation from "../../../src/application/usecases/CreateReservation";
import Guest from "../../../src/domain/entities/Guest";
import Room from "../../../src/domain/entities/Room";
import GuestRepository from "../../../src/domain/repositories/GuestRepository";
import ReservationRepository from "../../../src/domain/repositories/ReservationRepository";
import RoomRepository from "../../../src/domain/repositories/RoomRepository";
import GuestRepositoryMemory from "../../../src/infra/repositories/GuestRepositoryMemory";
import ReservationRepositoryMemory from "../../../src/infra/repositories/ReservationRepositoryMemory";
import RoomRepositoryMemory from "../../../src/infra/repositories/RoomRepositoryMemory";

let reservationRepository: ReservationRepository;
let roomRepository: RoomRepository;
let guestRepository: GuestRepository;
let createReservationUseCase: CreateReservation;    
let guest: Guest;
let room: Room;

beforeEach(() => {
    reservationRepository = new ReservationRepositoryMemory();
    roomRepository = new RoomRepositoryMemory();
    guestRepository = new GuestRepositoryMemory();
    createReservationUseCase = new CreateReservation(reservationRepository, roomRepository, guestRepository);

    guest = Guest.create("John Doe", "johndoe@gmail.com", "123.456.789-09", "password123");
    guestRepository.save(guest);

    room = Room.create(101, 2, 100, "available");
    roomRepository.save(room);
});

it("Should create a reservation", async () => {
    const input = {
        guestId: guest.getUuid(),
        roomId: room.getUuid(),
        checkInDate: new Date("2026-07-01"),
        checkOutDate: new Date("2026-07-05")
    };
    const output = await createReservationUseCase.execute(input);
    expect(output).toHaveProperty("id");
});

it("Should not create a reservation if guest does not exist", async () => {
    const input = {
        guestId: "non-existing-guest-id",
        roomId: room.getUuid(),
        checkInDate: new Date("2026-07-01"),
        checkOutDate: new Date("2026-07-05")
    };
    await expect(createReservationUseCase.execute(input)).rejects.toThrow("Guest not found");
});

it("Should not create a reservation if room does not exist", async () => {
    const input = {
        guestId: guest.getUuid(),
        roomId: "non-existing-room-id",
        checkInDate: new Date("2026-07-01"),
        checkOutDate: new Date("2026-07-05")
    };
    await expect(createReservationUseCase.execute(input)).rejects.toThrow("Room not found");
});

it("Should not create a reservation if there is a conflict", async () => {
    const existingReservationInput = {
        guestId: guest.getUuid(),
        roomId: room.getUuid(),
        checkInDate: new Date("2026-07-01"),
        checkOutDate: new Date("2026-07-05")
    };
    await createReservationUseCase.execute(existingReservationInput);

    const conflictingReservationInput = {
        guestId: guest.getUuid(),
        roomId: room.getUuid(),
        checkInDate: new Date("2026-07-01"),
        checkOutDate: new Date("2026-07-05")
    };
    await expect(createReservationUseCase.execute(conflictingReservationInput)).rejects.toThrow(new Error("The room is already booked for the selected period"));
});