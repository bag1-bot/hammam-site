import { z } from "zod";

export const callbackSchema = z.object({
  type: z.literal("callback"),
  name: z.string().min(1).max(120),
  phone: z.string().min(5).max(40),
  locale: z.string().min(2).max(5).default("en"),
});

export const bookingSchema = z.object({
  type: z.literal("booking"),
  name: z.string().min(1).max(120),
  phone: z.string().min(5).max(40),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  hammamId: z.string().min(1),
  slotId: z.string().optional(),
  preferredAt: z.string().datetime().optional(),
  message: z.string().max(1000).optional(),
  locale: z.string().min(2).max(5).default("en"),
});

export const inquirySchema = z.discriminatedUnion("type", [
  callbackSchema,
  bookingSchema,
]);

export type InquiryInput = z.infer<typeof inquirySchema>;

export const hammamSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  name: z.object({
    en: z.string().min(1),
    ru: z.string().min(1),
    zh: z.string().min(1),
    pt: z.string().min(1),
  }),
  address: z.object({
    en: z.string().min(1),
    ru: z.string().min(1),
    zh: z.string().min(1),
    pt: z.string().min(1),
  }),
  description: z.object({
    en: z.string().default(""),
    ru: z.string().default(""),
    zh: z.string().default(""),
    pt: z.string().default(""),
  }),
  photos: z.array(z.string()).default([]),
  tripadvisorRating: z.number().min(0).max(5).nullable().optional(),
  tripadvisorUrl: z
    .union([z.string().url(), z.literal(""), z.null()])
    .optional(),
  price: z.coerce.number().positive(),
  currency: z.string().min(3).max(3).default("EUR"),
  isPublished: z.boolean().default(false),
});

export const slotSchema = z.object({
  hammamId: z.string().min(1),
  startsAt: z.string().datetime(),
  durationMin: z.number().int().min(30).default(30),
  isActive: z.boolean().default(true),
});

export const slotBulkSchema = z.object({
  hammamId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  durationMin: z.number().int().min(30).default(30),
});
