import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { useLocaleContext } from 'fbtee';
import { Fragment } from 'react/jsx-runtime';

export default function TabLayout() {
  const { locale } = useLocaleContext();

  return (
    <Fragment key={locale}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ initialRouteName: '(tabs)' }}>
          <Stack.Screen
            name="(tabs)"
            options={{
              contentStyle: {
                backgroundColor: 'transparent',
              },
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="aspect/[aspectId]"
            options={{
              contentStyle: {
                backgroundColor: 'transparent',
              },
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </Fragment>
  );
}
