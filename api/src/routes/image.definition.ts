import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { bearerAuth, defaultResponses, jsonc, useAccessToken } from '../utils/openapi.js';
import { StatusCodes } from '../types/status-codes.js';
import { RewardInfoModel } from '../types/reward.js';

export const uploadImage = createRoute({
  method: 'post',
  path: '/upload',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: 'Send an image as a checkpoint for a thing. <br> (Scalar UI does not support formdata yet)',
  tags: ['Images'],
  request: {
    headers: [
      z.object({
        'Content-Type': z
          .string()
          .optional()
          .default('multipart/form-data')
          .openapi({ param: { name: 'Content-Type', in: 'header' } })
      })
    ],
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            image: z.any().openapi({ format: 'binary' }).optional(),
            thingId: z.string().optional()
          })
        }
      }
    }
  },
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      ...jsonc(RewardInfoModel),
      description: 'Successfully sent image.'
    }
  }
});

export const serveImage = createRoute({
  method: 'get',
  path: '/{filename}',
  middleware: useAccessToken(),
  security: bearerAuth,
  description: `Get image using its filename.`,
  tags: ['Images'],
  request: {
    params: z.object({ filename: z.string() })
  },
  responses: {
    ...defaultResponses,
    [StatusCodes.OK]: {
      content: {
        'image/jpeg': {
          schema: z.string().openapi({ format: 'binary' })
        }
      },
      description: 'The image.'
    },
    [StatusCodes.NOT_FOUND]: {
      description: 'Image not found.'
    }
  }
});
