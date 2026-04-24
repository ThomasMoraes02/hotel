import Room from "../entities/Room";
import Uuid from "../value-objects/Uuid";

export default interface RoomRepository {
    save(room: RoomRepository): Promise<void>;
    findByUuid(uuid: Uuid): Promise<Room | null>;
}