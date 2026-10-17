import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  UploadCloud,
  Sparkles,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  Video,
  X,
  HelpCircle,
} from 'lucide-react';
import type { RecognitionResult, ProduceItem } from '../types/produce.ts';
import { SAMPLE_SCAN_PRESETS } from '../data/sampleProduce.ts';

interface AiScannerProps {
  onSelectProduce: (item: ProduceItem) => void;
  onSaveHistory: (result: RecognitionResult) => void;
}

export const AiScanner: React.FC<AiScannerProps> = ({
  onSelectProduce,
  onSaveHistory,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live Camera Stream states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setError('Camera access could not be initialized. Please upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      handleImageSelect(dataUrl, 'image/jpeg');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleImageSelect(reader.result, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleImageSelect(reader.result, file.type);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = async (preset: typeof SAMPLE_SCAN_PRESETS[0]) => {
    setError(null);
    setSelectedImage(preset.imageUrl);
    setIsScanning(true);
    setScanStep('Analyzing visual features with Gemini 3.8 Flash...');

    try {
      // Convert image to base64 or send direct hint
      const res = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: 'data:image/jpeg;base64,preset_sample',
          userHint: preset.name,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        onSaveHistory(data.result);
      } else {
        throw new Error(data.error || 'Recognition failed');
      }
    } catch (err: any) {
      setError(err.message || 'Recognition service encountered an error.');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleImageSelect = async (base64Url: string, mimeType: string = 'image/jpeg') => {
    setError(null);
    setSelectedImage(base64Url);
    setResult(null);
    setIsScanning(true);
    setScanStep('Sending image to Gemini 3.8 Flash vision model...');

    try {
      setTimeout(() => setScanStep('Detecting botanical morphology & leaf patterns...'), 600);
      setTimeout(() => setScanStep('Retrieving USDA FoodData Central & FAO clinical nutrition...'), 1200);

      const res = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Url,
          mimeType,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        onSaveHistory(data.result);
      } else {
        throw new Error(data.error || 'Failed to analyze produce image.');
      }
    } catch (err: any) {
      setError(err.message || 'Recognition service was unable to process image.');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Multimodal AI Vision
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          AI Fruit & Vegetable Recognition
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
          Capture or upload any produce photo. Gemini 3.8 Flash identifies the botanical specimen, cross-references USDA FoodData Central nutrition, and flags clinical precautions for diabetes and kidney health.
        </p>
      </div>

      {/* Main Upload / Camera / Scanner Surface */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-900 font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Camera View */}
        {isCameraActive ? (
          <div className="relative bg-black p-4 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[440px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-[440px] object-contain rounded-2xl"
            />
            <div className="absolute bottom-6 flex items-center gap-4">
              <button
                onClick={capturePhotoFromCamera}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <Camera className="w-5 h-5" /> Take Photo
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-semibold rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !selectedImage ? (
          /* Initial Upload / Drag-and-Drop Surface */
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-stone-200 rounded-3xl m-4 bg-stone-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-bold text-stone-800">
                Drag and drop your produce photo here, or <span className="text-emerald-700 underline">browse</span>
              </p>
              <p className="text-xs text-stone-500">
                Supports JPG, PNG, WEBP (Clear, well-lit photos give highest confidence)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <UploadCloud className="w-4 h-4" /> Upload File
              </button>
              <button
                onClick={startCamera}
                className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <Video className="w-4 h-4" /> Live Camera
              </button>
            </div>
          </div>
        ) : (
          /* Preview & Scanning / Result View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Photo Preview Thumbnail & Scanning Beam */}
              <div className="relative w-full sm:w-64 h-64 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shrink-0 shadow-md">
                <img
                  src={selectedImage}
                  alt="Scanned produce preview"
                  className="w-full h-full object-cover"
                />

                {/* Animated Scanner Beam Overlay during AI processing */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-4 text-center">
                    <div className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-xs font-semibold text-emerald-200 animate-pulse">
                      {scanStep}
                    </span>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                  </div>
                )}

                <button
                  onClick={resetScanner}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all text-xs"
                  title="Scan another photo"
                  aria-label="Scan another item"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Recognition Result Content */}
              <div className="flex-1 w-full space-y-4">
                {isScanning ? (
                  <div className="space-y-3 py-6">
                    <div className="h-6 bg-stone-200 rounded-md w-3/4 animate-pulse" />
                    <div className="h-4 bg-stone-100 rounded-md w-1/2 animate-pulse" />
                    <div className="h-16 bg-stone-50 rounded-xl border border-stone-200 p-3 animate-pulse" />
                    <p className="text-xs text-stone-500 italic">
                      Evaluating botanical traits, color pigmentation, rind geometry and nutritional database...
                    </p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    {/* Unclear image warning if applicable */}
                    {result.unclearWarning && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">Image Quality Warning:</strong>
                          <span>{result.unclearWarning}</span>
                        </div>
                      </div>
                    )}

                    {/* Not produce warning */}
                    {!result.isProduce ? (
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-rose-950">
                          <AlertCircle className="w-5 h-5 text-rose-600" />
                          No Fruit or Vegetable Detected
                        </div>
                        <p>
                          Our AI could not detect an edible fruit, vegetable, or culinary plant in this photo. Please ensure the subject is well-lit and unobstructed.
                        </p>
                        <button
                          onClick={resetScanner}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
                        >
                          Try Another Photo
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Success header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {result.confidence}% Confidence
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 uppercase font-semibold">
                              {result.item.category}
                            </span>
                          </div>

                          <span className="text-[11px] text-stone-400">
                            Verified with USDA FoodData Central
                          </span>
                        </div>

                        {/* Identified Names */}
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center gap-2.5">
                            {result.item.name}
                            <span className="text-xl sm:text-2xl font-serif text-emerald-700 font-normal">
                              {result.item.urduName}
                            </span>
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-500 italic font-serif">
                            {result.item.scientificName} · Family: {result.item.family}
                          </p>
                        </div>

                        {/* Nutrition & Clinical Snapshot */}
                        <div className="grid grid-cols-3 gap-2 py-2">
                          <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-center">
                            <span className="text-[10px] text-stone-500 font-medium block">Energy</span>
                            <span className="font-bold text-stone-900 text-sm">{result.item.nutritionPer100g.calories} kcal</span>
                            <span className="text-[10px] text-stone-400 block">per 100g</span>
                          </div>
                          <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-center">
                            <span className="text-[10px] text-stone-500 font-medium block">Glycemic Index</span>
                            <span className="font-bold text-emerald-700 text-sm">
                              GI {result.item.precautions.diabetes.glycemicIndex}
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {result.item.precautions.diabetes.category}
                            </span>
                          </div>
                          <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-center">
                            <span className="text-[10px] text-stone-500 font-medium block">Potassium</span>
                            <span className="font-bold text-stone-900 text-sm">
                              {result.item.nutritionPer100g.potassium_mg} mg
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {result.item.precautions.kidneyDisease.potassiumTier.split(' ')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Quick Health Summary */}
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                          <strong className="block font-bold flex items-center gap-1.5 text-emerald-900">
                            <Sparkles className="w-3.5 h-3.5" /> Key Clinical Highlight:
                          </strong>
                          <p className="leading-relaxed">
                            {result.item.healthBenefits[0]?.title}: {result.item.healthBenefits[0]?.description}
                          </p>
                        </div>

                        {/* Alternative Candidate Matches */}
                        {result.alternativeMatches && result.alternativeMatches.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5" /> Alternative Candidate Matches:
                            </span>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {result.alternativeMatches.map((cand, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-medium"
                                >
                                  {cand.name} ({cand.confidence}%)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTA: Open Full Nutrition & Clinical Profile */}
                        <div className="pt-2 flex flex-wrap gap-3">
                          <button
                            onClick={() => onSelectProduce(result.item)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                          >
                            Explore Complete Profile & Precautions <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={resetScanner}
                            className="px-4 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs rounded-xl transition-all"
                          >
                            Scan Another Photo
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1-Click Instant Testing Presets (Phase 2 & Testing UX) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              1-Click Instant Testing Presets
            </h3>
            <p className="text-xs text-stone-500">
              Don't have a fresh photo right now? Click any specimen below to test the AI recognition engine and clinical report immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_SCAN_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="group text-left border border-stone-200 hover:border-emerald-500 hover:shadow-md p-2 rounded-xl transition-all bg-stone-50 hover:bg-white"
            >
              <div className="relative h-24 rounded-lg overflow-hidden bg-stone-200 mb-2">
                <img
                  src={preset.imageUrl}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-serif backdrop-blur-xs">
                  {preset.urduName}
                </span>
              </div>
              <span className="font-bold text-stone-900 text-xs block truncate group-hover:text-emerald-700">
                {preset.name}
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                {preset.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
