export default class Password {
    private value: string;

    constructor (value: string) {
        if (!this.isValid(value)) throw new Error("Invalid password");
        this.value = value;
    }

    private isValid(value: string): boolean {
        return value.length >= 6;
    }

    getValue () {
        return this.value;
    }
}