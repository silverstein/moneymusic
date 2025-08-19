export interface WealthScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompts: string[];
  duration: number;
  category:
    | 'morning'
    | 'work'
    | 'focus'
    | 'celebration'
    | 'evening'
    | 'mindset'
    | 'custom';
  energy: 'calm' | 'moderate' | 'high' | 'intense';
  gradient: string;
}

export interface MusicGeneration {
  id: string;
  prompt: string;
  scenarioId?: string;
  audioUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  duration: number;
  createdAt: Date;
  title?: string;
  error?: string;
}

export interface GenerationPlan {
  globalStyle: string;
  sections: {
    style: string;
    duration: number;
  }[];
}
