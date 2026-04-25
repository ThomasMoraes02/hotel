import CreateGuest from "../../../src/application/usecases/CreateGuest";
import Registry from "../../../src/infra/di/Registry";
import GuestRepositoryMemory from "../../../src/infra/repositories/GuestRepositoryMemory";

let guestRepository: GuestRepositoryMemory;
let createGuestUseCase: CreateGuest;

beforeEach(() => {
    guestRepository = new GuestRepositoryMemory();
    Registry.getInstance().provide("GuestRepository", guestRepository);
    createGuestUseCase = new CreateGuest();
});

it("Should create a new guest", async () => {
    const input = {
        "name": "John Doe",
        "email": "johndoe@gmail.com",
        "document": "123.456.789-09",
        "password": "password123"
    };
    const output = await createGuestUseCase.execute(input);
    expect(output).toHaveProperty("id");
    const guest = await guestRepository.findByUuid(output.id);
    expect(guest).not.toBeNull();
    expect(guest?.name).toBe(input.name);
    expect(guest?.getEmail()).toBe(input.email);
    expect(guest?.getDocument()).toBe(input.document);
});

it("Should not create a guest with an email that already exists", async () => {
    const input1 = {
        "name": "John Doe",
        "email": "johndoe@gmail.com",
        "document": "123.456.789-09",
        "password": "password123"
    };
    await createGuestUseCase.execute(input1);

    const input2 = {
        "name": "John Doe 2",
        "email": "johndoe@gmail.com",
        "document": "123.456.789-09",
        "password": "password123"
    };
    expect(async () => await createGuestUseCase.execute(input2)).rejects.toThrow(new Error("Guest already exists with this email"));
});