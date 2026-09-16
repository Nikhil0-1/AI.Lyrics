import React, { useRef, useState, useEffect } from 'react';
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

  const startDrag = (
    clientX: number,
    line: LyricLine,
    type: 'move' | 'resize-left' | 'resize-right'
  ) => {
    setSelectedLineId(line.id);
    seek(line.start);

    setDragging({
      lineId: line.id,
      type,
      startX: clientX,
      initialStart: line.start,
      initialEnd: line.end
    });
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    line: LyricLine,
    type: 'move' | 'resize-left' | 'resize-right'
  ) => {
    e.stopPropagation();
    startDrag(e.clientX, line, type);
  };

  const handleTouchStart = (
    e: React.TouchEvent,
    line: LyricLine,
    type: 'move' | 'resize-left' | 'resize-right'
  ) => {
    e.stopPropagation();
    if (e.touches && e.touches[0]) {
      startDrag(e.touches[0].clientX, line, type);
    }
  };

  // Global mouse & touch move / up listeners
  useEffect(() => {
    if (!dragging) return;

    const onMove = (clientX: number) => {
      const deltaX = clientX - dragging.startX;
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

    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        onMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => setDragging(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
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
        const width = Math.max(34, endX - startX);
        const isSelected = line.id === selectedLineId;

        return (
          <div
            key={line.id}
            onMouseDown={(e) => handleMouseDown(e, line, 'move')}
            onTouchStart={(e) => handleTouchStart(e, line, 'move')}
            style={{
              left: `${startX}px`,
              width: `${width}px`
            }}
            className={`absolute top-4 h-10 rounded-lg border flex items-center justify-between px-2 cursor-grab active:cursor-grabbing transition-colors shadow-sm select-none touch-none ${
              isSelected
                ? 'bg-indigo-600/30 border-indigo-400 text-white ring-1 ring-indigo-400'
                : 'bg-studio-800/80 border-studio-700 text-slate-200 hover:border-slate-500 hover:bg-studio-800'
            }`}
          >
            {/* Left Resize Handle with expanded touch target */}
            <div
              onMouseDown={(e) => handleMouseDown(e, line, 'resize-left')}
              onTouchStart={(e) => handleTouchStart(e, line, 'resize-left')}
              className="absolute left-0 top-0 bottom-0 w-3.5 hover:bg-indigo-500/80 rounded-l cursor-ew-resize flex items-center justify-center -ml-1 touch-none"
              title="Drag to adjust start time"
            >
              <div className="w-1 h-4 bg-slate-400/50 rounded-full" />
            </div>

            {/* Line Content */}
            <div className="flex-1 overflow-hidden px-1.5 pointer-events-none">
              <p className="text-[11px] font-bold truncate leading-tight">{line.text}</p>
              <span className="text-[9px] font-mono text-slate-400 truncate block">
                {line.style.animationPreset || 'smoothReveal'}
              </span>
            </div>

            {/* Right Resize Handle with expanded touch target */}
            <div
              onMouseDown={(e) => handleMouseDown(e, line, 'resize-right')}
              onTouchStart={(e) => handleTouchStart(e, line, 'resize-right')}
              className="absolute right-0 top-0 bottom-0 w-3.5 hover:bg-indigo-500/80 rounded-r cursor-ew-resize flex items-center justify-center -mr-1 touch-none"
              title="Drag to adjust end time"
            >
              <div className="w-1 h-4 bg-slate-400/50 rounded-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
