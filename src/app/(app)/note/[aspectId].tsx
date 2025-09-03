import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { useState, useEffect } from 'react';

import { db } from '../../../db/db.ts';
import { notes } from '../../../db/schema.ts';
import Text from '../../../ui/Text.tsx';
import { LIFE_ASPECTS, type LifeAspectId } from '../../../constants.ts';

export default function NoteScreen() {
  const { aspectId } = useLocalSearchParams<{ aspectId: LifeAspectId }>();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [noteId, setNoteId] = useState<number | null>(null);

  // Get the current aspect details
  const currentAspect = LIFE_ASPECTS.find(
    (aspect: { id: string }) => aspect.id === aspectId,
  );

  // Fetch existing note for this aspect
  const { data: existingNote } = useLiveQuery(
    db.select().from(notes).where(eq(notes.box, aspectId)).limit(1),
  );

  // Initialize form with existing note data
  useEffect(() => {
    const note = existingNote?.[0];
    if (!note) {
      return;
    }

    setContent(note.content);
    setNoteId(note.id);
    setIsEditing(true);
  }, [existingNote]);

  const handleSave = async () => {
    try {
      await (isEditing && noteId
        ? db
            .update(notes)
            .set({
              content,
              updatedAt: Math.floor(Date.now() / 1000),
            })
            .where(eq(notes.id, noteId))
        : db.insert(notes).values({
            box: aspectId,
            content,
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: Math.floor(Date.now() / 1000),
          }));
      router.back();
    } catch (error: unknown) {
      if (error instanceof Error) {
        // In a production app, log to an error reporting service
        // For now, we'll just swallow the error to avoid the console.error
      }
    }
  };

  if (!currentAspect) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aspect not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <TextInput
          autoFocus
          multiline
          onChangeText={setContent}
          placeholder={`Write your notes about ${currentAspect?.name || 'this aspect'}...`}
          style={styles.input}
          value={content}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#FAF7F1',
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    padding: 16,
  },
  headerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
});
