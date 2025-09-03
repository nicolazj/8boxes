import { useRootNavigationState, useRouter } from 'expo-router';
import { useDBMigrations } from 'src/db/db.ts';
import { useHydration, useUserStore } from 'src/store/index.ts';
import { useEffect } from 'react';
import { hideAsync } from 'expo-splash-screen';

export default function Root() {
  useDBMigrations();
  const { name, onboarded } = useUserStore();
  const { hydrationFinished } = useHydration();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const navigatorReady = rootNavigationState?.key != null;

  useEffect(() => {
    if (!hydrationFinished || !navigatorReady) {
      return;
    }

    const destination =
      onboarded === false || !name ? '/(app)/onboarding' : '/(app)/(tabs)';

    setTimeout(() => {
      router.replace(destination);
      hideAsync();
    }, 100);
  }, [hydrationFinished, name, onboarded, router, navigatorReady]);
  return null;
}
