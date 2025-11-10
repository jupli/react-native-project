import React, { useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { analyzeFoodImage } from '../services/geminiService';
import type { Meal } from '../types';
import Icon from '../components/Icon';

interface ScannerScreenProps {
  onBack: () => void;
  onAnalysisComplete: (meal: Omit<Meal, 'id' | 'time'>) => void;
}

const ScannerScreen: React.FC<ScannerScreenProps> = ({ onBack, onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1160');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickImage = async () => {
    // Due to web security, we can't directly trigger the file picker
    // without user interaction. We'll use a hidden input element.
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        setImage(imageUrl);
        // The result includes the mime type header, e.g., "data:image/jpeg;base64,"
        // We need to extract just the base64 part.
        const base64Data = imageUrl.split(',')[1];
        if (base64Data) {
          await handleScan(base64Data, imageUrl, file.type);
        } else {
            setError('Could not read image data correctly.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async (base64: string, imageUrl: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeFoodImage(base64, mimeType);
      onAnalysisComplete({ ...result, imageUrl: imageUrl });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onBack} className="bg-black/30 rounded-full p-2">
          <Icon name="back" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Scanner</h1>
        <button className="bg-black/30 rounded-full p-2">
            <Icon name="more" className="w-6 h-6" />
        </button>
      </div>

      {/* Image Display */}
      <div className="flex-grow relative flex justify-center items-center overflow-hidden">
        {image && (
          <img src={image} alt="Scanned food" className="w-full h-full object-cover" />
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">Analyzing your meal...</p>
          </div>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="absolute bottom-24 left-4 right-4 bg-red-800/80 p-3 rounded-lg border border-red-600">
          <p className="font-bold">Analysis Failed</p>
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* Footer Controls */}
      <div className="p-4 bg-black/50 z-10 flex flex-col items-center">
        <div className="flex justify-around items-center bg-black/40 p-2 rounded-full w-full max-w-xs mb-4">
            <button className="text-white font-semibold py-2 px-4 rounded-full bg-white/20">Scan food</button>
            <button className="text-gray-400 font-semibold py-2 px-4">Barcode</button>
            <button className="text-gray-400 font-semibold py-2 px-4">Food label</button>
        </div>
        <button 
          onClick={pickImage} 
          className="bg-white text-black font-bold py-4 px-10 rounded-full text-lg"
          disabled={isLoading}
        >
          Pick from Library
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            className="hidden"
        />
      </div>
    </div>
  );
};

export default ScannerScreen;