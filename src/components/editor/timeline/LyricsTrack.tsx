import React, { useRef, useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { LyricLine } from '../../../types/lyrics';

export const LyricsTrack: React.FC<{
  totalWidth: number;
  duration: number;
}> = ({ totalWidth, duration }) => {
  const {
    project,
    selectedLineId,
    setSelectedLineId,
    updateLine,
    seek
  } = useProject();

  const [dragging, setDragging] = useState<{
    lineId: string;
    type: 'move' | 'resize-left' | 'resize-right';
    startX: number;
    initialStart: number;
    initialEnd: number;
  } | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    line: LyricLine,
    type: 'move' | 'resize-left' | 'resize-right'
  ) => {
    e.stopPropagation();
    setSelectedLineId(line.id);
    seek(line.start);

    setDragging({
      lineId: line.id,
      type,
      startX: e.clientX,
      initialStart: line.start,
      initialEnd: line.end
    });
  };

  // Global mouse move & mouse up for smooth dragging across canvas/timeline
  React.useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragging.startX;
      const deltaTime = (deltaX / totalWidth) * duration;

      if (dragging.type === 'move') {
        const lineDur = dragging.initialEnd - dragging.initialStart;
        const newStart = Math.max(0, parseFloat((dragging.initialStart + deltaTime).toFixed(2)));
        const newEnd = parseFloat((newStart + lineDur).toFixed(2));
        updateLine(dragging.lineId, { start: newStart, end: newEnd });
      } else if (dragging.type === 'resize-left') {
        const newStart = Math.max(0, Math.min(dragging.initialEnd - 0.3, parseFloat((dragging.initialStart + deltaTime).toFixed(2))));
        updateLine(dragging.lineId, { start: newStart });
      } else if (dragging.type === 'resize-right') {
        const newEnd = Math.max(dragging.initialStart + 0.3, Math.min(duration, parseFloat((dragging.initialEnd + deltaTime).toFixed(2))));
        updateLine(dragging.lineId, { end: newEnd });
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, totalWidth, duration, updateLine]);

  return (
    <div className="relative h-16 bg-studio-950/40 rounded-lg border border-studio-800/60 overflow-hidden">
      <div className="absolute top-1 left-2 z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lyrics Track</span>
      </div>

      {project.lyrics.map((line) => {
        const startX = (line.start / duration) * totalWidth;
        const endX = (line.end / duration) * totalWidth;
        const width = Math.max(28, endX - startX);
        const isSelected = line.id === selectedLineId;

        return (
          <div
            key={line.id}
            onMouseDown={(e) => handleMouseDown(e, line, 'move')}
            style={{
              left: `${startX}px`,
              width: `${width}px`
            }}
            className={`absolute top-4 h-10 rounded-lg border flex items-center justify-between px-2 cursor-grab active:cursor-grabbing transition-colors shadow-sm select-none ${
              isSelected
                ? 'bg-indigo-600/30 border-indigo-400 text-white ring-1 ring-indigo-400'
                : 'bg-studio-800/80 border-studio-700 text-slate-200 hover:border-slate-500 hover:bg-studio-800'
            }`}
          >
            {/* Left Resize Handle */}
            <div
              onMouseDown={(e) => handleMouseDown(e, line, 'resize-left')}
              className="absolute left-0 top-0 bottom-0 w-2 hover:bg-indigo-500/80 rounded-l cursor-ew-resize"
              title="Drag to adjust start time"
            />

            {/* Line Content */}
            <div className="flex-1 overflow-hidden px-1">
              <p className="text-[11px] font-bold truncate leading-tight">{line.text}</p>
              <span className="text-[9px] font-mono text-slate-400 truncate block">
                {line.style.animationPreset || 'smoothReveal'}
              </span>
            </div>

            {/* Right Resize Handle */}
            <div
              onMouseDown={(e) => handleMouseDown(e, line, 'resize-right')}
              className="absolute right-0 top-0 bottom-0 w-2 hover:bg-indigo-500/80 rounded-r cursor-ew-resize"
              title="Drag to adjust end time"
            />
          </div>
        );
      })}
    </div>
  );
};
