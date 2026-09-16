import { ProjectData } from '../types/project';
import { audioController } from './audio';

export interface RenderProgressCallback {
  (progress: number, stage: string): void;
}

export class ExportHelper {
  /**
   * Records the canvas animation in real-time with Web Audio to produce an instant client-side video file
   */
  public static async exportClientRecording(
    canvas: HTMLCanvasElement,
    duration: number,
    onProgress: RenderProgressCallback
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        onProgress(5, 'Preparing video and audio streams...');

        const videoStream = canvas.captureStream(30); // 30 FPS
        const audioCtx = audioController.getAudioContext();

        // Create MediaStreamDestination from Web Audio
        const dest = audioCtx.createMediaStreamDestination();
        // Connect gain node or source to dest
        const tracks = [...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()];
        const combinedStream = new MediaStream(tracks);

        const mimeTypes = [
          'video/mp4;codecs=avc1,mp4a.40.2',
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm'
        ];

        let selectedMime = 'video/webm';
        for (const mime of mimeTypes) {
          if (MediaRecorder.isTypeSupported(mime)) {
            selectedMime = mime;
            break;
          }
        }

        const recorder = new MediaRecorder(combinedStream, {
          mimeType: selectedMime,
          videoBitsPerSecond: 8000000 // 8 Mbps high quality
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          onProgress(100, 'Video packaging complete!');
          const finalBlob = new Blob(chunks, { type: selectedMime });
          resolve(finalBlob);
        };

        // Start playback from 0
        onProgress(10, 'Rendering frames with synchronized audio...');
        recorder.start(100);
        audioController.play(0, (t) => {
          const pct = Math.min(95, Math.round(10 + (t / duration) * 85));
          onProgress(pct, `Compositing: ${Math.round(t)}s / ${Math.round(duration)}s`);
        }, () => {
          recorder.stop();
        });

        // Safety timeout in case onEnded doesn't fire
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
            audioController.stop();
          }
        }, (duration + 1.5) * 1000);

      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Request server-side FFmpeg MP4 export
   */
  public static async exportServerMP4(
    project: ProjectData,
    onProgress: RenderProgressCallback
  ): Promise<{ downloadUrl: string; fileName: string }> {
    onProgress(15, 'Uploading project parameters to FFmpeg pipeline...');

    const response = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project,
        settings: project.settings
      })
    });

    onProgress(65, 'Muxing audio and visual tracks with H.264...');

    if (!response.ok) {
      throw new Error(`Server export failed: ${response.statusText}`);
    }

    const json = await response.json();
    onProgress(100, 'MP4 successfully exported!');
    return json;
  }
}
