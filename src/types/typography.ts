export interface TypographyPreset {
  id: string;
  name: string;
  category: 'Modern Sans' | 'Cinematic' | 'Bold Display' | 'Condensed' | 'Neon' | 'Emotional' | 'Rap' | 'YouTube Dynamic';
  fontFamily: string;
  fontWeight: string | number;
  letterSpacing: number;
  lineHeight: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fillColor: string;
  outlineColor?: string;
  outlineWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  glowColor?: string;
  glowIntensity?: number;
}
