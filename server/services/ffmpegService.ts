import ffmpegPath from 'ffmpeg-static';
import { execFile, execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export class FFmpegService {
  /**
   * Ensure audio file is in standard MP3 format
   */
  public static async convertToMp3(inputPath: string, outputPath: string): Promise<string> {
    if (!ffmpegPath) throw new Error('FFmpeg binary not available');

    console.log(`[FFmpeg] Converting ${inputPath} to ${outputPath}...`);
    await execFileAsync(ffmpegPath, [
      '-y',
      '-i', inputPath,
      '-vn',
      '-c:a', 'libmp3lame',
      '-b:a', '192k',
      outputPath
    ]);
    return outputPath;
  }

  /**
   * Get audio duration in seconds
   */
  public static async getDuration(filePath: string): Promise<number> {
    if (!ffmpegPath) return 30.0;
    try {
      const { stderr } = await execFileAsync(ffmpegPath, ['-i', filePath]);
      const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
      if (match) {
        const hours = parseFloat(match[1]);
        const minutes = parseFloat(match[2]);
        const seconds = parseFloat(match[3]);
        return hours * 3600 + minutes * 60 + seconds;
      }
    } catch (err: any) {
      if (err.stderr) {
        const match = err.stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
        if (match) {
          const hours = parseFloat(match[1]);
          const minutes = parseFloat(match[2]);
          const seconds = parseFloat(match[3]);
          return hours * 3600 + minutes * 60 + seconds;
        }
      }
    }
    return 30.0;
  }

  /**
   * Render an MP4 video combining audio with visual styling
   */
  public static async renderVideo(
    audioPath: string,
    outputPath: string,
    options: {
      width: number;
      height: number;
      fps: number;
      duration: number;
      title?: string;
    }
  ): Promise<string> {
    if (!ffmpegPath) throw new Error('FFmpeg binary not available');

    const { width, height, fps, duration, title = 'AI Lyrics Video' } = options;
    console.log(`[FFmpeg] Rendering final MP4: ${width}x${height} @ ${fps}fps, duration ${duration}s...`);

    // Create a high-definition audio-reactive video stream with FFmpeg lavfi
    // Combines color waves and audio showwaves / showcqt filter for YouTube lyric video look
    await execFileAsync(ffmpegPath, [
      '-y',
      '-i', audioPath,
      '-f', 'lavfi',
      '-i', `color=c=0x090a16:s=${width}x${height}:r=${fps}`,
      '-filter_complex',
      `[0:a]showwaves=s=${width}x${Math.round(height * 0.3)}:mode=line:colors=0x6366f1@0.8:scale=sqrt[wave];` +
      `[1:v][wave]overlay=0:${Math.round(height * 0.65)}:shortest=1[v1];` +
      `[v1]drawtext=text='${title.replace(/'/g, '')}':fontsize=${Math.round(width * 0.05)}:fontcolor=white:x=(w-text_w)/2:y=${Math.round(height * 0.4)}[v]`,
      '-map', '[v]',
      '-map', '0:a',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-t', duration.toString(),
      outputPath
    ]);

    return outputPath;
  }
}
