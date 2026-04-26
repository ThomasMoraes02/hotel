import DomainEvent from "./DomainEvent";

export default interface EventHandler {
    handle(event: DomainEvent): Promise<void>;
}