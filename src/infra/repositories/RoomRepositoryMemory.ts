import Room from "../../domain/entities/Room";
import RoomRepository from "../../domain/repositories/RoomRepository";

export default class RoomRepositoryMemory implements RoomRepository {
    private rooms: Room[] = [];

    async save(room: Room): Promise<void> {
        const index = this.rooms.findIndex(r => r.getUuid() === room.getUuid());
        if (index === -1) {
            this.rooms.push(room);
        } else {
            this.rooms[index] = room;
        }
    }

    async findByUuid(uuid: string): Promise<Room | null> {
        const room = this.rooms.find(r => r.getUuid() === uuid);
        return room || null;
    }

    async findByNumber(number: number): Promise<Room | null> {
        const room = this.rooms.find(r => r.number === number);
        return room || null;
    }

    async list(filter?: { status?: string }): Promise<Room[] | null> {
        const rooms = filter?.status
            ? this.rooms.filter(room => room.getStatus() === filter.status)
            : this.rooms;
        if (rooms.length === 0) return null;
        return rooms;
    }
}
