
import React, { useState } from 'react';
import { parseScriptToScenes, generateImage } from '../services/geminiService';
import { StoryboardScene, ParsedScene } from '../types';
import StoryboardPanel from './StoryboardPanel';

const StoryboardCreator: React.FC = () => {
    const [script, setScript] = useState('');
    const [storyboard, setStoryboard] = useState<StoryboardScene[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateStoryboard = async () => {
        if (!script.trim()) {
            setError('Please enter a script.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStoryboard([]);

        try {
            const parsedScenes = await parseScriptToScenes(script);
            if (parsedScenes.length === 0) {
                throw new Error("The AI could not identify any scenes in your script. Please check the formatting.");
            }

            const initialScenes: StoryboardScene[] = parsedScenes.map((ps, index) => ({
                id: `scene-${index}-${Date.now()}`,
                prompt: ps.promptForImage,
                image: null,
                isLoading: true,
                location: ps.location,
                characters: ps.characters,
                sceneNumber: ps.sceneNumber,
            }));
            setStoryboard(initialScenes);

            // Generate images in parallel
            await Promise.all(initialScenes.map(async (scene) => {
                try {
                    // FIX: Pass the required '16:9' aspect ratio to the generateImage function.
                    const imageUrl = await generateImage(scene.prompt, '16:9');
                    setStoryboard(prev => prev.map(s => s.id === scene.id ? { ...s, image: imageUrl, isLoading: false } : s));
                } catch (e) {
                    console.error(`Failed to generate image for scene ${scene.sceneNumber}:`, e);
                    setStoryboard(prev => prev.map(s => s.id === scene.id ? { ...s, isLoading: false } : s)); // Stop loading on error
                }
            }));

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during storyboard generation.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveStoryboard = () => {
        if (storyboard.length === 0 || storyboard.some(s => !s.image)) {
            return;
        }

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Storyboard AI - Saved Storyboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #111827; color: #f3f4f6; margin: 0; padding: 2rem; }
        h1 { text-align: center; color: #d1d5db; border-bottom: 1px solid #374151; padding-bottom: 1rem; margin-bottom: 2rem; }
        .storyboard { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .panel { background-color: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; overflow: hidden; display: flex; flex-direction: column; }
        .panel img { width: 100%; height: auto; display: block; background-color: #111827; aspect-ratio: 16/9; object-fit: cover; }
        .panel-details { padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; }
        .panel h2 { margin: 0 0 0.5rem; font-size: 1.125rem; color: #e5e7eb; }
        .panel .location { font-family: monospace; font-size: 0.875rem; color: #9ca3af; margin-bottom: 0.5rem; }
        .panel .characters-wrapper { margin-bottom: 1rem; }
        .panel .characters-title { font-size: 0.875rem; font-weight: 600; color: #d1d5db; }
        .panel .characters { font-size: 0.875rem; color: #a78bfa; }
        .panel .prompt { font-size: 0.875rem; color: #d1d5db; background-color: #374151; padding: 0.75rem; border-radius: 0.25rem; line-height: 1.5; margin-top: auto; }
    </style>
</head>
<body>
    <h1>Storyboard</h1>
    <div class="storyboard">
        ${storyboard.map(scene => `
            <div class="panel">
                <img src="${scene.image}" alt="Scene ${scene.sceneNumber}">
                <div class="panel-details">
                    <div>
                        <h2>Scene ${scene.sceneNumber}</h2>
                        <p class="location">${scene.location}</p>
                        ${scene.characters.length > 0 ? `<div class="characters-wrapper"><span class="characters-title">Characters:</span> <span class="characters">${scene.characters.join(', ')}</span></div>` : ''}
                    </div>
                    <p class="prompt">${scene.prompt}</p>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'storyboard.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const placeholderScript = `SCENE 1
INT. SPACESHIP - DAY

JANE (30s), a determined astronaut, stares at a blinking red light on her console. Her co-pilot, MARK (40s), looks worried.

MARK
Is that... what I think it is?

JANE
It is. We have a problem.

---
SCENE 2
EXT. ALIEN PLANET - DAY

The spaceship has crash-landed on a strange, purple desert. Jane and Mark, in their spacesuits, look out at the bizarre, towering rock formations. Two suns hang in the sky.`;

    const isSaveDisabled = isLoading || storyboard.length === 0 || storyboard.some(scene => scene.isLoading || !scene.image);

    return (
        <div>
            <div className="relative mb-6">
                <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder={placeholderScript}
                    className="w-full h-48 p-4 bg-gray-800 border border-gray-700 rounded-lg resize-y focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-500"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerateStoryboard}
                    disabled={isLoading || !script.trim()}
                    className="absolute bottom-4 right-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating...
                        </>
                    ) : (
                        'Generate Storyboard'
                    )}
                </button>
            </div>

            {error && (
                <div className="text-center p-4 mb-6 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p className="text-red-300">{error}</p>
                </div>
            )}
            
            {storyboard.length > 0 && (
                <div className="mt-8">
                    <div className="text-center mb-6">
                        <button
                            onClick={handleSaveStoryboard}
                            disabled={isSaveDisabled}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Save Storyboard
                        </button>
                        {isSaveDisabled && storyboard.some(s => s.isLoading) && (
                            <p className="text-xs text-gray-400 mt-2">Waiting for all images to generate before saving...</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {storyboard.map(scene => (
                            <StoryboardPanel key={scene.id} scene={scene} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryboardCreator;
