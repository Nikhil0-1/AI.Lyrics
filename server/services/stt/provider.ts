export interface STTWord {
  word: string;
  start: number;
  end: number;
}

export interface STTLine {
  id: string;
  text: string;
  start: number;
  end: number;
  words: Array<{
    id: string;
    word: string;
    start: number;
    end: number;
  }>;
}

export interface STTResult {
  language: string;
  duration: number;
  words: STTWord[];
  lines: STTLine[];
}

export interface SpeechToTextProvider {
  name: string;
  transcribe(
    audioBuffer: Buffer,
    fileName: string,
    options?: { language?: string; apiKey?: string }
  ): Promise<STTResult>;
}
