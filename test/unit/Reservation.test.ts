import Reservation from "../../src/domain/entities/Reservation";
import ReservationPeriod from "../../src/domain/value-objects/ReservationPeriod";
import Uuid from "../../src/domain/value-objects/Uuid";

let roomId: Uuid;
let guestId: Uuid;

beforeEach(() => {
    roomId = Uuid.create();
    guestId = Uuid.create();
});

describe("Reservation Entity", () => {
    it("Should create a reservation with valid data", () => {
        const checkIn = new Date("2026-08-01");
        const checkOut = new Date("2026-08-05");
        const reservation = Reservation.create(roomId.getValue(), guestId.getValue(), checkIn, checkOut);
        
        expect(reservation.getUuid()).toBeDefined();
        expect(reservation.getRoomId()).toBe(roomId.getValue());
        expect(reservation.getGuestId()).toBe(guestId.getValue());
        expect(reservation.getTotalNights()).toBe(4);
    });

    it("Should throw an error if check-out date is before check-in date", () => {
        const checkIn = new Date("2026-08-05");
        const checkOut = new Date("2026-08-01");
        expect(() => Reservation.create(roomId.getValue(), guestId.getValue(), checkIn, checkOut)).toThrow(new Error("Check-out date must be after check-in date."));
    });
});