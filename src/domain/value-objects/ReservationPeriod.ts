export default class ReservationPeriod {
    constructor(readonly checkIn: Date, readonly checkOut: Date) {
        if (checkIn >= checkOut) throw new Error("Check-out date must be after check-in date.");
    }

    getTotalNights(): number {
        const millisecondsPerNight = 1000 * 60 * 60 * 24;
        const totalNights = (this.checkOut.getTime() - this.checkIn.getTime()) / millisecondsPerNight;
        return Math.ceil(totalNights);
    }
}