import React from 'react';

interface StyleToggleProps {
  isChecked: boolean;
  onToggle: (isChecked: boolean) => void;
  disabled: boolean;
  label: string;
  description: string;
}

const StyleToggle: React.FC<StyleToggleProps> = ({ isChecked, onToggle, disabled, label, description }) => {
  const toggleId = `style-toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex items-center justify-center gap-3">
      <label htmlFor={toggleId} className="relative inline-flex items-center cursor-pointer group disabled:cursor-not-allowed">
        <input 
          type="checkbox" 
          id={toggleId}
          className="sr-only peer" 
          checked={isChecked}
          onChange={(e) => onToggle(e.target.checked)}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      </label>
      <div className="text-left cursor-pointer" onClick={() => !disabled && onToggle(!isChecked)}>
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default StyleToggle;
