import bcrypt from 'bcrypt';
import { AuthDTO } from '../routes/auth.definition.js';
import { BaseService } from './base.service.js';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { ClientError } from '../utils/errors.js';

export type AccessTokenPayload = {
  username: string;
  id: string;
};

export type RefreshTokenPayload = {
  type: 'refresh';
  id: string;
};

export class AuthService extends BaseService {
  private readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  private readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  /**
   * @throws {Error}
   */
  public async register(data: AuthDTO) {
    const existingUser = await this.repositories.user.getByUsername(data.username);
    if (existingUser) {
      throw new ClientError('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return db.transaction(async (tx) => {
      try {
        const [user] = await this.repositories.user.create(
          {
            username: data.username,
            password: hashedPassword,
            pushToken: data.pushToken
          },
          tx
        );
        if (!user) {
          throw new Error('Failed to create user');
        }

        await this.repositories.score.init(user.id, tx);

        const tokenPair = this.generateTokenPair({
          username: user.username,
          id: user.id
        });

        // Save the refresh token in the database
        await this.repositories.session.create(user.id, tokenPair.refreshToken, tx);

        return tokenPair;
      } catch (error) {
        console.error('Error registering user: %o', error);
        tx.rollback();
      }
    });
  }

  /**
   * @throws {Error}
   */
  public async login(data: AuthDTO) {
    const user = await this.repositories.user.getByUsername(data.username);
    if (!user) {
      console.log('User not found');
      throw new ClientError('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      throw new ClientError('Invalid username or password');
    }

    if (data.pushToken) {
      await this.repositories.user.updatePushToken(user.id, data.pushToken);
    }

    const payload: AccessTokenPayload = {
      username: user.username,
      id: user.id
    };

    const tokenPair = this.generateTokenPair(payload);

    // Save the refresh token in the database
    await this.repositories.session.create(user.id, tokenPair.refreshToken);

    return tokenPair;
  }

  public async silentLogin(userId: string, pushToken: string) {
    return this.repositories.user.updatePushToken(userId, pushToken);
  }

  public async logout(refreshToken: string) {
    return this.repositories.session.delete(refreshToken);
  }

  /**
   * @throws {Error}
   */
  public generateTokenPair(payload: AccessTokenPayload) {
    const accessToken = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    });
    const refreshToken = jwt.sign({ type: 'refresh', id: payload.id }, this.REFRESH_TOKEN_SECRET, {
      expiresIn: '30d'
    });

    return {
      accessToken,
      refreshToken
    };
  }

  /**
   * @throws {Error}
   */
  public async refreshTokenPair(refreshToken: string) {
    let tokenData: RefreshTokenPayload | null = null;
    try {
      // Check if the refresh token is valid
      tokenData = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;

      // Check if the refresh token exists in the database
      const session = await this.repositories.session.get(refreshToken);
      if (!session) {
        throw new Error('Refresh token not found');
      }

      // Delete the old session
      await this.repositories.session.delete(refreshToken);

      // Get the user from the session
      const user = await this.repositories.user.getById(session.userId);
      if (!user) {
        throw new Error('Invalid token');
      }

      // Generate a new token pair
      const tokenPair = this.generateTokenPair({
        username: user.username,
        id: user.id
      });

      // Save the refresh token in the database
      await this.repositories.session.create(user.id, tokenPair.refreshToken);

      return tokenPair;
    } catch (error) {
      // Delete all sessions with the invalid refresh token
      if (tokenData) {
        await this.repositories.session.deleteAll(tokenData.id);
      }

      throw error;
    }
  }

  public async checkUsername(username: string) {
    const user = await this.repositories.user.getByUsername(username);
    if (!user) {
      console.log('User not found');
      return false;
    }

    return true;
  }

  public async updateUsername(userId: string, username: string) {
    const existingUser = await this.repositories.user.getByUsername(username);
    if (existingUser) {
      throw new ClientError('User already exists.');
    }
    return this.repositories.user.updateUsername(userId, username);
  }

  /**
   * Get user by ID
   * @throws {Error}
   */
  public async getUserById(userId: string) {
    const user = await this.repositories.user.getById(userId);
    if (!user) {
      throw new ClientError('User not found');
    }
    return user;
  }
}
