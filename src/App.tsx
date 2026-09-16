import React, { useState, useRef, useEffect } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { EditorHeader } from './components/editor/EditorHeader';
import { LeftSidebar, SidebarTabType } from './components/editor/LeftSidebar';
import { VideoPlayer } from './components/editor/VideoPlayer';
import { Inspector } from './components/editor/Inspector';
import { Timeline } from './components/editor/timeline/Timeline';
import { AutoCreateModal } from './components/wizard/AutoCreateModal';
import { ExportModal } from './components/export/ExportModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { RendererHandle } from './engine/Renderer';
import {
  Film,
  FileText,
  Palette,
  Sliders,
  Clock,
  Play,
  Pause
} from 'lucide-react';

type MobileTab = 'video' | 'lyrics' | 'styles' | 'inspector' | 'timeline';

export const MainStudio: React.FC = () => {
  const rendererRef = useRef<RendererHandle>(null);
  const { isPlaying, togglePlay } = useProject();

  // Screen size detection
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTabletOrLaptop = windowWidth >= 768 && windowWidth < 1280;

  // Panel collapse states for desktop & laptop
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Auto-collapse inspector on smaller laptops/tablets
  useEffect(() => {
    if (windowWidth < 1280 && windowWidth >= 768) {
      setIsInspectorOpen(false); // keep sidebar, collapse inspector by default on 13" laptops/tablets
    } else if (windowWidth >= 1280) {
      setIsInspectorOpen(true);
      setIsLeftSidebarOpen(true);
    }
  }, [windowWidth]);

  // Mobile active bottom tab
  const [mobileTab, setMobileTab] = useState<MobileTab>('video');
  const [mobileSidebarTab, setMobileSidebarTab] = useState<SidebarTabType>('lyrics');

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-950 text-slate-100 font-sans">
      {/* Top Header */}
      <EditorHeader
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isLeftSidebarOpen={isLeftSidebarOpen}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
        isMobile={isMobile}
      />

      {/* ================= DESKTOP & LAPTOP LAYOUT (>= 768px) ================= */}
      {!isMobile ? (
        <>
          {/* Main Studio Viewport */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Sidebar (collapsible on laptop/desktop) */}
            {isLeftSidebarOpen && (
              <LeftSidebar className="transition-all duration-200" />
            )}

            {/* Large Center Canvas Viewport */}
            <VideoPlayer rendererRef={rendererRef} />

            {/* Right Inspector (collapsible on laptop/desktop) */}
            {isInspectorOpen && (
              <Inspector />
            )}
          </div>

          {/* Bottom Multi-Track Timeline */}
          <Timeline />
        </>
      ) : (
        /* ================= MOBILE LAYOUT (< 768px) ================= */
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile Main Content Screen */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {/* 1. Video View */}
            {mobileTab === 'video' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <VideoPlayer rendererRef={rendererRef} />
              </div>
            )}

            {/* 2. Lyrics View */}
            {mobileTab === 'lyrics' && (
              <div className="flex-1 overflow-y-auto">
                <LeftSidebar
                  className="w-full border-r-0"
                  activeTabOverride="lyrics"
                />
              </div>
            )}

            {/* 3. Styles View (Fonts, Animations, Backgrounds, AI Re-Style) */}
            {mobileTab === 'styles' && (
              <div className="flex-1 overflow-y-auto">
                <LeftSidebar
                  className="w-full border-r-0"
                  activeTabOverride={mobileSidebarTab === 'lyrics' ? 'typography' : mobileSidebarTab}
                  onTabChange={(t) => setMobileSidebarTab(t)}
                />
              </div>
            )}

            {/* 4. Inspector View */}
            {mobileTab === 'inspector' && (
              <div className="flex-1 overflow-y-auto">
                <Inspector />
              </div>
            )}

            {/* 5. Timeline View */}
            {mobileTab === 'timeline' && (
              <div className="flex-1 flex flex-col overflow-hidden p-2">
                <div className="p-2 bg-studio-900 rounded-xl mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Touch Multi-Track Timeline</span>
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 rounded-lg text-xs font-bold text-white shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                </div>
                <div className="flex-1 overflow-hidden rounded-xl border border-studio-800">
                  <Timeline />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Floating Mini Transport (visible on non-video tabs so music never stops) */}
          {mobileTab !== 'video' && mobileTab !== 'timeline' && (
            <div className="h-10 bg-studio-900/95 border-t border-studio-800 px-4 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 truncate">
                Now Editing: {mobileTab.toUpperCase()}
              </span>
              <button
                onClick={togglePlay}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white shadow-sm active:scale-95 transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          )}

          {/* Mobile Bottom Navigation Bar */}
          <nav className="h-14 bg-studio-900 border-t border-studio-800 flex items-center justify-around px-2 select-none z-30 shrink-0">
            {[
              { id: 'video', label: 'Preview', icon: Film },
              { id: 'lyrics', label: 'Lyrics', icon: FileText },
              { id: 'styles', label: 'Styles', icon: Palette },
              { id: 'inspector', label: 'Inspect', icon: Sliders },
              { id: 'timeline', label: 'Timeline', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = mobileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id as MobileTab)}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                    isActive
                      ? 'text-indigo-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[10px] tracking-tight">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Modals */}
      <AutoCreateModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rendererRef={rendererRef}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <MainStudio />
    </ProjectProvider>
  );
}
