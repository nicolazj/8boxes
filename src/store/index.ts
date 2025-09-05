import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
type UserStore = {
  name: string;
  onboarded: boolean;
  setName: (name: string) => void;
  setOnboarded: (onboarded: boolean) => void;
};

// AsyncStorage.clear();
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: '',
      onboarded: false,
      setName: (name) => set({ name }),
      setOnboarded: (onboarded) => set({ onboarded }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // use AsyncStorage for React Native
    },
  ),
);

export const useHydration = () => {
  const [hydrationFinished, setHydrationFinished] = useState(() =>
    useUserStore.persist.hasHydrated(),
  );
  console.log('hydrationFinished', hydrationFinished);
  useEffect(() => {
    setHydrationFinished(useUserStore.persist.hasHydrated());
    const unsub = useUserStore.persist.onFinishHydration((state) => {
      setHydrationFinished(true);
    });
    return () => {
      unsub();
    };
  }, []);

  return { hydrationFinished };
};
