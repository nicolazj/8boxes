import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from 'src/store';
import Text from 'src/ui/Text';
import { useState } from 'react';
import PagerView from 'react-native-pager-view';
export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const { setName: setStoreName, setOnboarded } = useUserStore();

  const handleComplete = () => {
    if (name.trim()) {
      setStoreName(name.trim());
      setOnboarded(true);
      router.replace('/(app)/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <PagerView initialPage={0} style={styles.container}>
        <View key="1" style={styles.page}>
          <Text>First page</Text>
          <Text>Swipe ➡️</Text>
        </View>
        <View key="2" style={styles.page}>
          <Text>Second page</Text>
        </View>
        <View key="3" style={styles.page}>
          <Text>Third page</Text>
        </View>
      </PagerView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
