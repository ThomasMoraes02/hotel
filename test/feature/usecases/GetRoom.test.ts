import GetRoom from "../../../src/application/usecases/GetRoom";
import Room from "../../../src/domain/entities/Room";
import RoomRepository from "../../../src/domain/repositories/RoomRepository";
import Registry from "../../../src/infra/di/Registry";
import RoomRepositoryMemory from "../../../src/infra/repositories/RoomRepositoryMemory";

let roomRepository: RoomRepository;
let getRoom: GetRoom;
let room: Room;

beforeEach(async () => {
    roomRepository = new RoomRepositoryMemory();
    Registry.getInstance().provide("RoomRepository", roomRepository);
    room = Room.create(101, 2, 150.00, "available");
    getRoom = new GetRoom();
    await roomRepository.save(room);
});

it("Should get a room by uuid", async () => {
    const output = await getRoom.execute({ id: room.getUuid() });
    expect(output).toEqual({
        id: room.getUuid(),
        number: room.getNumber(),
        capacity: room.getCapacity(),
        pricePerNight: room.getPricePerNight(),
        status: room.getStatus()
    });
});

it("Should throw an error if room not found", async () => {
    expect(() => getRoom.execute({ id: "non-existing-uuid" })).rejects.toThrow(new Error("Room not found"));
});
