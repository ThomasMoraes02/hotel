import Room from "../../domain/entities/Room";
import RoomRepository from "../../domain/repositories/RoomRepository";
import { inject } from "../../infra/di/Registry";

export default class CreateRoom {
    @inject("RoomRepository")
    private readonly roomRepository!: RoomRepository;
    
    async execute(input: Input): Promise<Output> {
        const roomExists = await this.roomRepository.findByNumber(input.number);
        if (roomExists) throw new Error("Room already exists with this number");
        const room = Room.create(input.number, input.capacity, input.pricePerNight, input.status);
        await this.roomRepository.save(room);
        return { id: room.getUuid() };
    }
}

type Input = {
    number: number, 
    capacity: number,
    pricePerNight: number,
    status: string
};

type Output = {
    id: string
};