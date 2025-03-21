import { BaseService } from './base.service.js';
import { ClientError } from '../utils/errors.js';

export class RequestTypeService extends BaseService {
  /**
   * Create a new type change request for a user
   */
  public async createTypeChangeRequest(userId: string, requestedType: 'user' | 'organization' = 'organization') {
    // Check if user already has pending request
    const hasPending = await this.repositories.requestType.hasPendingRequest(userId);
    if (hasPending) {
      throw new ClientError('You already have a pending type change request');
    }

    // Get current user info
    const user = await this.repositories.user.getById(userId);
    if (!user) {
      throw new ClientError('User not found');
    }

    // Check if the requested type is different from current type
    if (user.type === requestedType) {
      throw new ClientError(`Your account is already of type '${requestedType}'`);
    }

    // Create the request
    const [newRequest] = await this.repositories.requestType.createRequest(userId, requestedType);
    return newRequest;
  }
}
