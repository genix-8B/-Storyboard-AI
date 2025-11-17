
import { GenerationMode } from './types';

export const IMAGE_MODEL = 'imagen-4.0-generate-001';
export const VIDEO_MODEL = 'veo-3.1-fast-generate-preview';
export const ADVANCED_VIDEO_MODEL = 'veo-3.1-generate-preview';

export const TAB_OPTIONS = [
  { id: GenerationMode.IMAGE, label: 'Generate Image', icon: 'image' },
  { id: GenerationMode.VIDEO, label: 'Generate Video', icon: 'video_spark' },
  { id: GenerationMode.ANIMATE, label: 'Animate Image', icon: 'movie' },
  { id: GenerationMode.ADVANCED_VIDEO, label: 'Advanced Video', icon: 'advanced' },
  { id: GenerationMode.STORYBOARD, label: 'Script to Storyboard', icon: 'storyboard' },
  { id: GenerationMode.MULTIMODAL_SEARCH, label: 'Multimodal Search', icon: 'search' },
];

export const VIDEO_LOADING_MESSAGES = [
  "Summoning digital muses...",
  "Teaching pixels to dance...",
  "Rendering cinematic brilliance...",
  "Stitching frames into a masterpiece...",
  "Adjusting the director's chair...",
  "This might take a few moments. Great art needs patience.",
  "Finalizing the special effects...",
  "Rolling the digital credits...",
];