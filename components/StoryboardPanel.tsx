
import React from 'react';
import { StoryboardScene } from '../types';

interface StoryboardPanelProps {
  scene: StoryboardScene;
}

const StoryboardPanel: React.FC<StoryboardPanelProps> = ({ scene }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 animate-text-focus-in">
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        {scene.isLoading ? (
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-xs">Generating...</span>
          </div>
        ) : scene.image ? (
          <img src={scene.image} alt={`Scene ${scene.sceneNumber}`} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
            </svg>
            <span className="text-xs">Failed</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-gray-200">Scene {scene.sceneNumber}</h3>
                <p className="text-xs text-gray-400 font-mono">{scene.location}</p>
            </div>
            {scene.characters.length > 0 && (
                <div className="text-right">
                    <h4 className="text-xs font-semibold text-gray-300">Characters</h4>
                    <p className="text-xs text-purple-400">{scene.characters.join(', ')}</p>
                </div>
            )}
        </div>
        <p className="text-sm text-gray-300 bg-gray-900/50 p-2 rounded-md">{scene.prompt}</p>
      </div>
    </div>
  );
};

export default StoryboardPanel;