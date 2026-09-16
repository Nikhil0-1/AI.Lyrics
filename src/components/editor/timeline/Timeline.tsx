import React, { useRef, useState, useEffect } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { AudioTrack } from './AudioTrack';
import { LyricsTrack } from './LyricsTrack';
import { ZoomIn, ZoomOut, Scissors, Plus, Magnet } from 'lucide-react';
import { formatTimecode } from '../../../utils/formatting';

export const Timeline: React.FC = () => {
  const {
    project,
    currentTime,
    zoom,
    setZoom,
    seek,
    selectedLineId,
    splitLine,
    addLine,
    updateSettings
  } = useProject();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const duration = project.audio?.duration || 20;
  const totalTimelineWidth = Math.max(containerWidth, containerWidth * zoom);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 32);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Scrubbing logic
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left + (containerRef.current?.scrollLeft || 0);
    const newTime = Math.max(0, Math.min(duration, (clickX / totalTimelineWidth) * duration));
    seek(newTime);
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScrubbing(true);
  };

  useEffect(() => {
    if (!isScrubbing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left + containerRef.current.scrollLeft;
      const newTime = Math.max(0, Math.min(duration, (clickX / totalTimelineWidth) * duration));
      seek(newTime);
    };

    const handleMouseUp = () => setIsScrubbing(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, totalTimelineWidth, duration, seek]);

  // Split line at current playhead position
  const handleSplitAtPlayhead = () => {
    if (!selectedLineId) return;
    const targetLine = project.lyrics.find(l => l.id === selectedLineId);
    if (!targetLine || currentTime <= targetLine.start || currentTime >= targetLine.end) return;

    // Find the word closest to current time
    let splitWordIndex = targetLine.words.findIndex(w => w.start >= currentTime);
    if (splitWordIndex <= 0) splitWordIndex = 1;
    splitLine(selectedLineId, splitWordIndex);
  };

  // Generate ruler tick marks
  const numSeconds = Math.ceil(duration);
  const rulerTicks = [];
  for (let s = 0; s <= numSeconds; s++) {
    rulerTicks.push(s);
  }

  const playheadX = (currentTime / duration) * totalTimelineWidth;

  return (
    <div className="h-56 border-t border-studio-800 bg-studio-900/95 flex flex-col shrink-0 select-none z-20">
      {/* Timeline Controls Toolbar */}
      <div className="h-9 border-b border-studio-800 px-4 flex items-center justify-between bg-studio-950/40 text-xs">
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <button
            onClick={() => addLine(selectedLineId || undefined)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-studio-800 hover:bg-studio-700 text-slate-300 hover:text-white transition font-medium text-[11px]"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Lyric</span>
          </button>

          <button
            onClick={handleSplitAtPlayhead}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-studio-800 hover:bg-studio-700 text-slate-300 hover:text-white transition font-medium text-[11px]"
            title="Split selected line at current playhead"
          >
            <Scissors className="w-3.5 h-3.5 text-indigo-400" />
            <span>Split Line</span>
          </button>

          {/* Beat Snapping Toggle */}
          <button
            onClick={() => updateSettings({ beatSyncEnabled: !project.settings.beatSyncEnabled })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium text-[11px] ${
              project.settings.beatSyncEnabled
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-studio-800 text-slate-400 hover:text-white'
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span>Snap to Beats</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-mono">Zoom</span>
          <button
            onClick={() => setZoom(Math.max(1.0, zoom - 0.5))}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <input
            type="range"
            min="1"
            max="4"
            step="0.2"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-20 h-1 accent-indigo-500 bg-studio-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => setZoom(Math.min(4.0, zoom + 0.5))}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-8 text-right">{zoom.toFixed(1)}x</span>
        </div>
      </div>

      {/* Timeline Scroll Container */}
      <div
        ref={containerRef}
        onClick={handleTimelineClick}
        className="flex-1 overflow-x-auto overflow-y-hidden p-4 relative cursor-pointer"
      >
        <div
          style={{ width: `${totalTimelineWidth}px` }}
          className="relative flex flex-col gap-2.5"
        >
          {/* Time Ruler */}
          <div className="h-5 relative border-b border-studio-800 flex items-end">
            {rulerTicks.map((sec) => {
              const x = (sec / duration) * totalTimelineWidth;
              return (
                <div
                  key={sec}
                  style={{ left: `${x}px` }}
                  className="absolute bottom-0 flex flex-col items-start"
                >
                  <span className="text-[9px] font-mono text-slate-500 pl-0.5 leading-none">
                    {formatTimecode(sec)}
                  </span>
                  <div className="w-[1px] h-1.5 bg-studio-700 mt-0.5" />
                </div>
              );
            })}
          </div>

          {/* Audio Track */}
          <AudioTrack totalWidth={totalTimelineWidth} duration={duration} />

          {/* Lyrics Track */}
          <LyricsTrack totalWidth={totalTimelineWidth} duration={duration} />

          {/* Playhead Scrubber */}
          <div
            style={{ left: `${playheadX}px` }}
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none"
          >
            {/* Draggable Playhead Pin Handle */}
            <div
              onMouseDown={handlePlayheadMouseDown}
              className="w-3 h-3 bg-red-500 rounded-b -ml-[5px] cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform shadow-md shadow-red-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
