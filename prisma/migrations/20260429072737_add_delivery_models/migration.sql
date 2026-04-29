-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'VAN', 'BUS', 'PLANE', 'TRAIN', 'OTHER');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'FULL', 'DEPARTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('PASSENGER', 'PARCEL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "courierId" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3),
    "vehicleType" "VehicleType" NOT NULL DEFAULT 'CAR',
    "passengerSeatsOffered" INTEGER NOT NULL DEFAULT 0,
    "parcelCapacityKg" INTEGER NOT NULL DEFAULT 0,
    "pricePerSeatCents" INTEGER,
    "pricePerKgCents" INTEGER,
    "notes" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "BookingType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "customerPhone" TEXT NOT NULL,
    "customerMessage" TEXT,
    "parcelDescription" TEXT,
    "pickupAddress" TEXT,
    "dropoffAddress" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trip_originCity_destinationCity_departureDate_idx" ON "Trip"("originCity", "destinationCity", "departureDate");

-- CreateIndex
CREATE INDEX "Trip_courierId_idx" ON "Trip"("courierId");

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "Trip"("status");

-- CreateIndex
CREATE INDEX "Booking_tripId_idx" ON "Booking"("tripId");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "CourierProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
