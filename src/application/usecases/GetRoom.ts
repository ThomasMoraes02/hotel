import RoomRepository from "../../domain/repositories/RoomRepository";
import { inject } from "../../infra/di/Registry";

export default class GetRoom {
    @inject("RoomRepository")
    private readonly roomRepository!: RoomRepository;

    async execute(input: Input): Promise<Output> {
        const room = await this.roomRepository.findByUuid(input.id);
        if (!room) throw new Error("Room not found");
        return {
            id: room.getUuid(),
            number: room.getNumber(),
            capacity: room.getCapacity(),
            pricePerNight: room.getPricePerNight(),
            status: room.getStatus()
        }
    }
}

type Input = {
    id: string
}

type Output = {
    id: string,
    number: number,
    capacity: number,
    pricePerNight: number,
    status: string
}
