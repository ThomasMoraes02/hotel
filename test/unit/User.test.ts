import User from "../../src/domain/entities/User";

it('should create an user', () => {
    const user = User.create("John Doe", "johndoe@gmail.com", "123.456.789-09", "password123");
    expect(user).toBeInstanceOf(User);
    expect(user.getUuid()).toBeDefined();
    expect(user.getEmail()).toBe("johndoe@gmail.com");
    expect(user.getDocument()).toBe("123.456.789-09");
    expect(user.getPassword()).toBe("password123");
});