import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { db } from 'src/db/db.ts';
import { weeklyBoxLog } from 'src/db/schema.ts';
import { LIFE_ASPECTS } from 'src/constants.ts';
import Text from 'src/ui/Text.tsx';
import { ScrollView } from 'react-native-gesture-handler';
import { EmptyState } from 'src/components/EmptyState';

export default function InsightsScreen() {
  const { data: allLogs = [] } = useLiveQuery(
    db.select().from(weeklyBoxLog).orderBy(weeklyBoxLog.createdAt),
  ) as {
    data: Array<{
      box: string;
      createdAt: number;
      id: number;
      week: number;
      year: number;
    }>;
  };

  // Calculate logs count per aspect, sort by count (descending), and find the maximum count
  const aspectData = (() => {
    const aspectCounts = LIFE_ASPECTS.map((aspect) => ({
      aspect,
      count: allLogs.filter((log) => log.box === aspect.id).length,
    })).sort((a, b) => b.count - a.count); // Sort by count in descending order

    const maxCount = Math.max(1, ...aspectCounts.map((a) => a.count));

    return aspectCounts.map(({ aspect, count }) => {
      const logs = allLogs.filter((log) => log.box === aspect.id);
      const percentage = Math.round((count / maxCount) * 100);
      const lastLog = [...logs].sort((a, b) => b.createdAt - a.createdAt)[0];

      return {
        color: aspect.color,
        count,
        emoji: aspect.emoji,
        id: aspect.id,
        lastUpdated: lastLog
          ? `Week ${lastLog.week}, ${lastLog.year}`
          : 'Never',
        name: aspect.name,
        percentage,
      };
    });
  })();

  // Get most active week
  const getMostActiveWeek = () => {
    if (allLogs.length === 0) {
      return 'No data';
    }

    const weekCounts: Record<string, number> = {};
    allLogs.forEach((log) => {
      const weekKey = `${log.year}-W${String(log.week).padStart(2, '0')}`;
      weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;
    });

    const mostActiveWeek = Object.entries(weekCounts).reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      ['', 0],
    )[0];

    return mostActiveWeek ? mostActiveWeek.replace('-W', ' Week ') : 'No data';
  };

  // Get most logged aspect
  const mostActiveAspect = [...aspectData].sort((a, b) => b.count - a.count)[0];
  const totalLogs = allLogs.length;
  const weeksTracked = new Set(allLogs.map((log) => `${log.year}-${log.week}`))
    .size;
  const averageLogsPerWeek =
    weeksTracked > 0 ? (totalLogs / weeksTracked).toFixed(1) : '0';

  return (
    <SafeAreaView style={styles.container}>
      {totalLogs > 0 ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={{}}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Your Life Insights</Text>
            {/* Life Balance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Logs Overview</Text>
              {aspectData.map((aspect, index) => (
                <View key={aspect.id} style={styles.aspectRow}>
                  <View style={styles.aspectHeader}>
                    <Text style={[styles.aspectName, { color: aspect.color }]}>
                      {aspect.emoji} {aspect.name}
                    </Text>
                    <Text style={styles.aspectCount}>{aspect.count} logs</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          backgroundColor: aspect.color,
                          opacity: 0.7,
                          width: `${Math.min(aspect.percentage * 2, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.lastUpdated}>
                    Last updated: {aspect.lastUpdated}
                  </Text>
                </View>
              ))}
            </View>

            {/* Activity Insights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity Insights</Text>
              <View style={styles.insightCard}>
                <View style={styles.insightItem}>
                  <Text style={styles.insightEmoji}>📅</Text>
                  <View>
                    <Text style={styles.insightText}>
                      Most active week:{' '}
                      <Text style={styles.highlight}>
                        {getMostActiveWeek()}
                      </Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightEmoji}>📊</Text>
                  <View>
                    <Text style={styles.insightText}>
                      <Text style={styles.highlight}>{totalLogs}</Text> total
                      logs across {weeksTracked} weeks
                    </Text>
                    <Text style={[styles.insightText, { marginTop: 4 }]}>
                      Average:{' '}
                      <Text style={styles.highlight}>
                        {averageLogsPerWeek} logs/week
                      </Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.insightItem}>
                  <Text style={styles.insightEmoji}>🏆</Text>
                  <View>
                    <Text style={styles.insightText}>
                      <Text style={styles.highlight}>
                        {mostActiveAspect?.name || 'No aspect'}
                      </Text>{' '}
                      is your most tracked area
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Your Life Insights</Text>
          <EmptyState
            icon="bar-chart-2"
            title="No Data Yet"
            description="Start tracking your life aspects to see personalized insights and visualize your progress over time."
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aspectCount: {
    color: '#666',
    fontSize: 14,
  },
  aspectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aspectName: {
    fontSize: 15,
    fontWeight: '600',
  },
  aspectRow: {
    marginBottom: 20,
  },
  container: {
    backgroundColor: '#FAF7F1',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  highlight: {
    color: '#6c5ce7',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  insightEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightText: {
    color: '#333',
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  lastUpdated: {
    color: '#999',
    fontSize: 12,
  },
  noteAspect: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  noteAspectText: {
    fontSize: 18,
  },
  noteContent: {
    flex: 1,
  },
  noteDate: {
    color: '#999',
    fontSize: 12,
    marginBottom: 2,
  },
  noteText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 20,
  },
  progressBar: {
    borderRadius: 4,
    height: '100%',
  },
  progressBarContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    height: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  recentNote: {
    alignItems: 'flex-start',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statValue: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
