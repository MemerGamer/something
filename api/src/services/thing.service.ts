/* eslint-disable no-console */
import { DateTime } from 'luxon';
import { db } from '../db/db.js';
import {
  SocialThingDTO,
  SocialThingPreviewModel,
  ThingCardModel,
  ThingDTO,
  ThingDetailsModel,
  ThingPreviewModel
} from '../types/thing.types.js';
import { BaseService } from './base.service.js';
import { ImageService } from './image.service.js';
import { notificationService } from '../index.js';
import { NotificationService } from './notification.service.js';
import { ClientError } from '../utils/errors.js';

export class ThingService extends BaseService {
  public async create(userId: string, data: ThingDTO) {
    return db.transaction(async (tx) => {
      try {
        // Create thing
        const [{ thingId }] = await this.repositories.thing.create(userId, data.name, data.description, tx);

        // Schedule entry
        await this.repositories.schedule.create(thingId, data.schedule, tx);

        // Add user as admin
        await this.repositories.access.giveThingAccess(thingId, [userId], 'admin', tx);

        // Share with people
        let sharedUserIds: string[] = [];
        if (data.sharedUsernames.length !== 0) {
          const res = await this.repositories.user.getUserIds(data.sharedUsernames, tx);
          sharedUserIds = res.map((u) => u.userId);
          await this.repositories.access.giveThingAccess(thingId, sharedUserIds, 'viewer', tx);
        }

        // Init streaks
        await this.repositories.streak.createStreaks([...sharedUserIds, userId], thingId, 0, tx);

        // Create notifications
        for (const _userId of [...sharedUserIds, userId]) {
          const interval = NotificationService.computeScheduleInterval(data.schedule.startTime, data.schedule.endTime);
          await notificationService.createNotification(_userId, thingId, data.name, interval, tx);
        }
      } catch (error) {
        console.error('Error creating thing: %o', error);
        tx.rollback();
      }
    });
  }

  public async createSocial(userId: string, data: Required<SocialThingDTO>) {
    return db.transaction(async (tx) => {
      try {
        // Create thing
        const [{ thingId, joinCode }] = await this.repositories.thing.createSocial(
          userId,
          data.name,
          data.description,
          data.location,
          data.image,
          data.visibility,
          tx
        );

        // Schedule entry
        await this.repositories.schedule.create(thingId, data.schedule as any, tx);

        // Add user as admin
        await this.repositories.access.giveThingAccess(thingId, [userId], 'admin', tx);

        // Add cover image
        await this.repositories.image.insert(userId, thingId, data.image, tx);

        return { thingId, joinCode };
      } catch (error) {
        console.error('Error creating thing: %o', error);
        tx.rollback();
        throw error;
      }
    });
  }

  public async getSocialThings(userId: string): Promise<SocialThingPreviewModel[]> {
    const things = await this.repositories.thing.getSocialThingPreviews(userId);
    const thingsWithNotified = [];

    for (const thing of things) {
      const role = await this.repositories.access.getThingAccess(userId, thing.id);
      thingsWithNotified.push({ ...thing, notified: !!role, coverImage: ImageService.getImageUrl(thing.coverImage) });
    }

    return thingsWithNotified;
  }

  public async joinSocialThingByCode(userId: string, joinCode: string) {
    return db.transaction(async (tx) => {
      try {
        const thing = await this.repositories.thing.getThingByJoinCode(joinCode, tx);

        if (!thing) {
          return null;
        }

        // Check if user already has access
        const existingAccess = await this.repositories.access.getThingAccess(userId, thing.id, tx);

        if (existingAccess) {
          console.warn(`User (${userId}) already has access to thing (${thing.id})`);
          return { thingId: thing.id, name: thing.name };
        }

        // Give viewer access
        await this.repositories.access.giveThingAccess(thing.id, [userId], 'viewer', tx);

        // Subscribe to notifications
        await notificationService.subscribe(userId, thing.id);

        return { thingId: thing.id, name: thing.name };
      } catch (error) {
        console.error('Error joining social thing: %o', error);
        tx.rollback();
        throw error;
      }
    });
  }

  public async getDetails(userId: string, thingId: string): Promise<ThingDetailsModel> {
    const {
      name,
      description,
      type,
      userId: thingUserId,
      join_code,
      visibility
    } = await this.repositories.thing.getDetails(thingId);
    const access = await this.repositories.access.getThingAccess(userId, thingId);

    if (type === 'personal') {
      if (!access) {
        throw new Error(`User (${userId}) has no access to thing (${thingId})`);
      }

      const schedule = await this.repositories.schedule.getThingSchedule(thingId);
      const sharedWith = await this.repositories.access.getSharedUsernames(userId, thingId);
      const _images = await this.repositories.image.getThingImages(thingId);
      const images = _images.map(({ username, filename, createdAt }) => ({
        username,
        image: ImageService.getImageUrl(filename),
        createdAt
      }));

      return {
        name,
        description,
        schedule,
        sharedWith,
        images,
        access
      };
    } else {
      const schedule = await this.repositories.schedule.getThingSchedule(thingId);
      const sharedWith = await this.repositories.access.getSharedUsernames(userId, thingId, false);
      const _images = await this.repositories.image.getThingImages(thingId);
      const images = _images.map(({ username, filename, createdAt }) => ({
        username,
        image: ImageService.getImageUrl(filename),
        createdAt
      }));

      return {
        name,
        description,
        schedule,
        sharedWith,
        images,
        visibility: visibility ?? undefined,
        joinCode: join_code ?? undefined,
        access: userId === thingUserId ? 'admin' : 'viewer'
      };
    }
  }

  public async getUserThingsToday(userId: string, limit: number | undefined = undefined): Promise<ThingPreviewModel[]> {
    const dayStart = DateTime.utc().startOf('day');
    const dayEnd = DateTime.utc().endOf('day');
    return this.repositories.thing.getThingPreviewsScheduledBetween(userId, dayStart.toISO(), dayEnd.toISO(), limit);
  }

  public async getUserThings(userId: string, limit: number | undefined = undefined): Promise<ThingPreviewModel[]> {
    return this.repositories.thing.getThingPreviews(userId, limit);
  }

  public async getOthersThingsToday(userId: string): Promise<ThingCardModel[]> {
    const dayStart = DateTime.utc().startOf('day');
    const dayEnd = DateTime.utc().endOf('day');
    const things = await this.repositories.thing.getOthersThingImagesCreatedBetween(
      userId,
      dayStart.toISO(),
      dayEnd.toISO()
    );

    return things.map(({ id, name, username, filename, createdAt }) => ({
      id,
      name,
      username,
      image: ImageService.getImageUrl(filename),
      createdAt
    }));
  }

  public async toggleSocialThings(userId: string, thingId: string) {
    const role = await this.repositories.access.getThingAccess(userId, thingId);
    if (role === 'admin') {
      throw new ClientError(`Can't unsubscribe from created social thing`);
    }

    if (role === 'viewer') {
      await this.repositories.access.removeThingAccess(thingId, userId);
      await notificationService.unsubscribe(userId, thingId);
    }

    if (role === null) {
      await this.repositories.access.giveThingAccess(thingId, [userId], 'viewer');
      await notificationService.subscribe(userId, thingId);
    }
  }
}
