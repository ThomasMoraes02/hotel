import Cpf from "../../src/domain/value-objects/Cpf";

test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("should test a valid cpf: %s", (cpf: string) => {
    const document = new Cpf(cpf);
    expect(document).toBeDefined();
});

test.each([
    null,
    undefined,
    "11111111111",
    "111",
    "1111111111111111",
])("should test an invalid cpf: %s", (cpf: any) => {
    expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"));
});