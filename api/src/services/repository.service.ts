import { BadgeRepository } from '../repositories/badge.repository.js';
import { ImageRepository } from '../repositories/image.repository.js';
import { NotificationRepository } from '../repositories/notification.repository.js';
import { ScheduleRepository } from '../repositories/schedule.repository.js';
import { ScoreRepository } from '../repositories/score.repository.js';
import { SessionRepository } from '../repositories/session.repository.js';
import { AccessRepository } from '../repositories/access.repository.js';
import { StreakRepository } from '../repositories/streak.repository.js';
import { ThingRepository } from '../repositories/thing.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { LeaderboardRepository } from '../repositories/leaderboard.repository.js';
import { RequestTypeRepository } from '../repositories/request-type.repository.js';

export class RepositoryService {
  public readonly user = new UserRepository();
  public readonly score = new ScoreRepository();
  public readonly session = new SessionRepository();
  public readonly image = new ImageRepository();
  public readonly thing = new ThingRepository();
  public readonly schedule = new ScheduleRepository();
  public readonly streak = new StreakRepository();
  public readonly badge = new BadgeRepository();
  public readonly access = new AccessRepository();
  public readonly notification = new NotificationRepository();
  public readonly leaderboard = new LeaderboardRepository();
  public readonly requestType = new RequestTypeRepository();
}
