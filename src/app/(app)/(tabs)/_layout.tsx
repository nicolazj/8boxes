import { Tabs } from 'expo-router';
import { FC } from 'react';
import colors from 'src/ui/colors.ts';
import _FontAwesome from '@expo/vector-icons/FontAwesome.js';
// Types in `@expo/vector-icons` do not currently work correctly in `"type": "module"` packages.
const FontAwesome = _FontAwesome as unknown as FC<{
  color: string;
  name: string;
  size: number;
}>;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: 'transparent',
        },

        tabBarActiveTintColor: colors.black,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <FontAwesome
              color={focused ? colors.black : colors.grey}
              name="dropbox"
              size={24}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
          },
          title: '8 boxes',
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <FontAwesome
              color={focused ? colors.black : colors.grey}
              name="sticky-note"
              size={24}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
          },
          title: 'Notes',
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <FontAwesome
              color={focused ? colors.black : colors.grey}
              name="signal"
              size={24}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
          },
          title: 'Insights',
        }}
      />
    </Tabs>
  );
}
