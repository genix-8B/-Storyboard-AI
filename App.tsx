import React, { useState, useCallback, useEffect } from 'react';
import { GenerationMode, AspectRatio, GeneratedMedia, Resolution, UploadedImage, ShotType, CameraMovement, TransitionStyle, ImageAspectRatio } from './types';
import { generateImage, generateVideo, animateImage, generateVideoFromFrames, generateVideoFromReferences, generateImageVariations } from './services/geminiService';
import Header from './components/Header';
import GeneratorTabs from './components/GeneratorTabs';
import PromptInput from './components/PromptInput';
import ImageUpload from './components/ImageUpload';
import AspectRatioSelector from './components/AspectRatioSelector';
import LoadingSpinner from './components/LoadingSpinner';
import GeneratedMediaComponent from './components/GeneratedMedia';
import ResolutionSelector from './components/ResolutionSelector';
import MultiImageUpload from './components/MultiImageUpload';
import StyleToggle from './components/StyleToggle';
import StoryboardCreator from './components/StoryboardCreator';
import CameraControls from './components/CameraControls';
import KeyIcon from './components/icons/KeyIcon';
import ImageAspectRatioSelector from './components/ImageAspectRatioSelector';
import MultimodalSearch from './components/MultimodalSearch';


const App: React.FC = () => {
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.IMAGE);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia | null>(null);
  
  // Video-specific state
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean>(false);
  const [isCinematic, setIsCinematic] = useState<boolean>(true);
  const [isTrailerStyle, setIsTrailerStyle] = useState<boolean>(false);

  // Mode-specific uploads
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null); // For Animate
  const [advancedVideoMode, setAdvancedVideoMode] = useState<'assets' | 'frames'>('assets');
  const [startFrame, setStartFrame] = useState<UploadedImage | null>(null);
  const [endFrame, setEndFrame] = useState<UploadedImage | null>(null);
  const [referenceImages, setReferenceImages] = useState<UploadedImage[]>([]);
  const [shotType, setShotType] = useState<ShotType>('none');
  const [cameraMovement, setCameraMovement] = useState<CameraMovement>('none');
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>('none');

  // Image variations state
  const [imageAspectRatio, setImageAspectRatio] = useState<ImageAspectRatio>('1:1');
  const [imageVariations, setImageVariations] = useState<string[]>([]);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState<boolean>(false);

  // Thumbnail generation state
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState<boolean>(false);


  const isVideoMode = 
    generationMode === GenerationMode.VIDEO || 
    generationMode === GenerationMode.ANIMATE || 
    generationMode === GenerationMode.ADVANCED_VIDEO;
  const isAdvancedAssetsMode = generationMode === GenerationMode.ADVANCED_VIDEO && advancedVideoMode === 'assets';
  
  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
        try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setIsApiKeySelected(hasKey);
        } catch (e) {
            console.warn("Could not check for API key.", e);
            setIsApiKeySelected(false);
        }
    } else {
        // For environments where aistudio is not available, assume key is present for non-video modes.
        // Video modes will fail gracefully if the env var isn't set.
        console.warn("aistudio object not found. Assuming API key is set via environment variables.");
        setIsApiKeySelected(true); 
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleManageKey = async () => {
    if (!window.aistudio) {
        alert("API Key management is not available in this environment.");
        return;
    }
    try {
        await window.aistudio.openSelectKey();
        // After user interaction, re-check the key status.
        await checkApiKey();
    } catch (error) {
        console.error("Error opening API key selection:", error);
    }
  };


  const handleImageUpload = (base64: string, mimeType: string, preview: string) => {
    setUploadedImage(base64 && mimeType ? { base64, mimeType, preview } : null);
  };
  const handleStartFrameUpload = (base64: string, mimeType: string, preview: string) => {
    setStartFrame(base64 && mimeType ? { base64, mimeType, preview } : null);
  };
   const handleEndFrameUpload = (base64: string, mimeType: string, preview: string) => {
    setEndFrame(base64 && mimeType ? { base64, mimeType, preview } : null);
  };

  const resetStateForNewGeneration = () => {
    setError(null);
    setGeneratedMedia(null);
    setImageVariations([]);
    setGeneratedThumbnail(null);
    setIsLoading(true);
  };
  
  const handleGeneration = useCallback(async () => {
    if (generationMode === GenerationMode.STORYBOARD) return;
    
    resetStateForNewGeneration();
    
    try {
      let mediaUrl: string;
      switch (generationMode) {
        case GenerationMode.IMAGE:
          mediaUrl = await generateImage(prompt, imageAspectRatio);
          setGeneratedMedia({ url: mediaUrl, type: 'image' });
          break;
        case GenerationMode.VIDEO:
          let finalVideoPrompt = prompt;
          if (isCinematic) finalVideoPrompt = `cinematic shot, high detail, realistic physics, ${finalVideoPrompt}`;
          if (isTrailerStyle) finalVideoPrompt = `trailer cut, fast-paced, high-energy, ${finalVideoPrompt}`;
          mediaUrl = await generateVideo(finalVideoPrompt, aspectRatio, resolution);
          setGeneratedMedia({ url: mediaUrl, type: 'video' });
          break;
        case GenerationMode.ANIMATE:
          if (!uploadedImage) throw new Error("Please upload an image to animate.");
          mediaUrl = await animateImage(prompt, uploadedImage, aspectRatio, resolution);
          setGeneratedMedia({ url: mediaUrl, type: 'video' });
          break;
        case GenerationMode.ADVANCED_VIDEO:
            let finalAdvancedPrompt = prompt;
            const cameraDirectives = [];
            if (shotType !== 'none') {
                const shotText = shotType.replace('-', ' ');
                cameraDirectives.push(`a ${shotText}`);
            }
            if (cameraMovement !== 'none') {
                const movementText = cameraMovement.replace('-', ' ');
                cameraDirectives.push(movementText);
            }
            if (transitionStyle !== 'none') {
                const transitionText = transitionStyle.replace('-', ' ');
                cameraDirectives.push(`with a ${transitionText} transition`);
            }

            if (cameraDirectives.length > 0) {
                finalAdvancedPrompt = `${cameraDirectives.join(', ')}: ${prompt}`;
            }
            
            if (isTrailerStyle) {
                finalAdvancedPrompt = `trailer cut, fast-paced, high-energy: ${finalAdvancedPrompt}`;
            }

            if (advancedVideoMode === 'assets') {
                if (referenceImages.length === 0) throw new Error("Please upload at least one asset image.");
                mediaUrl = await generateVideoFromReferences(finalAdvancedPrompt, referenceImages);
            } else { // 'frames'
                if (!startFrame || !endFrame) throw new Error("Please upload both a start and end frame.");
                mediaUrl = await generateVideoFromFrames(finalAdvancedPrompt, startFrame, endFrame, aspectRatio, resolution);
            }
            setGeneratedMedia({ url: mediaUrl, type: 'video' });
            break;
      }
    } catch (err: any) {
      console.error("Generation failed:", err);
      let errorMessage = err.message || "An unexpected error occurred.";
       if (err.message?.includes("Requested entity was not found")) {
        errorMessage = "API Key error. Please re-select your API key using the button in the header.";
        checkApiKey(); // Re-validate the key status
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [generationMode, prompt, aspectRatio, resolution, uploadedImage, advancedVideoMode, referenceImages, startFrame, endFrame, isCinematic, isTrailerStyle, imageAspectRatio, shotType, cameraMovement, transitionStyle, checkApiKey]);

  const handleGenerateVariations = async () => {
    if (!prompt || generationMode !== GenerationMode.IMAGE) return;

    setIsGeneratingVariations(true);
    setError(null);
    try {
        const variations = await generateImageVariations(prompt, imageAspectRatio, 4);
        setImageVariations(variations);
    } catch (err: any) {
      console.error("Variation generation failed:", err);
      setError(err.message || "An unexpected error occurred while generating variations.");
    } finally {
        setIsGeneratingVariations(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!prompt) {
        setError("Please enter a prompt to generate a thumbnail.");
        return;
    };
    setIsGeneratingThumbnail(true);
    setError(null);
    setGeneratedThumbnail(null);
    try {
        const thumbnailPrompt = `A cinematic, high-impact thumbnail for a video about: "${prompt}". Epic lighting, bold text style, high contrast.`;
        const thumbnailUrl = await generateImage(thumbnailPrompt, '16:9');
        setGeneratedThumbnail(thumbnailUrl);
    } catch (err: any) {
        console.error("Thumbnail generation failed:", err);
        setError(err.message || "An unexpected error occurred while generating the thumbnail.");
    } finally {
        setIsGeneratingThumbnail(false);
    }
};

  const handleTabChange = (tab: GenerationMode) => {
    setGenerationMode(tab);
    setGeneratedMedia(null);
    setError(null);
    setPrompt('');
    setUploadedImage(null);
    setStartFrame(null);
    setEndFrame(null);
    setReferenceImages([]);
    setIsCinematic(true);
    setIsTrailerStyle(false);
    setShotType('none');
    setCameraMovement('none');
    setTransitionStyle('none');
    setImageAspectRatio('1:1');
    setImageVariations([]);
    setIsGeneratingVariations(false);
    setGeneratedThumbnail(null);
    setIsGeneratingThumbnail(false);
  };
  
  const isGenerateDisabled = 
    isLoading || 
    (isVideoMode && !isApiKeySelected) ||
    (generationMode === GenerationMode.ANIMATE && !uploadedImage) ||
    (generationMode === GenerationMode.ADVANCED_VIDEO && advancedVideoMode === 'frames' && (!startFrame || !endFrame)) ||
    (generationMode === GenerationMode.ADVANCED_VIDEO && advancedVideoMode === 'assets' && referenceImages.length === 0);

  const isPromptRequired = !(generationMode === GenerationMode.ADVANCED_VIDEO && advancedVideoMode === 'frames') && generationMode !== GenerationMode.ANIMATE;
  
  const placeholders = {
    [GenerationMode.IMAGE]: "A photorealistic image of a golden retriever wearing sunglasses on a beach.",
    [GenerationMode.VIDEO]: "A drone shot flying over a futuristic city at sunset, with flying cars weaving through neon-lit skyscrapers.",
    [GenerationMode.ANIMATE]: "An optional prompt to guide the animation, e.g., 'make the clouds move'.",
    [GenerationMode.ADVANCED_VIDEO]: "A video of the character from image 1 walking through the city from image 2.",
    [GenerationMode.STORYBOARD]: "", // Not used here
    [GenerationMode.MULTIMODAL_SEARCH]: "", // Not used here
  };
  let currentPlaceholder = placeholders[generationMode];
  if (generationMode === GenerationMode.ADVANCED_VIDEO && advancedVideoMode === 'frames') {
      currentPlaceholder = "An optional prompt to guide the animation from start to end frame.";
  }

  const renderContent = () => {
    if (generationMode === GenerationMode.STORYBOARD || generationMode === GenerationMode.MULTIMODAL_SEARCH) return null;
    
    if (isVideoMode && !isApiKeySelected) {
        return (
            <div className="text-center p-8 bg-yellow-900/30 rounded-lg border border-yellow-500/50 animate-text-focus-in">
                <KeyIcon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-semibold text-yellow-300">API Key Required for Video</h3>
                <p className="text-yellow-200/80 mt-2 max-w-md mx-auto">
                    To generate, animate, or create advanced videos, please select an API key using the button in the header.
                </p>
                <p className="text-xs text-gray-400 mt-4">
                    For more information, see the{' '}
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 hover:underline"
                    >
                        billing documentation
                    </a>.
                </p>
            </div>
        );
    }
    
    if (isLoading) return <LoadingSpinner isGeneratingVideo={isVideoMode} />;
    
    if (error && !generatedMedia) return (
      <div className="text-center p-4 bg-red-900/50 border border-red-500 rounded-lg">
        <p className="font-bold">Generation Failed</p>
        <p className="text-red-300">{error}</p>
      </div>
    );

    if (generatedMedia) return (
      <>
        <GeneratedMediaComponent
            media={generatedMedia}
            onGenerateVariations={generationMode === GenerationMode.IMAGE ? handleGenerateVariations : undefined}
            isGeneratingVariations={isGeneratingVariations}
            onGenerateThumbnail={isVideoMode ? handleGenerateThumbnail : undefined}
            isGeneratingThumbnail={isGeneratingThumbnail}
            thumbnailUrl={generatedThumbnail}
        />

        {error && <div className="mt-4 text-center p-2 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">{error}</div>}

        {isGeneratingVariations && (
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-300">Generating Variations...</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-700/50 rounded-lg aspect-square"></div>
                    ))}
                </div>
            </div>
        )}
        {!isGeneratingVariations && imageVariations.length > 0 && (
            <div className="mt-8 animate-text-focus-in">
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-300">Variations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageVariations.map((url, index) => (
                         <div key={index} className="bg-gray-800/50 p-1 rounded-lg shadow-lg group">
                            <a href={url} download={`storyboard-ai-variation-${index+1}.jpg`} className="relative block">
                                <img src={url} alt={`Variation ${index + 1}`} className="w-full rounded-md aspect-square object-cover transition-transform group-hover:scale-105 duration-300" />
                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="D 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </>
    );
    
    const messages = {
      [GenerationMode.IMAGE]: "Describe the image you want to create.",
      [GenerationMode.VIDEO]: "Describe a scene and watch it come to life with cinematic quality and realistic physics.",
      [GenerationMode.ANIMATE]: "Upload an image and describe how you want to animate it.",
      [GenerationMode.ADVANCED_VIDEO]: "Upload custom assets like characters or scenes to create consistent videos, or use start/end frames for precise animations.",
      [GenerationMode.STORYBOARD]: "Paste your script to automatically generate a visual storyboard.",
      [GenerationMode.MULTIMODAL_SEARCH]: "Upload images or videos and ask questions to get detailed insights and information.",
    }

    return (
        <div className="text-center p-8 bg-gray-800/50 rounded-lg animate-text-focus-in">
            <h3 className="text-xl font-semibold text-gray-300">Let's create something amazing!</h3>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto">{messages[generationMode]}</p>
            
            <p className="mt-6 text-purple-300/90 max-w-2xl mx-auto text-base">
                Storyboard AI helps democratize filmmaking by turning complex, expensive film production into something fast, affordable, and available to everyone—empowering creators to focus on storytelling, not technical barriers.
            </p>

            <div className="my-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:text-left">
                <div className="lg:pr-4">
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2 text-center lg:text-left">
                        Narrative AI Pipeline™
                    </h4>
                    <p className="text-sm md:text-base font-mono text-gray-300 tracking-wide mb-2 text-center">
                        Script → Scenes → Pacing → Music → Voice → Final Cut
                    </p>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto lg:mx-0">
                        Ensures story continuity, emotional arcs, and cinematic timing.
                    </p>
                </div>
                <div className="lg:px-4 lg:border-l lg:border-gray-700/50">
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2 text-center lg:text-left">
                        RhythmMatch Audio Engine
                    </h4>
                    <ul className="text-sm text-gray-400 max-w-md mx-auto lg:mx-0 list-none space-y-1 text-left inline-block">
                        <li className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>AI selects voiceover tone</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>Narration auto-timed to the script</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>Music synced to dramatic beats</span>
                        </li>
                    </ul>
                </div>
                 <div className="lg:pl-4 lg:border-l lg:border-gray-700/50">
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2 text-center lg:text-left">
                        Visual DNA Lock™
                    </h4>
                    <p className="text-sm font-semibold text-gray-300 mb-1">Locks:</p>
                    <ul className="text-sm text-gray-400 list-disc list-inside space-y-1 mb-2">
                        <li>Color palette & Character appearance</li>
                        <li>Cinematic style</li>
                        <li>Texture & lighting mood</li>
                    </ul>
                    <p className="text-sm text-gray-400">
                        <strong className="text-gray-300">Guarantees:</strong> Scene-to-scene consistency — essential for long-form storytelling.
                    </p>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-700/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div>
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                        Zero-Barrier Creation
                    </h4>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                        Perfect for students, teachers, bloggers, marketers, educators, and content creators—no technical skills required.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                        Always Up-To-Date AI
                    </h4>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                        Continuously integrating the latest AI models and creative elements to keep your content fresh and visually modern.
                    </p>
                </div>
                 <div>
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                        Instant Browser Studio
                    </h4>
                    <ul className="text-sm text-gray-400 list-disc list-inside space-y-1 mb-2">
                        <li>Zero installation & Lightweight</li>
                        <li>Fast preview mode</li>
                        <li>Works on average laptops</li>
                        <li>Cloud rendering with priority scenes</li>
                    </ul>
                    <p className="text-sm text-gray-400">
                        <strong className="text-gray-300">Advantage:</strong> Accessible to students, teachers, and marketers — not just creative pros.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                        Creative Flexibility
                    </h4>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                        Revise scripts, regenerate scenes, and try creative variations to perfect your story.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                        FormatFlex Rendering™
                    </h4>
                    <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                        <li>TikTok/Reels vertical & Square social formats</li>
                        <li>Trailer cut generation</li>
                        <li>Thumbnail auto-creation</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                        Story Character Memory™
                    </h4>
                    <ul className="text-sm text-gray-400 list-disc list-inside space-y-1 mb-2">
                        <li>Stores identity & protects facial consistency</li>
                        <li>Preserves clothing</li>
                        <li>Memorizes emotional progression</li>
                    </ul>
                    <p className="text-sm text-gray-400">
                        <strong className="text-gray-300">Result:</strong> Reliable characters for episodic stories or mini-series.
                    </p>
                </div>
                 <div>
                    <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
                        Multimodal Search
                    </h4>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                        A powerful tool for searching and reasoning with mixed media (images, text), enabling richer information retrieval.
                    </p>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/30 font-sans">
      <Header isApiKeySelected={isApiKeySelected} onManageApiKey={handleManageKey} />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <GeneratorTabs activeTab={generationMode} onTabChange={handleTabChange} />
        
        <div className="bg-gray-800/30 p-6 rounded-xl shadow-2xl border border-gray-700/50">
          {generationMode === GenerationMode.STORYBOARD ? (
            <StoryboardCreator />
          ) : generationMode === GenerationMode.MULTIMODAL_SEARCH ? (
            <MultimodalSearch />
          ) : (
            <>
              {generationMode === GenerationMode.ANIMATE && (
                <ImageUpload onImageUpload={handleImageUpload} disabled={isGenerateDisabled} />
              )}

              {generationMode === GenerationMode.ADVANCED_VIDEO && (
                 <div className="mb-4">
                    <div className="flex justify-center p-1 bg-gray-900 rounded-lg mb-4">
                        <button onClick={() => setAdvancedVideoMode('assets')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors w-1/2 ${advancedVideoMode === 'assets' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Custom Assets</button>
                        <button onClick={() => setAdvancedVideoMode('frames')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors w-1/2 ${advancedVideoMode === 'frames' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Start/End Frames</button>
                    </div>

                    <CameraControls
                        shotType={shotType}
                        onShotTypeChange={setShotType}
                        cameraMovement={cameraMovement}
                        onCameraMovementChange={setCameraMovement}
                        transitionStyle={transitionStyle}
                        onTransitionStyleChange={setTransitionStyle}
                        disabled={isGenerateDisabled}
                    />

                    {advancedVideoMode === 'assets' ? (
                      <MultiImageUpload 
                        onImagesUpload={setReferenceImages} 
                        disabled={isGenerateDisabled}
                        title="Upload Custom Assets"
                        description="Consistent characters, objects, or scenes for your video."
                      />
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        <ImageUpload onImageUpload={handleStartFrameUpload} disabled={isGenerateDisabled} title="Upload Start Frame" />
                        <ImageUpload onImageUpload={handleEndFrameUpload} disabled={isGenerateDisabled} title="Upload End Frame" />
                      </div>
                    )}
                </div>
              )}

              {generationMode === GenerationMode.IMAGE && (
                <ImageAspectRatioSelector
                    selectedRatio={imageAspectRatio}
                    onRatioChange={setImageAspectRatio}
                    disabled={isGenerateDisabled}
                />
              )}
              
              {generationMode === GenerationMode.VIDEO && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4 mb-4">
                  <StyleToggle
                      isChecked={isCinematic}
                      onToggle={setIsCinematic}
                      disabled={isGenerateDisabled}
                      label="Cinematic Style"
                      description="Enhances realism and physics."
                  />
                  <StyleToggle
                      isChecked={isTrailerStyle}
                      onToggle={setIsTrailerStyle}
                      disabled={isGenerateDisabled}
                      label="Trailer Cut"
                      description="Fast-paced, high-energy style."
                  />
                </div>
              )}

              {isVideoMode && (
                <div className='flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2'>
                  <AspectRatioSelector 
                      selectedRatio={aspectRatio} 
                      onRatioChange={setAspectRatio} 
                      disabled={isGenerateDisabled || isAdvancedAssetsMode}
                  />
                  <ResolutionSelector 
                      selectedResolution={resolution}
                      onResolutionChange={setResolution}
                      disabled={isGenerateDisabled || isAdvancedAssetsMode}
                  />
                </div>
              )}
              {isAdvancedAssetsMode && <p className="text-center text-xs text-yellow-400 -mt-2 mb-4">Custom asset mode is fixed to 16:9 aspect ratio and 720p resolution.</p>}
              
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleGeneration}
                isLoading={isLoading}
                disabled={isGenerateDisabled}
                promptRequired={isPromptRequired}
                placeholder={currentPlaceholder}
              />
              {isAdvancedAssetsMode && (
                 <p className="text-center text-xs text-gray-400 mt-2 px-4">
                    <strong>Tip:</strong> Describe how to use your assets in the prompt. E.g., "The robot from image 1 exploring the city from image 2."
                 </p>
              )}
            </>
          )}
        </div>
        
        <div className="mt-8">
            {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-gray-600">
        Powered by Google Gemini
      </footer>
    </div>
  );
};

export default App;