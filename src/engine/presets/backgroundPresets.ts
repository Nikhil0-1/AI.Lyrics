import { BackgroundPreset } from '../../types/background';

export const BACKGROUND_PRESETS: Record<string, BackgroundPreset> = {
  cinematicGradient: {
    id: 'cinematicGradient',
    name: 'Cinematic Indigo',
    type: 'cinematicGradient',
    description: 'Deep midnight blue with swirling indigo and violet aurora tones',
    settings: {
      type: 'cinematicGradient',
      primaryColor: '#090a16',
      secondaryColor: '#1e1b4b',
      accentColor: '#4338ca',
      speed: 1.0,
      reactiveIntensity: 0.7,
      blur: 20,
      opacity: 1.0
    }
  },
  darkCinematic: {
    id: 'darkCinematic',
    name: 'Dark Studio Glow',
    type: 'darkCinematic',
    description: 'Minimalist obsidian stage with responsive radial core illumination',
    settings: {
      type: 'darkCinematic',
      primaryColor: '#050508',
      secondaryColor: '#12131c',
      accentColor: '#6366f1',
      speed: 0.8,
      reactiveIntensity: 0.85,
      blur: 30,
      opacity: 1.0
    }
  },
  particles: {
    id: 'particles',
    name: 'Stardust Particles',
    type: 'particles',
    description: 'Floating luminous dust motes reacting to musical frequency peaks',
    settings: {
      type: 'particles',
      primaryColor: '#0b0c10',
      secondaryColor: '#1f2833',
      accentColor: '#66fcf1',
      particleCount: 65,
      speed: 1.2,
      reactiveIntensity: 0.9,
      blur: 2,
      opacity: 0.95
    }
  },
  waveform: {
    id: 'waveform',
    name: 'Audio Wavefield',
    type: 'waveform',
    description: 'Living audio oscilloscope bars pulsating behind typography',
    settings: {
      type: 'waveform',
      primaryColor: '#0a0a0f',
      secondaryColor: '#181824',
      accentColor: '#a855f7',
      speed: 1.0,
      reactiveIntensity: 1.0,
      blur: 0,
      opacity: 0.85
    }
  },
  equalizer: {
    id: 'equalizer',
    name: 'Spectrum Equalizer',
    type: 'equalizer',
    description: 'Dynamic neon frequency bars mirroring bass and treble energy',
    settings: {
      type: 'equalizer',
      primaryColor: '#030712',
      secondaryColor: '#111827',
      accentColor: '#10b981',
      speed: 1.5,
      reactiveIntensity: 0.95,
      blur: 0,
      opacity: 0.9
    }
  },
  abstractMotion: {
    id: 'abstractMotion',
    name: 'Liquid Abstract Flow',
    type: 'abstractMotion',
    description: 'Organic undulating liquid silk ribbon motions',
    settings: {
      type: 'abstractMotion',
      primaryColor: '#18042b',
      secondaryColor: '#4a044e',
      accentColor: '#e879f9',
      speed: 1.4,
      reactiveIntensity: 0.75,
      blur: 15,
      opacity: 0.95
    }
  },
  flowingGradient: {
    id: 'flowingGradient',
    name: 'Sunset Ambient',
    type: 'flowingGradient',
    description: 'Warm velvet peach, magenta, and deep ember hues',
    settings: {
      type: 'flowingGradient',
      primaryColor: '#1a0505',
      secondaryColor: '#450a0a',
      accentColor: '#f97316',
      speed: 1.1,
      reactiveIntensity: 0.7,
      blur: 25,
      opacity: 1.0
    }
  },
  bokeh: {
    id: 'bokeh',
    name: 'Anamorphic Bokeh',
    type: 'bokeh',
    description: 'Soft out-of-focus atmospheric lens orbs drifting gracefully',
    settings: {
      type: 'bokeh',
      primaryColor: '#050505',
      secondaryColor: '#18181b',
      accentColor: '#fbbf24',
      speed: 0.7,
      reactiveIntensity: 0.6,
      blur: 8,
      opacity: 0.9
    }
  },
  lightStreaks: {
    id: 'lightStreaks',
    name: 'Laser Light Streaks',
    type: 'lightStreaks',
    description: 'High velocity prismatic light beams cutting across the darkness',
    settings: {
      type: 'lightStreaks',
      primaryColor: '#020617',
      secondaryColor: '#0f172a',
      accentColor: '#38bdf8',
      speed: 1.8,
      reactiveIntensity: 0.95,
      blur: 4,
      opacity: 0.9
    }
  },
  minimalSolid: {
    id: 'minimalSolid',
    name: 'Minimal Obsidian',
    type: 'minimalSolid',
    description: 'Pure focused black backdrop highlighting typography precision',
    settings: {
      type: 'minimalSolid',
      primaryColor: '#000000',
      secondaryColor: '#0a0a0a',
      speed: 0,
      reactiveIntensity: 0.2,
      blur: 0,
      opacity: 1.0
    }
  }
};

export const BACKGROUND_LIST = Object.values(BACKGROUND_PRESETS);
