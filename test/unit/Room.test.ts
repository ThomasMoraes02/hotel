import Room from "../../src/domain/entities/Room";

it("should create a room", () => {
    const room = Room.create(101, 1, 55, "available");
    expect(room).toBeInstanceOf(Room);
    expect(room.getUuid()).toBeDefined();
    expect(room.number).toBe(101);
    expect(room.capacity).toBe(1);
    expect(room.pricePerNight).toBe(55);
    expect(room.getStatus()).toBe("available");
});

it("should occupy a room", () => {
    const room = Room.create(101, 1, 55, "available");
    room.occupy();
    expect(room.getStatus()).toBe("occupied");
});

it("should not occupy an already occupied room", () => {
    const room = Room.create(101, 1, 55, "available");
    room.occupy();
    expect(() => room.occupy()).toThrow("Room is already occupied");
});

it("should make a room available", () => {
    const room = Room.create(101, 1, 55, "available");
    room.occupy();
    room.available();
    expect(room.getStatus()).toBe("available");
});

it("should not make an already available room available", () => {
    const room = Room.create(101, 1, 55, "available");
    expect(() => room.available()).toThrow("Room is already available");
});