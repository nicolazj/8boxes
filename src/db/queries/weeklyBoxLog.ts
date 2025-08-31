import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db.ts';
import { weeklyBoxLog } from '../schema.ts';
import { getWeek } from 'date-fns';
import type { LifeAspectId } from '../../constants.ts';

export const toggleWeeklyBoxLog = async (boxId: LifeAspectId) => {
  const now = new Date();
  const week = getWeek(now, { weekStartsOn: 1 });
  const year = now.getFullYear();

  // Check if log already exists
  const existingLog = await db
    .select()
    .from(weeklyBoxLog)
    .where(
      and(
        eq(weeklyBoxLog.box, sql`${boxId}`),
        eq(weeklyBoxLog.week, week),
        eq(weeklyBoxLog.year, year),
      ),
    )
    .get();

  if (existingLog) {
    // Delete existing log
    await db
      .delete(weeklyBoxLog)
      .where(
        and(
          eq(weeklyBoxLog.box, sql`${boxId}`),
          eq(weeklyBoxLog.week, week),
          eq(weeklyBoxLog.year, year),
        ),
      )
      .run();
    return { action: 'deleted' };
  } else {
    // Create new log
    await db
      .insert(weeklyBoxLog)
      .values({
        box: boxId, // Type assertion needed for Drizzle ORM's type limitations
        week,
        year,
      } as const)
      .run();
    return { action: 'created' };
  }
};

export const getWeeklyBoxLogs = async (week: number, year: number) => {
  const logs = await db
    .select()
    .from(weeklyBoxLog)
    .where(and(eq(weeklyBoxLog.week, week), eq(weeklyBoxLog.year, year)))
    .all();
  return logs.map((log) => ({
    ...log,
    box: log.box as LifeAspectId,
  }));
};
