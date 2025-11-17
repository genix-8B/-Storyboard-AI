import { GoogleGenAI, GenerateVideosOperation, GenerateVideosResponse, VideoGenerationReferenceImage, VideoGenerationReferenceType, Type } from '@google/genai';
import { IMAGE_MODEL, VIDEO_MODEL, ADVANCED_VIDEO_MODEL } from '../constants';
import { AspectRatio, Resolution, UploadedImage, ParsedScene, ImageAspectRatio } from '../types';

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const parseScriptToScenes = async (script: string): Promise<ParsedScene[]> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Analyze the following script and break it down into distinct scenes. For each scene, identify its number, location (e.g., INT. COFFEE SHOP - DAY), the characters present, and generate a concise, visually descriptive prompt suitable for an AI image generator to create a storyboard panel.
        
        Script:
        ---
        ${script}
        ---`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    scenes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sceneNumber: { type: Type.NUMBER, description: "The scene number." },
                                location: { type: Type.STRING, description: "The location of the scene (e.g., INT. COFFEE SHOP - DAY)." },
                                characters: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "A list of characters in the scene."
                                },
                                promptForImage: {
                                    type: Type.STRING,
                                    description: "A detailed, visual prompt for an AI image generator, describing the key action or mood of the scene."
                                }
                            },
                            required: ['sceneNumber', 'location', 'characters', 'promptForImage']
                        }
                    }
                },
                required: ['scenes']
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        if (!parsedJson.scenes || !Array.isArray(parsedJson.scenes)) {
            throw new Error("Invalid response structure from AI. Expected a 'scenes' array.");
        }
        return parsedJson.scenes;
    } catch (e) {
        console.error("Failed to parse script-to-scene JSON response:", response.text);
        throw new Error("The AI failed to return a valid storyboard structure. Please try refining your script.");
    }
};


export const generateImage = async (prompt: string, aspectRatio: ImageAspectRatio): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateImages({
        model: IMAGE_MODEL,
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateImageVariations = async (prompt: string, aspectRatio: ImageAspectRatio, count: number = 4): Promise<string[]> => {
    const ai = getAiClient();
    const response = await ai.models.generateImages({
        model: IMAGE_MODEL,
        prompt,
        config: {
            numberOfImages: count,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image variation generation failed to produce images.");
    }

    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};


const pollVideoOperation = async (operation: GenerateVideosOperation): Promise<GenerateVideosResponse> => {
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        try {
            const ai = getAiClient();
            currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
        } catch (error) {
            console.error("Polling failed:", error);
            throw error;
        }
    }
    if (!currentOperation.response) {
        throw new Error("Video generation operation finished without a response.");
    }
    return currentOperation.response;
};

const processVideoResponse = async (operation: GenerateVideosOperation): Promise<string> => {
    const finalResponse = await pollVideoOperation(operation);
    
    const downloadLink = finalResponse.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video URI not found in the response.");
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
}

// FIX: Removed unsupported native audio feature for video generation.
// The `audio` property in the config is not supported by the generateVideos API.
export const generateVideo = async (prompt: string, aspectRatio: AspectRatio, resolution: Resolution): Promise<string> => {
    const ai = getAiClient();
    const config = {
        numberOfVideos: 1,
        resolution,
        aspectRatio,
    };

    const operation = await ai.models.generateVideos({
        model: VIDEO_MODEL,
        prompt,
        config,
    });

    return processVideoResponse(operation);
};

export const animateImage = async (prompt: string, image: UploadedImage, aspectRatio: AspectRatio, resolution: Resolution): Promise<string> => {
    const ai = getAiClient();
    const config = {
        numberOfVideos: 1,
        resolution,
        aspectRatio,
    };

    const operation = await ai.models.generateVideos({
        model: VIDEO_MODEL,
        prompt,
        image: {
            imageBytes: image.base64,
            mimeType: image.mimeType,
        },
        config,
    });

    return processVideoResponse(operation);
};

export const generateVideoFromFrames = async (
    prompt: string,
    startFrame: UploadedImage,
    endFrame: UploadedImage,
    aspectRatio: AspectRatio,
    resolution: Resolution
): Promise<string> => {
    const ai = getAiClient();
    const config = {
        numberOfVideos: 1,
        resolution,
        aspectRatio,
        lastFrame: {
            imageBytes: endFrame.base64,
            mimeType: endFrame.mimeType,
        }
    };
    
    const operation = await ai.models.generateVideos({
        model: ADVANCED_VIDEO_MODEL,
        prompt,
        image: {
            imageBytes: startFrame.base64,
            mimeType: startFrame.mimeType,
        },
        config
    });

    return processVideoResponse(operation);
};

export const generateVideoFromReferences = async (
    prompt: string,
    referenceImages: UploadedImage[]
): Promise<string> => {
    const ai = getAiClient();

    const referenceImagesPayload: VideoGenerationReferenceImage[] = referenceImages.map(img => ({
        image: {
            imageBytes: img.base64,
            mimeType: img.mimeType,
        },
        referenceType: VideoGenerationReferenceType.ASSET,
    }));

    const config = {
        numberOfVideos: 1,
        referenceImages: referenceImagesPayload,
        resolution: '720p', // Constraint
        aspectRatio: '16:9', // Constraint
    };

    const operation = await ai.models.generateVideos({
        model: ADVANCED_VIDEO_MODEL,
        prompt,
        config,
    });

    return processVideoResponse(operation);
};

export const performMultimodalSearch = async (prompt: string, images: UploadedImage[]): Promise<string> => {
    const ai = getAiClient();
    
    if (images.length === 0) {
        throw new Error("Please upload at least one image for multimodal search.");
    }

    const imageParts = images.map(image => ({
        inlineData: {
            mimeType: image.mimeType,
            data: image.base64,
        },
    }));

    const textPart = {
        text: `Analyze the following image(s) and answer the user's query. Query: "${prompt}"`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [...imageParts, textPart] },
    });

    return response.text;
};