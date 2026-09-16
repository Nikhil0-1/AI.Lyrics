import { SpeechToTextProvider, STTResult } from './provider';
import { LocalSTTProvider } from './localProvider';

export class CloudWhisperProvider implements SpeechToTextProvider {
  name = 'CloudWhisperProvider';

  async transcribe(
    audioBuffer: Buffer,
    fileName: string,
    options?: { language?: string; apiKey?: string; duration?: number }
  ): Promise<STTResult> {
    const apiKey = options?.apiKey || process.env.WHISPER_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.log('[CloudWhisperProvider] No API key detected. Delegating gracefully to LocalSTTProvider.');
      const local = new LocalSTTProvider();
      return local.transcribe(audioBuffer, fileName, options);
    }

    try {
      console.log(`[CloudWhisperProvider] Calling Whisper API for ${fileName}...`);
      // FormData multi-part upload to Whisper endpoint
      const formData = new FormData();
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      formData.append('file', blob, fileName);
      formData.append('model', 'whisper-large-v3');
      formData.append('response_format', 'verbose_json');
      formData.append('timestamp_granularities[]', 'word');
      if (options?.language && options.language !== 'Auto-detect') {
        formData.append('language', options.language.toLowerCase().substring(0, 2));
      }

      const endpoint = process.env.GROQ_API_KEY 
        ? 'https://api.groq.com/openai/v1/audio/transcriptions'
        : 'https://api.openai.com/v1/audio/transcriptions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.statusText}`);
      }

      const json = await response.json();
      const words = (json.words || []).map((w: any) => ({
        word: w.word.trim(),
        start: parseFloat(w.start),
        end: parseFloat(w.end)
      }));

      const lines = LocalSTTProvider.groupWordsIntoLines(words);

      return {
        language: json.language || 'English',
        duration: json.duration || options?.duration || 30,
        words,
        lines
      };
    } catch (err) {
      console.warn('[CloudWhisperProvider] Cloud transcription failed, falling back to LocalSTTProvider:', err);
      const local = new LocalSTTProvider();
      return local.transcribe(audioBuffer, fileName, options);
    }
  }
}
