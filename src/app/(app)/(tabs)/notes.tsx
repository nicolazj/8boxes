import { useRouter } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { db } from 'src/db/db.ts';
import { notes } from 'src/db/schema.ts';
import { LIFE_ASPECTS } from 'src/constants.ts';
import Text from 'src/ui/Text.tsx';
import { formatDistanceToNow } from 'date-fns';
import { EmptyState } from 'src/components/EmptyState';

interface NoteItemProps {
  box: string;
  content: string;
  id: number;
  updatedAt: number;
}

function NoteItem({ note }: { note: NoteItemProps }) {
  const router = useRouter();
  const aspect = LIFE_ASPECTS.find((a) => a.id === note.box);

  if (!aspect) {
    return null;
  }

  return (
    <Pressable
      onPress={() => router.push(`/note/${note.box}`)}
      style={styles.noteItem}
    >
      <View style={[styles.aspectBadge, { backgroundColor: aspect.color }]}>
        <Text style={styles.aspectEmoji}>{aspect.emoji}</Text>
      </View>
      <View style={styles.noteContent}>
        <Text numberOfLines={2} style={styles.noteText}>
          {note.content}
        </Text>
        <Text style={styles.noteDate}>
          {formatDistanceToNow(new Date(note.updatedAt * 1000), {
            addSuffix: true,
          })}
        </Text>
      </View>
      <Feather color="#666" name="chevron-right" size={20} />
    </Pressable>
  );
}

export default function NotesScreen() {
  const { data: allNotes = [] } = useLiveQuery(
    db.select().from(notes).orderBy(notes.updatedAt),
  ) as { data: Array<NoteItemProps> };

  // Sort notes by updatedAt in descending order (newest first)
  const sortedNotes = [...allNotes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Your Notes</Text>
        {sortedNotes.length > 0 ? (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={sortedNotes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <NoteItem note={item} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="file-text"
            title="No Notes Yet"
            description="Add notes to track your progress and reflections across different life aspects."
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aspectBadge: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  aspectEmoji: {
    fontSize: 20,
  },
  container: {
    backgroundColor: '#FAF7F1',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  // Empty state styles removed - using EmptyState component instead
  listContent: {
    paddingBottom: 20,
  },
  noteContent: {
    flex: 1,
    marginRight: 12,
  },
  noteDate: {
    color: '#888',
    fontSize: 12,
  },
  noteItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteText: {
    color: '#333',
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
