import React, { useState, useRef } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { EditorHeader } from './components/editor/EditorHeader';
import { LeftSidebar } from './components/editor/LeftSidebar';
import { VideoPlayer } from './components/editor/VideoPlayer';
import { Inspector } from './components/editor/Inspector';
import { Timeline } from './components/editor/timeline/Timeline';
import { AutoCreateModal } from './components/wizard/AutoCreateModal';
import { ExportModal } from './components/export/ExportModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { RendererHandle } from './engine/Renderer';

export const MainStudio: React.FC = () => {
  const rendererRef = useRef<RendererHandle>(null);
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
      />

      {/* Main Workspace (Left Sidebar + Center Canvas Viewport + Right Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        <LeftSidebar />
        <VideoPlayer rendererRef={rendererRef} />
        <Inspector />
      </div>

      {/* Bottom Multi-Track Timeline */}
      <Timeline />

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
