# LyricWave AI — Professional AI Lyrics Video Maker

> **"Drop a song. Get a professional animated lyrics video."**

**LyricWave AI** is a production-quality, modern AI-driven animated lyric video generator and studio editor. It automatically transcribes song audio with word-level timestamps, detects song structure (Intro, Verse, Chorus, Bridge, Outro), calculates BPM and beat maps, selects curated kinetic typography and procedural audio-reactive visual styles, and opens a multi-track studio timeline for complete creative customization and MP4 export.

---

## 🌟 Key Features

### 1. Audio Ingestion & Extraction
- **Supported Formats**: MP3, WAV, M4A, AAC, OGG, and MP4 video extraction.
- **Drag-and-Drop** with automatic file validation, size limits, and instant audio decoding.
- **Waveform & Peak Analysis**: Pre-computes 800-point normalized audio envelope for instant 60 FPS timeline rendering.
- **Native FFmpeg Conversion**: Seamless background transcode for non-standard containers.

### 2. Speech-To-Text & Timestamp Engine
- **Extensible Provider Architecture**:
  - `SampleDemoProvider`: 4 high-definition demo songs (Hindi Romantic, English Synthpop, Punjabi Desi Beat, Hinglish Lo-Fi) with hand-synchronized word boundaries for zero-config 1-click testing.
  - `LocalSTTProvider`: Offline speech segmentation with phrase-grouping algorithms based on pause gaps (>0.45s), sentence punctuation, and musical bar cadence.
  - `CloudWhisperProvider`: Seamlessly connects to Groq or OpenAI Whisper (`whisper-large-v3`) with `timestamp_granularities=["word"]`.
- **Multilingual Support**: Hindi, English, Hinglish, Punjabi, Bengali, Marathi, etc.
- **Preserves Original Script & Language**: Never translates lyrics arbitrarily; permits full text editing.

### 3. Beat & Music Synchronization
- **BPM & Beat Detection**: Detects tempo, quarter-note intervals, and measure downbeats.
- **Song Structure Detection**: Automatically maps sections:
  - `Intro` $\rightarrow$ Ambient visual build-up
  - `Verse` $\rightarrow$ Smooth kinetic slide & tracking reveals
  - `Chorus` $\rightarrow$ High-energy Kinetic Typography & Beat Pulses
  - `Drop` $\rightarrow$ Impact scale slam & rhythmic camera shakes
  - `Outro` $\rightarrow$ Atmospheric dissolve fade-outs
- **Beat Snapping**: Interactive toggle snaps lyric line boundaries and animations directly to the nearest musical beat.

### 4. 25+ Kinetic Animation Presets
- **TEXT**: Fade In, Fade Out, Smooth Reveal, Blur Reveal, Slide Up/Down/Left/Right, Scale In/Out, Pop, Bounce, Typewriter, Letter Reveal, Word Reveal, Tracking Reveal, Mask Reveal, Cinematic Reveal.
- **DYNAMIC**: Beat Pulse, Impact Scale, Shake, Flash, Glitch, Elastic, Rotation Tilt, Wave, Floating Ambient, Kinetic Typography.
- **KARAOKE**: Word Highlight, Progressive Liquid Fill, Active Word Scale Bounce, Active Word Neon Glow, Pill Badge Background.

### 5. 10 Audio-Reactive Procedural Backgrounds
- **Cinematic Gradient**: Deep midnight blue with swirling aurora tones.
- **Dark Studio Glow**: Obsidian stage with audio-reactive radial core illumination.
- **Stardust Particles**: Floating luminous particles reacting to bass and treble peaks.
- **Audio Wavefield**: Living oscilloscope wavefield.
- **Spectrum Equalizer**: High-definition neon frequency bars.
- **Liquid Abstract Flow**: Undulating silk ribbon motion.
- **Sunset Ambient**: Velvet peach and magenta gradient sweep.
- **Anamorphic Bokeh**: Soft out-of-focus atmospheric lens orbs.
- **Laser Light Streaks**: Prismatic high-velocity streaks.
- **Minimal Obsidian**: Clean studio backdrop focusing on typography precision.

### 6. Full-Featured Multi-Track Timeline & Studio
- **Audio Track**: Canvas waveform with beat ticks and section indicator color banners.
- **Lyrics Track**: Draggable, resizable line cards with left/right micro-timing handles.
- **Interactive Inspector**: Micro-adjust word-level timings, font family, font size, X/Y positioning, scale, and rotation.
- **Undo / Redo History**: Full state snapshotting (`Ctrl+Z` / `Ctrl+Shift+Z`).
- **Aspect Ratio Switching**: 9:16 (Shorts/Reels), 16:9 (YouTube), 1:1 (Square).

### 7. Dual MP4 Video Export Engine
- **Direct In-Browser Canvas Stream Capture**: Instant 30 FPS recording with synced Web Audio destination.
- **Server-Side FFmpeg Pipeline**: Full H.264/AAC MP4 encoding.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+ (bundled in `C:\Users\DELL\bin\node`)
- FFmpeg (bundled in `node_modules/ffmpeg-static`)

### Running the Application
```bash
# Start backend server (port 3001)
npm run dev:server

# Start Vite frontend (port 5173)
npm run dev:client

# Or run both concurrently:
npm run dev
```

Open your browser to:
- **Frontend (Vite HMR)**: `http://localhost:5173`
- **Full-Stack Production Server**: `http://localhost:3001`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Space` | Play / Pause audio |
| `Ctrl + Z` | Undo last edit |
| `Ctrl + Shift + Z` (or `Ctrl + Y`) | Redo edit |
| `Delete` | Delete currently selected lyric line |
| `Right Arrow` | Scrub timeline forward (+1.0s with Shift) |
| `Left Arrow` | Scrub timeline backward (-1.0s with Shift) |

---

## 🔮 Future-Ready Architecture

The pipeline is partitioned into clean, isolated layers ready for future extensions without refactoring:
- **Audio Layer**: Decoupled Web Audio & FFmpeg extraction.
- **Lyrics Layer**: Word-level timing model with STT provider interfaces.
- **Visuals Layer**: Procedural backgrounds ready for `AIImageProvider` or `StockVideoProvider`.
- **Animation Layer**: Reusable parameter-driven kinetics.
- **Compositing Layer**: Multi-layer canvas compositor ready for Remotion or cloud render farms.
