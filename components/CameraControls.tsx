
import React from 'react';
import { ShotType, CameraMovement, TransitionStyle } from '../types';

interface CameraControlsProps {
  shotType: ShotType;
  onShotTypeChange: (type: ShotType) => void;
  cameraMovement: CameraMovement;
  onCameraMovementChange: (movement: CameraMovement) => void;
  transitionStyle: TransitionStyle;
  onTransitionStyleChange: (style: TransitionStyle) => void;
  disabled: boolean;
}

const shotTypeOptions: { value: ShotType; label: string }[] = [
  { value: 'none', label: 'Default Shot' },
  { value: 'wide-shot', label: 'Wide Shot' },
  { value: 'medium-shot', label: 'Medium Shot' },
  { value: 'close-up', label: 'Close-Up' },
  { value: 'extreme-close-up', label: 'Extreme Close-Up' },
  { value: 'drone-shot', label: 'Drone Shot' },
];

const cameraMovementOptions: { value: CameraMovement; label: string }[] = [
  { value: 'none', label: 'Default Movement' },
  { value: 'static', label: 'Static' },
  { value: 'pan-left', label: 'Pan Left' },
  { value: 'pan-right', label: 'Pan Right' },
  { value: 'tilt-up', label: 'Tilt Up' },
  { value: 'tilt-down', label: 'Tilt Down' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'zoom-out', label: 'Zoom Out' },
  { value: 'tracking-shot', label: 'Tracking Shot' },
];

const transitionStyleOptions: { value: TransitionStyle; label: string }[] = [
    { value: 'none', label: 'Default Transition' },
    { value: 'hard-cut', label: 'Hard Cut' },
    { value: 'crossfade', label: 'Crossfade' },
    { value: 'match-cut', label: 'Match Cut' },
];


const selectClassName = "w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50";

const CameraControls: React.FC<CameraControlsProps> = ({
  shotType,
  onShotTypeChange,
  cameraMovement,
  onCameraMovementChange,
  transitionStyle,
  onTransitionStyleChange,
  disabled,
}) => {
  return (
    <div className="my-4 p-4 border border-gray-700 rounded-lg bg-gray-900/30">
        <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">Cinematic Controls</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label htmlFor="shot-type" className="block text-xs text-gray-400 mb-1">Shot Type</label>
                <select
                    id="shot-type"
                    value={shotType}
                    onChange={(e) => onShotTypeChange(e.target.value as ShotType)}
                    disabled={disabled}
                    className={selectClassName}
                >
                    {shotTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="camera-movement" className="block text-xs text-gray-400 mb-1">Movement</label>
                <select
                    id="camera-movement"
                    value={cameraMovement}
                    onChange={(e) => onCameraMovementChange(e.target.value as CameraMovement)}
                    disabled={disabled}
                    className={selectClassName}
                >
                    {cameraMovementOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="transition-style" className="block text-xs text-gray-400 mb-1">Transition</label>
                <select
                    id="transition-style"
                    value={transitionStyle}
                    onChange={(e) => onTransitionStyleChange(e.target.value as TransitionStyle)}
                    disabled={disabled}
                    className={selectClassName}
                >
                    {transitionStyleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
        </div>
         <p className="text-center text-xs text-gray-500 mt-3">Direct the shot composition, movement, and transitions for more professional results.</p>
    </div>
  );
};

export default CameraControls;