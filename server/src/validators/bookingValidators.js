import { z } from "zod";

export const createBookingSchema = z.object({
  property: z.string().min(1, "Property ID is required"),
  checkIn: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid check-in date"),
  checkOut: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid check-out date"),
  guestsCount: z.object({
    adults: z.coerce.number().int().min(1),
    children: z.coerce.number().int().min(0).optional().default(0),
    infants: z.coerce.number().int().min(0).optional().default(0),
  }),
  guestNote: z.string().max(500).optional().default(""),
});

export const cancelBookingSchema = z.object({
  cancellationReason: z.string().trim().min(3).max(500),
});

export const createReviewSchema = z.object({
  booking: z.string().min(1, "Booking ID is required"),
  ratings: z.object({
    overall: z.coerce.number().min(1).max(5),
    cleanliness: z.coerce.number().min(1).max(5).optional(),
    accuracy: z.coerce.number().min(1).max(5).optional(),
    communication: z.coerce.number().min(1).max(5).optional(),
    location: z.coerce.number().min(1).max(5).optional(),
    value: z.coerce.number().min(1).max(5).optional(),
  }),
  comment: z.string().trim().min(10, "Review must be at least 10 characters").max(2000),
});

export const hostReplySchema = z.object({
  comment: z.string().trim().min(3).max(1000),
});
