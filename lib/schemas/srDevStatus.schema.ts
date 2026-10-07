// src/lib/schemas/srDevStatus.schema.ts
import { PHASE_PERCENTAGE_RANGES } from "@/lib/constants/srDevStatus.constants";
import { DevCategory, DevPhase } from "@/lib/types/srdevstatus";
import * as z from "zod";

export const devCategoryEnum = Object.values(DevCategory);
export const devPhaseEnum = Object.values(DevPhase);

export const srDevStatusSchema = z
  .object({
    srDevStatName: z
      .string()
      .min(2, "Status name must be at least 2 characters")
      .max(100, "Status name too long"),

    srDevStatCode: z
      .string()
      .min(2, "Status code must be at least 2 characters")
      .max(20, "Status code too long")
      .transform((val) => val.toUpperCase()),

    devCategory: z.enum(devCategoryEnum as [string, ...string[]]),

    devPhase: z.nativeEnum(DevPhase),

    description: z.string().max(500, "Description too long").optional(),

    sequence: z
      .union([z.number().min(1, "Sequence must be at least 1"), z.string()])
      .transform((val) => Number(val))
      .default(1),

    isActive: z.boolean().default(true),

    isDefault: z.boolean().default(false),

    colorCode: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code")
      .default("#808080"),

    icon: z.string().max(50, "Icon name too long").optional(),

    percentageComplete: z
      .union([z.number().min(0).max(100), z.string()])
      .transform((val) => Number(val))
      .refine((val) => val >= 0 && val <= 100, {
        message: "Percentage must be between 0 and 100",
      })
      .default(0),

    requiresDocumentation: z.boolean().default(false),

    allowedTransitions: z.array(z.string()).optional(),

    estimatedDurationDays: z
      .union([z.number().min(0, "Duration cannot be negative"), z.string()])
      .transform((val) => Number(val))
      .optional()
      .default(0),
  })
  .refine(
    (data) => {
      const range = PHASE_PERCENTAGE_RANGES[data.devPhase as DevPhase];
      if (!range) return true;
      if (data.percentageComplete == null) return true;
      return (
        data.percentageComplete >= range.min &&
        data.percentageComplete <= range.max
      );
    },
    {
      message: "Percentage is not valid for the selected phase",
      path: ["percentageComplete"],
    },
  );

export const statusTransitionSchema = z.object({
  currentStatusId: z.string().min(1, "Current status is required"),
  targetStatusId: z.string().min(1, "Target status is required"),
  projectId: z.string().optional(),
  remarks: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

export const bulkUpdateSchema = z.object({
  statusIds: z.array(z.string()).min(1, "At least one status is required"),
  field: z.enum(["isActive", "requiresDocumentation"]),
  value: z.boolean(),
});

export const projectProgressSchema = z.object({
  statusIds: z.array(z.string()).min(1, "At least one status is required"),
});

export type SrDevStatusFormData = z.infer<typeof srDevStatusSchema>;
export type StatusTransitionData = z.infer<typeof statusTransitionSchema>;
export type BulkUpdateData = z.infer<typeof bulkUpdateSchema>;
export type ProjectProgressData = z.infer<typeof projectProgressSchema>;
