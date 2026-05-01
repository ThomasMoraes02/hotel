import 'dotenv/config';
import Registry from "../../../src/infra/di/Registry";
import ListRooms from '../../../src/application/usecases/ListRooms';
import RoomRepositoryMemory from '../../../src/infra/repositories/RoomRepositoryMemory';
import RoomRepository from '../../../src/domain/repositories/RoomRepository';
import Room from '../../../src/domain/entities/Room';

let roomRepository: RoomRepository;
let listRooms: ListRooms;

beforeEach(() => {
    listRooms = new ListRooms();
    roomRepository = new RoomRepositoryMemory();
    Registry.getInstance().provide("RoomRepository", roomRepository);
});

it("Should throw an error if no rooms are found", async () => {
   expect(async () => await listRooms.execute()).rejects.toThrow(new Error("No rooms found"));
});

it("Should list all rooms", async () => {
    for (let i = 1; i <= 5; i++) {
        const room = Room.create(i*2, i++, i*100, 'available');
        await roomRepository.save(room);
    }
    const output = await listRooms.execute();
    expect(output.rooms.length).toBeGreaterThan(0);
    expect(output.rooms).toEqual(expect.arrayContaining([
        expect.objectContaining({
            id: expect.any(String),
            number: expect.any(Number),
            capacity: expect.any(Number),
            pricePerNight: expect.any(Number),
            status: expect.any(String)
        })
    ]));
});

it("Should list rooms filtered by status", async () => {
    const availableRoom = Room.create(102, 2, 150, "available");
    const occupiedRoom = Room.create(103, 4, 250, "occupied");

    await roomRepository.save(availableRoom);
    await roomRepository.save(occupiedRoom);

    const output = await listRooms.execute({ status: "available" });

    expect(output.rooms).toHaveLength(1);
    expect(output.rooms).toEqual([
        {
            id: availableRoom.getUuid(),
            number: availableRoom.getNumber(),
            capacity: availableRoom.getCapacity(),
            pricePerNight: availableRoom.getPricePerNight(),
            status: "available"
        }
    ]);
});
