import { DrizzleDatabaseSession, DrizzleTransactionSession, db } from '../db/db.js';
import { ImageTable, ThingTable, UserTable } from '../db/schema.js';
import { and, between, count, desc, eq, notLike } from 'drizzle-orm';

export class ImageRepository {
  /**
   * @throws {Error}
   */
  public async getCountBetween(
    userId: string,
    thingId: string,
    from: string,
    to: string,
    tx: DrizzleDatabaseSession | DrizzleTransactionSession = db
  ) {
    return tx
      .select({ count: count(ImageTable.thingId) })
      .from(ImageTable)
      .where(
        and(eq(ImageTable.userId, userId), eq(ImageTable.thingId, thingId), between(ImageTable.createdAt, from, to))
      );
  }

  /**
   * @throws {Error}
   */
  public async insert(
    userId: string,
    thingId: string,
    filename: string,
    tx: DrizzleDatabaseSession | DrizzleTransactionSession = db
  ) {
    const [{ createdAt }] = await tx
      .insert(ImageTable)
      .values({ userId, thingId, filename })
      .returning({ createdAt: ImageTable.createdAt });

    return createdAt;
  }

  /**
   * @throws {Error}
   */
  public async getCount(userId: string, tx: DrizzleDatabaseSession | DrizzleTransactionSession = db) {
    return tx
      .select({ count: count(ImageTable.thingId) })
      .from(ImageTable)
      .innerJoin(ThingTable, eq(ImageTable.thingId, ThingTable.id))
      .where(and(eq(ImageTable.userId, userId), eq(ThingTable.type, 'personal')));
  }

  /**
   * @throws {Error}
   */
  public async getThingImages(thingId: string, tx: DrizzleDatabaseSession | DrizzleTransactionSession = db) {
    return tx
      .select({ username: UserTable.username, filename: ImageTable.filename, createdAt: ImageTable.createdAt })
      .from(ImageTable)
      .innerJoin(UserTable, eq(ImageTable.userId, UserTable.id))
      .where(and(eq(ImageTable.thingId, thingId), notLike(ImageTable.filename, 'cover-%')))
      .orderBy(desc(ImageTable.createdAt));
  }

  /**
   * @throws {Error}
   */
  public async getThingIdFromFilename(filename: string, tx: DrizzleDatabaseSession | DrizzleTransactionSession = db) {
    const [{ thingId }] = await tx
      .select({ thingId: ImageTable.thingId })
      .from(ImageTable)
      .where(eq(ImageTable.filename, filename));

    return thingId ? thingId : null;
  }

  public async getUserGalleryItems(userId: string, tx: DrizzleDatabaseSession | DrizzleTransactionSession = db) {
    return tx
      .select({
        thingId: ImageTable.thingId,
        filename: ImageTable.filename,
        createdAt: ImageTable.createdAt,
        thingType: ThingTable.type
      })
      .from(ImageTable)
      .innerJoin(ThingTable, eq(ImageTable.thingId, ThingTable.id))
      .where(eq(ImageTable.userId, userId))
      .orderBy(desc(ImageTable.createdAt));
  }
}
