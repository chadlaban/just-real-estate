import { z } from "zod";

export const propertySchema = z.object({
  formatted_address: z.string().min(1, "Formatted address is required"),
  address_line1: z.string().min(1, "Address Line 1 is required"),
  address_line2: z.string().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip_code: z.number(),
  county: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  property_type: z.string().nullable(),
  bedrooms: z.number().nullable(),
  bathrooms: z.number().nullable(),
  square_footage: z.number().nullable(),
  lot_size: z.number().nullable(),
  year_built: z.number().nullable(),
  assessor_id: z.string().nullable(),
  legal_description: z.string().nullable(),
  subdivision: z.string().nullable(),
  last_sale_date: z.string().nullable(),
  created_by: z.string().default("Guest"),
});
