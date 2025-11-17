
import React from 'react';
import { Resolution } from '../types';

interface ResolutionSelectorProps {
  selectedResolution: Resolution;
  onResolutionChange: (resolution: Resolution) => void;
  disabled: boolean;
}

const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({ selectedResolution, onResolutionChange, disabled }) => {
  const resolutions: Resolution[] = ['720p', '1080p'];

  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <span className="text-sm font-medium text-gray-400">Resolution:</span>
      <div className="flex p-1 bg-gray-800 rounded-lg">
        {resolutions.map((resolution) => (
          <button
            key={resolution}
            onClick={() => onResolutionChange(resolution)}
            disabled={disabled}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              selectedResolution === resolution ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {resolution.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResolutionSelector;
