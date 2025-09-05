import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { eq, and } from 'drizzle-orm';
import { getWeek, getYear } from 'date-fns';
import { Feather } from '@expo/vector-icons';

// Local imports
import { db } from '../../../db/db.ts';
import { weeklyBoxLog, notes } from '../../../db/schema.ts';
import Text from '../../../ui/Text.tsx';
import { LIFE_ASPECTS, type LifeAspectId } from '../../../constants.ts';
import { toggleWeeklyBoxLog } from 'src/db/queries/weeklyBoxLog.ts';

export default function AspectDetailScreen() {
  const { aspectId } = useLocalSearchParams<{ aspectId: LifeAspectId }>();
  const router = useRouter();
  const now = new Date();
  const weekNumber = getWeek(now, { weekStartsOn: 1 });
  const year = getYear(now);

  // Check if note exists for this aspect
  const { data: existingNote } = useLiveQuery(
    db.select().from(notes).where(eq(notes.box, aspectId)).limit(1),
  );

  const { data: currentWeekLogs = [] } = useLiveQuery(
    db
      .select()
      .from(weeklyBoxLog)
      .where(
        and(
          eq(weeklyBoxLog.box, aspectId),
          eq(weeklyBoxLog.week, weekNumber),
          eq(weeklyBoxLog.year, year),
        ),
      )
      .limit(1),
  );

  const hasNotes = existingNote && existingNote.length > 0;
  const isActiveThisWeek = currentWeekLogs.length > 0;

  // Get the current aspect details
  const currentAspect = LIFE_ASPECTS.find(
    (aspect: { id: string }) => aspect.id === aspectId,
  );

  // Get the description for the current aspect
  const getAspectTips = (aspectId: LifeAspectId): string => {
    const aspect = LIFE_ASPECTS.find((aspect) => aspect.id === aspectId);
    return aspect?.description || 'No description available for this aspect.';
  };

  if (!currentAspect) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Aspect Not Found' }} />
        <Text style={styles.errorText}>Aspect not found</Text>
      </View>
    );
  }

  const handleToggleComplete = async () => {
    try {
      await toggleWeeklyBoxLog(aspectId);
    } catch {
      // Error handling without console.log
    }
  };

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
        <Pressable
          onPress={handleToggleComplete}
          style={[
            styles.statusContainer,
            isActiveThisWeek && styles.statusContainerActive,
          ]}
        >
          <Text numberOfLines={1} style={styles.status}>
            {isActiveThisWeek
              ? 'Completed this week'
              : 'Not completed yet this week'}
          </Text>

          {isActiveThisWeek ? (
            <Text style={styles.undoText}>Undo</Text>
          ) : (
            <Text style={styles.undoText}>Mark it done</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Pressable
            onPress={() => router.push(`/note/${aspectId}`)}
            style={styles.notesButton}
          >
            <Feather
              color={hasNotes ? '#007AFF' : '#666'}
              name={hasNotes ? 'edit-2' : 'plus'}
              size={20}
            />
            <Text
              style={[styles.notesButtonText, hasNotes && styles.hasNotesText]}
            >
              {hasNotes ? 'Edit Notes' : 'Add Notes'}
            </Text>
          </Pressable>
        </View>
        {hasNotes && (
          <Text numberOfLines={3} style={styles.notePreview}>
            {existingNote[0].content}
          </Text>
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
    padding: 24,
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
  hasNotesText: {
    color: '#007AFF',
    fontWeight: '500',
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
  notePreview: {
    borderTopColor: '#f0f0f0',
    borderTopWidth: 1,
    color: '#444',
    lineHeight: 22,
    marginTop: 8,
    paddingTop: 8,
  },
  notesButton: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 8,
  },
  notesButtonText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 6,
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
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  statusContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 8,
    padding: 8,
  },
  statusContainerActive: {
    backgroundColor: '#e8f5e9',
  },
  statusIcon: {
    marginRight: 0,
  },
  statusIconContainer: {
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
    height: 24,
    justifyContent: 'center',
    marginLeft: 12,
    width: 24,
  },
  tipText: {
    color: '#666',
    lineHeight: 22,
  },
  title: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  undoText: {
    color: '#4CAF50',
    fontSize: 14,
    marginLeft: 8,
  },
});
