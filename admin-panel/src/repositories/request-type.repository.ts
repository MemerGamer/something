// src/repositories/requestType.repository.ts
import { db } from "../db/db.js";
import { RequestTypeTable, UserTable } from "../db/schema.js";
import { eq, sql, desc } from "drizzle-orm";

export class RequestTypeRepository {
  /**
   * Get all pending type change requests
   */
  public async getAllPendingRequests() {
    return db
      .select({
        requestId: RequestTypeTable.id,
        userId: RequestTypeTable.userId,
        username: UserTable.username,
        currentType: UserTable.type,
        requestedType: RequestTypeTable.type,
        createdAt: RequestTypeTable.createdAt,
      })
      .from(RequestTypeTable)
      .innerJoin(UserTable, eq(RequestTypeTable.userId, UserTable.id))
      .where(eq(RequestTypeTable.approved, false))
      .orderBy(desc(RequestTypeTable.createdAt));
  }

  /**
   * Get all approved type change requests
   */
  public async getAllApprovedRequests() {
    return db
      .select({
        requestId: RequestTypeTable.id,
        userId: RequestTypeTable.userId,
        username: UserTable.username,
        currentType: UserTable.type,
        requestedType: RequestTypeTable.type,
        createdAt: RequestTypeTable.createdAt,
      })
      .from(RequestTypeTable)
      .innerJoin(UserTable, eq(RequestTypeTable.userId, UserTable.id))
      .where(eq(RequestTypeTable.approved, true))
      .orderBy(desc(RequestTypeTable.createdAt));
  }

  /**
   * Get request by ID
   */
  public async getRequestById(requestId: string) {
    const [request] = await db
      .select({
        requestId: RequestTypeTable.id,
        userId: RequestTypeTable.userId,
        username: UserTable.username,
        currentType: UserTable.type,
        requestedType: RequestTypeTable.type,
        createdAt: RequestTypeTable.createdAt,
      })
      .from(RequestTypeTable)
      .innerJoin(UserTable, eq(RequestTypeTable.userId, UserTable.id))
      .where(eq(RequestTypeTable.id, requestId))
      .limit(1);

    return request;
  }

  /**
   * Approve a type change request and update the user's type
   */
  public async approveRequest(requestId: string) {
    // Get the request first
    const [request] = await db
      .select()
      .from(RequestTypeTable)
      .where(eq(RequestTypeTable.id, requestId))
      .limit(1);

    if (!request) {
      return null;
    }

    // Update the user's type
    await db
      .update(UserTable)
      .set({ type: request.type })
      .where(eq(UserTable.id, request.userId));

    // Update the request to approved
    await db
      .update(RequestTypeTable)
      .set({ approved: true })
      .where(eq(RequestTypeTable.id, requestId));

    return request;
  }

  /**
   * Get stats
   */
  public async getStats() {
    const pendingCountResult = await db
      .select({
        count: sql`count(*)::integer`,
      })
      .from(RequestTypeTable)
      .where(eq(RequestTypeTable.approved, false));

    const recentApproved = await db
      .select({
        requestId: RequestTypeTable.id,
        username: UserTable.username,
        requestedType: RequestTypeTable.type,
        createdAt: RequestTypeTable.createdAt,
        updatedAt: RequestTypeTable.updatedAt,
      })
      .from(RequestTypeTable)
      .innerJoin(UserTable, eq(RequestTypeTable.userId, UserTable.id))
      .where(eq(RequestTypeTable.approved, true))
      .orderBy(desc(RequestTypeTable.updatedAt))
      .limit(5);

    return {
      pendingCount: pendingCountResult[0]?.count || 0,
      recentApproved,
    };
  }
}
