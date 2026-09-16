import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { SAMPLE_SONGS, SampleSTTProvider } from './services/stt/sampleProvider';
import { LocalSTTProvider } from './services/stt/localProvider';
import { CloudWhisperProvider } from './services/stt/cloudProvider';
import { AudioAnalyzerService } from './services/audioAnalyzer';
import { StyleDirectorService } from './services/styleDirector';
import { FFmpegService } from './services/ffmpegService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Upload directory setup
const uploadsDir = path.resolve(__dirname, 'uploads');
const exportsDir = path.resolve(__dirname, 'exports');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));
app.use('/exports', express.static(exportsDir));
app.use('/samples', express.static(path.resolve(__dirname, '../public/samples')));

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(mp3|wav|m4a|aac|ogg|mp4|webm|flac)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error('Unsupported audio file format. Please upload MP3, WAV, M4A, AAC, OGG, or MP4.'));
    }
    cb(null, true);
  }
});

// GET /api/samples
app.get('/api/samples', (_req, res) => {
  const list = Object.entries(SAMPLE_SONGS).map(([id, s]) => ({
    id,
    title: s.title,
    artist: s.artist,
    language: s.language,
    genre: s.genre,
    duration: s.duration,
    bpm: s.bpm,
    audioUrl: s.audioUrl
  }));
  res.json({ samples: list });
});

// POST /api/upload
app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    const uploadedPath = req.file.path;
    let finalAudioPath = uploadedPath;
    let finalFileName = req.file.filename;

    // If file is not MP3, convert it using FFmpeg for optimal browser decoding
    if (!req.file.originalname.toLowerCase().endsWith('.mp3')) {
      const mp3FileName = `${path.parse(req.file.filename).name}.mp3`;
      const mp3Path = path.join(uploadsDir, mp3FileName);
      await FFmpegService.convertToMp3(uploadedPath, mp3Path);
      finalAudioPath = mp3Path;
      finalFileName = mp3FileName;
    }

    const duration = await FFmpegService.getDuration(finalAudioPath);

    res.json({
      success: true,
      audioUrl: `/uploads/${finalFileName}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      duration: parseFloat(duration.toFixed(2))
    });
  } catch (err: any) {
    console.error('Upload processing error:', err);
    res.status(500).json({ error: err.message || 'Failed to process audio upload.' });
  }
});

// POST /api/analyze
app.post('/api/analyze', (req, res) => {
  try {
    const { duration = 30, bpm, genre = 'Pop', language = 'English' } = req.body;
    const beatMap = AudioAnalyzerService.analyzeTrack(duration, bpm, genre);
    const styleDecision = StyleDirectorService.direct(beatMap.bpm, language, genre, beatMap);

    res.json({
      beatMap,
      styleDecision
    });
  } catch (err: any) {
    console.error('Audio analysis error:', err);
    res.status(500).json({ error: err.message || 'Audio analysis failed.' });
  }
});

// POST /api/transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { sampleId, audioUrl, fileName = 'song.mp3', language = 'Auto-detect', provider = 'auto' } = req.body;

    let result;

    // 1. If sample song was selected
    if (sampleId && SAMPLE_SONGS[sampleId]) {
      result = SAMPLE_SONGS[sampleId].data;
    } else {
      // 2. Select provider based on preference & environment
      let selectedProvider = new LocalSTTProvider();
      if (provider === 'cloud' || process.env.WHISPER_API_KEY || process.env.GROQ_API_KEY) {
        selectedProvider = new CloudWhisperProvider() as any;
      }

      let audioBuffer = Buffer.alloc(0);
      if (audioUrl) {
        const localPath = path.join(__dirname, '..', audioUrl.replace(/^\//, ''));
        if (fs.existsSync(localPath)) {
          audioBuffer = fs.readFileSync(localPath);
        }
      }

      result = await selectedProvider.transcribe(audioBuffer, fileName, { language });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: err.message || 'Transcription failed.' });
  }
});

// POST /api/restyle
app.post('/api/restyle', (req, res) => {
  try {
    const { option, lines, targetLineId } = req.body;
    const result = StyleDirectorService.applyRestyle(option, lines, targetLineId);
    res.json(result);
  } catch (err: any) {
    console.error('Restyle error:', err);
    res.status(500).json({ error: err.message || 'Restyle failed.' });
  }
});

// POST /api/export
app.post('/api/export', async (req, res) => {
  try {
    const { project, settings } = req.body;
    const width = settings?.width || 1080;
    const height = settings?.height || 1920;
    const fps = settings?.fps || 30;
    const duration = project?.audio?.duration || 20;

    const audioSource = project?.audio?.sourceUrl || '/samples/hindi-romantic.mp3';
    let audioFilePath = path.join(__dirname, '..', audioSource.replace(/^\//, ''));
    if (!fs.existsSync(audioFilePath)) {
      audioFilePath = path.join(__dirname, '../public', audioSource.replace(/^\//, ''));
    }

    const outputFileName = `export_${Date.now()}_${width}x${height}.mp4`;
    const outputPath = path.join(exportsDir, outputFileName);

    await FFmpegService.renderVideo(audioFilePath, outputPath, {
      width,
      height,
      fps,
      duration,
      title: project?.project?.name || 'AI Lyrics Video'
    });

    res.json({
      success: true,
      downloadUrl: `/exports/${outputFileName}`,
      fileName: outputFileName
    });
  } catch (err: any) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message || 'Export failed.' });
  }
});

// Serve frontend build if present
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/exports') || req.path.startsWith('/samples')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[LyricWave Backend] Running on http://localhost:${PORT}`);
});
