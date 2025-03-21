import { StatusCodes, reasonPhrase } from '../types/status-codes.js';
import { OpenAPIHono } from '@hono/zod-openapi';
import {
  otherThingsToday,
  userThingsTodayAll,
  userThingsToday,
  userThingsAll,
  thingDetails,
  createThing,
  createSocialThing,
  getSocialThings,
  toggleSocialThings,
  joinSocialThingByCode
} from './things.definition.js';
import { zodErrorHandler } from '../utils/errors.js';
import { ThingService } from '../services/thing.service.js';
import { AccessTokenPayload } from '../services/auth.service.js';
import { SocialThingDTO } from '../types/thing.types.js';
import { ImageService } from '../services/image.service.js';

const thingService = new ThingService();
const imageService = new ImageService();

export const thingRouter = new OpenAPIHono({ defaultHook: zodErrorHandler })
  .openapi(userThingsToday, async (c) => {
    const userId = c.get('jwtPayload').id;
    const things = await thingService.getUserThingsToday(userId, 3);
    return c.json(things, StatusCodes.OK);
  })

  .openapi(userThingsTodayAll, async (c) => {
    const userId = c.get('jwtPayload').id;
    const things = await thingService.getUserThingsToday(userId);
    return c.json(things, StatusCodes.OK);
  })

  .openapi(userThingsAll, async (c) => {
    const userId = c.get('jwtPayload').id;
    const things = await thingService.getUserThings(userId);
    return c.json(things, StatusCodes.OK);
  })

  .openapi(otherThingsToday, async (c) => {
    const userId = c.get('jwtPayload').id;
    const things = await thingService.getOthersThingsToday(userId);
    return c.json(things, StatusCodes.OK);
  })

  .openapi(thingDetails, async (c) => {
    const userId = c.get('jwtPayload').id;
    const thingId = c.req.param('uuid');
    const thingsDetails = await thingService.getDetails(userId, thingId);
    return c.json(thingsDetails, StatusCodes.OK);
  })

  .openapi(createThing, async (c) => {
    const userId = c.get('jwtPayload').id;
    const body = c.req.valid('json');
    await thingService.create(userId, body);
    return c.text(reasonPhrase(StatusCodes.CREATED), StatusCodes.CREATED);
  })
  .openapi(createSocialThing, async (c) => {
    const userId = (c.get('jwtPayload') as AccessTokenPayload).id;

    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const description = body['description'] as string;
    const location = body['location'] as string;
    const visibility = body['visibility'] as string;
    const schedule = JSON.parse(body['schedule'] as string) as SocialThingDTO['schedule'];
    const image = (await body['image']) as File;

    const data = await image.arrayBuffer();
    const filename = await imageService.saveImageToDisk(data, true);

    // add filename as image and include visibility
    const result = await thingService.createSocial(userId, {
      name,
      description,
      location,
      schedule: schedule as any,
      image: filename,
      visibility: visibility as 'public' | 'private'
    });

    return c.json(result, StatusCodes.CREATED);
  })

  .openapi(getSocialThings, async (c) => {
    const userId = (c.get('jwtPayload') as AccessTokenPayload).id;
    const things = await thingService.getSocialThings(userId);
    return c.json(things, StatusCodes.OK);
  })

  .openapi(toggleSocialThings, async (c) => {
    const userId = (c.get('jwtPayload') as AccessTokenPayload).id;
    const { thingId } = c.req.valid('json');
    await thingService.toggleSocialThings(userId, thingId);
    return c.text(reasonPhrase(StatusCodes.OK), StatusCodes.OK);
  })
  .openapi(joinSocialThingByCode, async (c) => {
    const userId = (c.get('jwtPayload') as AccessTokenPayload).id;
    const { joinCode } = c.req.valid('json');

    const result = await thingService.joinSocialThingByCode(userId, joinCode);
    return c.json(result, StatusCodes.OK);
  });
