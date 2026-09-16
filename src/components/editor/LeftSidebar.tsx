import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  FileText,
  Type,
  Film,
  Image,
  Sparkles,
  Mic,
  Plus,
  Trash2,
  Copy,
  Scissors,
  Merge,
  Check,
  Zap,
  Sliders
} from 'lucide-react';
import { ANIMATION_LIST, ANIMATION_PRESETS } from '../../engine/presets/animationPresets';
import { TYPOGRAPHY_LIST, TYPOGRAPHY_PRESETS } from '../../engine/presets/typographyPresets';
import { BACKGROUND_LIST, BACKGROUND_PRESETS } from '../../engine/presets/backgroundPresets';
import { AIRestyleOption } from '../../types/animation';
import { formatTimecode } from '../../utils/formatting';

export type SidebarTabType = 'lyrics' | 'typography' | 'animation' | 'background' | 'restyle' | 'karaoke';

export const LeftSidebar: React.FC<{
  className?: string;
  activeTabOverride?: SidebarTabType;
  onTabChange?: (tab: SidebarTabType) => void;
  onClose?: () => void;
}> = ({ className, activeTabOverride, onTabChange, onClose }) => {
  const {
    project,
    selectedLineId,
    setSelectedLineId,
    updateLine,
    addLine,
    duplicateLine,
    deleteLine,
    splitLine,
    mergeWithNextLine,
    updateGlobalStyle,
    updateBackground,
    updateSettings,
    applyAIRestyle,
    seek
  } = useProject();

  const [activeTabInternal, setActiveTabInternal] = useState<SidebarTabType>('lyrics');
  const activeTab = activeTabOverride || activeTabInternal;
  const setActiveTab = (t: SidebarTabType) => {
    setActiveTabInternal(t);
    if (onTabChange) onTabChange(t);
  };

  const [animCategory, setAnimCategory] = useState<'ALL' | 'TEXT' | 'DYNAMIC' | 'KARAOKE'>('ALL');
  const [restyleTargetAll, setRestyleTargetAll] = useState(true);

  const selectedLine = project.lyrics.find(l => l.id === selectedLineId) || project.lyrics[0];

  const filteredAnimations = animCategory === 'ALL'
    ? ANIMATION_LIST
    : ANIMATION_LIST.filter(a => a.category === animCategory);

  return (
    <aside className={`w-full md:w-80 border-r border-studio-800 bg-studio-900/95 flex flex-col shrink-0 select-none overflow-hidden ${className || ''}`}>
      {/* Top Tabs */}
      <div className="flex items-center border-b border-studio-800 p-1.5 gap-1 bg-studio-950/60 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'lyrics', label: 'Lyrics', icon: FileText },
          { id: 'typography', label: 'Fonts', icon: Type },
          { id: 'animation', label: 'Animate', icon: Film },
          { id: 'background', label: 'Visuals', icon: Image },
          { id: 'restyle', label: 'AI Style', icon: Sparkles },
          { id: 'karaoke', label: 'Karaoke', icon: Mic }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ================= 1. LYRICS TAB ================= */}
        {activeTab === 'lyrics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lyrics Lines ({project.lyrics.length})
              </span>
              <button
                onClick={() => addLine(selectedLineId || undefined)}
                className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {project.lyrics.map((line, idx) => {
                const isSelected = line.id === selectedLineId;
                return (
                  <div
                    key={line.id}
                    onClick={() => {
                      setSelectedLineId(line.id);
                      seek(line.start);
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/10 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                        : 'border-studio-800 bg-studio-850/40 hover:border-studio-700 hover:bg-studio-800/50'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500">#{idx + 1}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-studio-800 text-indigo-300">
                          {formatTimecode(line.start)} - {formatTimecode(line.end)}
                        </span>
                        {line.section && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-studio-700 text-slate-300 font-semibold">
                            {line.section}
                          </span>
                        )}
                      </div>

                      {/* Quick Line Actions */}
                      <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateLine(line.id);
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-studio-800"
                          title="Duplicate line"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {idx < project.lyrics.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              mergeWithNextLine(line.id);
                            }}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-studio-800"
                            title="Merge with next line"
                          >
                            <Merge className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLine(line.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-studio-800"
                          title="Delete line"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Text Input */}
                    <textarea
                      value={line.text}
                      onChange={(e) => updateLine(line.id, { text: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      rows={2}
                      className="w-full bg-studio-900/80 border border-studio-800 focus:border-indigo-500 rounded-lg p-2 text-xs font-semibold text-white outline-none resize-none"
                    />

                    {/* Word Timing Chips */}
                    {line.words && line.words.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {line.words.map((w, wIdx) => (
                          <div
                            key={w.id}
                            className="inline-flex items-center gap-1 bg-studio-800/80 border border-studio-700/60 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-medium"
                          >
                            <span>{w.word}</span>
                            <span className="text-[8px] font-mono text-slate-500">
                              {w.start.toFixed(1)}s
                            </span>
                            {wIdx < line.words.length - 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  splitLine(line.id, wIdx + 1);
                                }}
                                title="Split line after this word"
                                className="text-slate-500 hover:text-indigo-400 ml-0.5"
                              >
                                <Scissors className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 2. TYPOGRAPHY TAB ================= */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typography Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {TYPOGRAPHY_LIST.map((preset) => {
                const isSelected = project.globalStyle.fontFamily === preset.fontFamily;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      updateGlobalStyle({
                        fontFamily: preset.fontFamily,
                        fillColor: preset.fillColor
                      });
                      if (selectedLineId) {
                        updateLine(selectedLineId, {
                          style: {
                            fontFamily: preset.fontFamily,
                            fillColor: preset.fillColor,
                            fontWeight: preset.fontWeight,
                            letterSpacing: preset.letterSpacing
                          }
                        });
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/15 ring-1 ring-indigo-500'
                        : 'border-studio-800 bg-studio-850/40 hover:border-studio-700 hover:bg-studio-800/50'
                    }`}
                  >
                    <p className="text-xs font-semibold text-white">{preset.name}</p>
                    <p
                      className="text-lg font-bold text-slate-200 mt-1 truncate"
                      style={{ fontFamily: preset.fontFamily }}
                    >
                      Aa Bb Cc
                    </p>
                    <span className="text-[9px] text-slate-500">{preset.category}</span>
                  </div>
                );
              })}
            </div>

            {/* Custom Typography Controls */}
            <div className="pt-3 border-t border-studio-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Adjustments</span>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Base Font Size ({project.globalStyle.fontSize}px)</label>
                <input
                  type="range"
                  min="32"
                  max="110"
                  value={project.globalStyle.fontSize}
                  onChange={(e) => updateGlobalStyle({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Text Fill Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.globalStyle.fillColor}
                    onChange={(e) => updateGlobalStyle({ fillColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{project.globalStyle.fillColor}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. ANIMATIONS TAB ================= */}
        {activeTab === 'animation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Animation Presets</span>
              <span className="text-[11px] text-indigo-400 font-semibold">{filteredAnimations.length} styles</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-studio-950 p-1 rounded-lg border border-studio-800">
              {(['ALL', 'TEXT', 'DYNAMIC', 'KARAOKE'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setAnimCategory(cat)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition ${
                    animCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Preset Cards */}
            <div className="space-y-2">
              {filteredAnimations.map(anim => {
                const isSelected = selectedLine?.style?.animationPreset === anim.id;
                return (
                  <div
                    key={anim.id}
                    onClick={() => {
                      if (selectedLineId) {
                        updateLine(selectedLineId, {
                          style: { animationPreset: anim.id, animationIntensity: anim.intensity }
                        });
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/15 ring-1 ring-indigo-500'
                        : 'border-studio-800 bg-studio-850/40 hover:border-studio-700 hover:bg-studio-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white">{anim.name}</p>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-studio-800 text-slate-400 font-mono">
                          {anim.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{anim.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. BACKGROUND TAB ================= */}
        {activeTab === 'background' && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Background Styles</span>
            <div className="grid grid-cols-2 gap-2">
              {BACKGROUND_LIST.map((bg) => {
                const isSelected = project.background.type === bg.type;
                return (
                  <div
                    key={bg.id}
                    onClick={() => updateBackground(bg.settings)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/15 ring-1 ring-indigo-500'
                        : 'border-studio-800 bg-studio-850/40 hover:border-studio-700 hover:bg-studio-800/50'
                    }`}
                  >
                    <div
                      className="w-full h-10 rounded-lg mb-2 flex items-center justify-center text-xs font-bold shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${bg.settings.primaryColor}, ${bg.settings.secondaryColor || '#000'})`
                      }}
                    />
                    <p className="text-xs font-bold text-white truncate">{bg.name}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{bg.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Background Sliders */}
            <div className="pt-3 border-t border-studio-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reactivity & Tuning</span>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Music Reactive Intensity ({Math.round((project.background.reactiveIntensity || 0.5) * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round((project.background.reactiveIntensity || 0.5) * 100)}
                  onChange={(e) => updateBackground({ reactiveIntensity: parseInt(e.target.value) / 100 })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Animation Speed ({project.background.speed || 1.0}x)
                </label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={Math.round((project.background.speed || 1.0) * 10)}
                  onChange={(e) => updateBackground({ speed: parseInt(e.target.value) / 10 })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Accent Light Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.background.accentColor || '#6366f1'}
                    onChange={(e) => updateBackground({ accentColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{project.background.accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. AI RE-STYLE TAB ================= */}
        {activeTab === 'restyle' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Re-Styling</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically recompose font, motion kinetics, and background mood in one click.
              </p>
            </div>

            {/* Scope toggle */}
            <div className="flex items-center justify-between p-2.5 bg-studio-950 rounded-xl border border-studio-800 text-xs">
              <span className="text-slate-300 font-medium">Apply Scope</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRestyleTargetAll(false)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                    !restyleTargetAll ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Selected Line
                </button>
                <button
                  onClick={() => setRestyleTargetAll(true)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                    restyleTargetAll ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Lines
                </button>
              </div>
            </div>

            {/* Restyle Options */}
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'cinematic', name: 'More Cinematic', desc: 'Anamorphic glows, serif titles, slow auroral movement' },
                { id: 'minimal', name: 'More Minimal', desc: 'High contrast clean modern typography, pure obsidian background' },
                { id: 'energetic', name: 'More Energetic', desc: 'Pop bounce kinetics, neon stardust particles, high impact' },
                { id: 'emotional', name: 'More Emotional', desc: 'Poetic serif fonts, soft bokeh orbs, blur dissolves' },
                { id: 'dynamic', name: 'More Dynamic', desc: 'Kinetic YouTube typography with rapid multi-directional words' },
                { id: 'beatFocused', name: 'Beat Focused', desc: 'Intense bass-drop pulses, soundwave reactive background' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => applyAIRestyle(opt.id as AIRestyleOption, restyleTargetAll)}
                  className="p-3 rounded-xl border border-studio-800 bg-studio-850/50 hover:border-indigo-500/60 hover:bg-studio-800/80 text-left transition group active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                      {opt.name}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. KARAOKE TAB ================= */}
        {activeTab === 'karaoke' && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Karaoke Singing Mode</span>
            
            <div className="flex items-center justify-between p-3 bg-studio-850 rounded-xl border border-studio-800">
              <div>
                <p className="text-xs font-bold text-white">Enable Karaoke</p>
                <p className="text-[10px] text-slate-400">Word-by-word active singing highlight</p>
              </div>
              <input
                type="checkbox"
                checked={project.settings.karaokeModeEnabled}
                onChange={(e) => updateSettings({ karaokeModeEnabled: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {project.settings.karaokeModeEnabled && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Active Word Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={project.settings.karaokeStyle.activeWordColor}
                      onChange={(e) => updateSettings({
                        karaokeStyle: { ...project.settings.karaokeStyle, activeWordColor: e.target.value }
                      })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {project.settings.karaokeStyle.activeWordColor}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Singing Word Bounce Scale ({project.settings.karaokeStyle.activeWordScale}x)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="150"
                    value={Math.round(project.settings.karaokeStyle.activeWordScale * 100)}
                    onChange={(e) => updateSettings({
                      karaokeStyle: { ...project.settings.karaokeStyle, activeWordScale: parseInt(e.target.value) / 100 }
                    })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-studio-850/60 rounded-lg border border-studio-800 text-xs">
                  <span className="text-slate-300">Active Word Glow Aura</span>
                  <input
                    type="checkbox"
                    checked={project.settings.karaokeStyle.activeWordGlow}
                    onChange={(e) => updateSettings({
                      karaokeStyle: { ...project.settings.karaokeStyle, activeWordGlow: e.target.checked }
                    })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-studio-850/60 rounded-lg border border-studio-800 text-xs">
                  <span className="text-slate-300">Active Word Pill Badge</span>
                  <input
                    type="checkbox"
                    checked={project.settings.karaokeStyle.activeWordBg}
                    onChange={(e) => updateSettings({
                      karaokeStyle: { ...project.settings.karaokeStyle, activeWordBg: e.target.checked }
                    })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
