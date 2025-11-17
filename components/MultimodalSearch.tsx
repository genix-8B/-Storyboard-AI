
import React, { useState } from 'react';
import { UploadedImage } from '../types';
import { performMultimodalSearch } from '../services/geminiService';
import MultiImageUpload from './MultiImageUpload';
import PromptInput from './PromptInput';

const MultimodalSearch: React.FC = () => {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handleSearch = async () => {
        if (images.length === 0) {
            setError('Please upload at least one image for multimodal search.');
            return;
        }
        if (!query.trim()) {
            setError('Please enter a search query.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const searchResult = await performMultimodalSearch(query, images);
            setResult(searchResult);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during the search.');
        } finally {
            setIsLoading(false);
        }
    };

    const isSearchDisabled = isLoading || images.length === 0 || !query.trim();

    return (
        <div>
            <MultiImageUpload
                onImagesUpload={setImages}
                disabled={isLoading}
                maxImages={5}
                title="Upload Media for Search"
                description="Upload up to 5 images to include in your query."
            />

            <PromptInput
                prompt={query}
                setPrompt={setQuery}
                onSubmit={handleSearch}
                isLoading={isLoading}
                disabled={isLoading}
                promptRequired={true}
                placeholder="Ask a question about the uploaded media..."
            />

            {error && (
                <div className="text-center p-4 mt-6 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p className="text-red-300">{error}</p>
                </div>
            )}

            {isLoading && (
                 <div className="flex flex-col items-center justify-center p-8 mt-6 animate-text-focus-in">
                    <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-semibold text-gray-200">Analyzing media and searching...</p>
                </div>
            )}

            {result && (
                <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700 animate-text-focus-in">
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">Search Result</h3>
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default MultimodalSearch;