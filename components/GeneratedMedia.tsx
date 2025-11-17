import React from 'react';
import { GeneratedMedia as GeneratedMediaType } from '../types';

interface GeneratedMediaProps {
  media: GeneratedMediaType;
  onGenerateVariations?: () => void;
  isGeneratingVariations?: boolean;
  onGenerateThumbnail?: () => void;
  isGeneratingThumbnail?: boolean;
  thumbnailUrl?: string | null;
}

const GeneratedMedia: React.FC<GeneratedMediaProps> = ({ 
  media, 
  onGenerateVariations, 
  isGeneratingVariations,
  onGenerateThumbnail,
  isGeneratingThumbnail,
  thumbnailUrl,
}) => {
  return (
    <div className="mt-6 animate-text-focus-in">
      <div className="bg-gray-800/50 p-2 rounded-lg shadow-lg">
        {media.type === 'image' ? (
          <img src={media.url} alt="Generated content" className="w-full max-w-lg mx-auto rounded-md" />
        ) : (
          <video src={media.url} controls autoPlay loop className="w-full max-w-lg mx-auto rounded-md" />
        )}
      </div>
       <div className="text-center mt-4 flex items-center justify-center gap-4 flex-wrap">
        <a 
          href={media.url} 
          download={`storyboard-ai-creation.${media.type === 'image' ? 'jpg' : 'mp4'}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
        </a>
        
        {media.type === 'video' && onGenerateThumbnail && (
          <button
            onClick={onGenerateThumbnail}
            disabled={isGeneratingThumbnail}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingThumbnail ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <span>Generate Thumbnail</span>
              </>
            )}
          </button>
        )}

        {media.type === 'image' && onGenerateVariations && (
          <button
            onClick={onGenerateVariations}
            disabled={isGeneratingVariations}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingVariations ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.992" />
                </svg>
                <span>Generate Variations</span>
              </>
            )}
          </button>
        )}
      </div>

      {isGeneratingThumbnail && !thumbnailUrl && (
          <div className="mt-8 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-400">Generating thumbnail...</p>
          </div>
      )}

      {thumbnailUrl && (
        <div className="mt-8 animate-text-focus-in">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-300">Generated Thumbnail</h3>
          <div className="bg-gray-800/50 p-2 rounded-lg shadow-lg max-w-md mx-auto">
            <img src={thumbnailUrl} alt="Generated thumbnail" className="w-full rounded-md" />
          </div>
          <div className="text-center mt-4">
             <a href={thumbnailUrl} download="storyboard-ai-thumbnail.jpg" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Thumbnail
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedMedia;