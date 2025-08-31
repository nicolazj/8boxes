import { Stack, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { eq, and } from 'drizzle-orm';
import { getWeek, getYear } from 'date-fns';

// Local imports
import { db } from 'src/db/db.ts';
import { weeklyBoxLog } from 'src/db/schema.ts';
import Text from 'src/ui/Text.tsx';
import { LIFE_ASPECTS, type LifeAspectId } from 'src/constants.ts';

export default function AspectDetailScreen() {
  const { aspectId } = useLocalSearchParams<{ aspectId: LifeAspectId }>();
  const now = new Date();
  const weekNumber = getWeek(now, { weekStartsOn: 1 });
  const year = getYear(now);

  // Get the current aspect details
  const currentAspect = LIFE_ASPECTS.find(
    (aspect: { id: string }) => aspect.id === aspectId,
  );

  // Helper function to get tips for each aspect
  const getAspectTips = (aspectId: LifeAspectId): string => {
    const tips: Record<LifeAspectId, string> = {
      assist: 'Help others in your community or support causes you care about.',
      ego: 'Practice self-reflection and personal growth.',
      family:
        'Spend quality time with your family and strengthen your relationships.',
      health:
        'Focus on physical and mental well-being through exercise and self-care.',
      invest:
        'Review your investments and consider rebalancing your portfolio.',
      learn: 'Dedicate time to learn something new or improve your skills.',
      relationships:
        'Nurture your personal relationships and social connections.',
      transact:
        'Track your financial transactions and set weekly spending goals.',
    };
    return tips[aspectId] || 'No specific tips available for this aspect.';
  };

  // Get history of logs for this aspect
  const { data: logs = [] } = useLiveQuery(
    db
      .select()
      .from(weeklyBoxLog)
      .where(
        and(
          eq(weeklyBoxLog.box, aspectId), // Type assertion for Drizzle ORM
        ),
      )
      .orderBy(weeklyBoxLog.year, weeklyBoxLog.week),
  ) as { data: Array<{ box: string; week: number; year: number }> };

  if (!currentAspect) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Aspect Not Found' }} />
        <Text style={styles.errorText}>Aspect not found</Text>
      </View>
    );
  }

  const isActiveThisWeek = logs.some(
    (log) => log.week === weekNumber && log.year === year,
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: currentAspect.name }} />

      <View style={styles.header}>
        <View
          style={[
            styles.emojiContainer,
            { backgroundColor: currentAspect.color },
          ]}
        >
          <Text style={styles.emoji}>{currentAspect.emoji}</Text>
        </View>
        <Text style={styles.title}>{currentAspect.name}</Text>
        <Text style={styles.status}>
          {isActiveThisWeek
            ? 'Completed this week'
            : 'Not completed yet this week'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <Text>
                Week {log.week}, {log.year}
              </Text>
              <Text>✓</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No history yet</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips</Text>
        <Text style={styles.tipText}>
          {getAspectTips(currentAspect.id) ||
            'No specific tips available for this aspect.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF7F1',
    flex: 1,
    padding: 20,
  },
  emoji: {
    fontSize: 40,
  },
  emojiContainer: {
    alignItems: 'center',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logItem: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  status: {
    color: '#666',
    fontSize: 16,
  },
  tipText: {
    color: '#333',
    lineHeight: 22,
  },
  title: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
