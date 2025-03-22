import { randomUUID } from 'node:crypto';
import { BaseService } from './base.service.js';
import path from 'node:path';
import sharp from 'sharp';
import { ClientError } from '../utils/errors.js';

export class ImageService extends BaseService {
  public async checkAccess(userId: string, filename: string) {
    const thingId = await this.repositories.image.getThingIdFromFilename(filename);
    if (!thingId) {
      return false;
    }

    const role = await this.repositories.access.getThingAccess(userId, thingId);
    return !!role;
  }

  public async saveImageToDisk(data: ArrayBuffer, coverImage: boolean = false) {
    try {
      const ext = '.jpg';
      const filename = `${coverImage ? 'cover-' : ''}${randomUUID()}${ext}`;

      const path = this.getImagePath(filename);
      await sharp(Buffer.from(data)).jpeg({ quality: 50, mozjpeg: true }).toFile(path);

      console.log(`Image saved to ${path}`);

      return filename;
    } catch (error) {
      throw new ClientError('Unable to save image, please try again.');
    }
  }

  public getImagePath(filename: string) {
    return path.join(process.env.API_IMAGE_DIR, filename);
  }

  public async getThingTypeFromFilename(filename: string) {
    const thingId = await this.repositories.image.getThingIdFromFilename(filename);
    if (!thingId) {
      return null;
    }
    const thing = await this.repositories.thing.getDetails(thingId);

    return thing.type;
  }

  static getImageUrl(filename: string) {
    return `${process.env.API_HOST}/images/${filename}`;
  }

  // Add this to your ImageService class
  public async getUserGallery(userId: string) {
    // Get all images associated with the user's things
    const galleryItems = await this.repositories.image.getUserGalleryItems(userId);

    // Transform the results to include imageUrl
    const transformedItems = galleryItems.map((item) => ({
      ...item,
      imageUrl: ImageService.getImageUrl(item.filename),
      isSocial: item.thingType === 'social'
    }));

    // Remove item filename and thingType from the response
    return transformedItems.map((item) => {
      const { filename: _filename, thingType: _thingType, ...rest } = item;
      return rest;
    });
  }
}
