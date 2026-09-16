export type AnimationCategory = 'TEXT' | 'DYNAMIC' | 'KARAOKE';

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';

export interface AnimationPreset {
  id: string;
  name: string;
  category: AnimationCategory;
  duration: number; // default animation transition duration in seconds
  intensity: number; // 0.0 to 1.0
  easing: EasingType;
  description: string;
  parameters?: Record<string, any>;
}

export type AIRestyleOption = 
  | 'cinematic'
  | 'minimal'
  | 'energetic'
  | 'emotional'
  | 'dynamic'
  | 'beatFocused';
