export enum GenerationMode {
  IMAGE = 'image',
  VIDEO = 'video',
  ANIMATE = 'animate',
  ADVANCED_VIDEO = 'advanced_video',
  STORYBOARD = 'storyboard',
  MULTIMODAL_SEARCH = 'multimodal_search',
}

export interface ParsedScene {
  sceneNumber: number;
  location: string;
  characters: string[];
  promptForImage: string;
}

export interface StoryboardScene {
  id: string;
  prompt: string;
  image: string | null;
  isLoading: boolean;
  location: string;
  characters: string[];
  sceneNumber: number;
}


export type AspectRatio = '16:9' | '9:16';
export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export type Resolution = '720p' | '1080p';

export type ShotType = 'none' | 'wide-shot' | 'medium-shot' | 'close-up' | 'extreme-close-up' | 'drone-shot';
export type CameraMovement = 'none' | 'static' | 'pan-left' | 'pan-right' | 'tilt-up' | 'tilt-down' | 'zoom-in' | 'zoom-out' | 'tracking-shot';
export type TransitionStyle = 'none' | 'hard-cut' | 'crossfade' | 'match-cut';

export interface GeneratedMedia {
  url: string;
  type: 'image' | 'video';
}

export interface UploadedImage {
    base64: string;
    mimeType: string;
    preview: string;
}

// Fix: Resolve TypeScript errors for `window.aistudio` by making the AIStudio interface global.
// This prevents "Subsequent property declarations must have the same type" errors by ensuring
// there's a single, unambiguous type definition for `AIStudio` across the application.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // FIX: Add `readonly` modifier to resolve the "All declarations of 'aistudio' must have identical modifiers" error.
    readonly aistudio: AIStudio;
  }
}
