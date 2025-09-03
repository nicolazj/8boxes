import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { LIFE_ASPECT_IDS } from 'src/constants.ts';

export const weeklyBoxLog = sqliteTable('weekly_box_log', {
  box: text('box', {
    enum: LIFE_ASPECT_IDS,
  }).notNull(),
  createdAt: integer('created_at').$defaultFn(() =>
    Math.floor(Date.now() / 1000),
  ),
  id: integer().primaryKey({ autoIncrement: true }),
  week: integer('week').notNull(), // Week number in year (1-53)
  year: integer('year').notNull(),
});

export const notes = sqliteTable('notes', {
  box: text('box', {
    enum: LIFE_ASPECT_IDS,
  }).notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at').$defaultFn(() =>
    Math.floor(Date.now() / 1000),
  ),
  id: integer().primaryKey({ autoIncrement: true }),
  updatedAt: integer('updated_at').$defaultFn(() =>
    Math.floor(Date.now() / 1000),
  ),
});
