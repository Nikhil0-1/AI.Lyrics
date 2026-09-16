import { BeatMap, SongSectionType } from '../../src/types/beat';
import { BackgroundSettings } from '../../src/types/background';
import { LyricLine } from '../../src/types/lyrics';
import { AIRestyleOption } from '../../src/types/animation';

export interface StyleDirectorDecision {
  styleName: string;
  fontFamily: string;
  fontSize: number;
  fillColor: string;
  primaryAnimation: string;
  animationIntensity: number;
  background: BackgroundSettings;
  karaokeColor: string;
}

export class StyleDirectorService {
  /**
   * Intelligently orchestrates typography, animations, and backgrounds based on song mood, tempo, and genre
   */
  public static direct(
    bpm: number,
    language: string,
    genre?: string,
    beatMap?: BeatMap
  ): StyleDirectorDecision {
    const isFast = bpm > 115;
    const isMedium = bpm >= 95 && bpm <= 115;
    const isSlow = bpm < 95;

    // Default to cinematic mood for ballads / Hindi / emotional songs
    if (isSlow || genre?.toLowerCase().includes('romantic') || genre?.toLowerCase().includes('ballad')) {
      return {
        styleName: 'Cinematic Emotional',
        fontFamily: 'Cinzel, serif',
        fontSize: 64,
        fillColor: '#F6E05E',
        primaryAnimation: 'cinematicReveal',
        animationIntensity: 0.75,
        karaokeColor: '#FACC15',
        background: {
          type: 'cinematicGradient',
          primaryColor: '#090a16',
          secondaryColor: '#1e1b4b',
          accentColor: '#4338ca',
          speed: 0.9,
          reactiveIntensity: 0.7,
          blur: 20,
          opacity: 1.0
        }
      };
    }

    // Upbeat pop / energetic
    if (isFast || genre?.toLowerCase().includes('pop') || genre?.toLowerCase().includes('synth')) {
      return {
        styleName: 'Neon Cyberpop',
        fontFamily: 'Outfit, sans-serif',
        fontSize: 68,
        fillColor: '#FFFFFF',
        primaryAnimation: 'kineticTypography',
        animationIntensity: 0.9,
        karaokeColor: '#22D3EE',
        background: {
          type: 'particles',
          primaryColor: '#0b0c10',
          secondaryColor: '#1f2833',
          accentColor: '#38bdf8',
          particleCount: 70,
          speed: 1.3,
          reactiveIntensity: 0.95,
          blur: 2,
          opacity: 0.95
        }
      };
    }

    // Punjabi / High Bass / Desi Hip Hop
    if (genre?.toLowerCase().includes('punjabi') || genre?.toLowerCase().includes('hip hop') || genre?.toLowerCase().includes('rap')) {
      return {
        styleName: 'Impact Street',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 72,
        fillColor: '#FFFFFF',
        primaryAnimation: 'beatPulse',
        animationIntensity: 0.95,
        karaokeColor: '#FACC15',
        background: {
          type: 'equalizer',
          primaryColor: '#030712',
          secondaryColor: '#111827',
          accentColor: '#10b981',
          speed: 1.4,
          reactiveIntensity: 1.0,
          blur: 0,
          opacity: 0.9
        }
      };
    }

    // Chill / Lo-Fi / Hinglish
    return {
      styleName: 'Lo-Fi Ambient',
      fontFamily: 'Inter, sans-serif',
      fontSize: 62,
      fillColor: '#F8FAFC',
      primaryAnimation: 'smoothReveal',
      animationIntensity: 0.7,
      karaokeColor: '#FB7185',
      background: {
        type: 'flowingGradient',
        primaryColor: '#1a0505',
        secondaryColor: '#450a0a',
        accentColor: '#f97316',
        speed: 1.0,
        reactiveIntensity: 0.75,
        blur: 25,
        opacity: 1.0
      }
    };
  }

  /**
   * Assigns diverse, context-aware animations across lyrics lines based on song section
   * (Intro -> Fade/Cinematic, Verse -> Smooth Reveal, Chorus -> Kinetic/BeatPulse, Drop -> Impact/Shake, Outro -> Fade)
   */
  public static assignSectionAnimations(
    lines: LyricLine[],
    beatMap: BeatMap,
    baseDecision: StyleDirectorDecision
  ): LyricLine[] {
    return lines.map((line, idx) => {
      // Determine what section this line falls in
      const lineCenter = (line.start + line.end) / 2;
      const section = beatMap.sections.find(s => lineCenter >= s.start && lineCenter < s.end) 
        || { type: 'verse' as SongSectionType, energy: 0.5 };

      let anim = baseDecision.primaryAnimation;
      let intensity = baseDecision.animationIntensity;

      switch (section.type) {
        case 'intro':
          anim = 'blurReveal';
          intensity = 0.6;
          break;
        case 'verse':
          // Alternate between smooth reveal and tracking reveal for dynamic pacing
          anim = idx % 2 === 0 ? 'smoothReveal' : 'slideUp';
          intensity = 0.7;
          break;
        case 'pre-chorus':
        case 'bridge':
          anim = 'scaleIn';
          intensity = 0.8;
          break;
        case 'chorus':
          anim = 'kineticTypography';
          intensity = 0.95;
          break;
        case 'drop':
          anim = 'impact';
          intensity = 1.0;
          break;
        case 'outro':
          anim = 'fadeOut';
          intensity = 0.5;
          break;
      }

      return {
        ...line,
        section: section.type,
        style: {
          ...line.style,
          fontFamily: baseDecision.fontFamily,
          fontSize: baseDecision.fontSize,
          fillColor: baseDecision.fillColor,
          animationPreset: anim,
          animationIntensity: intensity,
          positionX: 50,
          positionY: 50,
          scale: 1.0,
          rotation: 0
        }
      };
    });
  }

  /**
   * Applies an AI Re-Style intent to target lines or entire project
   */
  public static applyRestyle(
    option: AIRestyleOption,
    currentLines: LyricLine[],
    targetLineId?: string
  ): { lines: LyricLine[]; backgroundModifier?: Partial<BackgroundSettings>; globalFont?: string } {
    let newAnim = 'smoothReveal';
    let newFont = 'Inter, sans-serif';
    let intensity = 0.7;
    let bgMod: Partial<BackgroundSettings> = {};

    switch (option) {
      case 'cinematic':
        newAnim = 'cinematicReveal';
        newFont = 'Cinzel, serif';
        intensity = 0.8;
        bgMod = { type: 'cinematicGradient', blur: 25, reactiveIntensity: 0.7 };
        break;
      case 'minimal':
        newAnim = 'fadeIn';
        newFont = 'Inter, sans-serif';
        intensity = 0.5;
        bgMod = { type: 'minimalSolid', reactiveIntensity: 0.3 };
        break;
      case 'energetic':
        newAnim = 'pop';
        newFont = 'Montserrat, sans-serif';
        intensity = 0.95;
        bgMod = { type: 'particles', speed: 1.6, reactiveIntensity: 1.0 };
        break;
      case 'emotional':
        newAnim = 'blurReveal';
        newFont = 'Playfair Display, serif';
        intensity = 0.65;
        bgMod = { type: 'bokeh', speed: 0.8, reactiveIntensity: 0.6 };
        break;
      case 'dynamic':
        newAnim = 'kineticTypography';
        newFont = 'Outfit, sans-serif';
        intensity = 0.95;
        bgMod = { type: 'equalizer', speed: 1.5, reactiveIntensity: 0.95 };
        break;
      case 'beatFocused':
        newAnim = 'beatPulse';
        newFont = 'Bebas Neue, sans-serif';
        intensity = 1.0;
        bgMod = { type: 'waveform', reactiveIntensity: 1.0 };
        break;
    }

    const updatedLines = currentLines.map(line => {
      if (!targetLineId || line.id === targetLineId) {
        return {
          ...line,
          style: {
            ...line.style,
            animationPreset: newAnim,
            fontFamily: newFont,
            animationIntensity: intensity
          }
        };
      }
      return line;
    });

    return {
      lines: updatedLines,
      backgroundModifier: bgMod,
      globalFont: newFont
    };
  }
}
