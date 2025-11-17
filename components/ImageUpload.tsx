
import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (base64: string, mimeType: string, preview: string) => void;
  disabled: boolean;
  title?: string;
  description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, disabled, title, description }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        setPreview(result);
        onImageUpload(base64String, file.type, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload('', '', '');
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-4">
      <div className={`w-full p-4 border-2 border-dashed rounded-lg text-center transition-colors ${ disabled ? 'border-gray-700 bg-gray-800/50' : 'border-gray-600 hover:border-purple-500 hover:bg-gray-800/50 cursor-pointer'}`}
        onClick={() => !disabled && fileInputRef.current?.click()}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={disabled}
        />
        {!preview ? (
          <div className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            <p className="font-semibold">{title || 'Click to upload an image'}</p>
            <p className="text-xs">{description || 'PNG, JPG, or WEBP'}</p>
          </div>
        ) : (
          <div className="relative inline-block">
            <img src={preview} alt="Image preview" className="max-h-48 rounded-md mx-auto" />
            <button 
              onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
              disabled={disabled}
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
