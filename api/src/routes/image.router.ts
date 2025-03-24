import { StatusCodes, reasonPhrase } from '../types/status-codes.js';
import { OpenAPIHono } from '@hono/zod-openapi';
import { serveImage, uploadImage } from './image.definition.js';
import { serveStatic } from '../utils/serve-static.js';
import { zodErrorHandler } from '../utils/errors.js';
import { AccessTokenPayload } from '../services/auth.service.js';
import { ImageService } from '../services/image.service.js';
import { RewardService } from '../services/reward.service.js';

const imageService = new ImageService();
const rewardService = new RewardService();

export const imageRouter = new OpenAPIHono({ defaultHook: zodErrorHandler })
  .openapi(uploadImage, async (c) => {
    const userId = (c.get('jwtPayload') as AccessTokenPayload).id;

    const body = await c.req.parseBody();
    const image = (await body['image']) as File;
    const thingId = body['thingId'] as string;

    const data = await image.arrayBuffer();
    const filename = await imageService.saveImageToDisk(data);

    const reward = await rewardService.handleImageUpload(userId, thingId, filename);
    return c.json(reward, StatusCodes.OK);
  })

  .openapi(serveImage, async (c, next) => {
    const { filename } = c.req.param();
    const userId = (c.get('jwtPayload') as AccessTokenPayload).id;

    const type = await imageService.getThingTypeFromFilename(filename);

    if (type === 'personal') {
      const hasAccess = await imageService.checkAccess(userId, filename);
      if (!hasAccess) {
        return c.text(reasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND);
      }
    }

    const filepath = imageService.getImagePath(filename);
    return serveStatic(filepath)(c, next);
  });
