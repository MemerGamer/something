import { db } from '../db/db.js';
import { RequestTypeTable } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export class RequestTypeRepository {
  /**
   * Create a new type change request
   */
  public async createRequest(userId: string, requestedType: 'user' | 'organization') {
    return db
      .insert(RequestTypeTable)
      .values({
        userId,
        type: requestedType,
        approved: false
      })
      .returning();
  }

  /**
   * Check if user already has a pending request
   */
  public async hasPendingRequest(userId: string) {
    const [request] = await db
      .select()
      .from(RequestTypeTable)
      .where(and(eq(RequestTypeTable.userId, userId), eq(RequestTypeTable.approved, false)))
      .limit(1);

    return !!request;
  }
}
