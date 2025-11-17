import React from 'react';

interface CinematicStyleToggleProps {
  isCinematic: boolean;
  onToggle: (isCinematic: boolean) => void;
  disabled: boolean;
}

const CinematicStyleToggle: React.FC<CinematicStyleToggleProps> = ({ isCinematic, onToggle, disabled }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <label htmlFor="cinematic-toggle" className="relative inline-flex items-center cursor-pointer group disabled:cursor-not-allowed">
        <input 
          type="checkbox" 
          id="cinematic-toggle"
          className="sr-only peer" 
          checked={isCinematic}
          onChange={(e) => onToggle(e.target.checked)}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      </label>
      <div className="text-left cursor-pointer" onClick={() => !disabled && onToggle(!isCinematic)}>
          <span className="text-sm font-medium text-gray-300">Cinematic Style</span>
          <p className="text-xs text-gray-400">Enhances realism, detail, and physics.</p>
      </div>
    </div>
  );
};

export default CinematicStyleToggle;
