import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { Fragment } from 'react/jsx-runtime';

export default function TabLayout() {
  console.log('tab layout');
  return (
    <Fragment>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{ headerShown: false, initialRouteName: '(tabs)' }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          />
          <Stack.Screen
            name="aspect/[aspectId]"
            options={{
              contentStyle: {
                backgroundColor: 'transparent',
              },
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="note/[aspectId]"
            options={{
              contentStyle: {
                backgroundColor: 'transparent',
              },
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              animation: 'none',
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </Fragment>
  );
}
