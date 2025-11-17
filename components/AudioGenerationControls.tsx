import React from 'react';

interface AudioGenerationControlsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  transcript: string;
  onTranscriptChange: (transcript: string) => void;
  disabled: boolean;
}

const AudioGenerationControls: React.FC<AudioGenerationControlsProps> = ({
  enabled,
  onToggle,
  transcript,
  onTranscriptChange,
  disabled,
}) => {
  return (
    <div className="my-4 p-4 border border-gray-700 rounded-lg bg-gray-900/30">
      <div className="flex items-center justify-between">
        <div className="text-left cursor-pointer flex-grow" onClick={() => !disabled && onToggle(!enabled)}>
          <span className="text-sm font-medium text-gray-300">Enable Native Audio</span>
          <p className="text-xs text-gray-400">Generates synced environmental sounds, effects, and dialogue.</p>
        </div>
        <label htmlFor="audio-toggle" className="relative inline-flex items-center cursor-pointer group disabled:cursor-not-allowed">
          <input
            type="checkbox"
            id="audio-toggle"
            className="sr-only peer"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            disabled={disabled}
          />
          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {enabled && (
        <div className="mt-4 animate-text-focus-in">
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Optional: Enter a transcript for dialogue..."
            className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-500"
            disabled={disabled}
          />
          <ul className="mt-2 text-xs text-yellow-400/80 list-disc list-inside space-y-1">
            <li>Speech works best with longer transcripts.</li>
            <li>Audio may be muted on depictions of minors and subtitles can be inaccurate.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AudioGenerationControls;
