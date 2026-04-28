import { get } from "axios";
import GetGuest from "../../../src/application/usecases/GetGuest";
import Guest from "../../../src/domain/entities/Guest";
import GuestRepository from "../../../src/domain/repositories/GuestRepository";
import Registry from "../../../src/infra/di/Registry";
import GuestRepositoryMemory from "../../../src/infra/repositories/GuestRepositoryMemory";

let guestRepository: GuestRepository;
let getGuest: GetGuest;
let guest: Guest;

beforeEach(async () => {
    guestRepository = new GuestRepositoryMemory();
    Registry.getInstance().provide("GuestRepository", guestRepository);
    guest = Guest.create("John Doe", "johndoe@gmail.com", "12345678909", "password123");
    getGuest = new GetGuest();
    await guestRepository.save(guest);
});

it("Should get a guest by uuid", async () => {
    const output = await getGuest.execute({ id: guest.getUuid() });
    expect(output).toEqual({
        id: guest.getUuid(),
        name: guest.getName(),
        email: guest.getEmail(),
        document: guest.getDocument()
    });
});

it("Should throw an error if guest not found", async () => {
    expect(() => getGuest.execute({ id: "non-existing-uuid" })).rejects.toThrow(new Error("Guest not found"));
});