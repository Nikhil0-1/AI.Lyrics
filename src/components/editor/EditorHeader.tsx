import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { AspectRatio } from '../../types/project';
import {
  Sparkles,
  Undo2,
  Redo2,
  Download,
  Sun,
  Moon,
  Keyboard,
  Smartphone,
  Tv,
  Square,
  Activity,
  Mic2,
  PanelLeft,
  PanelRight,
  Menu
} from 'lucide-react';

export const EditorHeader: React.FC<{
  onOpenWizard: () => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
  isLeftSidebarOpen?: boolean;
  onToggleLeftSidebar?: () => void;
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
  isMobile?: boolean;
}> = ({
  onOpenWizard,
  onOpenExport,
  onOpenShortcuts,
  isLeftSidebarOpen,
  onToggleLeftSidebar,
  isInspectorOpen,
  onToggleInspector,
  isMobile
}) => {
  const {
    project,
    canUndo,
    canRedo,
    undo,
    redo,
    theme,
    toggleTheme,
    setAspectRatio,
    updateSettings,
    loadProject
  } = useProject();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.project.name);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      loadProject({
        ...project,
        project: { ...project.project, name: titleInput.trim() }
      });
    }
  };

  return (
    <header className="h-14 border-b border-studio-800 bg-studio-900/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between select-none z-30 shrink-0 gap-2">
      {/* Left: Sidebar Toggle, Brand & Project Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Toggle Left Sidebar Button (Laptop / Desktop) */}
        {!isMobile && onToggleLeftSidebar && (
          <button
            onClick={onToggleLeftSidebar}
            title={isLeftSidebarOpen ? 'Collapse Left Sidebar' : 'Expand Left Sidebar'}
            className={`p-1.5 rounded-lg border transition ${
              isLeftSidebarOpen
                ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300'
                : 'border-studio-700 text-slate-400 hover:text-white hover:bg-studio-800'
            }`}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white hidden md:inline">
            LyricWave <span className="text-indigo-400 font-semibold">AI</span>
          </span>
        </div>

        <div className="h-4 w-[1px] bg-studio-800 hidden sm:block shrink-0" />

        {/* Project Title Editor */}
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
            className="bg-studio-800 border border-indigo-500/70 text-white text-xs font-semibold px-2 py-0.5 rounded-md outline-none max-w-[140px] sm:max-w-xs"
          />
        ) : (
          <div
            onClick={() => {
              setTitleInput(project.project.name);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-1 cursor-pointer text-xs font-semibold text-slate-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-studio-800 transition max-w-[110px] sm:max-w-[180px] md:max-w-xs truncate"
            title="Click to rename project"
          >
            <span className="truncate">{project.project.name}</span>
          </div>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1 sm:p-1.5 rounded-lg border transition ${
              canUndo
                ? 'border-studio-700 text-slate-300 hover:text-white hover:bg-studio-800'
                : 'border-transparent text-slate-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className={`p-1 sm:p-1.5 rounded-lg border transition ${
              canRedo
                ? 'border-studio-700 text-slate-300 hover:text-white hover:bg-studio-800'
                : 'border-transparent text-slate-600 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Aspect Ratio & Mode Toggles (Desktop & Laptop) */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Aspect Ratio Pills */}
        <div className="flex items-center bg-studio-950/80 p-0.5 rounded-xl border border-studio-800">
          {(['9:16', '16:9', '1:1'] as AspectRatio[]).map((aspect) => {
            const isActive = project.settings.aspectRatio === aspect;
            return (
              <button
                key={aspect}
                onClick={() => setAspectRatio(aspect)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-studio-800/60'
                }`}
              >
                {aspect === '9:16' && <Smartphone className="w-3 h-3" />}
                {aspect === '16:9' && <Tv className="w-3 h-3" />}
                {aspect === '1:1' && <Square className="w-3 h-3" />}
                <span>{aspect}</span>
              </button>
            );
          })}
        </div>

        {/* Beat Sync Toggle */}
        <button
          onClick={() => updateSettings({ beatSyncEnabled: !project.settings.beatSyncEnabled })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
            project.settings.beatSyncEnabled
              ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
              : 'border-studio-800 text-slate-500 hover:text-slate-300 hover:bg-studio-800/40'
          }`}
          title="Snap lyric lines & animations to musical beats"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Beat Sync</span>
        </button>

        {/* Karaoke Mode Toggle */}
        <button
          onClick={() => updateSettings({ karaokeModeEnabled: !project.settings.karaokeModeEnabled })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
            project.settings.karaokeModeEnabled
              ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
              : 'border-studio-800 text-slate-500 hover:text-slate-300 hover:bg-studio-800/40'
          }`}
          title="Active word liquid highlight & bouncing karaoke display"
        >
          <Mic2 className="w-3.5 h-3.5" />
          <span>Karaoke</span>
        </button>
      </div>

      {/* Right: Shortcuts, Theme, Inspector Toggle, New Video & Export */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Toggle Inspector Button (Laptop / Desktop) */}
        {!isMobile && onToggleInspector && (
          <button
            onClick={onToggleInspector}
            title={isInspectorOpen ? 'Collapse Inspector' : 'Expand Inspector'}
            className={`p-1.5 rounded-lg border transition ${
              isInspectorOpen
                ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300'
                : 'border-studio-700 text-slate-400 hover:text-white hover:bg-studio-800'
            }`}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        )}

        {/* Shortcuts (hidden on mobile) */}
        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex p-1.5 text-slate-400 hover:text-white hover:bg-studio-800 rounded-lg transition"
          title="Keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-studio-800 rounded-lg transition"
          title="Toggle Dark / Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* New Video Button */}
        <button
          onClick={onOpenWizard}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-studio-800 hover:bg-studio-700 border border-studio-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">New Song</span>
        </button>

        {/* Export MP4 Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 active:scale-95 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="font-bold">Export<span className="hidden sm:inline"> MP4</span></span>
        </button>
      </div>
    </header>
  );
};
