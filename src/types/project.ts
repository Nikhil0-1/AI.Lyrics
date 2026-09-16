import { LyricLine } from './lyrics';
import { BeatMap } from './beat';
import { BackgroundSettings } from './background';

export type AspectRatio = '9:16' | '16:9' | '1:1';

export interface ProjectMeta {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface AudioTrackInfo {
  sourceUrl: string;
  fileName: string;
  fileSize?: number;
  duration: number; // seconds
  bpm: number;
  sampleRate?: number;
  peaks?: number[]; // pre-computed waveform peaks
}

export interface VideoSettings {
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  fps: number;
  beatSyncEnabled: boolean;
  karaokeModeEnabled: boolean;
  karaokeStyle: {
    activeWordColor: string;
    activeWordGlow: boolean;
    activeWordScale: number; // e.g. 1.15
    activeWordBg: boolean;
    activeWordUnderline: boolean;
  };
}

export interface ProjectData {
  project: ProjectMeta;
  audio: AudioTrackInfo;
  beatMap: BeatMap;
  lyrics: LyricLine[];
  background: BackgroundSettings;
  globalStyle: {
    fontFamily: string;
    fontSize: number;
    fillColor: string;
    animationPreset: string;
  };
  settings: VideoSettings;
}
