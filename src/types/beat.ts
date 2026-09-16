export type SongSectionType = 'intro' | 'verse' | 'pre-chorus' | 'chorus' | 'bridge' | 'drop' | 'outro';

export interface SongSection {
  type: SongSectionType;
  start: number; // in seconds
  end: number;   // in seconds
  energy: number; // 0.0 - 1.0
  name?: string;
}

export interface BeatMap {
  bpm: number;
  beats: number[];       // timestamps of detected beats in seconds
  downbeats: number[];   // timestamps of measures/downbeats
  energyCurve: number[]; // normalized energy values sampled across the track
  sections: SongSection[];
}
