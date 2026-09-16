import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const samplesDir = path.resolve(__dirname, '../../public/samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

console.log('Generating demo musical backing audio files using FFmpeg...');

// 1. Hindi Romantic (90 BPM Acoustic Ballad Chord Progression)
const hindiPath = path.join(samplesDir, 'hindi-romantic.mp3');
if (!fs.existsSync(hindiPath)) {
  console.log('Generating hindi-romantic.mp3...');
  execFileSync(ffmpegPath, [
    '-y',
    '-f', 'lavfi',
    '-i', 'sine=frequency=220:duration=24', // A3
    '-f', 'lavfi',
    '-i', 'sine=frequency=277.18:duration=24', // C#4
    '-f', 'lavfi',
    '-i', 'sine=frequency=329.63:duration=24', // E4
    '-filter_complex', '[0:a][1:a][2:a]amix=inputs=3:dropout_transition=2,volume=0.6,aecho=0.8:0.88:60:0.4[a]',
    '-map', '[a]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    hindiPath
  ]);
}

// 2. English Synthpop (120 BPM Energetic Groove)
const englishPath = path.join(samplesDir, 'english-pop.mp3');
if (!fs.existsSync(englishPath)) {
  console.log('Generating english-pop.mp3...');
  execFileSync(ffmpegPath, [
    '-y',
    '-f', 'lavfi',
    '-i', 'sine=frequency=261.63:duration=20', // C4
    '-f', 'lavfi',
    '-i', 'sine=frequency=329.63:duration=20', // E4
    '-f', 'lavfi',
    '-i', 'sine=frequency=392.00:duration=20', // G4
    '-filter_complex', '[0:a][1:a][2:a]amix=inputs=3:dropout_transition=2,volume=0.7,aecho=0.8:0.7:40:0.3[a]',
    '-map', '[a]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    englishPath
  ]);
}

// 3. Punjabi Beat (100 BPM Driving Energy)
const punjabiPath = path.join(samplesDir, 'punjabi-beat.mp3');
if (!fs.existsSync(punjabiPath)) {
  console.log('Generating punjabi-beat.mp3...');
  execFileSync(ffmpegPath, [
    '-y',
    '-f', 'lavfi',
    '-i', 'sine=frequency=146.83:duration=22', // D3
    '-f', 'lavfi',
    '-i', 'sine=frequency=220.00:duration=22', // A3
    '-f', 'lavfi',
    '-i', 'sine=frequency=293.66:duration=22', // D4
    '-filter_complex', '[0:a][1:a][2:a]amix=inputs=3:dropout_transition=2,volume=0.7,aecho=0.8:0.6:50:0.5[a]',
    '-map', '[a]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    punjabiPath
  ]);
}

// 4. Hinglish Lo-Fi (85 BPM Chillhop)
const hinglishPath = path.join(samplesDir, 'hinglish-chill.mp3');
if (!fs.existsSync(hinglishPath)) {
  console.log('Generating hinglish-chill.mp3...');
  execFileSync(ffmpegPath, [
    '-y',
    '-f', 'lavfi',
    '-i', 'sine=frequency=174.61:duration=22', // F3
    '-f', 'lavfi',
    '-i', 'sine=frequency=261.63:duration=22', // C4
    '-f', 'lavfi',
    '-i', 'sine=frequency=349.23:duration=22', // F4
    '-filter_complex', '[0:a][1:a][2:a]amix=inputs=3:dropout_transition=2,volume=0.6,aecho=0.8:0.9:80:0.4[a]',
    '-map', '[a]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    hinglishPath
  ]);
}

console.log('Successfully generated all 4 demo audio tracks in public/samples!');
