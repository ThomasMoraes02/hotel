import CreateRoom from "../../../src/application/usecases/CreateRoom";
import RoomRepository from "../../../src/domain/repositories/RoomRepository";
import Registry from "../../../src/infra/di/Registry";
import RoomRepositoryMemory from "../../../src/infra/repositories/RoomRepositoryMemory";

let roomRepository: RoomRepository;
let createRoomUseCase: CreateRoom;

beforeEach(() => {
    roomRepository = new RoomRepositoryMemory();
    createRoomUseCase = new CreateRoom();
    Registry.getInstance().provide("RoomRepository", roomRepository);
});

it("Should create a new room", async () => {
    const input = {
        number: 101,
        capacity: 2,
        pricePerNight: 100,
        status: "available"
    };
    const output = await createRoomUseCase.execute(input);
    expect(output).toHaveProperty("id");
    const room = await roomRepository.findByUuid(output.id);
    expect(room).not.toBeNull();
    expect(room?.number).toBe(input.number);
    expect(room?.capacity).toBe(input.capacity);
    expect(room?.pricePerNight).toBe(input.pricePerNight);
    expect(room?.getStatus()).toBe(input.status);
});

it("Should not create a room with a number that already exists", async () => {
    const input1 = {
        number: 101,
        capacity: 2,
        pricePerNight: 100,
        status: "available"
    };
    await createRoomUseCase.execute(input1);

    const input2 = {
        number: 101,
        capacity: 3,
        pricePerNight: 150,
        status: "available"
    };
    expect(async () => await createRoomUseCase.execute(input2)).rejects.toThrow(new Error("Room already exists with this number"));
});