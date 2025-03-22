import { except } from 'drizzle-orm/pg-core';
import { DrizzleDatabaseSession, DrizzleTransactionSession, db } from '../db/db.js';
import { BadgeDefinitionTable, BadgeTable } from '../db/schema.js';
import { InferInsertModel, and, eq, lte, sql } from 'drizzle-orm';

export class BadgeRepository {
  /**
   * @throws {Error}
   */
  public async getNextBadgeId(
    userId: string,
    actionType: Exclude<InferInsertModel<typeof BadgeDefinitionTable>['action'], undefined>,
    actionCount: number,
    tx: DrizzleDatabaseSession | DrizzleTransactionSession = db
  ) {
    const allPossibleBadges = tx
      .select({ id: BadgeDefinitionTable.id })
      .from(BadgeDefinitionTable)
      .where(and(eq(BadgeDefinitionTable.action, actionType), lte(BadgeDefinitionTable.action_count, actionCount)));

    const userEarnedBadges = tx
      .select({ id: BadgeTable.badgeDefinitionId })
      .from(BadgeTable)
      .where(eq(BadgeTable.userId, userId));

    const [nextBadge] = await except(allPossibleBadges, userEarnedBadges).limit(1);

    return nextBadge ? nextBadge.id : undefined;
  }

  /**
   * @throws {Error}
   */
  public async giveBadge(
    userId: string,
    badgeDefinitionId: string,
    tx: DrizzleDatabaseSession | DrizzleTransactionSession = db
  ) {
    return tx.insert(BadgeTable).values({ userId, badgeDefinitionId });
  }

  /**
   * @throws {Error}
   */
  public async getById(badgeDefinitionId: string, tx: DrizzleDatabaseSession | DrizzleTransactionSession = db) {
    return tx
      .select({
        icon: BadgeDefinitionTable.icon,
        name: BadgeDefinitionTable.name,
        description: BadgeDefinitionTable.description
      })
      .from(BadgeDefinitionTable)
      .where(eq(BadgeDefinitionTable.id, badgeDefinitionId));
  }

  /**
   * @throws {Error}
   */
  public async getTopBadges(userId: string) {
    return this.getUserBadges(userId, 3);
  }

  public async getUserBadges(userId: string, limit: number | undefined = undefined) {
    // First, get all badge definitions
    const allBadgeDefinitions = await db
      .select({
        id: BadgeDefinitionTable.id,
        icon: BadgeDefinitionTable.icon,
        name: BadgeDefinitionTable.name,
        description: BadgeDefinitionTable.description,
        action: BadgeDefinitionTable.action,
        actionCount: BadgeDefinitionTable.action_count
      })
      .from(BadgeDefinitionTable);

    // Then, get the badges that the user has earned
    const earnedBadges = await db
      .select({
        badgeDefinitionId: BadgeTable.badgeDefinitionId,
        createdAt: BadgeTable.createdAt
      })
      .from(BadgeTable)
      .where(eq(BadgeTable.userId, userId));

    // Get the user's current action counts
    const userActionCounts = await db
      .select({
        action: BadgeDefinitionTable.action,
        actionCount: sql`count(${BadgeDefinitionTable.action})`.as('actionCount')
      })
      .from(BadgeDefinitionTable)
      .leftJoin(BadgeTable, eq(BadgeTable.badgeDefinitionId, BadgeDefinitionTable.id))
      .where(eq(BadgeTable.userId, userId))
      .groupBy(BadgeDefinitionTable.action);

    // Create a map of user's action counts for quick lookup
    const userActionCountMap = new Map();
    userActionCounts.forEach((actionCount) => {
      userActionCountMap.set(actionCount.action, actionCount.actionCount);
    });

    // Create a map of earned badge definition IDs for quick lookup
    // In case of duplicates, keep the most recent one
    const earnedBadgeMap = new Map();
    earnedBadges.forEach((badge) => {
      const existing = earnedBadgeMap.get(badge.badgeDefinitionId);
      if (!existing || new Date(badge.createdAt) > new Date(existing.earnedAt)) {
        earnedBadgeMap.set(badge.badgeDefinitionId, {
          earned: true,
          earnedAt: badge.createdAt
        });
      }
    });

    // Combine the results - all badge definitions with earned status and progress
    // Each badge definition will appear exactly once
    let result = allBadgeDefinitions.map((badgeDef) => {
      const earnedInfo = earnedBadgeMap.get(badgeDef.id) || { earned: false };
      const userActionCount = userActionCountMap.get(badgeDef.action) || 0;
      const progress = Math.min(userActionCount / badgeDef.actionCount, 1);
      return {
        ...badgeDef,
        earned: earnedInfo.earned,
        earnedAt: earnedInfo.earnedAt,
        progress
      };
    });

    // Sort by earnedAt (descending) for earned badges, then by progress (descending) for non-earned badges
    result.sort((a, b) => {
      if (a.earned && b.earned) {
        return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
      } else if (a.earned) {
        return -1; // a is earned, b is not, so a comes first
      } else if (b.earned) {
        return 1; // b is earned, a is not, so b comes first
      } else {
        return b.progress - a.progress; // neither is earned, sort by progress descending
      }
    });

    // Apply limit if specified
    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }
}
