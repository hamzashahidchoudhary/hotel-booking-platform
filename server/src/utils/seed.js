import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

const SAMPLE_IMAGE = {
  url: "https://res.cloudinary.com/demo/image/upload/v1690000000/sample-room.jpg",
  publicId: "sample-room-placeholder",
};

const seedData = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Property.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log("Creating users...");
  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin1234",
    role: "admin",
    isVerified: true,
  });

  const host1 = await User.create({
    name: "Sarah Mitchell",
    email: "host1@example.com",
    password: "Host1234",
    role: "host",
    isVerified: true,
    phone: "+1-555-0101",
  });

  const host2 = await User.create({
    name: "Carlos Rivera",
    email: "host2@example.com",
    password: "Host1234",
    role: "host",
    isVerified: true,
    phone: "+1-555-0102",
  });

  const guest1 = await User.create({
    name: "Emma Johnson",
    email: "guest1@example.com",
    password: "Guest1234",
    role: "user",
    isVerified: true,
  });

  const guest2 = await User.create({
    name: "Liam Patel",
    email: "guest2@example.com",
    password: "Guest1234",
    role: "user",
    isVerified: true,
  });

  console.log("Creating properties...");
  const propertiesData = [
    {
      host: host1._id,
      title: "Sunny Downtown Loft with City Views",
      description:
        "A bright, modern loft in the heart of downtown. Walking distance to restaurants, cafes, and nightlife. Floor-to-ceiling windows offer stunning city views, perfect for both business travelers and couples exploring the city.",
      propertyType: "apartment",
      pricePerNight: 120,
      cleaningFee: 35,
      maxGuests: 4,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      location: {
        address: "123 Main St",
        city: "Austin",
        state: "TX",
        country: "USA",
        zipCode: "78701",
        coordinates: { type: "Point", coordinates: [-97.7431, 30.2672] },
      },
      amenities: ["wifi", "air_conditioning", "kitchen", "tv", "workspace", "elevator"],
      images: [SAMPLE_IMAGE, SAMPLE_IMAGE],
      cancellationPolicy: "moderate",
      ratingsAverage: 4.7,
      ratingsCount: 2,
    },
    {
      host: host1._id,
      title: "Beachfront Villa with Private Pool",
      description:
        "Escape to this stunning beachfront villa featuring a private infinity pool, direct beach access, and panoramic ocean views. Ideal for families or groups looking for a luxurious tropical getaway.",
      propertyType: "villa",
      pricePerNight: 350,
      cleaningFee: 80,
      maxGuests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
      location: {
        address: "45 Ocean Drive",
        city: "Miami",
        state: "FL",
        country: "USA",
        zipCode: "33139",
        coordinates: { type: "Point", coordinates: [-80.13, 25.7907] },
      },
      amenities: ["wifi", "pool", "parking", "air_conditioning", "kitchen", "beach_access", "hot_tub"],
      images: [SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE],
      cancellationPolicy: "strict",
      ratingsAverage: 4.9,
      ratingsCount: 1,
    },
    {
      host: host2._id,
      title: "Cozy Mountain Cabin Retreat",
      description:
        "Nestled in the woods, this charming cabin offers a peaceful retreat with a stone fireplace, hot tub, and hiking trails right outside your door. Perfect for a romantic getaway or a quiet workcation.",
      propertyType: "cabin",
      pricePerNight: 95,
      cleaningFee: 25,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      location: {
        address: "78 Pine Ridge Rd",
        city: "Asheville",
        state: "NC",
        country: "USA",
        zipCode: "28801",
        coordinates: { type: "Point", coordinates: [-82.5515, 35.5951] },
      },
      amenities: ["wifi", "fireplace", "hot_tub", "parking", "heating", "pet_friendly"],
      images: [SAMPLE_IMAGE, SAMPLE_IMAGE],
      cancellationPolicy: "flexible",
      ratingsAverage: 4.5,
      ratingsCount: 1,
    },
    {
      host: host2._id,
      title: "Boutique Hotel Room - Historic District",
      description:
        "Stay in a beautifully restored boutique hotel located in the historic district. Includes breakfast, concierge service, and easy access to museums, galleries, and the old town square.",
      propertyType: "hotel",
      pricePerNight: 180,
      cleaningFee: 0,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      location: {
        address: "12 Heritage Square",
        city: "Charleston",
        state: "SC",
        country: "USA",
        zipCode: "29401",
        coordinates: { type: "Point", coordinates: [-79.9311, 32.7765] },
      },
      amenities: ["wifi", "breakfast", "air_conditioning", "tv", "elevator", "gym"],
      images: [SAMPLE_IMAGE, SAMPLE_IMAGE],
      cancellationPolicy: "moderate",
      ratingsAverage: 0,
      ratingsCount: 0,
    },
  ];

  const properties = await Property.insertMany(propertiesData);

  console.log("Creating sample bookings...");
  const pastCheckIn = new Date();
  pastCheckIn.setDate(pastCheckIn.getDate() - 20);
  const pastCheckOut = new Date();
  pastCheckOut.setDate(pastCheckOut.getDate() - 15);

  const completedBooking1 = await Booking.create({
    property: properties[0]._id,
    guest: guest1._id,
    host: host1._id,
    checkIn: pastCheckIn,
    checkOut: pastCheckOut,
    nights: 5,
    guestsCount: { adults: 2, children: 0, infants: 0 },
    priceBreakdown: {
      pricePerNight: 120,
      subtotal: 600,
      cleaningFee: 35,
      serviceFee: 60,
      total: 695,
      currency: "USD",
    },
    status: "completed",
    reviewEligible: true,
    reviewed: true,
    payment: { paidAt: pastCheckIn },
  });

  const completedBooking2 = await Booking.create({
    property: properties[1]._id,
    guest: guest2._id,
    host: host1._id,
    checkIn: pastCheckIn,
    checkOut: pastCheckOut,
    nights: 5,
    guestsCount: { adults: 4, children: 2, infants: 0 },
    priceBreakdown: {
      pricePerNight: 350,
      subtotal: 1750,
      cleaningFee: 80,
      serviceFee: 175,
      total: 2005,
      currency: "USD",
    },
    status: "completed",
    reviewEligible: true,
    reviewed: true,
    payment: { paidAt: pastCheckIn },
  });

  const futureCheckIn = new Date();
  futureCheckIn.setDate(futureCheckIn.getDate() + 14);
  const futureCheckOut = new Date();
  futureCheckOut.setDate(futureCheckOut.getDate() + 18);

  await Booking.create({
    property: properties[2]._id,
    guest: guest1._id,
    host: host2._id,
    checkIn: futureCheckIn,
    checkOut: futureCheckOut,
    nights: 4,
    guestsCount: { adults: 2, children: 0, infants: 0 },
    priceBreakdown: {
      pricePerNight: 95,
      subtotal: 380,
      cleaningFee: 25,
      serviceFee: 38,
      total: 443,
      currency: "USD",
    },
    status: "confirmed",
    payment: { paidAt: new Date() },
  });

  console.log("Creating sample reviews...");
  await Review.create({
    property: properties[0]._id,
    booking: completedBooking1._id,
    guest: guest1._id,
    ratings: { overall: 5, cleanliness: 5, accuracy: 5, communication: 5, location: 4, value: 5 },
    comment:
      "Absolutely loved this place! The views were incredible and Sarah was a fantastic host, very responsive and helpful throughout our stay.",
    hostReply: {
      comment: "Thank you so much, Emma! You're welcome back anytime.",
      repliedAt: new Date(),
    },
  });

  await Review.create({
    property: properties[1]._id,
    booking: completedBooking2._id,
    guest: guest2._id,
    ratings: { overall: 4.9, cleanliness: 5, accuracy: 5, communication: 5, location: 5, value: 4 },
    comment:
      "The villa exceeded our expectations. The pool and beach access were perfect for our family. Would definitely book again.",
  });

  console.log("\n✅ Seed data created successfully!\n");
  console.log("Demo accounts (all use the listed password):");
  console.log("  Admin:  admin@example.com   / Admin1234");
  console.log("  Host:   host1@example.com   / Host1234");
  console.log("  Host:   host2@example.com   / Host1234");
  console.log("  Guest:  guest1@example.com  / Guest1234");
  console.log("  Guest:  guest2@example.com  / Guest1234\n");

  await mongoose.connection.close();
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
