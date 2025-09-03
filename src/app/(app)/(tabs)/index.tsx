import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useUserStore } from 'src/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getWeek, getYear, startOfWeek, endOfWeek } from 'date-fns';

import Text from 'src/ui/Text.tsx';
import { LIFE_ASPECTS, LifeAspectId } from 'src/constants.ts';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from 'src/db/db.ts';
import { weeklyBoxLog } from 'src/db/schema.ts';
import { eq, and } from 'drizzle-orm';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const SIDE_PADDING = 20;
const INNER_PADDING = 16;

const CARD_WIDTH = (width - SIDE_PADDING * 2 - INNER_PADDING) / 2;
export default function Index() {
  const router = useRouter();
  const { name: username } = useUserStore();
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekNumber = getWeek(now, {
    firstWeekContainsDate: 1,
    weekStartsOn: 1,
  });
  const year = getYear(now);

  const [canClick, setCanClick] = useState(false);
  // Use live query to get active logs
  const { data: logs = [] } = useLiveQuery(
    db
      .select()
      .from(weeklyBoxLog)
      .where(
        and(eq(weeklyBoxLog.week, weekNumber), eq(weeklyBoxLog.year, year)),
      ),
  );

  // Create a Set of active box IDs
  const activeBoxes = new Set<LifeAspectId>(
    logs.map((log) => log.box as LifeAspectId),
  );

  useFocusEffect(() => {
    setCanClick(true);
    return () => {
      setCanClick(false);
    };
  });

  const renderAspectBox = (aspect: (typeof LIFE_ASPECTS)[number]) => {
    const isActive = activeBoxes.has(aspect.id);
    return (
      <Pressable
        key={aspect.id}
        onPress={() => {
          if (canClick) {
            router.push(`/aspect/${aspect.id}`);
          }
        }}
        style={[
          styles.aspectBox,
          { width: CARD_WIDTH },
          isActive && styles.aspectBoxActive,
        ]}
      >
        <Text
          style={[
            styles.emoji,
            { color: isActive ? '#ffffff' : aspect.color },
            isActive && styles.emojiActive,
          ]}
        >
          {aspect.emoji}
        </Text>
        <Text style={[styles.aspectName, isActive && styles.aspectNameActive]}>
          {aspect.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Greeting Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {username}!</Text>
          <Text style={styles.dateRange}>
            {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}{' '}
            (Week#{weekNumber})
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {LIFE_ASPECTS.map((aspect: (typeof LIFE_ASPECTS)[number]) => {
            const isActive = activeBoxes.has(aspect.id);
            return (
              <View
                key={aspect.id}
                style={[
                  styles.progressDash,
                  isActive && styles.progressDashActive,
                ]}
              />
            );
          })}
        </View>

        {/* Life Aspects Grid */}
        <View style={styles.grid}>
          {LIFE_ASPECTS.map((aspect) => renderAspectBox(aspect))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aspectBox: {
    alignItems: 'center',
    aspectRatio: 1 / 0.618,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    justifyContent: 'center',
    marginBottom: 16,
    opacity: 0.5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aspectBoxActive: {
    // backgroundColor: '#4CAF50',
    opacity: 1,
  },

  aspectName: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  aspectNameActive: {
    // color: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    padding: 16,
  },
  dateRange: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.7,
  },
  detailButton: {
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
  },
  detailButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },

  emojiActive: {
    color: '#ffffff',
  },
  greeting: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  pressed: {
    opacity: 0.8,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressBarFill: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    height: '100%',
  },
  progressBarTrack: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    height: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 32,
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
    backgroundColor: '#ffe399',
  },
  progressText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  safeArea: {
    backgroundColor: '#FAF7F1',
    flex: 1,
  },
});
