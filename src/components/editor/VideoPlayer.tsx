import React, { useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { VideoRenderer, RendererHandle } from '../../engine/Renderer';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Activity
} from 'lucide-react';
import { formatTimecode } from '../../utils/formatting';
import { audioController } from '../../utils/audio';

export const VideoPlayer: React.FC<{
  rendererRef: React.RefObject<RendererHandle>;
}> = ({ rendererRef }) => {
  const {
    project,
    currentTime,
    isPlaying,
    togglePlay,
    seek
  } = useProject();

  const [volume, setVolume] = React.useState(1.0);
  const [isMuted, setIsMuted] = React.useState(false);

  const duration = project.audio?.duration || 20;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    audioController.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioController.setVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioController.setVolume(0);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-studio-950 items-center justify-center p-4 relative overflow-hidden">
      {/* Aspect Ratio Badge / Resolution */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-md bg-studio-900/80 border border-studio-800 text-[11px] font-mono font-semibold text-slate-300 backdrop-blur-sm shadow-md">
          {project.settings.aspectRatio} • {project.settings.width}x{project.settings.height}
        </span>
        {project.settings.beatSyncEnabled && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-semibold text-indigo-400 backdrop-blur-sm">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>{project.audio.bpm} BPM</span>
          </span>
        )}
      </div>

      {/* Video Viewport Container */}
      <div className="flex-1 w-full max-h-[calc(100%-60px)] flex items-center justify-center p-2">
        <VideoRenderer
          ref={rendererRef}
          onCanvasClick={togglePlay}
          className="cursor-pointer border border-studio-800/80 shadow-2xl hover:border-indigo-500/30"
        />
      </div>

      {/* Floating Center Transport Bar */}
      <div className="h-12 bg-studio-900/90 border border-studio-800/80 backdrop-blur-md px-4 rounded-2xl flex items-center justify-between gap-4 shadow-xl z-20 w-full max-w-xl">
        {/* Left: Timecode */}
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-300">
          <span className="text-white">{formatTimecode(currentTime)}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500">{formatTimecode(duration)}</span>
        </div>

        {/* Center: Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => seek(currentTime - 5)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-studio-800 transition"
            title="Skip back 5s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 active:scale-95 transition"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => seek(currentTime + 5)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-studio-800 transition"
            title="Skip forward 5s"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Volume & Fullscreen */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 accent-indigo-500 bg-studio-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
