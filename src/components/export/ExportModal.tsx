import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ExportHelper } from '../../utils/exportHelper';
import { RendererHandle } from '../../engine/Renderer';
import {
  Download,
  CheckCircle2,
  Loader2,
  Film,
  Smartphone,
  Tv,
  Square,
  Sparkles,
  Play
} from 'lucide-react';
import { AspectRatio } from '../../types/project';

export const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  rendererRef: React.RefObject<RendererHandle>;
}> = ({ isOpen, onClose, rendererRef }) => {
  const { project, setAspectRatio } = useProject();

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [exportEngine, setExportEngine] = useState<'client' | 'server'>('client');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const duration = project.audio?.duration || 20;

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(5);
    setStage('Initializing export engine...');
    setErrorMsg(null);
    setDownloadUrl(null);
    setExportedBlob(null);

    try {
      if (exportEngine === 'client') {
        const canvas = rendererRef.current?.getCanvas();
        if (!canvas) throw new Error('Video Canvas is not initialized.');

        const blob = await ExportHelper.exportClientRecording(
          canvas,
          duration,
          (pct, stg) => {
            setProgress(pct);
            setStage(stg);
          }
        );

        setExportedBlob(blob);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const res = await ExportHelper.exportServerMP4(project, (pct, stg) => {
          setProgress(pct);
          setStage(stg);
        });
        setDownloadUrl(res.downloadUrl);
      }
    } catch (err: any) {
      console.error('Export failure:', err);
      setErrorMsg(err.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    const cleanName = project.project.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${cleanName}_${project.settings.aspectRatio}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-studio-900 border border-studio-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-studio-800 flex items-center justify-between bg-studio-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Export Lyrics Video</h2>
              <p className="text-xs text-slate-400">Export high-resolution video optimized for social platforms.</p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-studio-800 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {errorMsg}
            </div>
          )}

          {!downloadUrl ? (
            <>
              {/* Aspect Ratio Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Format & Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: '9:16', title: 'Vertical (9:16)', sub: 'Shorts / Reels / TikTok', icon: Smartphone, res: '1080x1920' },
                    { id: '16:9', title: 'Widescreen (16:9)', sub: 'YouTube / TV', icon: Tv, res: '1920x1080' },
                    { id: '1:1', title: 'Square (1:1)', sub: 'Instagram Post', icon: Square, res: '1080x1080' }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = project.settings.aspectRatio === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => !isExporting && setAspectRatio(item.id as AspectRatio)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition text-center flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-600/15 ring-1 ring-indigo-500 shadow-md'
                            : 'border-studio-800 bg-studio-850/40 hover:border-studio-700'
                        } ${isExporting ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-studio-800 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{item.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                          <span className="text-[9px] font-mono text-indigo-400 font-semibold">{item.res}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Export Engine Selection */}
              <div className="flex items-center justify-between p-3.5 bg-studio-850/60 border border-studio-800 rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Rendering Engine</p>
                  <p className="text-[11px] text-slate-500">Fast client capture or server-side FFmpeg H.264 muxer</p>
                </div>
                <div className="flex items-center gap-1 bg-studio-950 p-1 rounded-lg border border-studio-800">
                  <button
                    disabled={isExporting}
                    onClick={() => setExportEngine('client')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      exportEngine === 'client' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Direct Browser
                  </button>
                  <button
                    disabled={isExporting}
                    onClick={() => setExportEngine('server')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      exportEngine === 'server' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    FFmpeg Server
                  </button>
                </div>
              </div>

              {/* Progress Box while exporting */}
              {isExporting && (
                <div className="p-4 bg-studio-850/80 border border-indigo-500/40 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{stage}</span>
                    </div>
                    <span className="font-mono text-white font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-studio-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Render Complete View */
            <div className="py-4 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Video Render Complete!</h3>
              <p className="text-xs text-slate-400">
                Your animated lyrics video has been rendered in {project.settings.aspectRatio} format.
              </p>

              {/* Video Preview */}
              {downloadUrl && (
                <div className="w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-studio-800 shadow-xl bg-black">
                  <video
                    src={downloadUrl}
                    controls
                    autoPlay
                    className="w-full max-h-64 object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-studio-800 bg-studio-850/50 flex items-center justify-end gap-3">
          {!isExporting && !downloadUrl && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-studio-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition active:scale-95"
              >
                <Film className="w-4 h-4" />
                <span>Start Video Render</span>
              </button>
            </>
          )}

          {downloadUrl && (
            <>
              <button
                onClick={() => setDownloadUrl(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-studio-800 transition"
              >
                Render Another
              </button>
              <button
                onClick={triggerDownload}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download MP4 Video</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
