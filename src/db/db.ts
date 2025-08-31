import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations.js';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

const rawDB = openDatabaseSync('db.db', { enableChangeListener: true });
export const db = drizzle(rawDB);

export const useDBMigrations = () => {
  const { error, success } = useMigrations(db, migrations);
  return { error, success };
};

export const useDBStudio = () => {
  useDrizzleStudio(rawDB);
};
