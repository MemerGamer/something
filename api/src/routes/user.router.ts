import { StatusCodes, reasonPhrase } from '../types/status-codes.js';
import { OpenAPIHono } from '@hono/zod-openapi';
import {
  leaderboard,
  userBadges,
  userProfile,
  toggleLeaderboardVisibility,
  UserProfileModel,
  usernameExists,
  userTypeRequest,
  updateUsername,
  userType
} from './user.definition.js';
import { ClientError, zodErrorHandler } from '../utils/errors.js';
import { ThingService } from '../services/thing.service.js';
import { RewardService } from '../services/reward.service.js';
import { LeaderboardService } from '../services/leaderboard.service.js';
import { AuthService } from '../services/auth.service.js';
import { RequestTypeService } from '../services/request-type.service.js';

const thingService = new ThingService();
const rewardService = new RewardService();
const leaderboardService = new LeaderboardService();
const authservice = new AuthService();
const requestTypeService = new RequestTypeService();

export const userRouter = new OpenAPIHono({ defaultHook: zodErrorHandler })
  .openapi(userProfile, async (c) => {
    const userId = c.get('jwtPayload').id;
    // Step1: Get top 3 badess from badge repository (icon, name, description)
    const badges = await rewardService.getTopBadges(userId);

    // Step2: Get level from level repository (current level, next level, level object definition(name, min_treshold))
    const level = await rewardService.getUserLevel(userId);

    // Step3: Get past things from thing repository
    const things = await thingService.getUserThings(userId);

    const result: UserProfileModel = {
      badges,
      things,
      level
    };
    return c.json(result, StatusCodes.OK);
  })
  .openapi(userType, async (c) => {
    const userId = c.get('jwtPayload').id;
    const type = await requestTypeService.getUserType(userId);
    if (!type) {
      return c.text(reasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND);
    }
    return c.json({ type }, StatusCodes.OK);
  })

  .openapi(userBadges, async (c) => {
    const userId = c.get('jwtPayload').id;
    const badges = await rewardService.getUserBadges(userId);
    return c.json(badges, StatusCodes.OK);
  })

  .openapi(leaderboard, async (c) => {
    const userId = c.get('jwtPayload').id;
    const leaderboard = await leaderboardService.getLeaderBoard();
    const currentVisibility = await leaderboardService.getUserVisibility(userId);
    return c.json({ leaderboard, currentVisibility }, StatusCodes.OK);
  })

  .openapi(toggleLeaderboardVisibility, async (c) => {
    const userId = c.get('jwtPayload').id;
    await leaderboardService.toggleUserVisibility(userId);
    return c.text(reasonPhrase(StatusCodes.OK), StatusCodes.OK);
  })

  .openapi(usernameExists, async (c) => {
    const { username } = c.req.param();
    const exists = await authservice.checkUsername(username);
    if (exists) {
      return c.text(reasonPhrase(StatusCodes.OK), StatusCodes.OK);
    } else {
      return c.text(reasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND);
    }
  })
  .openapi(userTypeRequest, async (c) => {
    const userId = c.get('jwtPayload').id;
    const body = await c.req.json().catch(() => ({}));
    const requestedType = body?.type || 'organization';

    try {
      const request = await requestTypeService.createTypeChangeRequest(userId, requestedType);
      return c.json(
        {
          message: `Your request to change account type to ${requestedType} has been submitted.`,
          requestId: request.id
        },
        StatusCodes.OK
      );
    } catch (error) {
      if (error instanceof ClientError) {
        return c.json({ error: error.message }, StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  })
  .openapi(updateUsername, async (c) => {
    const userId = c.get('jwtPayload').id;
    const { username } = c.req.valid('json');

    try {
      // Check if username is valid format
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return c.json(
          {
            error: 'Username can only contain letters, numbers, and underscores'
          },
          StatusCodes.BAD_REQUEST
        );
      }

      // Update the username
      await authservice.updateUsername(userId, username);

      const tokenPair = authservice.generateTokenPair({
        username: username,
        id: userId
      });

      return c.json(
        {
          message: 'Username updated successfully',
          newUsername: username,
          accessToken: tokenPair.accessToken
        },
        StatusCodes.OK
      );
    } catch (error) {
      if (error instanceof ClientError) {
        return c.json({ error: error.message }, StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  });
