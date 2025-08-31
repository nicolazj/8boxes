export const LIFE_ASPECT_IDS = [
  'transact',
  'invest',
  'assist',
  'learn',
  'health',
  'family',
  'relationships',
  'ego',
] as const;

export type LifeAspectId = (typeof LIFE_ASPECT_IDS)[number];

export const LIFE_ASPECTS: Array<{
  color: string;
  emoji: string;
  id: LifeAspectId;
  name: string;
}> = [
  { color: '#4CAF50', emoji: '💸', id: 'transact', name: 'Transact' },
  { color: '#2196F3', emoji: '📈', id: 'invest', name: 'Invest' },
  { color: '#FF9800', emoji: '🤝', id: 'assist', name: 'Assist' },
  { color: '#9C27B0', emoji: '📚', id: 'learn', name: 'Learn' },
  { color: '#F44336', emoji: '💪', id: 'health', name: 'Health' },
  { color: '#3F51B5', emoji: '👨‍👩‍👧‍👦', id: 'family', name: 'Family' },
  { color: '#E91E63', emoji: '🔗', id: 'relationships', name: 'Relationships' },
  { color: '#00BCD4', emoji: '🧘', id: 'ego', name: 'Self-Kindness' },
] as const;
