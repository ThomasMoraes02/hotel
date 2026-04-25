export default abstract class DomainEvent {
    constructor(
        readonly occurredOn: Date = new Date(),
        readonly eventName: string = this.constructor.name
    ) { }

    abstract getEventName(): string;
}