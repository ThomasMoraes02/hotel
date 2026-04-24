import Uuid from "../value-objects/Uuid";

export default class Room {
    constructor(
        readonly uuid: Uuid,
        readonly number: number,
        readonly capacity: number,
        readonly pricePerNight: number,
        private status: "available" | "occupied"
    ) {}
    
    static create(number: number, capacity: number, pricePerNight: number, status: string): Room {
        const uuid = Uuid.create();
        return new Room(uuid, number, capacity, pricePerNight, status as "available" | "occupied");
    }

    getUuid(): string {
        return this.uuid.getValue();
    }

    getStatus(): string {
        return this.status;
    }

    occupy(): void {
        if (this.status === "occupied") throw new Error("Room is already occupied");
        this.status = "occupied";
    }

    available(): void {
        if (this.status === "available") throw new Error("Room is already available");
        this.status = "available";
    }
}