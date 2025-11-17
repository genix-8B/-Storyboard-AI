
import React, { useState, useEffect } from 'react';
import { VIDEO_LOADING_MESSAGES } from '../constants';

interface LoadingSpinnerProps {
  isGeneratingVideo: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isGeneratingVideo }) => {
  const [message, setMessage] = useState(VIDEO_LOADING_MESSAGES[0]);

  useEffect(() => {
    if (isGeneratingVideo) {
      const intervalId = setInterval(() => {
        setMessage(prevMessage => {
          const currentIndex = VIDEO_LOADING_MESSAGES.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % VIDEO_LOADING_MESSAGES.length;
          return VIDEO_LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isGeneratingVideo]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg">
      <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-semibold text-gray-200 mb-2">Generating your creation...</p>
      {isGeneratingVideo && (
        <p className="text-gray-400 text-center transition-opacity duration-500">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
