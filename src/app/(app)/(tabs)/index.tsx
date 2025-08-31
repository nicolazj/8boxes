import { Stack as ExpoStack } from 'expo-router';
import { fbs } from 'fbtee';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';
import Text from 'src/ui/Text.tsx';
import { endOfWeek, getWeek, startOfWeek } from 'date-fns';

const LIFE_ASPECTS = [
  { color: '#4CAF50', emoji: '💸', id: 'transact', name: 'Transact' },
  { color: '#2196F3', emoji: '📈', id: 'invest', name: 'Invest' },
  { color: '#FF9800', emoji: '🤝', id: 'assist', name: 'Assist' },
  { color: '#9C27B0', emoji: '📚', id: 'learn', name: 'Learn' },
  { color: '#F44336', emoji: '💪', id: 'health', name: 'Health' },
  { color: '#3F51B5', emoji: '👨‍👩‍👧‍👦', id: 'family', name: 'Family' },
  { color: '#E91E63', emoji: '❤️', id: 'relationships', name: 'Relationships' },
  { color: '#00BCD4', emoji: '🧘', id: 'ego', name: 'Self-Kindness' },
];

const { width } = Dimensions.get('window');
const SIDE_PADDING = 20;
const INNER_PADDING = 16;

const CARD_WIDTH = (width - SIDE_PADDING * 2 - INNER_PADDING) / 2;

export default function Index() {
  const username = 'Nick'; // TODO: Replace with actual user name from auth

  const now = new Date();

  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekNumber = getWeek(now, {
    firstWeekContainsDate: 1,
    weekStartsOn: 1,
  });
  //=> 53
  return (
    <View className="flex-1 bg-warm p-5">
      <SafeAreaView style={styles.safeArea}>
        <ExpoStack.Screen
          options={{
            title: String(fbs('Dashboard', 'Dashboard header title')),
          }}
        />

        {/* Greeting Section */}
        <View style={styles.header}>
          <Text className="text-3xl font-bold">Hi, {username}!</Text>
          <Text className="text-gray-600 mt-1">
            {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()} (
            Week#{weekNumber})
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDash,
                  index < 3 && styles.progressDashActive, // Example: first 3 segments are active
                ]}
              />
            ))}
        </View>

        {/* Life Aspects Grid */}
        <View style={styles.grid}>
          {LIFE_ASPECTS.map((aspect) => (
            <Pressable
              key={aspect.id}
              style={[styles.aspectBox, { width: CARD_WIDTH }]}
            >
              <Text style={[styles.emoji, { color: aspect.color }]}>
                {aspect.emoji}
              </Text>
              <Text style={styles.aspectName}>{aspect.name}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  aspectBox: {
    alignItems: 'center',
    aspectRatio: 1 / 0.618,
    backgroundColor: '#ffffff',
    borderCurve: 'continuous',
    borderRadius: 24,
    elevation: 3,
    justifyContent: 'center',
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  aspectName: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  progressDash: {
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    flex: 1,
    height: 4,
    marginHorizontal: 2,
  },
  progressDashActive: {
    backgroundColor: '#ffe399', // Dark yellow color for active segments
  },
  safeArea: {
    flex: 1,
  },
});
