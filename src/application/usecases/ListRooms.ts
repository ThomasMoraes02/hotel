import Room from "../../domain/entities/Room";
import RoomRepository from "../../domain/repositories/RoomRepository";
import { inject } from "../../infra/di/Registry";

export default class ListRooms {
    @inject("RoomRepository")
    private roomRepository!: RoomRepository;

    async execute(): Promise<Output> {
        const rooms = await this.roomRepository.list();
        if (!rooms) throw new Error("No rooms found");
        return {
            rooms: rooms.map((room: Room) => ({
                id: room.getUuid(),
                number: room.getNumber(),
                capacity: room.getCapacity(),
                pricePerNight: room.getPricePerNight(),
                status: room.getStatus()
            }))
        }
    }
}

type Output = {
    rooms: {
        id: string;
        number: number;
        capacity: number;
        pricePerNight: number;
        status: string;
    }[];
}