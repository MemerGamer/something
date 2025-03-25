import { HTTPException } from 'hono/http-exception';
import { StatusCodes, reasonPhrase } from '../types/status-codes.js';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { ErrorHandler } from 'hono';

export const ValidationError = z.object({
  type: z.literal('validation'),
  errors: z
    .object({
      path: z.array(z.string().or(z.number())),
      message: z.string()
    })
    .array()
});
export type ValidationError = z.infer<typeof ValidationError>;

export const GeneralError = z.object({
  type: z.literal('general'),
  message: z.string()
});
export type GeneralError = z.infer<typeof GeneralError>;

/**
 * Errors whose message can be safely sent to the user.
 */
export class ClientError extends HTTPException {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, { message });
    this.name = 'ClientError';
  }
}

export const zodErrorHandler: Parameters<OpenAPIHono['openapi']>['2'] = (result, c) => {
  if (!result.success) {
    const errors = result.error.issues.map(({ path, message }) => ({
      path,
      message
    }));
    const body: ValidationError = { type: 'validation', errors };
    return c.json(body, StatusCodes.BAD_REQUEST);
  }
};

export const globalErrorHandler: ErrorHandler = (error, c) => {
  if (error instanceof ClientError) {
    const body: GeneralError = { type: 'general', message: error.message };
    return c.json(body, error.status);
  }

  if (error instanceof HTTPException && error.res?.status === StatusCodes.UNAUTHORIZED) {
    return c.json(reasonPhrase(StatusCodes.UNAUTHORIZED), StatusCodes.UNAUTHORIZED);
  }
  console.error(error);
  return c.json(reasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR), StatusCodes.INTERNAL_SERVER_ERROR);
};
