import React from 'react';
import { ImageAspectRatio } from '../types';

interface ImageAspectRatioSelectorProps {
  selectedRatio: ImageAspectRatio;
  onRatioChange: (ratio: ImageAspectRatio) => void;
  disabled: boolean;
}

const ratioOptions: { value: ImageAspectRatio; label: string }[] = [
    { value: '1:1', label: 'Square' },
    { value: '16:9', label: 'Widescreen' },
    { value: '9:16', label: 'Vertical' },
    { value: '4:3', label: 'Standard' },
    { value: '3:4', label: 'Portrait' },
];

const ImageAspectRatioSelector: React.FC<ImageAspectRatioSelectorProps> = ({ selectedRatio, onRatioChange, disabled }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
      <span className="text-sm font-medium text-gray-400 mr-2">Aspect Ratio:</span>
      <div className="flex flex-wrap justify-center p-1 bg-gray-800 rounded-lg gap-1">
        {ratioOptions.map(({value, label}) => (
          <button
            key={value}
            onClick={() => onRatioChange(value)}
            disabled={disabled}
            className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
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

export default ImageAspectRatioSelector;