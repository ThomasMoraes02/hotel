import Password from "../../src/domain/value-objects/Password";

it("should create a password", () => {
    const password = new Password("my_secure_password");
    expect(password.getValue()).toBe("my_secure_password");
});

it("should throw an error for a short password", () => {
    expect(() => new Password("short")).toThrow("Invalid password");
});