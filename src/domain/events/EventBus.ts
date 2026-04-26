import DomainEvent from "./DomainEvent";
import EventHandler from "./EventHandler";

export default interface EventBus {
    publish(event: DomainEvent): Promise<void>;
    subscribe(eventName: string, handler: EventHandler): void;
}