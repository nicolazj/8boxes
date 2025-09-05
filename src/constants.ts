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
  description: string;
}> = [
  {
    color: '#4CAF50',
    emoji: '💸',
    id: 'transact',
    name: 'Transact',
    description: 'Direct income-generating work',
  },
  {
    color: '#2196F3',
    emoji: '📈',
    id: 'invest',
    name: 'Invest',
    description: 'Activities that compound in value over time',
  },
  {
    color: '#FF9800',
    emoji: '🤝',
    id: 'assist',
    name: 'Assist',
    description: 'Helping others (mentoring, advising, giving back)',
  },
  {
    color: '#9C27B0',
    emoji: '📚',
    id: 'learn',
    name: 'Learn',
    description: 'Systematically acquiring new skills and knowledge',
  },
  {
    color: '#F44336',
    emoji: '💪',
    id: 'health',
    name: 'Health',
    description: 'Physical and mental well-being',
  },
  {
    color: '#3F51B5',
    emoji: '👨‍👩‍👧‍👦',
    id: 'family',
    name: 'Family',
    description:
      'Nurturing relationships with spouse, children, immediate family',
  },
  {
    color: '#E91E63',
    emoji: '🔗',
    id: 'relationships',
    name: 'Relationships',
    description: 'Maintaining strong friendships and professional networks',
  },
  {
    color: '#00BCD4',
    emoji: '🧘',
    id: 'ego',
    name: 'Self-Kindness',
    description:
      'Doing things that bring joy, gratitude, and personal satisfaction',
  },
] as const;
