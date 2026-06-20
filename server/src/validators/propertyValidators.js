import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().min(20).max(3000),
  propertyType: z.enum(["hotel", "apartment", "villa", "guesthouse", "resort", "cabin", "hostel"]),
  pricePerNight: z.coerce.number().positive("Price must be greater than 0"),
  cleaningFee: z.coerce.number().min(0).optional().default(0),
  maxGuests: z.coerce.number().int().min(1),
  bedrooms: z.coerce.number().int().min(0),
  beds: z.coerce.number().int().min(1),
  bathrooms: z.coerce.number().min(0.5),
  location: z.object({
    address: z.string().trim().min(3),
    city: z.string().trim().min(2),
    state: z.string().optional().default(""),
    country: z.string().trim().min(2),
    zipCode: z.string().optional().default(""),
    coordinates: z.object({
      coordinates: z
        .array(z.number())
        .length(2, "Coordinates must be [longitude, latitude]"),
    }),
  }),
  amenities: z.array(z.string()).optional().default([]),
  houseRules: z
    .object({
      checkInTime: z.string().optional(),
      checkOutTime: z.string().optional(),
      smokingAllowed: z.boolean().optional(),
      petsAllowed: z.boolean().optional(),
      partiesAllowed: z.boolean().optional(),
      additionalRules: z.string().optional(),
    })
    .optional(),
  cancellationPolicy: z.enum(["flexible", "moderate", "strict"]).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  guests: z.coerce.number().int().optional(),
  propertyType: z.string().optional(),
  amenities: z.string().optional(), // comma-separated
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  // Map bounds search
  swLat: z.coerce.number().optional(),
  swLng: z.coerce.number().optional(),
  neLat: z.coerce.number().optional(),
  neLng: z.coerce.number().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  search: z.string().optional(),
});
