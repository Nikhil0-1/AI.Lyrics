import { BeatMap } from '../types/beat';

export class BeatSyncService {
  /**
   * Find nearest beat in seconds
   */
  public static findNearestBeat(time: number, beats: number[], threshold = 0.2): number | null {
    if (!beats || beats.length === 0) return null;
    let closest = beats[0];
    let minDiff = Math.abs(time - closest);

    for (let i = 1; i < beats.length; i++) {
      const diff = Math.abs(time - beats[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = beats[i];
      }
    }

    return minDiff <= threshold ? closest : null;
  }

  /**
   * Calculate current beat phase and pulse factor (0.0 to 1.0)
   * Peaks at 1.0 right on the beat, decays exponentially towards the next beat.
   */
  public static getBeatPulseFactor(currentTime: number, beatMap: BeatMap): number {
    if (!beatMap || !beatMap.beats || beatMap.beats.length === 0) return 0;
    
    // Find index of current or previous beat
    let prevBeat = 0;
    let nextBeat = 1;

    for (let i = 0; i < beatMap.beats.length; i++) {
      if (beatMap.beats[i] <= currentTime) {
        prevBeat = beatMap.beats[i];
        nextBeat = beatMap.beats[i + 1] || prevBeat + (60 / (beatMap.bpm || 120));
      } else {
        break;
      }
    }

    const beatDuration = Math.max(0.1, nextBeat - prevBeat);
    const elapsedSinceBeat = currentTime - prevBeat;
    const progress = Math.max(0, Math.min(1, elapsedSinceBeat / beatDuration));

    // Exponential decay pulse curve: instant sharp peak, quick decay
    return Math.max(0, Math.exp(-progress * 6));
  }

  /**
   * Snaps a timestamp to the closest beat if within snapping threshold
   */
  public static snapToBeat(time: number, beatMap: BeatMap, threshold = 0.15): number {
    if (!beatMap || !beatMap.beats || beatMap.beats.length === 0) return time;
    const nearest = this.findNearestBeat(time, beatMap.beats, threshold);
    return nearest !== null ? nearest : time;
  }

  /**
   * Identify current song section (intro, verse, chorus, etc.)
   */
  public static getCurrentSection(currentTime: number, beatMap: BeatMap) {
    if (!beatMap || !beatMap.sections || beatMap.sections.length === 0) {
      return { type: 'verse' as const, start: 0, end: 9999, energy: 0.5 };
    }
    const section = beatMap.sections.find(s => currentTime >= s.start && currentTime < s.end);
    return section || beatMap.sections[beatMap.sections.length - 1];
  }
}
