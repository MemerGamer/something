import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { bearerAuth, defaultResponses, jsonc, textc, useAccessToken } from '../utils/openapi.js';
import { StatusCodes } from '../types/status-codes.js';
import {
  SocialThingPreviewModel,
  ThingCardModel,
  ThingDTO,
  ThingDetailsModel,
  ThingPreviewModel
} from '../types/thing.types.js';

export const userThingsToday = createRoute({
  method: 'get',
  path: '/mine/today',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Retrieve some data about upcoming things scheduled for today. <br> This is only a preview.',
  tags: ['Things'],
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(ThingPreviewModel.array()),
      description: `Snippet of user's things today.`
    }
  }
});

export const userThingsTodayAll = createRoute({
  method: 'get',
  path: '/mine/today/all',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Retrieve some data about things that are scheduled for today.',
  tags: ['Things'],
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(ThingPreviewModel.array()),
      description: `All things to be completed today by a user.`
    }
  }
});

export const userThingsAll = createRoute({
  method: 'get',
  path: '/mine/all',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: `Retrieve some data about all of the user's things, created or shared with them.`,
  tags: ['Things'],
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(ThingPreviewModel.array()),
      description: `All things of a user.`
    }
  }
});

export const otherThingsToday = createRoute({
  method: 'get',
  path: '/others/today',
  middleware: useAccessToken(),
  security: bearerAuth,
  description:
    'Retrieve what others are doing today. <br> Only activity from shared things is shown (shared by user, or with the user).',
  tags: ['Things'],
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(ThingCardModel.array()),
      description: `Daily activities of the user's friends.`
    }
  }
});

export const thingDetails = createRoute({
  method: 'get',
  path: '/{uuid}/details',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Retrieve all info about a thing.',
  tags: ['Things'],
  request: {
    params: z.object({
      uuid: z.string().uuid()
    })
  },
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(ThingDetailsModel),
      description: `Details about a thing.`
    }
  }
});

export const createThing = createRoute({
  method: 'post',
  path: '/create',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Create a new thing.',
  tags: ['Things'],
  request: {
    body: jsonc(ThingDTO)
  },
  responses: {
    ...defaultResponses,
    [StatusCodes.CREATED]: {
      ...textc(z.string()),
      description: `New thing created.`
    }
  }
});

export const createSocialThing = createRoute({
  method: 'post',
  path: '/create-social',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Create a new social thing.',
  tags: ['Things'],
  request: {
    // body: formc(SocialThingDTO.optional())
  },
  responses: {
    ...defaultResponses,
    [StatusCodes.CREATED]: {
      ...jsonc(z.object({ thingId: z.string(), joinCode: z.string() })),
      description: `New social thing created.`
    }
  }
});

export const getSocialThings = createRoute({
  method: 'get',
  path: '/get-social',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Get a social things.',
  tags: ['Things'],
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(SocialThingPreviewModel.array()),
      description: `New social thing created.`
    }
  }
});

export const toggleSocialThings = createRoute({
  method: 'patch',
  path: '/toggle-notified',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Get a social things.',
  tags: ['Things'],
  request: {
    body: jsonc(z.object({ thingId: z.string() }))
  },
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...textc(z.string()),
      description: `Toggled notifications for thing.`
    }
  }
});

export const joinSocialThingByCode = createRoute({
  method: 'post',
  path: '/join-by-code',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Join a social thing using a join code',
  tags: ['Things'],
  request: {
    body: jsonc(z.object({ joinCode: z.string().length(10) }))
  },
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(z.object({ thingId: z.string(), name: z.string() })),
      description: `Successfully joined the social thing`
    }
  }
});
