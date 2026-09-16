class AudioController {
  private ctx: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startTime = 0;
  private pauseOffset = 0;
  private isPlaying = false;
  private frequencyData: Uint8Array | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private rafId: number | null = null;

  public getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public async loadAudio(url: string): Promise<AudioBuffer> {
    const ctx = this.getAudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return this.audioBuffer;
  }

  public setAudioBuffer(buffer: AudioBuffer) {
    this.audioBuffer = buffer;
  }

  public getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  public play(fromTime?: number, onTimeUpdate?: (time: number) => void, onEnded?: () => void) {
    const ctx = this.getAudioContext();
    if (!this.audioBuffer) return;

    if (this.isPlaying) {
      this.stop();
    }

    if (fromTime !== undefined) {
      this.pauseOffset = Math.max(0, Math.min(fromTime, this.audioBuffer.duration));
    }

    this.onTimeUpdateCallback = onTimeUpdate || null;
    this.onEndedCallback = onEnded || null;

    this.sourceNode = ctx.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;

    if (!this.analyserNode) {
      this.analyserNode = ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
    }

    if (!this.gainNode) {
      this.gainNode = ctx.createGain();
      this.gainNode.gain.value = 1.0;
    }

    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(ctx.destination);

    this.startTime = ctx.currentTime - this.pauseOffset;
    this.sourceNode.start(0, this.pauseOffset);
    this.isPlaying = true;

    this.sourceNode.onended = () => {
      if (this.isPlaying && this.getCurrentTime() >= (this.audioBuffer?.duration || 0) - 0.1) {
        this.isPlaying = false;
        this.pauseOffset = 0;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        if (this.onEndedCallback) this.onEndedCallback();
      }
    };

    this.startProgressLoop();
  }

  public pause(): number {
    if (!this.isPlaying) return this.pauseOffset;
    const currentTime = this.getCurrentTime();
    this.stop();
    this.pauseOffset = currentTime;
    return this.pauseOffset;
  }

  public stop() {
    this.isPlaying = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (e) {
        // ignore already stopped
      }
      this.sourceNode = null;
    }
  }

  public seek(time: number) {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.pauseOffset = Math.max(0, Math.min(time, this.audioBuffer?.duration || 0));
    if (wasPlaying) {
      this.play(this.pauseOffset, this.onTimeUpdateCallback || undefined, this.onEndedCallback || undefined);
    }
  }

  public getCurrentTime(): number {
    if (!this.isPlaying || !this.ctx) return this.pauseOffset;
    return Math.max(0, this.ctx.currentTime - this.startTime);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public getAudioFrequencyData(): Uint8Array {
    if (this.analyserNode && this.frequencyData) {
      this.analyserNode.getByteFrequencyData(this.frequencyData as any);
      return this.frequencyData;
    }
    return new Uint8Array(128);
  }

  // Energy in bass / mid / treble (0.0 to 1.0)
  public getEnergyLevels(): { bass: number; mid: number; treble: number; overall: number } {
    const data = this.getAudioFrequencyData();
    if (!data.length) return { bass: 0, mid: 0, treble: 0, overall: 0 };

    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;
    let totalSum = 0;

    const bassEnd = Math.floor(data.length * 0.15);
    const midEnd = Math.floor(data.length * 0.5);

    for (let i = 0; i < data.length; i++) {
      const val = data[i] / 255;
      totalSum += val;
      if (i < bassEnd) bassSum += val;
      else if (i < midEnd) midSum += val;
      else trebleSum += val;
    }

    return {
      bass: bassEnd ? bassSum / bassEnd : 0,
      mid: (midEnd - bassEnd) ? midSum / (midEnd - bassEnd) : 0,
      treble: (data.length - midEnd) ? trebleSum / (data.length - midEnd) : 0,
      overall: data.length ? totalSum / data.length : 0,
    };
  }

  private startProgressLoop() {
    const loop = () => {
      if (this.isPlaying) {
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.getCurrentTime());
        }
        this.rafId = requestAnimationFrame(loop);
      }
    };
    this.rafId = requestAnimationFrame(loop);
  }
}

export const audioController = new AudioController();

// Extract normalized waveform peaks from AudioBuffer
export function extractPeaks(audioBuffer: AudioBuffer, numPeaks = 800): number[] {
  const channelData = audioBuffer.getChannelData(0);
  const step = Math.ceil(channelData.length / numPeaks);
  const peaks: number[] = new Array(numPeaks).fill(0);

  for (let i = 0; i < numPeaks; i++) {
    let max = 0;
    const start = i * step;
    const end = Math.min(start + step, channelData.length);
    for (let j = start; j < end; j++) {
      const absVal = Math.abs(channelData[j]);
      if (absVal > max) max = absVal;
    }
    peaks[i] = Math.min(1, max);
  }
  return peaks;
}
