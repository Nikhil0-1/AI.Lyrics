import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ProjectData, VideoSettings, AspectRatio } from '../types/project';
import { LyricLine, LyricWord } from '../types/lyrics';
import { BackgroundSettings } from '../types/background';
import { AIRestyleOption } from '../types/animation';
import { audioController } from '../utils/audio';
import { BeatSyncService } from '../engine/BeatSync';
import { generateId } from '../utils/formatting';
import { StyleDirectorService } from '../../server/services/styleDirector';

interface ProjectContextType {
  project: ProjectData;
  currentTime: number;
  isPlaying: boolean;
  zoom: number;
  selectedLineId: string | null;
  selectedWordId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  theme: 'dark' | 'light';

  // Playback
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setZoom: (zoom: number) => void;
  setSelectedLineId: (id: string | null) => void;
  setSelectedWordId: (id: string | null) => void;
  toggleTheme: () => void;

  // History
  undo: () => void;
  redo: () => void;

  // Mutations
  loadProject: (data: ProjectData) => void;
  updateGlobalStyle: (style: Partial<ProjectData['globalStyle']>) => void;
  updateBackground: (bg: Partial<BackgroundSettings>) => void;
  updateSettings: (settings: Partial<VideoSettings>) => void;
  setAspectRatio: (aspect: AspectRatio) => void;
  updateLine: (lineId: string, updates: Partial<LyricLine>) => void;
  updateWordTiming: (lineId: string, wordId: string, start: number, end: number) => void;
  splitLine: (lineId: string, wordIndex: number) => void;
  mergeWithNextLine: (lineId: string) => void;
  addLine: (afterLineId?: string) => void;
  duplicateLine: (lineId: string) => void;
  deleteLine: (lineId: string) => void;
  applyAIRestyle: (option: AIRestyleOption, applyToAll: boolean) => void;
}

const DEFAULT_PROJECT: ProjectData = {
  project: {
    id: 'proj_default',
    name: 'Teri Aankhon Mein — AI Lyric Video',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  audio: {
    sourceUrl: '/samples/hindi-romantic.mp3',
    fileName: 'hindi-romantic.mp3',
    duration: 24.0,
    bpm: 90,
  },
  beatMap: {
    bpm: 90,
    beats: [0.0, 0.67, 1.33, 2.0, 2.67, 3.33, 4.0, 4.67, 5.33, 6.0, 6.67, 7.33, 8.0, 8.67, 9.33, 10.0],
    downbeats: [0.0, 2.67, 5.33, 8.0, 10.67],
    energyCurve: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.5],
    sections: [
      { type: 'intro', start: 0, end: 3.5, energy: 0.35, name: 'Intro' },
      { type: 'verse', start: 3.5, end: 11.0, energy: 0.55, name: 'Verse 1' },
      { type: 'chorus', start: 11.0, end: 20.0, energy: 0.85, name: 'Chorus' },
      { type: 'outro', start: 20.0, end: 24.0, energy: 0.4, name: 'Outro' }
    ]
  },
  lyrics: [
    {
      id: 'line_1',
      text: 'Teri aankhon mein khoya rahoon',
      start: 1.15,
      end: 3.90,
      section: 'intro',
      words: [
        { id: 'w1_1', word: 'Teri', start: 1.20, end: 1.65 },
        { id: 'w1_2', word: 'aankhon', start: 1.65, end: 2.25 },
        { id: 'w1_3', word: 'mein', start: 2.25, end: 2.60 },
        { id: 'w1_4', word: 'khoya', start: 2.60, end: 3.10 },
        { id: 'w1_5', word: 'rahoon', start: 3.10, end: 3.80 }
      ],
      style: {
        fontFamily: 'Cinzel, serif',
        fontSize: 64,
        fillColor: '#F6E05E',
        animationPreset: 'cinematicReveal',
        animationIntensity: 0.8,
        positionX: 50,
        positionY: 50
      }
    },
    {
      id: 'line_2',
      text: 'Har pal tujhko hi chahta rahoon',
      start: 4.40,
      end: 7.50,
      section: 'verse',
      words: [
        { id: 'w2_1', word: 'Har', start: 4.50, end: 4.80 },
        { id: 'w2_2', word: 'pal', start: 4.80, end: 5.20 },
        { id: 'w2_3', word: 'tujhko', start: 5.20, end: 5.85 },
        { id: 'w2_4', word: 'hi', start: 5.85, end: 6.15 },
        { id: 'w2_5', word: 'chahta', start: 6.15, end: 6.75 },
        { id: 'w2_6', word: 'rahoon', start: 6.75, end: 7.40 }
      ],
      style: {
        fontFamily: 'Cinzel, serif',
        fontSize: 64,
        fillColor: '#F6E05E',
        animationPreset: 'smoothReveal',
        animationIntensity: 0.75,
        positionX: 50,
        positionY: 50
      }
    },
    {
      id: 'line_3',
      text: 'Yeh ishq hai tera meri jaan',
      start: 8.40,
      end: 11.80,
      section: 'verse',
      words: [
        { id: 'w3_1', word: 'Yeh', start: 8.50, end: 8.85 },
        { id: 'w3_2', word: 'ishq', start: 8.85, end: 9.35 },
        { id: 'w3_3', word: 'hai', start: 9.35, end: 9.65 },
        { id: 'w3_4', word: 'tera', start: 9.65, end: 10.20 },
        { id: 'w3_5', word: 'meri', start: 10.20, end: 10.75 },
        { id: 'w3_6', word: 'jaan', start: 10.75, end: 11.60 }
      ],
      style: {
        fontFamily: 'Cinzel, serif',
        fontSize: 64,
        fillColor: '#F6E05E',
        animationPreset: 'trackingReveal',
        animationIntensity: 0.8,
        positionX: 50,
        positionY: 50
      }
    },
    {
      id: 'line_4',
      text: 'Dil ki dhadkan bhi tu hai jahaan',
      start: 12.70,
      end: 16.20,
      section: 'chorus',
      words: [
        { id: 'w4_1', word: 'Dil', start: 12.80, end: 13.20 },
        { id: 'w4_2', word: 'ki', start: 13.20, end: 13.50 },
        { id: 'w4_3', word: 'dhadkan', start: 13.50, end: 14.15 },
        { id: 'w4_4', word: 'bhi', start: 14.15, end: 14.45 },
        { id: 'w4_5', word: 'tu', start: 14.45, end: 14.90 },
        { id: 'w4_6', word: 'hai', start: 14.90, end: 15.30 },
        { id: 'w4_7', word: 'jahaan', start: 15.30, end: 16.10 }
      ],
      style: {
        fontFamily: 'Cinzel, serif',
        fontSize: 68,
        fillColor: '#FACC15',
        animationPreset: 'kineticTypography',
        animationIntensity: 0.95,
        positionX: 50,
        positionY: 50
      }
    },
    {
      id: 'line_5',
      text: 'Sath chhodenge na hum kabhi',
      start: 16.90,
      end: 19.90,
      section: 'chorus',
      words: [
        { id: 'w5_1', word: 'Sath', start: 17.00, end: 17.40 },
        { id: 'w5_2', word: 'chhodenge', start: 17.40, end: 18.20 },
        { id: 'w5_3', word: 'na', start: 18.20, end: 18.55 },
        { id: 'w5_4', word: 'hum', start: 18.55, end: 18.95 },
        { id: 'w5_5', word: 'kabhi', start: 18.95, end: 19.80 }
      ],
      style: {
        fontFamily: 'Cinzel, serif',
        fontSize: 66,
        fillColor: '#FACC15',
        animationPreset: 'beatPulse',
        animationIntensity: 0.9,
        positionX: 50,
        positionY: 50
      }
    },
    {
      id: 'line_6',
      text: 'Tujhse hi hai zindagi sabhi',
      start: 20.40,
      end: 23.50,
      section: 'outro',
      words: [
        { id: 'w6_1', word: 'Tujhse', start: 20.50, end: 21.05 },
        { id: 'w6_2', word: 'hi', start: 21.05, end: 21.35 },
        { id: 'w6_3', word: 'hai', start: 21.35, end: 21.65 },
        { id: 'w6_4', word: 'zindagi', start: 21.65, end: 22.40 },
        { id: 'w6_5', word: 'sabhi', start: 22.40, end: 23.30 }
      ],
      style: {
        fontFamily: 'Cinzel, serif',
        fontSize: 62,
        fillColor: '#F6E05E',
        animationPreset: 'fadeOut',
        animationIntensity: 0.6,
        positionX: 50,
        positionY: 50
      }
    }
  ],
  background: {
    type: 'cinematicGradient',
    primaryColor: '#090a16',
    secondaryColor: '#1e1b4b',
    accentColor: '#4338ca',
    speed: 0.9,
    reactiveIntensity: 0.7,
    blur: 20,
    opacity: 1.0
  },
  globalStyle: {
    fontFamily: 'Cinzel, serif',
    fontSize: 64,
    fillColor: '#F6E05E',
    animationPreset: 'cinematicReveal'
  },
  settings: {
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    beatSyncEnabled: true,
    karaokeModeEnabled: true,
    karaokeStyle: {
      activeWordColor: '#FACC15',
      activeWordGlow: true,
      activeWordScale: 1.15,
      activeWordBg: false,
      activeWordUnderline: false
    }
  }
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectData>(DEFAULT_PROJECT);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(DEFAULT_PROJECT.lyrics[0]?.id || null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // History stack for Undo / Redo
  const [past, setPast] = useState<ProjectData[]>([]);
  const [future, setFuture] = useState<ProjectData[]>([]);

  // Push state to undo history
  const commitChange = useCallback((newProject: ProjectData) => {
    setPast(prev => [...prev.slice(-30), project]);
    setFuture([]);
    setProject(newProject);
  }, [project]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(prev => prev.slice(0, prev.length - 1));
    setFuture(prev => [project, ...prev]);
    setProject(previous);
  }, [past, project]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(prev => prev.slice(1));
    setPast(prev => [...prev, project]);
    setProject(next);
  }, [future, project]);

  // Load audio file into Web Audio controller when audio source changes
  useEffect(() => {
    if (project.audio?.sourceUrl) {
      audioController.loadAudio(project.audio.sourceUrl).catch(err => {
        console.warn('Audio controller load warning:', err);
      });
    }
  }, [project.audio?.sourceUrl]);

  // Playback handlers
  const play = useCallback(() => {
    audioController.play(
      currentTime,
      (t) => setCurrentTime(t),
      () => {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    );
    setIsPlaying(true);
  }, [currentTime]);

  const pause = useCallback(() => {
    const pausedTime = audioController.pause();
    setCurrentTime(pausedTime);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const clamped = Math.max(0, Math.min(time, project.audio.duration || 9999));
    setCurrentTime(clamped);
    audioController.seek(clamped);
  }, [project.audio.duration]);

  // Keyboard Shortcuts (Space: Play/Pause, Ctrl+Z: Undo, Ctrl+Shift+Z: Redo, Delete: Delete line, Arrow keys: scrub)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === 'Z' || e.key === 'y') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        redo();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + (e.shiftKey ? 1.0 : 0.2));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - (e.shiftKey ? 1.0 : 0.2));
      } else if (e.key === 'Delete' && selectedLineId) {
        e.preventDefault();
        deleteLine(selectedLineId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, undo, redo, seek, currentTime, selectedLineId]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const loadProject = (data: ProjectData) => {
    setProject(data);
    setPast([]);
    setFuture([]);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedLineId(data.lyrics[0]?.id || null);
  };

  const updateGlobalStyle = (style: Partial<ProjectData['globalStyle']>) => {
    commitChange({
      ...project,
      globalStyle: { ...project.globalStyle, ...style }
    });
  };

  const updateBackground = (bg: Partial<BackgroundSettings>) => {
    commitChange({
      ...project,
      background: { ...project.background, ...bg }
    });
  };

  const updateSettings = (settings: Partial<VideoSettings>) => {
    commitChange({
      ...project,
      settings: { ...project.settings, ...settings }
    });
  };

  const setAspectRatio = (aspect: AspectRatio) => {
    let width = 1080;
    let height = 1920;
    if (aspect === '16:9') {
      width = 1920;
      height = 1080;
    } else if (aspect === '1:1') {
      width = 1080;
      height = 1080;
    }

    updateSettings({
      aspectRatio: aspect,
      width,
      height
    });
  };

  const updateLine = (lineId: string, updates: Partial<LyricLine>) => {
    const updated = project.lyrics.map(l => {
      if (l.id !== lineId) return l;
      let finalUpdates = { ...updates };

      // If beat sync enabled, snap boundaries
      if (project.settings.beatSyncEnabled && (updates.start !== undefined || updates.end !== undefined)) {
        if (updates.start !== undefined) {
          finalUpdates.start = BeatSyncService.snapToBeat(updates.start, project.beatMap);
        }
        if (updates.end !== undefined) {
          finalUpdates.end = BeatSyncService.snapToBeat(updates.end, project.beatMap);
        }
      }

      return {
        ...l,
        ...finalUpdates,
        style: { ...l.style, ...(updates.style || {}) }
      };
    });

    commitChange({ ...project, lyrics: updated });
  };

  const updateWordTiming = (lineId: string, wordId: string, start: number, end: number) => {
    const updated = project.lyrics.map(line => {
      if (line.id !== lineId) return line;
      const updatedWords = line.words.map(w => {
        if (w.id !== wordId) return w;
        return { ...w, start, end };
      });
      return { ...line, words: updatedWords };
    });
    commitChange({ ...project, lyrics: updated });
  };

  const splitLine = (lineId: string, wordIndex: number) => {
    const lineIdx = project.lyrics.findIndex(l => l.id === lineId);
    if (lineIdx === -1) return;
    const targetLine = project.lyrics[lineIdx];
    if (targetLine.words.length <= 1 || wordIndex <= 0 || wordIndex >= targetLine.words.length) return;

    const firstWords = targetLine.words.slice(0, wordIndex);
    const secondWords = targetLine.words.slice(wordIndex);

    const firstLine: LyricLine = {
      ...targetLine,
      text: firstWords.map(w => w.word).join(' '),
      end: firstWords[firstWords.length - 1].end + 0.1,
      words: firstWords
    };

    const secondLine: LyricLine = {
      id: generateId('line'),
      text: secondWords.map(w => w.word).join(' '),
      start: secondWords[0].start - 0.05,
      end: targetLine.end,
      words: secondWords,
      style: { ...targetLine.style },
      section: targetLine.section
    };

    const newLyrics = [...project.lyrics];
    newLyrics.splice(lineIdx, 1, firstLine, secondLine);
    commitChange({ ...project, lyrics: newLyrics });
  };

  const mergeWithNextLine = (lineId: string) => {
    const lineIdx = project.lyrics.findIndex(l => l.id === lineId);
    if (lineIdx === -1 || lineIdx >= project.lyrics.length - 1) return;
    const current = project.lyrics[lineIdx];
    const next = project.lyrics[lineIdx + 1];

    const merged: LyricLine = {
      ...current,
      text: `${current.text} ${next.text}`,
      end: next.end,
      words: [...current.words, ...next.words]
    };

    const newLyrics = [...project.lyrics];
    newLyrics.splice(lineIdx, 2, merged);
    commitChange({ ...project, lyrics: newLyrics });
  };

  const addLine = (afterLineId?: string) => {
    const lineIdx = afterLineId ? project.lyrics.findIndex(l => l.id === afterLineId) : project.lyrics.length - 1;
    const prev = project.lyrics[lineIdx];
    const startTime = prev ? prev.end + 0.5 : currentTime;
    const endTime = startTime + 3.0;

    const newLine: LyricLine = {
      id: generateId('line'),
      text: 'New lyric line here',
      start: parseFloat(startTime.toFixed(2)),
      end: parseFloat(endTime.toFixed(2)),
      words: [
        { id: generateId('w'), word: 'New', start: startTime, end: startTime + 0.6 },
        { id: generateId('w'), word: 'lyric', start: startTime + 0.6, end: startTime + 1.4 },
        { id: generateId('w'), word: 'line', start: startTime + 1.4, end: startTime + 2.1 },
        { id: generateId('w'), word: 'here', start: startTime + 2.1, end: endTime }
      ],
      style: {
        fontFamily: project.globalStyle.fontFamily,
        fontSize: project.globalStyle.fontSize,
        fillColor: project.globalStyle.fillColor,
        animationPreset: project.globalStyle.animationPreset,
        positionX: 50,
        positionY: 50
      },
      section: 'verse'
    };

    const newLyrics = [...project.lyrics];
    newLyrics.splice(lineIdx + 1, 0, newLine);
    commitChange({ ...project, lyrics: newLyrics });
    setSelectedLineId(newLine.id);
  };

  const duplicateLine = (lineId: string) => {
    const lineIdx = project.lyrics.findIndex(l => l.id === lineId);
    if (lineIdx === -1) return;
    const source = project.lyrics[lineIdx];
    const duration = source.end - source.start;
    const newStart = source.end + 0.5;
    const newEnd = newStart + duration;

    const dup: LyricLine = {
      ...source,
      id: generateId('line'),
      start: parseFloat(newStart.toFixed(2)),
      end: parseFloat(newEnd.toFixed(2)),
      words: source.words.map(w => ({
        ...w,
        id: generateId('w'),
        start: parseFloat((w.start + (newStart - source.start)).toFixed(2)),
        end: parseFloat((w.end + (newStart - source.start)).toFixed(2))
      }))
    };

    const newLyrics = [...project.lyrics];
    newLyrics.splice(lineIdx + 1, 0, dup);
    commitChange({ ...project, lyrics: newLyrics });
    setSelectedLineId(dup.id);
  };

  const deleteLine = (lineId: string) => {
    if (project.lyrics.length <= 1) return; // Keep at least one line
    const filtered = project.lyrics.filter(l => l.id !== lineId);
    commitChange({ ...project, lyrics: filtered });
    if (selectedLineId === lineId) {
      setSelectedLineId(filtered[0]?.id || null);
    }
  };

  const applyAIRestyle = (option: AIRestyleOption, applyToAll: boolean) => {
    const result = StyleDirectorService.applyRestyle(
      option,
      project.lyrics,
      applyToAll ? undefined : (selectedLineId || undefined)
    );

    let updated = {
      ...project,
      lyrics: result.lines
    };

    if (applyToAll) {
      if (result.backgroundModifier) {
        updated.background = { ...updated.background, ...result.backgroundModifier };
      }
      if (result.globalFont) {
        updated.globalStyle = { ...updated.globalStyle, fontFamily: result.globalFont };
      }
    }

    commitChange(updated);
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        currentTime,
        isPlaying,
        zoom,
        selectedLineId,
        selectedWordId,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        theme,
        play,
        pause,
        togglePlay,
        seek,
        setZoom,
        setSelectedLineId,
        setSelectedWordId,
        toggleTheme,
        undo,
        redo,
        loadProject,
        updateGlobalStyle,
        updateBackground,
        updateSettings,
        setAspectRatio,
        updateLine,
        updateWordTiming,
        splitLine,
        mergeWithNextLine,
        addLine,
        duplicateLine,
        deleteLine,
        applyAIRestyle
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
};
