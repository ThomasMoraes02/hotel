CREATE SCHEMA IF NOT EXISTS hotel;

CREATE TABLE hotel.guests (
    guest_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    document TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE hotel.rooms (
    room_id UUID PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE hotel.reservations (
    reservation_id UUID PRIMARY KEY,
    room_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES hotel.rooms(room_id),
    FOREIGN KEY (guest_id) REFERENCES hotel.guests(guest_id)
);