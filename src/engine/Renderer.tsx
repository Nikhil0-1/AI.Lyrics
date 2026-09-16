import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useProject } from '../context/ProjectContext';
import { BackgroundEngine } from './BackgroundEngine';
import { KineticTypographyEngine } from './KineticTypography';
import { BeatSyncService } from './BeatSync';
import { audioController } from '../utils/audio';

export interface RendererHandle {
  getCanvas: () => HTMLCanvasElement | null;
  renderFrameAtTime: (time: number) => void;
}

const bgEngine = new BackgroundEngine();

export const VideoRenderer = forwardRef<RendererHandle, {
  className?: string;
  onCanvasClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}>(({ className, onCanvasClick }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { project, currentTime } = useProject();

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    renderFrameAtTime: (time: number) => {
      if (canvasRef.current) {
        drawFrame(canvasRef.current, time);
      }
    }
  }));

  const drawFrame = (canvas: HTMLCanvasElement, time: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Get live frequency & beat data from Web Audio
    const freqData = audioController.getAudioFrequencyData();
    const beatPulse = BeatSyncService.getBeatPulseFactor(time, project.beatMap);

    // 1. Render Background
    bgEngine.render(ctx, width, height, time, project.background, freqData, beatPulse);

    // 2. Render Active Lyrics
    for (const line of project.lyrics) {
      KineticTypographyEngine.renderLine(ctx, line, time, project, width, height, beatPulse);
    }
  };

  // Continuous animation loop synchronized with requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const loop = () => {
      if (canvasRef.current) {
        drawFrame(canvasRef.current, currentTime);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentTime, project]);

  return (
    <canvas
      ref={canvasRef}
      width={project.settings.width}
      height={project.settings.height}
      onClick={onCanvasClick}
      className={`max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 ${className || ''}`}
      style={{
        aspectRatio: `${project.settings.width} / ${project.settings.height}`
      }}
    />
  );
});

VideoRenderer.displayName = 'VideoRenderer';
