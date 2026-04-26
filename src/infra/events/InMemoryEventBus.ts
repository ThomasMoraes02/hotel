import DomainEvent from "../../domain/events/DomainEvent";
import EventBus from "../../domain/events/EventBus";
import EventHandler from "../../domain/events/EventHandler";

export default class InMemoryEventBus implements EventBus {
    private handlers: Map<string, EventHandler[]> = new Map();

    subscribe(eventName: string, handler: EventHandler): void {
        const handlers = this.handlers.get(eventName) || [];
        handlers.push(handler);
        this.handlers.set(eventName, handlers);
    }

    async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.getEventName()) || [];
        for (const handler of handlers) {
            await handler.handle(event);
        }
    }
}