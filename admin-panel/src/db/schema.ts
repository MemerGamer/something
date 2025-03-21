import { sql } from 'drizzle-orm';
import {
  text,
  timestamp,
  pgTable,
  uuid,
  time,
  boolean,
  integer,
  unique,
  date,
  index,
  primaryKey,
  json
} from 'drizzle-orm/pg-core';

const timechangeColumns = {
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`NOW()`)
};

// quick hack to be able to have check support
// (https://github.com/drizzle-team/drizzle-orm/issues/880#issuecomment-1814869720)
const check = (defaultval: string, checkexpr: string) => sql`${sql.raw(defaultval)} CHECK (${sql.raw(checkexpr)})`;

export const UserTable = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    type: text('type', { enum: ['user', 'organization'] })
      .default(check(`'user'`, `type IN ('user', 'organization')`))
      .notNull(),
    pushToken: text('push_token'),
    ...timechangeColumns
  },
  (table) => ({
    usernameIdx: index().on(table.username)
  })
);

export const RequestTypeTable = pgTable('request_type', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => UserTable.id),
  type: text('type', { enum: ['user', 'organization'] })
    .notNull()
    .default(check(`'user'`, `type IN ('user', 'organization')`)),
  approved: boolean('approved').notNull().default(false),
  ...timechangeColumns
});

export const SessionTable = pgTable(
  'session',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    refreshToken: text('refresh_token').notNull().unique(),
    ...timechangeColumns
  },
  (table) => ({
    userIdIdx: index().on(table.userId),
    uniqueSession: unique().on(table.userId, table.refreshToken)
  })
);

export const ThingTable = pgTable(
  'thing',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    type: text('type', { enum: ['personal', 'social'] })
      .default(check(`'personal'`, `type IN ('personal', 'social')`))
      .notNull(),
    location: text('location'),
    coverFilename: text('cover_filename'),
    ...timechangeColumns
  },
  (table) => ({
    userIdIdx: index().on(table.userId),
    userIdWithTypeIdx: index().on(table.userId, table.type)
  })
);

export const ScheduleTable = pgTable(
  'schedule',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    thingId: uuid('thing_id')
      .notNull()
      .references(() => ThingTable.id),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    repeat: text('repeat', { enum: ['once', 'daily', 'weekly'] })
      .notNull()
      .default(check(`'once'`, `repeat IN ('once', 'daily', 'weekly')`)),
    specificDate: date('specific_date', { mode: 'string' }) // used for repeat 'once'
      .default(
        check(
          'NULL',
          `    (specific_date IS NULL     AND repeat IN ('daily', 'weekly'))
          OR (specific_date IS NOT NULL AND repeat = 'once')`
        )
      ),
    dayOfWeek: text(
      'day_of_week', // used for repeat 'weekly'
      {
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }
    ).default(
      check(
        'NULL',
        `(day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday','saturday', 'sunday'))
        AND (
              (day_of_week IS NULL     AND repeat IN ('once', 'daily'))
          OR  (day_of_week IS NOT NULL AND repeat = 'weekly')
        )`
      )
    ),
    ...timechangeColumns
  },
  (table) => ({
    thingIdIdx: index().on(table.thingId)
  })
);

export const NotificationTable = pgTable(
  'notification',
  {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    thingId: uuid('thing_id')
      .notNull()
      .references(() => ThingTable.id),
    title: text('title').notNull(),
    body: text('body').notNull(),
    data: json('data').notNull(),
    scheduledAt: timestamp('scheduled_at', { mode: 'string' }).notNull(),
    status: text('status', { enum: ['scheduled', 'completed'] })
      .notNull()
      .default(check(`'scheduled'`, `status IN ('scheduled', 'completed')`)),
    ...timechangeColumns
  },
  (table) => ({
    userIdIdx: index().on(table.userId),
    thingIdIdx: index().on(table.thingId),
    scheduledAt: index().on(table.scheduledAt)
  })
);

export const ImageTable = pgTable(
  'image',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    thingId: uuid('thing_id')
      .notNull()
      .references(() => ThingTable.id),
    filename: text('filename').notNull(),
    ...timechangeColumns
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.userId, table.thingId, table.filename]
    }),
    thingIdIdx: index().on(table.thingId),
    userIdThingIdIdx: index().on(table.userId, table.thingId)
  })
);

export const ThingAccessTable = pgTable(
  'thing_access',
  {
    thingId: uuid('thing_id')
      .notNull()
      .references(() => ThingTable.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    role: text('role', { enum: ['admin', 'viewer'] })
      .notNull()
      .default(check(`'viewer'`, `role IN ('admin', 'viewer')`)),
    ...timechangeColumns
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.thingId, table.userId]
    }),
    userIdIdx: index().on(table.userId),
    thingIdUserIdIdx: index().on(table.thingId, table.userId)
  })
);

export const ScoreTable = pgTable(
  'score',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id)
      .primaryKey(),
    value: integer('value').notNull(),
    public: boolean('public').notNull().default(true),
    ...timechangeColumns
  },
  (table) => ({
    publicIdx: index().on(table.public)
  })
);

export const LevelDefinitionTable = pgTable(
  'level_definition',
  {
    name: text('name').notNull().primaryKey(),
    minThreshold: integer('min_threshold').notNull(),
    ...timechangeColumns
  },
  (table) => ({
    minThresholdIdx: index().on(table.minThreshold)
  })
);

export const BadgeDefinitionTable = pgTable('badge_definition', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  icon: text('icon').notNull(), // PascalCase name from https://iconoir.com
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  action: text('action', { enum: ['create', 'complete'] })
    .notNull()
    .default(check(`'create'`, `action IN ('create', 'complete')`)),
  action_count: integer('action_count').notNull(),
  ...timechangeColumns
});

export const BadgeTable = pgTable(
  'badge',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    badgeDefinitionId: uuid('badge_definition_id')
      .notNull()
      .references(() => BadgeDefinitionTable.id),
    ...timechangeColumns
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.userId, table.badgeDefinitionId]
    }),
    userIdIdx: index().on(table.userId)
  })
);

export const StreakTable = pgTable(
  'streak',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    thingId: uuid('thing_id')
      .notNull()
      .references(() => ThingTable.id),
    count: integer('count').default(0).notNull()
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.userId, table.thingId]
    })
  })
);
