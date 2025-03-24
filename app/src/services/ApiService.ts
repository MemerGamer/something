import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Client, InferResponseType, InferRequestType } from '../../../api/dist/index';
import { StatusCode } from 'hono/utils/http-status';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hono = require('../../node_modules/hono/dist/client/index.js');

export type ApiResponse<T, S extends StatusCode> = InferResponseType<T, S>;
export type ApiRequest<T> = InferRequestType<T>;
export type ApiHeaders = { Authorization: string };

export type ApiError =
  | {
      type: 'general';
      message: string;
    }
  | {
      type: 'validation';
      errors: {
        path: (string | number)[];
        message: string;
      }[];
    };

export function extractError(error: ApiError | undefined, path: (string | number)[]) {
  if (typeof error === 'undefined') {
    return undefined;
  }
  if (!(error?.type === 'validation')) {
    return undefined;
  }
  const err = error.errors.find((e) => JSON.stringify(e.path) === JSON.stringify(path));
  return err?.message;
}

export default class ApiService {
  private readonly baseUrl = process.env.EXPO_PUBLIC_API_URL;
  private static instance: ApiService;
  private readonly _client = hono.hc(`${process.env.EXPO_PUBLIC_API_URL}/`, {
    headers: this.getAuthorizationHeaders
  }) as unknown as Client;

  public constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    } else {
      ApiService.instance = this;
      return this;
    }
  }

  get client() {
    return this._client;
  }

  async call<TArgs, TResponse>(fn: (args: TArgs) => Promise<TResponse>, args: TArgs): Promise<TResponse> {
    console.debug(`[api] Calling ${JSON.parse(JSON.stringify(fn)).url}`);

    try {
      const response: any = await fn(args);

      if (response.status === 401) {
        await this.refreshTokens();
        return fn(args) as TResponse;
      }

      return response as TResponse;
    } catch (error) {
      console.error('[api] Unexpected error %o', error);
      return {} as TResponse;
    }
  }

  public async getAuthorizationHeaders() {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return {
      Authorization: `Bearer ${accessToken}`
    };
  }

  private async refreshTokens() {
    console.debug('[api] Refreshing tokens');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      return;
    }

    const headers = () => ({ Authorization: `Bearer ${refreshToken}` });
    const response = await this.client.auth.refresh.$post({}, { headers });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      console.debug('[api] Tokens refreshed');
    } else {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    }
  }

  async fetchData(
    endPoint: string,
    method: string,
    options?: {
      token?: string;
      body?: any;
    }
  ) {
    try {
      if (!options?.token) {
        console.trace('No token provieded');
      }

      console.log('Fetching data from:', `${this.baseUrl}/${endPoint}`);

      const response = await fetch(`${this.baseUrl}/${endPoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: options?.token ? `Bearer ${options.token}` : ''
        },
        body: JSON.stringify(options?.body)
      });

      if (!response.ok) {
        console.error('Error while fetching: ', JSON.stringify(response, null, 2));
        return null;
      }

      return await response.json();
    } catch (e) {
      console.log('Error while fetching: ', JSON.stringify(e, null, 2));
      return null;
    }
  }

  async get<T = object | null>(
    endPoint: string,
    options?: {
      token?: string;
    }
  ) {
    return (await this.fetchData(endPoint, 'GET', {
      token: options?.token
    })) as T;
  }

  async post<T = object | null>(endPoint: string, options?: { body?: any; token?: string }) {
    return (await this.fetchData(endPoint, 'POST', options)) as T;
  }

  async postFormData<T = object | null>(endPoint: string, options: { body: FormData; token: string }) {
    let response;
    try {
      await this.call(this.client.auth.protected.$get, {});
      response = await fetch(`${this.baseUrl}/${endPoint}`, {
        method: 'POST',
        headers: {
          Authorization: options?.token ? `Bearer ${options.token}` : '',
          'Content-Type': 'multipart/form-data'
        },
        body: options?.body
      });

      if (!response.ok) {
        throw Error(await response.text());
      }

      return (await response.json()) as T;
    } catch (e) {
      if (response && response.ok) {
        return {};
      }

      console.log('Error while postFormData: ', e);
      return null;
    }
  }

  async patch<T = any>(endPoint: string, options: { token: string }) {
    return (await this.fetchData(endPoint, 'PATCH', options)) as T;
  }
}
