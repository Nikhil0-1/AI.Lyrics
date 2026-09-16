import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { ANIMATION_LIST } from '../../engine/presets/animationPresets';
import { TYPOGRAPHY_LIST } from '../../engine/presets/typographyPresets';
import { SongSectionType } from '../../types/beat';
import { formatTimecode } from '../../utils/formatting';
import { Sliders, Clock, Move, Sparkles, Type } from 'lucide-react';

export const Inspector: React.FC = () => {
  const {
    project,
    selectedLineId,
    updateLine,
    updateWordTiming,
    seek
  } = useProject();

  const selectedLine = project.lyrics.find(l => l.id === selectedLineId);

  if (!selectedLine) {
    return (
      <aside className="w-72 border-l border-studio-800 bg-studio-900/95 p-6 flex flex-col items-center justify-center text-center select-none text-slate-500">
        <Sliders className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-xs font-semibold">No Lyric Selected</p>
        <p className="text-[11px] mt-1">Click a lyric line in the timeline or sidebar to inspect and tweak properties.</p>
      </aside>
    );
  }

  const style = selectedLine.style;

  return (
    <aside className="w-72 border-l border-studio-800 bg-studio-900/95 flex flex-col shrink-0 select-none overflow-y-auto p-4 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-studio-800">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Properties</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-800 text-indigo-300">
          {formatTimecode(selectedLine.start)} - {formatTimecode(selectedLine.end)}
        </span>
      </div>

      {/* 1. Timing Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Timing & Section</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Start (s)</label>
            <input
              type="number"
              step="0.05"
              value={selectedLine.start}
              onChange={(e) => updateLine(selectedLine.id, { start: parseFloat(e.target.value) || 0 })}
              className="w-full bg-studio-800 border border-studio-700 rounded-lg p-1.5 text-xs font-mono text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">End (s)</label>
            <input
              type="number"
              step="0.05"
              value={selectedLine.end}
              onChange={(e) => updateLine(selectedLine.id, { end: parseFloat(e.target.value) || 0 })}
              className="w-full bg-studio-800 border border-studio-700 rounded-lg p-1.5 text-xs font-mono text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Song Section</label>
          <select
            value={selectedLine.section || 'verse'}
            onChange={(e) => updateLine(selectedLine.id, { section: e.target.value as SongSectionType })}
            className="w-full bg-studio-800 border border-studio-700 rounded-lg p-1.5 text-xs text-white outline-none focus:border-indigo-500"
          >
            <option value="intro">Intro</option>
            <option value="verse">Verse</option>
            <option value="pre-chorus">Pre-Chorus</option>
            <option value="chorus">Chorus</option>
            <option value="bridge">Bridge</option>
            <option value="drop">Drop</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>

      {/* 2. Animation & Motion */}
      <div className="space-y-2.5 pt-3 border-t border-studio-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Animation Preset</span>
        </div>

        <select
          value={style.animationPreset || 'smoothReveal'}
          onChange={(e) => updateLine(selectedLine.id, { style: { animationPreset: e.target.value } })}
          className="w-full bg-studio-800 border border-studio-700 rounded-lg p-1.5 text-xs text-white outline-none focus:border-indigo-500"
        >
          {ANIMATION_LIST.map(a => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.category})
            </option>
          ))}
        </select>

        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Intensity</span>
            <span>{Math.round((style.animationIntensity !== undefined ? style.animationIntensity : 0.8) * 100)}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={Math.round((style.animationIntensity !== undefined ? style.animationIntensity : 0.8) * 100)}
            onChange={(e) => updateLine(selectedLine.id, { style: { animationIntensity: parseInt(e.target.value) / 100 } })}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* 3. Typography & Styling */}
      <div className="space-y-2.5 pt-3 border-t border-studio-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <span>Line Typography</span>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Font Size</span>
            <span>{style.fontSize || 64}px</span>
          </div>
          <input
            type="range"
            min="28"
            max="120"
            value={style.fontSize || 64}
            onChange={(e) => updateLine(selectedLine.id, { style: { fontSize: parseInt(e.target.value) } })}
            className="w-full accent-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Color</label>
            <div className="flex items-center gap-1.5 bg-studio-800 p-1 rounded-lg border border-studio-700">
              <input
                type="color"
                value={style.fillColor || '#ffffff'}
                onChange={(e) => updateLine(selectedLine.id, { style: { fillColor: e.target.value } })}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-[10px] font-mono text-slate-300 truncate">{style.fillColor || '#fff'}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Glow</label>
            <div className="flex items-center gap-1.5 bg-studio-800 p-1 rounded-lg border border-studio-700">
              <input
                type="color"
                value={style.glowColor || '#6366f1'}
                onChange={(e) => updateLine(selectedLine.id, {
                  style: { glowColor: e.target.value, glowIntensity: 0.8 }
                })}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-[10px] font-mono text-slate-300 truncate">{style.glowColor || 'none'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Transform & Position */}
      <div className="space-y-2.5 pt-3 border-t border-studio-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Move className="w-3.5 h-3.5 text-slate-400" />
          <span>Position & Transform</span>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Vertical Y</span>
            <span>{style.positionY !== undefined ? style.positionY : 50}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={style.positionY !== undefined ? style.positionY : 50}
            onChange={(e) => updateLine(selectedLine.id, { style: { positionY: parseInt(e.target.value) } })}
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Rotation</span>
            <span>{style.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            value={style.rotation || 0}
            onChange={(e) => updateLine(selectedLine.id, { style: { rotation: parseInt(e.target.value) } })}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* 5. Word Timings Breakdown */}
      {selectedLine.words && selectedLine.words.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-studio-800">
          <span className="text-xs font-bold text-slate-300 block">Word-Level Timings</span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {selectedLine.words.map((w) => (
              <div
                key={w.id}
                onClick={() => seek(w.start)}
                className="flex items-center justify-between p-1.5 rounded-lg bg-studio-800/60 border border-studio-700/50 text-[11px] cursor-pointer hover:border-indigo-500/50"
              >
                <span className="font-semibold text-slate-200">{w.word}</span>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <input
                    type="number"
                    step="0.05"
                    value={w.start}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateWordTiming(selectedLine.id, w.id, parseFloat(e.target.value) || 0, w.end)}
                    className="w-12 bg-studio-900 border border-studio-700 rounded px-1 text-center text-white"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    step="0.05"
                    value={w.end}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateWordTiming(selectedLine.id, w.id, w.start, parseFloat(e.target.value) || 0)}
                    className="w-12 bg-studio-900 border border-studio-700 rounded px-1 text-center text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
