type ActivityType = 'discovery' | 'hiking' | 'history' | 'food' | 'entertainment';

interface FormData {
  destination: string;
  days: number;
  activities: ActivityType[];
  budget: 'budget' | 'moderate' | 'luxury';
  travelStyle: 'relaxed' | 'balanced' | 'intensive';
};

export type { ActivityType, FormData };