import { LyricWord } from '../types/lyrics';
import { VideoSettings } from '../types/project';

export interface ActiveWordState {
  wordId: string;
  index: number;
  progress: number; // 0.0 to 1.0
  isActive: boolean;
  isPast: boolean;
  scale: number;
  glow: boolean;
  highlightColor: string;
}

export class KaraokeEngine {
  /**
   * Determine states for all words in a lyric line at the given time
   */
  public static getWordStates(
    words: LyricWord[],
    currentTime: number,
    settings: VideoSettings['karaokeStyle']
  ): ActiveWordState[] {
    if (!words || words.length === 0) return [];

    return words.map((w, idx) => {
      const isPast = currentTime > w.end;
      const isFuture = currentTime < w.start;
      const isActive = currentTime >= w.start && currentTime <= w.end;

      let progress = 0;
      if (isPast) progress = 1;
      else if (isActive) {
        const dur = Math.max(0.01, w.end - w.start);
        progress = Math.max(0, Math.min(1, (currentTime - w.start) / dur));
      }

      // Smooth bounce on activation
      let scale = 1.0;
      if (isActive) {
        const peakScale = settings.activeWordScale || 1.15;
        // Bounce envelope: peak at 30% duration, settle down slightly
        scale = 1.0 + (peakScale - 1.0) * Math.sin(progress * Math.PI);
      }

      return {
        wordId: w.id,
        index: idx,
        progress,
        isActive,
        isPast,
        scale,
        glow: isActive && settings.activeWordGlow,
        highlightColor: settings.activeWordColor || '#FACC15'
      };
    });
  }
}
