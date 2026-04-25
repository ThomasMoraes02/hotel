import Room from "../entities/Room";

export default interface RoomRepository {
    save(room: Room): Promise<void>;
    findByUuid(uuid: string): Promise<Room | null>;
    findByNumber(number: number): Promise<Room | null>;
}