import React, { useState, useRef } from 'react';
import { UploadedImage } from '../types';

interface MultiImageUploadProps {
  onImagesUpload: (images: UploadedImage[]) => void;
  disabled: boolean;
  maxImages?: number;
  title?: string;
  description?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ onImagesUpload, disabled, maxImages = 3, title, description }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && images.length < maxImages) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newImage: UploadedImage = {
            base64: result.split(',')[1],
            mimeType: file.type,
            preview: result
        };
        const newImages = [...images, newImage];
        setImages(newImages);
        onImagesUpload(newImages);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesUpload(newImages);
  };

  const canUpload = !disabled && images.length < maxImages;

  return (
    <div className="mb-4">
        <div className={`w-full p-4 border-2 border-dashed rounded-lg text-center transition-colors ${ !canUpload ? 'border-gray-700 bg-gray-800/50' : 'border-gray-600 hover:border-purple-500 hover:bg-gray-800/50 cursor-pointer'}`}
            onClick={() => canUpload && fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              disabled={!canUpload}
            />
            <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <p className="font-semibold">{title || `Upload Reference Images`} ({images.length}/{maxImages})</p>
                <p className="text-xs">{description || 'These images will guide the video content'}</p>
            </div>
        </div>
         {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image, index) => (
                     <div key={index} className="relative">
                        <img src={image.preview} alt={`Reference ${index + 1}`} className="w-full h-auto rounded-md aspect-square object-cover" />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                            disabled={disabled}
                            aria-label={`Remove image ${index + 1}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default MultiImageUpload;