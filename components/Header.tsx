
import React from 'react';
import VideoIcon from './icons/VideoIcon';
import ApiKeyManager from './ApiKeyManager';

interface HeaderProps {
    isApiKeySelected: boolean;
    onManageApiKey: () => void;
}


const Header: React.FC<HeaderProps> = ({ isApiKeySelected, onManageApiKey }) => {
  return (
    <header className="relative text-center p-4 md:p-6 border-b border-gray-700/50">
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg">
           <VideoIcon className="w-8 h-8"/>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 animate-text-focus-in">
          Storyboard AI
        </h1>
      </div>
      <p className="max-w-3xl mx-auto text-gray-400 text-sm md:text-base">
        Your all-in-one AI partner for visual storytelling. Generate stunning images, produce professional videos, and animate static photos with just a prompt.
      </p>
      <ApiKeyManager isKeySelected={isApiKeySelected} onManageKey={onManageApiKey} />
    </header>
  );
};

export default Header;
