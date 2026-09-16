import { AnimationPreset } from '../../types/animation';

export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  // TEXT ANIMATIONS
  fadeIn: {
    id: 'fadeIn',
    name: 'Fade In',
    category: 'TEXT',
    duration: 0.5,
    intensity: 0.5,
    easing: 'easeOut',
    description: 'Smooth opacity fade-in transition'
  },
  fadeOut: {
    id: 'fadeOut',
    name: 'Fade Out',
    category: 'TEXT',
    duration: 0.5,
    intensity: 0.5,
    easing: 'easeIn',
    description: 'Gentle opacity dissolve'
  },
  smoothReveal: {
    id: 'smoothReveal',
    name: 'Smooth Reveal',
    category: 'TEXT',
    duration: 0.6,
    intensity: 0.6,
    easing: 'easeInOut',
    description: 'Velvety slide-up with subtle blur dissolution'
  },
  blurReveal: {
    id: 'blurReveal',
    name: 'Blur Reveal',
    category: 'TEXT',
    duration: 0.7,
    intensity: 0.8,
    easing: 'easeOut',
    description: 'Soft cinematic blur focusing into crisp clarity'
  },
  slideUp: {
    id: 'slideUp',
    name: 'Slide Up',
    category: 'TEXT',
    duration: 0.45,
    intensity: 0.6,
    easing: 'easeOut',
    description: 'Dynamic upward translation entry'
  },
  slideDown: {
    id: 'slideDown',
    name: 'Slide Down',
    category: 'TEXT',
    duration: 0.45,
    intensity: 0.6,
    easing: 'easeOut',
    description: 'Downward drop transition'
  },
  slideLeft: {
    id: 'slideLeft',
    name: 'Slide Left',
    category: 'TEXT',
    duration: 0.45,
    intensity: 0.6,
    easing: 'easeOut',
    description: 'Horizontal slide entry from the right'
  },
  slideRight: {
    id: 'slideRight',
    name: 'Slide Right',
    category: 'TEXT',
    duration: 0.45,
    intensity: 0.6,
    easing: 'easeOut',
    description: 'Horizontal slide entry from the left'
  },
  scaleIn: {
    id: 'scaleIn',
    name: 'Scale In',
    category: 'TEXT',
    duration: 0.5,
    intensity: 0.7,
    easing: 'easeOut',
    description: 'Expands smoothly from center outward'
  },
  scaleOut: {
    id: 'scaleOut',
    name: 'Scale Out',
    category: 'TEXT',
    duration: 0.5,
    intensity: 0.7,
    easing: 'easeIn',
    description: 'Zooms in close while dissolving away'
  },
  pop: {
    id: 'pop',
    name: 'Pop',
    category: 'TEXT',
    duration: 0.35,
    intensity: 0.8,
    easing: 'bounce',
    description: 'Snappy punchy pop scale effect'
  },
  bounce: {
    id: 'bounce',
    name: 'Bounce',
    category: 'TEXT',
    duration: 0.6,
    intensity: 0.8,
    easing: 'bounce',
    description: 'Playful rhythmic bounce landing'
  },
  typewriter: {
    id: 'typewriter',
    name: 'Typewriter',
    category: 'TEXT',
    duration: 0.8,
    intensity: 0.5,
    easing: 'linear',
    description: 'Sequential character-by-character typing appearance'
  },
  letterReveal: {
    id: 'letterReveal',
    name: 'Letter Reveal',
    category: 'TEXT',
    duration: 0.7,
    intensity: 0.7,
    easing: 'easeOut',
    description: 'Staggered cascading reveal of each character'
  },
  wordReveal: {
    id: 'wordReveal',
    name: 'Word Reveal',
    category: 'TEXT',
    duration: 0.6,
    intensity: 0.7,
    easing: 'easeOut',
    description: 'Sequential appearance synchronized to word timings'
  },
  trackingReveal: {
    id: 'trackingReveal',
    name: 'Tracking Reveal',
    category: 'TEXT',
    duration: 0.75,
    intensity: 0.65,
    easing: 'easeInOut',
    description: 'Letter spacing expands smoothly from tight to wide'
  },
  maskReveal: {
    id: 'maskReveal',
    name: 'Mask Reveal',
    category: 'TEXT',
    duration: 0.55,
    intensity: 0.7,
    easing: 'easeInOut',
    description: 'Appears through an invisible horizontal wipe boundary'
  },
  cinematicReveal: {
    id: 'cinematicReveal',
    name: 'Cinematic Reveal',
    category: 'TEXT',
    duration: 0.85,
    intensity: 0.75,
    easing: 'easeInOut',
    description: 'Grand anamorphic blur, subtle zoom and luminous glow'
  },

  // DYNAMIC ANIMATIONS
  beatPulse: {
    id: 'beatPulse',
    name: 'Beat Pulse',
    category: 'DYNAMIC',
    duration: 0.3,
    intensity: 0.85,
    easing: 'elastic',
    description: 'Pulses in size and luminosity synchronously on musical beats'
  },
  impact: {
    id: 'impact',
    name: 'Impact Scale',
    category: 'DYNAMIC',
    duration: 0.4,
    intensity: 0.9,
    easing: 'elastic',
    description: 'Heavy bass-drop slam with screen impact energy'
  },
  shake: {
    id: 'shake',
    name: 'Shake',
    category: 'DYNAMIC',
    duration: 0.35,
    intensity: 0.8,
    easing: 'easeInOut',
    description: 'High-energy rhythmic tremor on emphasis words'
  },
  flash: {
    id: 'flash',
    name: 'Flash',
    category: 'DYNAMIC',
    duration: 0.25,
    intensity: 0.9,
    easing: 'easeOut',
    description: 'Luminous light burst accentuating beat accents'
  },
  glitch: {
    id: 'glitch',
    name: 'Glitch',
    category: 'DYNAMIC',
    duration: 0.3,
    intensity: 0.85,
    easing: 'linear',
    description: 'Cyberpunk chromatic aberration and horizontal slice displacement'
  },
  elastic: {
    id: 'elastic',
    name: 'Elastic',
    category: 'DYNAMIC',
    duration: 0.65,
    intensity: 0.8,
    easing: 'elastic',
    description: 'Springy rubber-band overshoot motion'
  },
  rotation: {
    id: 'rotation',
    name: 'Rotation Tilt',
    category: 'DYNAMIC',
    duration: 0.5,
    intensity: 0.6,
    easing: 'easeOut',
    description: 'Dynamic angled tilt adding musical swagger'
  },
  wave: {
    id: 'wave',
    name: 'Wave',
    category: 'DYNAMIC',
    duration: 0.8,
    intensity: 0.6,
    easing: 'easeInOut',
    description: 'Floating sinusoidal letter undulation'
  },
  floating: {
    id: 'floating',
    name: 'Floating Ambient',
    category: 'DYNAMIC',
    duration: 1.5,
    intensity: 0.4,
    easing: 'easeInOut',
    description: 'Gentle continuous hovering motion like weightless space'
  },
  kineticTypography: {
    id: 'kineticTypography',
    name: 'Kinetic Typography',
    category: 'DYNAMIC',
    duration: 0.45,
    intensity: 0.95,
    easing: 'easeOut',
    description: 'High-octane YouTube style: rapid multi-directional dynamic word pop'
  },

  // KARAOKE ANIMATIONS
  wordHighlight: {
    id: 'wordHighlight',
    name: 'Word Highlight',
    category: 'KARAOKE',
    duration: 0.2,
    intensity: 0.8,
    easing: 'easeOut',
    description: 'Active singing word lights up with prominent contrasting color'
  },
  progressiveHighlight: {
    id: 'progressiveHighlight',
    name: 'Progressive Fill',
    category: 'KARAOKE',
    duration: 0.3,
    intensity: 0.8,
    easing: 'linear',
    description: 'Smooth liquid color sweep from left to right as word is sung'
  },
  activeWordScale: {
    id: 'activeWordScale',
    name: 'Active Word Scale',
    category: 'KARAOKE',
    duration: 0.25,
    intensity: 0.85,
    easing: 'elastic',
    description: 'Currently sung word expands larger than adjacent lyrics'
  },
  activeWordGlow: {
    id: 'activeWordGlow',
    name: 'Active Word Glow',
    category: 'KARAOKE',
    duration: 0.3,
    intensity: 0.9,
    easing: 'easeOut',
    description: 'Radiates intense neon aura while active'
  },
  activeWordColor: {
    id: 'activeWordColor',
    name: 'Active Word Color',
    category: 'KARAOKE',
    duration: 0.2,
    intensity: 0.7,
    easing: 'easeOut',
    description: 'Tint shifts instantly to high-visibility highlight color'
  },
  activeWordBackground: {
    id: 'activeWordBackground',
    name: 'Active Word Pill Background',
    category: 'KARAOKE',
    duration: 0.25,
    intensity: 0.75,
    easing: 'easeInOut',
    description: 'Subtle translucent badge background hugs the singing word'
  }
};

export const ANIMATION_LIST = Object.values(ANIMATION_PRESETS);
