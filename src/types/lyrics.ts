export interface LyricWord {
  id: string;
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface LyricStyle {
  fontFamily?: string;
  fontSize?: number; // relative base size
  fontWeight?: string | number;
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  fillColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  glowColor?: string;
  glowIntensity?: number;
  animationPreset?: string;
  animationIntensity?: number;
  positionX?: number; // percentage 0-100 (50 is center)
  positionY?: number; // percentage 0-100 (50 is center)
  rotation?: number;  // degrees
  scale?: number;     // 1.0 is default
}

export interface LyricLine {
  id: string;
  text: string;
  start: number; // in seconds
  end: number;   // in seconds
  words: LyricWord[];
  style: LyricStyle;
  section?: 'intro' | 'verse' | 'pre-chorus' | 'chorus' | 'bridge' | 'drop' | 'outro';
}
