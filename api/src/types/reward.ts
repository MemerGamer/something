import { z } from '@hono/zod-openapi';

export const PointInfoModel = z.object({
  value: z.number(),
  reason: z.enum(['ON_SCHEDULE', 'OFF_SCHEDULE', 'STREAK_KEPT', 'SOCIAL'])
});
export type PointInfoModel = z.infer<typeof PointInfoModel>;

export const StreakInfoModel = z.object({
  value: z.number(),
  reset: z.boolean()
});
export type StreakInfoModel = z.infer<typeof StreakInfoModel>;

export const BadgeInfoModel = z.object({
  icon: z.string(),
  name: z.string(),
  description: z.string(),
  earned: z.boolean().optional()
});
export type BadgeInfoModel = z.infer<typeof BadgeInfoModel>;

export const LevelModel = z.object({
  name: z.string(),
  minThreshold: z.number()
});
export type LevelModel = z.infer<typeof LevelModel>;
export const LevelInfoModel = z.object({
  currentLevel: LevelModel,
  nextLevel: LevelModel,
  currentScore: z.number()
});
export type LevelInfoModel = z.infer<typeof LevelInfoModel>;

export const RewardInfoModel = z.object({
  points: PointInfoModel.array(),
  streak: StreakInfoModel.optional(),
  badge: BadgeInfoModel.optional(),
  level: LevelInfoModel
});
export type RewardInfoModel = z.infer<typeof RewardInfoModel>;
