export type BackgroundType =
  | 'cinematicGradient'
  | 'darkCinematic'
  | 'abstractMotion'
  | 'particles'
  | 'flowingGradient'
  | 'waveform'
  | 'equalizer'
  | 'lightStreaks'
  | 'subtleGrain'
  | 'bokeh'
  | 'minimalSolid'
  | 'animatedShapes';

export interface BackgroundSettings {
  type: BackgroundType;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  speed: number;       // 0.1 to 3.0
  particleCount?: number;
  reactiveIntensity: number; // 0.0 to 1.0 (how much it dances to music)
  blur: number;        // 0 to 40px
  opacity: number;     // 0.0 to 1.0
  zoomEffect?: boolean;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  type: BackgroundType;
  description: string;
  settings: BackgroundSettings;
}
