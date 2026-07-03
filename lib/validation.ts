import { z } from "zod";

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
  description: z.string().trim().max(240).default(""),
  measurement: z.string().trim().min(2).max(40),
  maxValue: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined))
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
