import { STTResult, SpeechToTextProvider } from './provider';

export const SAMPLE_SONGS: Record<string, {
  title: string;
  artist: string;
  language: string;
  genre: string;
  audioUrl: string;
  duration: number;
  bpm: number;
  data: STTResult;
}> = {
  'hindi-romantic': {
    title: 'Teri Aankhon Mein (Romantic Ballad)',
    artist: 'Acoustic Melody',
    language: 'Hindi',
    genre: 'Romantic',
    audioUrl: '/samples/hindi-romantic.mp3',
    duration: 24.0,
    bpm: 90,
    data: {
      language: 'Hindi',
      duration: 24.0,
      words: [
        { word: 'Teri', start: 1.20, end: 1.65 },
        { word: 'aankhon', start: 1.65, end: 2.25 },
        { word: 'mein', start: 2.25, end: 2.60 },
        { word: 'khoya', start: 2.60, end: 3.10 },
        { word: 'rahoon', start: 3.10, end: 3.80 },

        { word: 'Har', start: 4.50, end: 4.80 },
        { word: 'pal', start: 4.80, end: 5.20 },
        { word: 'tujhko', start: 5.20, end: 5.85 },
        { word: 'hi', start: 5.85, end: 6.15 },
        { word: 'chahta', start: 6.15, end: 6.75 },
        { word: 'rahoon', start: 6.75, end: 7.40 },

        { word: 'Yeh', start: 8.50, end: 8.85 },
        { word: 'ishq', start: 8.85, end: 9.35 },
        { word: 'hai', start: 9.35, end: 9.65 },
        { word: 'tera', start: 9.65, end: 10.20 },
        { word: 'meri', start: 10.20, end: 10.75 },
        { word: 'jaan', start: 10.75, end: 11.60 },

        { word: 'Dil', start: 12.80, end: 13.20 },
        { word: 'ki', start: 13.20, end: 13.50 },
        { word: 'dhadkan', start: 13.50, end: 14.15 },
        { word: 'bhi', start: 14.15, end: 14.45 },
        { word: 'tu', start: 14.45, end: 14.90 },
        { word: 'hai', start: 14.90, end: 15.30 },
        { word: 'jahaan', start: 15.30, end: 16.10 },

        { word: 'Sath', start: 17.00, end: 17.40 },
        { word: 'chhodenge', start: 17.40, end: 18.20 },
        { word: 'na', start: 18.20, end: 18.55 },
        { word: 'hum', start: 18.55, end: 18.95 },
        { word: 'kabhi', start: 18.95, end: 19.80 },

        { word: 'Tujhse', start: 20.50, end: 21.05 },
        { word: 'hi', start: 21.05, end: 21.35 },
        { word: 'hai', start: 21.35, end: 21.65 },
        { word: 'zindagi', start: 21.65, end: 22.40 },
        { word: 'sabhi', start: 22.40, end: 23.30 }
      ],
      lines: [
        {
          id: 'line_1',
          text: 'Teri aankhon mein khoya rahoon',
          start: 1.15,
          end: 3.90,
          words: [
            { id: 'w1_1', word: 'Teri', start: 1.20, end: 1.65 },
            { id: 'w1_2', word: 'aankhon', start: 1.65, end: 2.25 },
            { id: 'w1_3', word: 'mein', start: 2.25, end: 2.60 },
            { id: 'w1_4', word: 'khoya', start: 2.60, end: 3.10 },
            { id: 'w1_5', word: 'rahoon', start: 3.10, end: 3.80 }
          ]
        },
        {
          id: 'line_2',
          text: 'Har pal tujhko hi chahta rahoon',
          start: 4.40,
          end: 7.50,
          words: [
            { id: 'w2_1', word: 'Har', start: 4.50, end: 4.80 },
            { id: 'w2_2', word: 'pal', start: 4.80, end: 5.20 },
            { id: 'w2_3', word: 'tujhko', start: 5.20, end: 5.85 },
            { id: 'w2_4', word: 'hi', start: 5.85, end: 6.15 },
            { id: 'w2_5', word: 'chahta', start: 6.15, end: 6.75 },
            { id: 'w2_6', word: 'rahoon', start: 6.75, end: 7.40 }
          ]
        },
        {
          id: 'line_3',
          text: 'Yeh ishq hai tera meri jaan',
          start: 8.40,
          end: 11.80,
          words: [
            { id: 'w3_1', word: 'Yeh', start: 8.50, end: 8.85 },
            { id: 'w3_2', word: 'ishq', start: 8.85, end: 9.35 },
            { id: 'w3_3', word: 'hai', start: 9.35, end: 9.65 },
            { id: 'w3_4', word: 'tera', start: 9.65, end: 10.20 },
            { id: 'w3_5', word: 'meri', start: 10.20, end: 10.75 },
            { id: 'w3_6', word: 'jaan', start: 10.75, end: 11.60 }
          ]
        },
        {
          id: 'line_4',
          text: 'Dil ki dhadkan bhi tu hai jahaan',
          start: 12.70,
          end: 16.20,
          words: [
            { id: 'w4_1', word: 'Dil', start: 12.80, end: 13.20 },
            { id: 'w4_2', word: 'ki', start: 13.20, end: 13.50 },
            { id: 'w4_3', word: 'dhadkan', start: 13.50, end: 14.15 },
            { id: 'w4_4', word: 'bhi', start: 14.15, end: 14.45 },
            { id: 'w4_5', word: 'tu', start: 14.45, end: 14.90 },
            { id: 'w4_6', word: 'hai', start: 14.90, end: 15.30 },
            { id: 'w4_7', word: 'jahaan', start: 15.30, end: 16.10 }
          ]
        },
        {
          id: 'line_5',
          text: 'Sath chhodenge na hum kabhi',
          start: 16.90,
          end: 19.90,
          words: [
            { id: 'w5_1', word: 'Sath', start: 17.00, end: 17.40 },
            { id: 'w5_2', word: 'chhodenge', start: 17.40, end: 18.20 },
            { id: 'w5_3', word: 'na', start: 18.20, end: 18.55 },
            { id: 'w5_4', word: 'hum', start: 18.55, end: 18.95 },
            { id: 'w5_5', word: 'kabhi', start: 18.95, end: 19.80 }
          ]
        },
        {
          id: 'line_6',
          text: 'Tujhse hi hai zindagi sabhi',
          start: 20.40,
          end: 23.50,
          words: [
            { id: 'w6_1', word: 'Tujhse', start: 20.50, end: 21.05 },
            { id: 'w6_2', word: 'hi', start: 21.05, end: 21.35 },
            { id: 'w6_3', word: 'hai', start: 21.35, end: 21.65 },
            { id: 'w6_4', word: 'zindagi', start: 21.65, end: 22.40 },
            { id: 'w6_5', word: 'sabhi', start: 22.40, end: 23.30 }
          ]
        }
      ]
    }
  },

  'english-pop': {
    title: 'Sky Full of Lights (Synthpop)',
    artist: 'Neon Horizon',
    language: 'English',
    genre: 'Pop / Synthwave',
    audioUrl: '/samples/english-pop.mp3',
    duration: 20.0,
    bpm: 120,
    data: {
      language: 'English',
      duration: 20.0,
      words: [
        { word: 'Cause', start: 0.80, end: 1.10 },
        { word: 'you', start: 1.10, end: 1.35 },
        { word: 'are', start: 1.35, end: 1.55 },
        { word: 'a', start: 1.55, end: 1.70 },
        { word: 'sky', start: 1.70, end: 2.15 },
        { word: 'full', start: 2.15, end: 2.55 },
        { word: 'of', start: 2.55, end: 2.75 },
        { word: 'stars', start: 2.75, end: 3.60 },

        { word: 'I', start: 4.20, end: 4.45 },
        { word: 'gonna', start: 4.45, end: 4.85 },
        { word: 'give', start: 4.85, end: 5.15 },
        { word: 'you', start: 5.15, end: 5.40 },
        { word: 'my', start: 5.40, end: 5.70 },
        { word: 'heart', start: 5.70, end: 6.60 },

        { word: 'Lighting', start: 7.40, end: 7.90 },
        { word: 'up', start: 7.90, end: 8.15 },
        { word: 'the', start: 8.15, end: 8.35 },
        { word: 'darkest', start: 8.35, end: 8.95 },
        { word: 'night', start: 8.95, end: 9.80 },

        { word: 'We', start: 10.50, end: 10.75 },
        { word: 'are', start: 10.75, end: 11.00 },
        { word: 'dancing', start: 11.00, end: 11.60 },
        { word: 'in', start: 11.60, end: 11.85 },
        { word: 'the', start: 11.85, end: 12.05 },
        { word: 'light', start: 12.05, end: 12.90 },

        { word: 'Feel', start: 13.60, end: 13.95 },
        { word: 'the', start: 13.95, end: 14.15 },
        { word: 'bass', start: 14.15, end: 14.60 },
        { word: 'and', start: 14.60, end: 14.80 },
        { word: 'take', start: 14.80, end: 15.20 },
        { word: 'flight', start: 15.20, end: 16.00 },

        { word: 'Forever', start: 16.80, end: 17.50 },
        { word: 'burning', start: 17.50, end: 18.20 },
        { word: 'bright', start: 18.20, end: 19.30 }
      ],
      lines: [
        {
          id: 'line_e1',
          text: 'Cause you are a sky full of stars',
          start: 0.75,
          end: 3.80,
          words: [
            { id: 'we1_1', word: 'Cause', start: 0.80, end: 1.10 },
            { id: 'we1_2', word: 'you', start: 1.10, end: 1.35 },
            { id: 'we1_3', word: 'are', start: 1.35, end: 1.55 },
            { id: 'we1_4', word: 'a', start: 1.55, end: 1.70 },
            { id: 'we1_5', word: 'sky', start: 1.70, end: 2.15 },
            { id: 'we1_6', word: 'full', start: 2.15, end: 2.55 },
            { id: 'we1_7', word: 'of', start: 2.55, end: 2.75 },
            { id: 'we1_8', word: 'stars', start: 2.75, end: 3.60 }
          ]
        },
        {
          id: 'line_e2',
          text: 'I gonna give you my heart',
          start: 4.10,
          end: 6.80,
          words: [
            { id: 'we2_1', word: 'I', start: 4.20, end: 4.45 },
            { id: 'we2_2', word: 'gonna', start: 4.45, end: 4.85 },
            { id: 'we2_3', word: 'give', start: 4.85, end: 5.15 },
            { id: 'we2_4', word: 'you', start: 5.15, end: 5.40 },
            { id: 'we2_5', word: 'my', start: 5.40, end: 5.70 },
            { id: 'we2_6', word: 'heart', start: 5.70, end: 6.60 }
          ]
        },
        {
          id: 'line_e3',
          text: 'Lighting up the darkest night',
          start: 7.30,
          end: 10.00,
          words: [
            { id: 'we3_1', word: 'Lighting', start: 7.40, end: 7.90 },
            { id: 'we3_2', word: 'up', start: 7.90, end: 8.15 },
            { id: 'we3_3', word: 'the', start: 8.15, end: 8.35 },
            { id: 'we3_4', word: 'darkest', start: 8.35, end: 8.95 },
            { id: 'we3_5', word: 'night', start: 8.95, end: 9.80 }
          ]
        },
        {
          id: 'line_e4',
          text: 'We are dancing in the light',
          start: 10.40,
          end: 13.10,
          words: [
            { id: 'we4_1', word: 'We', start: 10.50, end: 10.75 },
            { id: 'we4_2', word: 'are', start: 10.75, end: 11.00 },
            { id: 'we4_3', word: 'dancing', start: 11.00, end: 11.60 },
            { id: 'we4_4', word: 'in', start: 11.60, end: 11.85 },
            { id: 'we4_5', word: 'the', start: 11.85, end: 12.05 },
            { id: 'we4_6', word: 'light', start: 12.05, end: 12.90 }
          ]
        },
        {
          id: 'line_e5',
          text: 'Feel the bass and take flight',
          start: 13.50,
          end: 16.20,
          words: [
            { id: 'we5_1', word: 'Feel', start: 13.60, end: 13.95 },
            { id: 'we5_2', word: 'the', start: 13.95, end: 14.15 },
            { id: 'we5_3', word: 'bass', start: 14.15, end: 14.60 },
            { id: 'we5_4', word: 'and', start: 14.60, end: 14.80 },
            { id: 'we5_5', word: 'take', start: 14.80, end: 15.20 },
            { id: 'we5_6', word: 'flight', start: 15.20, end: 16.00 }
          ]
        },
        {
          id: 'line_e6',
          text: 'Forever burning bright',
          start: 16.70,
          end: 19.50,
          words: [
            { id: 'we6_1', word: 'Forever', start: 16.80, end: 17.50 },
            { id: 'we6_2', word: 'burning', start: 17.50, end: 18.20 },
            { id: 'we6_3', word: 'bright', start: 18.20, end: 19.30 }
          ]
        }
      ]
    }
  },

  'punjabi-beat': {
    title: 'Munda Desi Beat (Punjabi)',
    artist: 'Bhangra Club',
    language: 'Punjabi',
    genre: 'Punjabi / Desi Hip Hop',
    audioUrl: '/samples/punjabi-beat.mp3',
    duration: 22.0,
    bpm: 100,
    data: {
      language: 'Punjabi',
      duration: 22.0,
      words: [
        { word: 'Dil', start: 1.00, end: 1.40 },
        { word: 'le', start: 1.40, end: 1.70 },
        { word: 'gayi', start: 1.70, end: 2.15 },
        { word: 'kudi', start: 2.15, end: 2.65 },
        { word: 'haye', start: 2.65, end: 3.10 },
        { word: 'sadi', start: 3.10, end: 3.60 },

        { word: 'Nachdi', start: 4.50, end: 5.05 },
        { word: 'vekh', start: 5.05, end: 5.45 },
        { word: 'ke', start: 5.45, end: 5.75 },
        { word: 'dhol', start: 5.75, end: 6.30 },
        { word: 'te', start: 6.30, end: 6.65 },
        { word: 'yaar', start: 6.65, end: 7.40 },

        { word: 'Chhad', start: 8.20, end: 8.65 },
        { word: 'de', start: 8.65, end: 8.95 },
        { word: 'nakhre', start: 8.95, end: 9.60 },
        { word: 'tu', start: 9.60, end: 9.95 },
        { word: 'soniye', start: 9.95, end: 10.80 },

        { word: 'Bass', start: 11.50, end: 12.00 },
        { word: 'drop', start: 12.00, end: 12.45 },
        { word: 'hoya', start: 12.45, end: 12.95 },
        { word: 'te', start: 12.95, end: 13.25 },
        { word: 'machao', start: 13.25, end: 13.90 },
        { word: 'shor', start: 13.90, end: 14.70 },

        { word: 'Saare', start: 15.50, end: 16.05 },
        { word: 'nacho', start: 16.05, end: 16.60 },
        { word: 'gidhe', start: 16.60, end: 17.20 },
        { word: 'vich', start: 17.20, end: 17.65 },
        { word: 'aaj', start: 17.65, end: 18.30 },

        { word: 'Vakhra', start: 19.10, end: 19.70 },
        { word: 'swag', start: 19.70, end: 20.30 },
        { word: 'hai', start: 20.30, end: 20.65 },
        { word: 'sada', start: 20.65, end: 21.40 }
      ],
      lines: [
        {
          id: 'line_p1',
          text: 'Dil le gayi kudi haye sadi',
          start: 0.90,
          end: 3.80,
          words: [
            { id: 'wp1_1', word: 'Dil', start: 1.00, end: 1.40 },
            { id: 'wp1_2', word: 'le', start: 1.40, end: 1.70 },
            { id: 'wp1_3', word: 'gayi', start: 1.70, end: 2.15 },
            { id: 'wp1_4', word: 'kudi', start: 2.15, end: 2.65 },
            { id: 'wp1_5', word: 'haye', start: 2.65, end: 3.10 },
            { id: 'wp1_6', word: 'sadi', start: 3.10, end: 3.60 }
          ]
        },
        {
          id: 'line_p2',
          text: 'Nachdi vekh ke dhol te yaar',
          start: 4.40,
          end: 7.60,
          words: [
            { id: 'wp2_1', word: 'Nachdi', start: 4.50, end: 5.05 },
            { id: 'wp2_2', word: 'vekh', start: 5.05, end: 5.45 },
            { id: 'wp2_3', word: 'ke', start: 5.45, end: 5.75 },
            { id: 'wp2_4', word: 'dhol', start: 5.75, end: 6.30 },
            { id: 'wp2_5', word: 'te', start: 6.30, end: 6.65 },
            { id: 'wp2_6', word: 'yaar', start: 6.65, end: 7.40 }
          ]
        },
        {
          id: 'line_p3',
          text: 'Chhad de nakhre tu soniye',
          start: 8.10,
          end: 11.00,
          words: [
            { id: 'wp3_1', word: 'Chhad', start: 8.20, end: 8.65 },
            { id: 'wp3_2', word: 'de', start: 8.65, end: 8.95 },
            { id: 'wp3_3', word: 'nakhre', start: 8.95, end: 9.60 },
            { id: 'wp3_4', word: 'tu', start: 9.60, end: 9.95 },
            { id: 'wp3_5', word: 'soniye', start: 9.95, end: 10.80 }
          ]
        },
        {
          id: 'line_p4',
          text: 'Bass drop hoya te machao shor',
          start: 11.40,
          end: 14.90,
          words: [
            { id: 'wp4_1', word: 'Bass', start: 11.50, end: 12.00 },
            { id: 'wp4_2', word: 'drop', start: 12.00, end: 12.45 },
            { id: 'wp4_3', word: 'hoya', start: 12.45, end: 12.95 },
            { id: 'wp4_4', word: 'te', start: 12.95, end: 13.25 },
            { id: 'wp4_5', word: 'machao', start: 13.25, end: 13.90 },
            { id: 'wp4_6', word: 'shor', start: 13.90, end: 14.70 }
          ]
        },
        {
          id: 'line_p5',
          text: 'Saare nacho gidhe vich aaj',
          start: 15.40,
          end: 18.50,
          words: [
            { id: 'wp5_1', word: 'Saare', start: 15.50, end: 16.05 },
            { id: 'wp5_2', word: 'nacho', start: 16.05, end: 16.60 },
            { id: 'wp5_3', word: 'gidhe', start: 16.60, end: 17.20 },
            { id: 'wp5_4', word: 'vich', start: 17.20, end: 17.65 },
            { id: 'wp5_5', word: 'aaj', start: 17.65, end: 18.30 }
          ]
        },
        {
          id: 'line_p6',
          text: 'Vakhra swag hai sada',
          start: 19.00,
          end: 21.60,
          words: [
            { id: 'wp6_1', word: 'Vakhra', start: 19.10, end: 19.70 },
            { id: 'wp6_2', word: 'swag', start: 19.70, end: 20.30 },
            { id: 'wp6_3', word: 'hai', start: 20.30, end: 20.65 },
            { id: 'wp6_4', word: 'sada', start: 20.65, end: 21.40 }
          ]
        }
      ]
    }
  },

  'hinglish-chill': {
    title: 'Midnight Highway (Hinglish Lo-Fi)',
    artist: 'Urban Beats',
    language: 'Hinglish',
    genre: 'Lo-Fi / Indie Hip Hop',
    audioUrl: '/samples/hinglish-chill.mp3',
    duration: 22.0,
    bpm: 85,
    data: {
      language: 'Hinglish',
      duration: 22.0,
      words: [
        { word: 'Late', start: 1.10, end: 1.45 },
        { word: 'night', start: 1.45, end: 1.85 },
        { word: 'drives', start: 1.85, end: 2.35 },
        { word: 'and', start: 2.35, end: 2.60 },
        { word: 'your', start: 2.60, end: 2.85 },
        { word: 'smile', start: 2.85, end: 3.50 },

        { word: 'Bas', start: 4.20, end: 4.60 },
        { word: 'tu', start: 4.60, end: 4.95 },
        { word: 'rahe', start: 4.95, end: 5.40 },
        { word: 'sath', start: 5.40, end: 5.90 },
        { word: 'mere', start: 5.90, end: 6.40 },
        { word: 'for', start: 6.40, end: 6.75 },
        { word: 'a', start: 6.75, end: 6.95 },
        { word: 'while', start: 6.95, end: 7.70 },

        { word: 'City', start: 8.50, end: 8.95 },
        { word: 'lights', start: 8.95, end: 9.50 },
        { word: 'glow', start: 9.50, end: 9.95 },
        { word: 'kar', start: 9.95, end: 10.30 },
        { word: 'rahi', start: 10.30, end: 10.75 },
        { word: 'hain', start: 10.75, end: 11.20 },

        { word: 'Dil', start: 12.00, end: 12.40 },
        { word: 'ki', start: 12.40, end: 12.70 },
        { word: 'baatein', start: 12.70, end: 13.35 },
        { word: 'sab', start: 13.35, end: 13.70 },
        { word: 'hum', start: 13.70, end: 14.10 },
        { word: 'keh', start: 14.10, end: 14.45 },
        { word: 'rahe', start: 14.45, end: 14.85 },
        { word: 'hain', start: 14.85, end: 15.30 },

        { word: 'Nothing', start: 16.00, end: 16.50 },
        { word: 'matters', start: 16.50, end: 17.15 },
        { word: 'when', start: 17.15, end: 17.50 },
        { word: 'you', start: 17.50, end: 17.80 },
        { word: 'are', start: 17.80, end: 18.05 },
        { word: 'here', start: 18.05, end: 18.80 },

        { word: 'Khushboo', start: 19.40, end: 20.10 },
        { word: 'teri', start: 20.10, end: 20.65 },
        { word: 'in', start: 20.65, end: 20.95 },
        { word: 'the', start: 20.95, end: 21.20 },
        { word: 'atmosphere', start: 21.20, end: 22.00 }
      ],
      lines: [
        {
          id: 'line_h1',
          text: 'Late night drives and your smile',
          start: 1.00,
          end: 3.70,
          words: [
            { id: 'wh1_1', word: 'Late', start: 1.10, end: 1.45 },
            { id: 'wh1_2', word: 'night', start: 1.45, end: 1.85 },
            { id: 'wh1_3', word: 'drives', start: 1.85, end: 2.35 },
            { id: 'wh1_4', word: 'and', start: 2.35, end: 2.60 },
            { id: 'wh1_5', word: 'your', start: 2.60, end: 2.85 },
            { id: 'wh1_6', word: 'smile', start: 2.85, end: 3.50 }
          ]
        },
        {
          id: 'line_h2',
          text: 'Bas tu rahe sath mere for a while',
          start: 4.10,
          end: 7.90,
          words: [
            { id: 'wh2_1', word: 'Bas', start: 4.20, end: 4.60 },
            { id: 'wh2_2', word: 'tu', start: 4.60, end: 4.95 },
            { id: 'wh2_3', word: 'rahe', start: 4.95, end: 5.40 },
            { id: 'wh2_4', word: 'sath', start: 5.40, end: 5.90 },
            { id: 'wh2_5', word: 'mere', start: 5.90, end: 6.40 },
            { id: 'wh2_6', word: 'for', start: 6.40, end: 6.75 },
            { id: 'wh2_7', word: 'a', start: 6.75, end: 6.95 },
            { id: 'wh2_8', word: 'while', start: 6.95, end: 7.70 }
          ]
        },
        {
          id: 'line_h3',
          text: 'City lights glow kar rahi hain',
          start: 8.40,
          end: 11.40,
          words: [
            { id: 'wh3_1', word: 'City', start: 8.50, end: 8.95 },
            { id: 'wh3_2', word: 'lights', start: 8.95, end: 9.50 },
            { id: 'wh3_3', word: 'glow', start: 9.50, end: 9.95 },
            { id: 'wh3_4', word: 'kar', start: 9.95, end: 10.30 },
            { id: 'wh3_5', word: 'rahi', start: 10.30, end: 10.75 },
            { id: 'wh3_6', word: 'hain', start: 10.75, end: 11.20 }
          ]
        },
        {
          id: 'line_h4',
          text: 'Dil ki baatein sab hum keh rahe hain',
          start: 11.90,
          end: 15.50,
          words: [
            { id: 'wh4_1', word: 'Dil', start: 12.00, end: 12.40 },
            { id: 'wh4_2', word: 'ki', start: 12.40, end: 12.70 },
            { id: 'wh4_3', word: 'baatein', start: 12.70, end: 13.35 },
            { id: 'wh4_4', word: 'sab', start: 13.35, end: 13.70 },
            { id: 'wh4_5', word: 'hum', start: 13.70, end: 14.10 },
            { id: 'wh4_6', word: 'keh', start: 14.10, end: 14.45 },
            { id: 'wh4_7', word: 'rahe', start: 14.45, end: 14.85 },
            { id: 'wh4_8', word: 'hain', start: 14.85, end: 15.30 }
          ]
        },
        {
          id: 'line_h5',
          text: 'Nothing matters when you are here',
          start: 15.90,
          end: 19.00,
          words: [
            { id: 'wh5_1', word: 'Nothing', start: 16.00, end: 16.50 },
            { id: 'wh5_2', word: 'matters', start: 16.50, end: 17.15 },
            { id: 'wh5_3', word: 'when', start: 17.15, end: 17.50 },
            { id: 'wh5_4', word: 'you', start: 17.50, end: 17.80 },
            { id: 'wh5_5', word: 'are', start: 17.80, end: 18.05 },
            { id: 'wh5_6', word: 'here', start: 18.05, end: 18.80 }
          ]
        },
        {
          id: 'line_h6',
          text: 'Khushboo teri in the atmosphere',
          start: 19.30,
          end: 22.00,
          words: [
            { id: 'wh6_1', word: 'Khushboo', start: 19.40, end: 20.10 },
            { id: 'wh6_2', word: 'teri', start: 20.10, end: 20.65 },
            { id: 'wh6_3', word: 'in', start: 20.65, end: 20.95 },
            { id: 'wh6_4', word: 'the', start: 20.95, end: 21.20 },
            { id: 'wh6_5', word: 'atmosphere', start: 21.20, end: 22.00 }
          ]
        }
      ]
    }
  }
};

export class SampleSTTProvider implements SpeechToTextProvider {
  name = 'SampleDemoProvider';

  async transcribe(
    audioBuffer: Buffer,
    fileName: string,
    options?: { language?: string }
  ): Promise<STTResult> {
    const lower = fileName.toLowerCase();
    for (const [key, sample] of Object.entries(SAMPLE_SONGS)) {
      if (lower.includes(key) || lower.includes(sample.language.toLowerCase())) {
        return sample.data;
      }
    }
    // Default fallback to hindi-romantic sample
    return SAMPLE_SONGS['hindi-romantic'].data;
  }
}
