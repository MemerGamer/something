import { DrizzleDatabaseSession, DrizzleTransactionSession, db } from '../db/db.js';
import { UserTable } from '../db/schema.js';
import { InferInsertModel, eq, inArray } from 'drizzle-orm';

export class UserRepository {
  public async getById(id: string) {
    try {
      const [user] = await db.select().from(UserTable).where(eq(UserTable.id, id)).limit(1);
      return user || null;
    } catch (error) {
      return null;
    }
  }

  public async getByUsername(username: string) {
    try {
      const [user] = await db.select().from(UserTable).where(eq(UserTable.username, username)).limit(1);
      return user || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * @throws {Error}
   */
  public async create(
    user: InferInsertModel<typeof UserTable>,
    tx: DrizzleDatabaseSession | DrizzleTransactionSession = db
  ) {
    return tx.insert(UserTable).values(user).returning();
  }

  /**
   * @throws {Error}
   */
  public async updatePushToken(userId: string, pushToken: string) {
    return db.update(UserTable).set({ pushToken }).where(eq(UserTable.id, userId));
  }

  /**
   * @throws {Error}
   */
  public async getUserIds(usernames: string[], tx: DrizzleDatabaseSession | DrizzleTransactionSession = db) {
    return tx.select({ userId: UserTable.id }).from(UserTable).where(inArray(UserTable.username, usernames));
  }

  public async updateUsername(userId: string, username: string) {
    return db.update(UserTable).set({ username }).where(eq(UserTable.id, userId));
  }

  public async getTypeById(userId: string) {
    const [user] = await db.select({ type: UserTable.type }).from(UserTable).where(eq(UserTable.id, userId)).limit(1);
    return user?.type || null;
  }
}
