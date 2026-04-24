export default class Uuid {
    private value: string;

    constructor (value: string) {
        if (!this.isValid(value)) throw new Error("Invalid UUID");
        this.value = value;
    }

    static create() {
        const uuid = crypto.randomUUID();
        return new Uuid(uuid);
    }

    private isValid (value: string) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    }

    getValue () {
        return this.value;
    }
}