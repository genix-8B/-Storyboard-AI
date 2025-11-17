
import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange, disabled }) => {
  const ratios: { value: AspectRatio, label: string }[] = [
      { value: '16:9', label: 'Widescreen' },
      { value: '9:16', label: 'Vertical' }
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <span className="text-sm font-medium text-gray-400">Aspect Ratio:</span>
      <div className="flex p-1 bg-gray-800 rounded-lg">
        {ratios.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onRatioChange(value)}
            disabled={disabled}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              selectedRatio === value ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {value} ({label})
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;