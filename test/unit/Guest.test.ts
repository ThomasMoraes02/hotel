import Guest from "../../src/domain/entities/Guest";

it('should create an guest', () => {
    const guest = Guest.create("John Doe", "johndoe@gmail.com", "123.456.789-09", "password123");
    expect(guest).toBeInstanceOf(Guest);
    expect(guest.getUuid()).toBeDefined();
    expect(guest.getEmail()).toBe("johndoe@gmail.com");
    expect(guest.getDocument()).toBe("123.456.789-09");
    expect(guest.getPassword()).toBe("password123");
});