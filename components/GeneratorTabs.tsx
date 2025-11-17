
import React from 'react';
import { GenerationMode } from '../types';
import { TAB_OPTIONS } from '../constants';
import ImageIcon from './icons/ImageIcon';
import VideoIcon from './icons/VideoIcon';
import AnimateIcon from './icons/AnimateIcon';
import AdvancedIcon from './icons/AdvancedIcon';
import StoryboardIcon from './icons/StoryboardIcon';
import SearchIcon from './icons/SearchIcon';

interface GeneratorTabsProps {
  activeTab: GenerationMode;
  onTabChange: (tab: GenerationMode) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  image: <ImageIcon />,
  video_spark: <VideoIcon />,
  movie: <AnimateIcon />,
  advanced: <AdvancedIcon />,
  storyboard: <StoryboardIcon />,
  search: <SearchIcon />,
};

const GeneratorTabs: React.FC<GeneratorTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center p-2 bg-gray-800/50 rounded-lg mb-6">
      <div className="flex space-x-2 bg-gray-900 p-1 rounded-md overflow-x-auto">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {iconMap[tab.icon]}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GeneratorTabs;