import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color.");
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => !value || /^https?:\/\//i.test(value), "Use an http or https URL.");

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200)
});

export const createLeaderboardSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240).default(""),
  measurement: z.string().trim().min(2).max(40).default("Score"),
  maxValue: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  managerPassword: z.string().min(8).max(200)
});

export const entrySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(80),
  value: z.coerce.number().int().min(-999999).max(999999),
  note: z.string().trim().max(120).default("")
});

export const adjustmentSchema = z.object({
  id: z.string().min(1),
  delta: z.coerce.number().int().min(-999999).max(999999)
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240).default(""),
  measurement: z.string().trim().min(2).max(40),
  maxValue: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  primaryColor: hexColor.default("#1a2b4d"),
  accentColor: hexColor.default("#355c9c"),
  textColor: hexColor.default("#f8fafc"),
  headerImageUrl: optionalUrl.default(""),
  headerImageFit: z.enum(["cover", "contain"]).default("cover"),
  compactView: z.preprocess((value) => value === "on" || value === "true" || value === "1", z.boolean()),
  gradientBackground: z.preprocess((value) => value === "on" || value === "true" || value === "1", z.boolean())
});

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1).max(200),
    newPassword: z.string().min(8).max(200),
    confirmPassword: z.string().min(8).max(200)
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"]
  });
