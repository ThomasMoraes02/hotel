import DomainEvent from "../../domain/events/DomainEvent";
import EventHandler from "../../domain/events/EventHandler";

export default class SendEmailOnReservationCreated implements EventHandler {
    async handle(event: DomainEvent): Promise<void> {
        if (event.getEventName() === "ReservationCreated") {
            console.log(`Sending email for event: ${event.getEventName()} occurred on ${event.occurredOn.toISOString()}`);
        }
    }
}