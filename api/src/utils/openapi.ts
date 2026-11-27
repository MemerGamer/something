import { OpenAPIHono } from '@hono/zod-openapi';
import { jwt } from 'hono/jwt';
import * as openapi3_ts_oas31 from 'openapi3-ts/oas31';
import { StatusCodes } from '../types/status-codes.js';
import { GeneralError, ValidationError } from './errors.js';

export function jsonc<TSchema>(schema: TSchema) {
  return { content: { 'application/json': { schema } } };
}

export function textc<TSchema>(schema: TSchema) {
  return { content: { 'text/plain': { schema } } };
}

export function formc<TSchema>(schema: TSchema) {
  return { content: { 'multipart/form-data': { schema } } };
}

export function useAccessToken() {
  return jwt({ secret: process.env.ACCESS_TOKEN_SECRET, alg: 'HS256' });
}

export function useRefreshToken() {
  return jwt({ secret: process.env.REFRESH_TOKEN_SECRET, alg: 'HS256' });
}

export const defaultResponses = {
  [StatusCodes.BAD_REQUEST]: {
    ...jsonc(ValidationError.or(GeneralError)),
    description: 'Invalid request.'
  },
  [StatusCodes.INTERNAL_SERVER_ERROR]: {
    description: 'Unexpected error occured.'
  }
} as const;

export const bearerAuth = [{ Bearer: [] }];

export function registerBearerAuthScheme(app: OpenAPIHono) {
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  });
}

export function completeOpenAPIConfig(config: openapi3_ts_oas31.OpenAPIObject) {
  return {
    ...config,
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'Something API'
    }
  };
}
