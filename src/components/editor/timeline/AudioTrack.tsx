import React, { useRef, useEffect } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { audioController } from '../../../utils/audio';

export const AudioTrack: React.FC<{
  totalWidth: number;
  duration: number;
}> = ({ totalWidth, duration }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { project } = useProject();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || totalWidth <= 0 || duration <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = totalWidth;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Section background indicators
    if (project.beatMap.sections) {
      for (const section of project.beatMap.sections) {
        const startX = (section.start / duration) * width;
        const endX = (section.end / duration) * width;
        const w = Math.max(2, endX - startX);

        // Section tint
        ctx.fillStyle = section.type === 'chorus' 
          ? 'rgba(236, 72, 153, 0.12)' 
          : section.type === 'drop'
          ? 'rgba(239, 68, 68, 0.15)'
          : 'rgba(99, 102, 241, 0.08)';
        ctx.fillRect(startX, 0, w, height);

        // Top tag line
        ctx.fillStyle = section.type === 'chorus'
          ? '#ec4899'
          : section.type === 'drop'
          ? '#ef4444'
          : '#6366f1';
        ctx.fillRect(startX, 0, w, 3);

        // Label
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(section.name || section.type.toUpperCase(), startX + 4, 12);
      }
    }

    // 2. Draw Waveform Peaks
    const numBars = Math.floor(width / 3);
    const barWidth = 2;
    const centerY = height / 2 + 5;
    const maxBarHeight = height * 0.35;

    ctx.fillStyle = 'rgba(99, 102, 241, 0.65)';

    for (let i = 0; i < numBars; i++) {
      const timeAtBar = (i / numBars) * duration;
      // Synthetic harmonic envelope for waveform look
      const beatInterval = 60 / (project.audio.bpm || 100);
      const beatMod = 0.5 + 0.5 * Math.abs(Math.sin((timeAtBar / beatInterval) * Math.PI));
      const section = project.beatMap.sections.find(s => timeAtBar >= s.start && timeAtBar < s.end);
      const baseAmp = section ? section.energy : 0.5;
      const noise = (Math.sin(i * 12.3) * 0.2 + Math.cos(i * 5.7) * 0.2);
      const amp = Math.max(0.1, Math.min(1.0, (baseAmp * beatMod + noise) * 0.8));

      const barH = amp * maxBarHeight;
      const x = i * 3;
      ctx.fillRect(x, centerY - barH, barWidth, barH * 2);
    }

    // 3. Draw Beat markers
    if (project.beatMap.beats) {
      for (const beat of project.beatMap.beats) {
        const bx = (beat / duration) * width;
        const isDownbeat = project.beatMap.downbeats?.includes(beat);

        ctx.strokeStyle = isDownbeat ? 'rgba(250, 204, 21, 0.6)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = isDownbeat ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(bx, height - (isDownbeat ? 12 : 6));
        ctx.lineTo(bx, height);
        ctx.stroke();
      }
    }
  }, [totalWidth, duration, project.beatMap, project.audio.bpm]);

  return (
    <div className="relative h-14 bg-studio-950/60 rounded-lg border border-studio-800/80 overflow-hidden">
      <div className="absolute top-1 left-2 z-10 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audio Track</span>
        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-studio-800 text-indigo-400">
          {project.audio.bpm} BPM
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={totalWidth}
        height={56}
        className="w-full h-full block"
      />
    </div>
  );
};
