import React from 'react';
import { Keyboard, X } from 'lucide-react';

export const ShortcutsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause audio playback' },
    { key: 'Ctrl / Cmd + Z', desc: 'Undo last change' },
    { key: 'Ctrl / Cmd + Shift + Z (or Ctrl + Y)', desc: 'Redo previously undone change' },
    { key: 'Delete / Backspace', desc: 'Delete currently selected lyric line' },
    { key: 'Right Arrow', desc: 'Scrub timeline forward by 0.2s (+1.0s with Shift)' },
    { key: 'Left Arrow', desc: 'Scrub timeline backward by 0.2s (-1.0s with Shift)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-studio-900 border border-studio-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-5 border-b border-studio-800 flex items-center justify-between bg-studio-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-studio-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-studio-800/60 last:border-0 text-xs">
              <span className="text-slate-300 font-medium">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-studio-800 border border-studio-700 rounded-md font-mono text-[11px] text-indigo-300 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-studio-800 bg-studio-850/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-studio-800 hover:bg-studio-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
