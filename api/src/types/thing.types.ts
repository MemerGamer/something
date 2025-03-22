import { z } from '@hono/zod-openapi';
import { ThingAccessTable } from '../db/schema.js';

export const TimeModel = z.custom<string>((val) => {
  if (typeof val !== 'string') {
    return false;
  }

  // has to be in format: [0]0:[0]0
  if (!/^\d{1,2}:\d{1,2}$/.test(val)) {
    return false;
  }

  const [hour, minute] = val.split(':').map(Number);

  // hour has to be 0-23
  if (!(hour >= 0 && hour <= 23)) {
    return false;
  }

  // minute has to be 0-59
  if (!(minute >= 0 && minute <= 59)) {
    return false;
  }

  return true;
});

export const ScheduleDTO = z
  .object({
    startTime: TimeModel,
    endTime: TimeModel,
    repeat: z.enum(['once', 'daily', 'weekly']),
    specificDate: z.string().nullable().optional(),
    dayOfWeek: z
      .enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
      .nullable()
      .optional()
  })
  .superRefine((val, ctx) => {
    switch (val.repeat) {
      case 'once':
        if (!(typeof val.specificDate !== 'undefined' && typeof val.dayOfWeek === 'undefined')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `When \`repeat\` is 'once', only \`specificDate\` should be defined`,
            fatal: true
          });

          return z.NEVER;
        }
        break;
      case 'daily':
        if (!(typeof val.specificDate === 'undefined' && typeof val.dayOfWeek === 'undefined')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `When \`repeat\` is 'daily', \`specificDate\` and \`dayOfWeek\` should not be defined`,
            fatal: true
          });

          return z.NEVER;
        }
        break;
      case 'weekly':
        if (!(typeof val.specificDate === 'undefined' && typeof val.dayOfWeek !== 'undefined')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `When \`repeat\` is 'weekly', only \`dayOfWeek\` should be defined`,
            fatal: true
          });

          return z.NEVER;
        }
        break;
    }
  });
export type ScheduleDTO = z.infer<typeof ScheduleDTO>;

export const ThingDTO = z.object({
  name: z.string().min(3),
  description: z.string(),
  schedule: ScheduleDTO,
  sharedUsernames: z.string().array()
});
export type ThingDTO = z.infer<typeof ThingDTO>;

export const SocialThingDTO = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  schedule: z
    .object({
      startTime: TimeModel.optional(),
      endTime: TimeModel.optional(),
      specificDate: z.string().nullable().optional()
    })
    .optional(),
  visibility: z.enum(['public', 'private']),
  image: z.any().openapi({ format: 'binary' }).optional()
});
export type SocialThingDTO = z.infer<typeof SocialThingDTO>;

export const ThingCardModel = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().openapi({ description: 'This is actually the link to the image' }),
  username: z.string(),
  createdAt: z.string()
});
export type ThingCardModel = z.infer<typeof ThingCardModel>;

export const ThingDetailsModel = z.object({
  name: z.string(),
  description: z.string(),
  schedule: ScheduleDTO,
  sharedWith: z.string().array(),
  images: ThingCardModel.omit({
    id: true,
    name: true
  }).array(),
  visibility: z.enum(['public', 'private']).optional(),
  joinCode: z.string().optional(),
  access: z.enum(ThingAccessTable.role.enumValues)
});
export type ThingDetailsModel = z.infer<typeof ThingDetailsModel>;

export const ThingPreviewModel = z.object({
  id: z.string().uuid(),
  name: z.string(),
  streak: z.number(),
  startTime: z.string(),
  endTime: z.string()
});
export type ThingPreviewModel = z.infer<typeof ThingPreviewModel>;

export const SocialThingPreviewModel = z.object({
  id: z.string().uuid(),
  name: z.string(),
  userCount: z.number(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  coverImage: z.string(),
  notified: z.boolean(),
  joinCode: z.string().nullable(),
  hasAccess: z.boolean().nullable()
});
export type SocialThingPreviewModel = z.infer<typeof SocialThingPreviewModel>;
