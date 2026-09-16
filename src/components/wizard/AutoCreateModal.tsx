import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ProjectData } from '../../types/project';
import { Upload, Music, Sparkles, CheckCircle2, Loader2, ArrowRight, Disc3 } from 'lucide-react';
import { formatFileSize, formatTimecode } from '../../utils/formatting';

interface SampleSong {
  id: string;
  title: string;
  artist: string;
  language: string;
  genre: string;
  duration: number;
  bpm: number;
  audioUrl: string;
}

interface StepInfo {
  num: number;
  name: string;
  description: string;
}

const STEPS: StepInfo[] = [
  { num: 1, name: 'Analyzing audio file', description: 'Decoding audio stream & sample rate' },
  { num: 2, name: 'Extracting waveform & energy', description: 'Computing RMS energy curve & peak envelopes' },
  { num: 3, name: 'Detecting beats & BPM', description: 'Aligning downbeats & quarter-note grid' },
  { num: 4, name: 'Detecting lyrics & language', description: 'Running speech recognition & language identification' },
  { num: 5, name: 'Generating word timestamps', description: 'Micro-timing segmentation per sung word' },
  { num: 6, name: 'Detecting song structure', description: 'Mapping Intro, Verse, Chorus & Drop sections' },
  { num: 7, name: 'Choosing typography & mood', description: 'AI Style Director selecting aesthetic fonts' },
  { num: 8, name: 'Choosing dynamic animations', description: 'Assigning section-specific kinetic presets' },
  { num: 9, name: 'Synchronizing with beats', description: 'Snapping transition points to downbeat markers' },
  { num: 10, name: 'Building lyrics video', description: 'Assembling ready-to-edit project timeline' }
];

export const AutoCreateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { loadProject } = useProject();
  const [samples, setSamples] = useState<SampleSong[]>([]);
  const [selectedSample, setSelectedSample] = useState<string>('hindi-romantic');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [language, setLanguage] = useState('Auto-detect');

  // Pipeline processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/samples')
      .then(res => res.json())
      .then(data => {
        if (data.samples) setSamples(data.samples);
      })
      .catch(err => console.warn('Could not fetch samples:', err));
  }, []);

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const startPipeline = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setCurrentStep(1);

    try {
      let audioUrl = '/samples/hindi-romantic.mp3';
      let fileName = 'hindi-romantic.mp3';
      let duration = 24.0;
      let bpm = 90;
      let sampleId = selectedSample;

      // 1. If user uploaded a custom file
      if (uploadedFile) {
        sampleId = '';
        setCurrentStep(1);
        const formData = new FormData();
        formData.append('audio', uploadedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Failed to upload audio');
        }

        const uploadData = await uploadRes.json();
        audioUrl = uploadData.audioUrl;
        fileName = uploadData.fileName;
        duration = uploadData.duration;
      } else {
        const found = samples.find(s => s.id === selectedSample);
        if (found) {
          audioUrl = found.audioUrl;
          fileName = `${found.id}.mp3`;
          duration = found.duration;
          bpm = found.bpm;
        }
      }

      // Step 2 & 3: Audio analysis & Beat detection
      setCurrentStep(2);
      await new Promise(r => setTimeout(r, 400));
      setCurrentStep(3);

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration, bpm, language })
      });

      if (!analyzeRes.ok) throw new Error('Audio analysis failed');
      const { beatMap, styleDecision } = await analyzeRes.json();

      // Step 4 & 5: Transcription & Word Timestamps
      setCurrentStep(4);
      await new Promise(r => setTimeout(r, 450));
      setCurrentStep(5);

      const transRes = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleId,
          audioUrl,
          fileName,
          language
        })
      });

      if (!transRes.ok) throw new Error('Lyrics transcription failed');
      const { data: sttData } = await transRes.json();

      // Step 6: Song structure
      setCurrentStep(6);
      await new Promise(r => setTimeout(r, 350));

      // Step 7 & 8: Typography & Dynamic Animation
      setCurrentStep(7);
      await new Promise(r => setTimeout(r, 300));
      setCurrentStep(8);

      // Convert STT lines into full styled LyricLines
      const styledLyrics = sttData.lines.map((line: any, idx: number) => {
        const lineCenter = (line.start + line.end) / 2;
        const section = beatMap.sections.find((s: any) => lineCenter >= s.start && lineCenter < s.end) || beatMap.sections[0];
        
        let anim = 'smoothReveal';
        if (section.type === 'intro') anim = 'blurReveal';
        else if (section.type === 'chorus') anim = 'kineticTypography';
        else if (section.type === 'drop') anim = 'impact';
        else if (section.type === 'outro') anim = 'fadeOut';
        else anim = idx % 2 === 0 ? 'smoothReveal' : 'trackingReveal';

        return {
          ...line,
          section: section.type,
          style: {
            fontFamily: styleDecision.fontFamily,
            fontSize: styleDecision.fontSize,
            fillColor: styleDecision.fillColor,
            animationPreset: anim,
            animationIntensity: styleDecision.animationIntensity,
            positionX: 50,
            positionY: 50,
            rotation: 0,
            scale: 1.0
          }
        };
      });

      // Step 9: Beat synchronization
      setCurrentStep(9);
      await new Promise(r => setTimeout(r, 300));

      // Step 10: Final project assembly
      setCurrentStep(10);
      await new Promise(r => setTimeout(r, 400));

      const newProject: ProjectData = {
        project: {
          id: `proj_${Date.now()}`,
          name: uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, '') : `${samples.find(s => s.id === selectedSample)?.title || 'Song'} — AI Video`,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        audio: {
          sourceUrl: audioUrl,
          fileName,
          duration,
          bpm: beatMap.bpm
        },
        beatMap,
        lyrics: styledLyrics,
        background: styleDecision.background,
        globalStyle: {
          fontFamily: styleDecision.fontFamily,
          fontSize: styleDecision.fontSize,
          fillColor: styleDecision.fillColor,
          animationPreset: styleDecision.primaryAnimation
        },
        settings: {
          aspectRatio: '9:16',
          width: 1080,
          height: 1920,
          fps: 30,
          beatSyncEnabled: true,
          karaokeModeEnabled: true,
          karaokeStyle: {
            activeWordColor: styleDecision.karaokeColor,
            activeWordGlow: true,
            activeWordScale: 1.18,
            activeWordBg: false,
            activeWordUnderline: false
          }
        }
      };

      loadProject(newProject);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during auto-creation.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-studio-900 border border-studio-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-studio-800 flex items-center justify-between bg-studio-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Create AI Lyrics Video</h2>
              <p className="text-xs text-slate-400">Drop your song. Get a studio-grade animated lyric video instantly.</p>
            </div>
          </div>
          {!isProcessing && (
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

          {!isProcessing ? (
            <>
              {/* Upload Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                    : uploadedFile
                    ? 'border-emerald-500/60 bg-emerald-500/5'
                    : 'border-studio-700 hover:border-indigo-500/50 bg-studio-850/40 hover:bg-studio-850/70'
                }`}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="audio/*,video/mp4"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition shadow-lg ${
                    uploadedFile ? 'bg-emerald-600 text-white' : 'bg-studio-800 text-indigo-400'
                  }`}>
                    {uploadedFile ? <CheckCircle2 className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                  </div>

                  {uploadedFile ? (
                    <div>
                      <p className="font-semibold text-white text-base">{uploadedFile.name}</p>
                      <p className="text-xs text-emerald-400 mt-1">Ready for analysis • {formatFileSize(uploadedFile.size)}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-slate-200 text-sm">Drag & drop your song here, or click to browse</p>
                      <p className="text-xs text-slate-500 mt-1">Supports MP3, WAV, M4A, AAC, OGG, MP4 audio</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Song Quick Pick */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Or pick a demo song (1-Click Ready):</span>
                  {uploadedFile && (
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Clear custom file
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {samples.map((sample) => {
                    const isSelected = !uploadedFile && selectedSample === sample.id;
                    return (
                      <div
                        key={sample.id}
                        onClick={() => {
                          setSelectedSample(sample.id);
                          setUploadedFile(null);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-600/10 shadow-sm shadow-indigo-500/20'
                            : 'border-studio-800 bg-studio-850/40 hover:border-studio-700 hover:bg-studio-800/60'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-studio-800 text-slate-400'
                        }`}>
                          <Disc3 className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-white truncate">{sample.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="text-indigo-400 font-medium">{sample.language}</span>
                            <span>•</span>
                            <span>{sample.bpm} BPM</span>
                            <span>•</span>
                            <span>{formatTimecode(sample.duration)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between p-3.5 bg-studio-850/60 border border-studio-800 rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Lyrics Language</p>
                  <p className="text-[11px] text-slate-500">Auto-detects Hindi, English, Punjabi, Bengali, Marathi, etc.</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-studio-800 text-white text-xs rounded-lg px-3 py-1.5 border border-studio-700 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Auto-detect">Auto-detect</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>
            </>
          ) : (
            /* Processing Pipeline View */
            <div className="py-4 space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-white">Synthesizing Lyrics Video</h3>
                <p className="text-xs text-slate-400">Our audio & animation intelligence engine is crafting your project</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-studio-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
              </div>

              {/* Steps list */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {STEPS.map((step) => {
                  const isDone = currentStep > step.num;
                  const isCurrent = currentStep === step.num;

                  return (
                    <div
                      key={step.num}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                        isDone
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                          : isCurrent
                          ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200'
                          : 'border-transparent text-slate-500 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-600 text-[10px] flex items-center justify-center shrink-0">
                            {step.num}
                          </span>
                        )}
                        <div>
                          <p className="font-semibold">{step.name}</p>
                          <p className="text-[10px] opacity-75">{step.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono">
                        {isDone ? 'Completed' : isCurrent ? 'Processing...' : 'Queued'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-studio-800 bg-studio-850/50 flex items-center justify-end gap-3">
          {!isProcessing && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-studio-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={startPipeline}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                ✨ Generate Lyrics Video
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
