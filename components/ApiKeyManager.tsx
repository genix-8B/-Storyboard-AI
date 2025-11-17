
import React from 'react';
import KeyIcon from './icons/KeyIcon';

interface ApiKeyManagerProps {
  isKeySelected: boolean;
  onManageKey: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isKeySelected, onManageKey }) => {
  return (
    <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 flex items-center gap-4">
        <div className='flex items-center gap-2 text-sm'>
            <div className='relative flex items-center justify-center'>
                <span className={`w-3 h-3 rounded-full ${isKeySelected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                <span className={`absolute w-3 h-3 rounded-full ${isKeySelected ? 'bg-green-400' : 'bg-yellow-400'} ${isKeySelected ? '' : 'animate-ping'}`}></span>
            </div>
            <span className='text-gray-300 hidden lg:inline'>
                API Key for Video: {isKeySelected ? 'Ready' : 'Required'}
            </span>
        </div>
        <button
            onClick={onManageKey}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600/50 transition-colors duration-300 text-sm"
            aria-label={isKeySelected ? 'Change API Key' : 'Select API Key'}
        >
            <KeyIcon className="w-4 h-4" />
            <span className='hidden sm:inline'>{isKeySelected ? 'Change Key' : 'Select Key'}</span>
        </button>
    </div>
  );
};

export default ApiKeyManager;
