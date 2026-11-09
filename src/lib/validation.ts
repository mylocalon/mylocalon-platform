import { z } from "zod";

const email = z.string().trim().email().max(254);
const name = z.string().trim().min(1).max(64);

export const signupSchema = z.object({ email, password: z.string().min(10).max(200) }).strict();
export const loginSchema = z.object({ email, password: z.string().min(1).max(200) }).strict();
export const createKeySchema = z.object({ name }).strict();
export const createProjectSchema = z.object({ name }).strict();
export const reserveSchema = z.object({ name: z.string().trim().min(1).max(63), projectId: z.string().max(64).optional() }).strict();
export const deviceStartSchema = z.object({ clientName: z.string().trim().min(1).max(100).default("mylocalon CLI") }).strict();
export const devicePollSchema = z.object({ deviceCode: z.string().min(20).max(200) }).strict();
export const deviceDecideSchema = z.object({ userCode: z.string().min(8).max(16), approve: z.boolean() }).strict();
export const tokenRequestSchema = z.object({ ttlSec: z.number().int().min(60).max(3600).optional() }).strict();

export const tunnelEventsSchema = z
  .object({
    events: z
      .array(
        z
          .object({
            tunnelId: z.string().min(1).max(64),
            userId: z.string().min(1).max(64),
            subdomain: z.string().min(1).max(63),
            event: z.enum(["connected", "resumed", "disconnected", "closed"]),
            meta: z.record(z.unknown()).optional(),
            at: z.number().int().positive(),
          })
          .strict(),
      )
      .max(500),
  })
  .strict();
