import { FlatList, StyleSheet, View, SafeAreaView } from 'react-native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from 'src/db/db.ts';
import { weeklyBoxLog } from 'src/db/schema.ts';
import { desc } from 'drizzle-orm';
import { LIFE_ASPECTS } from 'src/constants.ts';
import Text from 'src/ui/Text';
import { EmptyState } from 'src/components/EmptyState';

interface WeeklyLog {
  week: number;
  year: number;
  boxes: string[];
}

export default function HistoryScreen() {
  // Query all weekly logs, grouped by week and year
  const { data: weeklyLogs = [] } = useLiveQuery(
    db
      .select({
        week: weeklyBoxLog.week,
        year: weeklyBoxLog.year,
        box: weeklyBoxLog.box,
      })
      .from(weeklyBoxLog)
      .orderBy(desc(weeklyBoxLog.year), desc(weeklyBoxLog.week)),
  ) as { data: Array<{ week: number; year: number; box: string }> };

  // Group logs by week and year
  const groupedLogs = weeklyLogs.reduce<Record<string, WeeklyLog>>(
    (acc, log) => {
      const key = `${log.year}-${log.week}`;
      if (!acc[key]) {
        acc[key] = { week: log.week, year: log.year, boxes: [] };
      }
      if (!acc[key].boxes.includes(log.box)) {
        acc[key].boxes.push(log.box);
      }
      return acc;
    },
    {},
  );

  const sortedLogs = Object.values(groupedLogs).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.week - a.week;
  });

  const renderWeekItem = ({ item }: { item: WeeklyLog }) => {
    const weekDate = new Date();
    // Set to the first day of the week
    weekDate.setFullYear(item.year);
    weekDate.setMonth(0); // Start from January
    weekDate.setDate((item.week - 1) * 7); // Approximate the date

    return (
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekText}>
            Week {item.week}, {item.year}
          </Text>
        </View>
        <View style={styles.aspectsContainer}>
          {LIFE_ASPECTS.map((aspect) => {
            const isActive = item.boxes.includes(aspect.id);
            return (
              <View
                key={aspect.id}
                style={[
                  styles.aspectCircle,
                  {
                    backgroundColor: isActive
                      ? `${aspect.color}cc`
                      : 'transparent',
                    opacity: isActive ? 1 : 0.3,
                  },
                ]}
              >
                <Text style={styles.aspectEmoji}>{aspect.emoji}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>History</Text>
        {sortedLogs.length > 0 ? (
          <FlatList
            data={sortedLogs}
            renderItem={renderWeekItem}
            keyExtractor={(item) => `${item.year}-${item.week}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="calendar"
            title="No History Yet"
            description="Your weekly progress will appear here once you start tracking your life aspects."
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FAF7F1',
    flex: 1,
  },
  container: {
    backgroundColor: '#FAF7F1',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  title: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  weekContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weekHeader: {
    marginBottom: 12,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  aspectsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  aspectCircle: {
    // width: 40,

    // height: 40,
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  aspectEmoji: {
    fontSize: 20,
  },
});
