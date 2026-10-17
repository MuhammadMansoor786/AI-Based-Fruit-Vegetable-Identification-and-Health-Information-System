import React from 'react';
import {
  Camera,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  Globe2,
  ArrowRight,
  Heart,
  Droplets,
  Flame,
} from 'lucide-react';
import type { ProduceItem } from '../types/produce.ts';

interface HeroSectionProps {
  onStartScanning: () => void;
  onExploreGallery: () => void;
  featuredProduce: ProduceItem[];
  onSelectProduce: (item: ProduceItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartScanning,
  onExploreGallery,
  featuredProduce,
  onSelectProduce,
}) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-950 to-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-stone-800">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-14 sm:py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Agricultural Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI-Based Fruit & Vegetable <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300 bg-clip-text text-transparent">
              Recognition & Health Portal
            </span>
          </h1>

          {/* Urdu Subtitle with Romanized Transliteration */}
          <div className="space-y-1">
            <p className="text-sm sm:text-lg font-bold text-emerald-300 tracking-wide">
              Phal Aur Sabzi Ki Tasveer Se AI Pehchan, Ghizaiyat Aur Sehat Ke Fawaid
            </p>
            <p className="text-xs sm:text-base font-urdu text-emerald-100/90 max-w-2xl mx-auto" dir="rtl">
              کسی بھی پھل یا سبزی کی تصویر لیں؛ اے آئی فوراً پہچان کر غذائی اجزاء، شوگر اور گردے کے پرہیز بتائے گا۔
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Upload or capture any produce photo to discover its botanical origins, USDA FoodData Central 100g nutrient facts, glycemic indices, and clinical precautions for diabetes and renal disease.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartScanning}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/40 flex items-center gap-2.5 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" /> Launch AI Recognition
            </button>
            <button
              onClick={onExploreGallery}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-2xl border border-white/20 backdrop-blur-sm transition-all"
            >
              <Layers className="w-4 h-4 inline mr-2" /> Browse Food Directory
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-white/10 max-w-4xl mx-auto text-xs">
            <div className="flex items-center gap-2.5 text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>USDA & FAO FoodData Verified</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-300">
              <Activity className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Diabetic & Renal Precautions</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-300">
              <Globe2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Origin & Multilingual (Urdu/Hindi)</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Gemini 3.8 Flash Multimodal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Botanical Specimens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Featured Superfoods & Therapeutic Produce
            </h2>
            <p className="text-xs text-stone-500">
              Hand-picked verified specimens with comprehensive metabolic and micronutrient profiles.
            </p>
          </div>
          <button
            onClick={onExploreGallery}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            View All ({featuredProduce.length}+) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProduce.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduce(item)}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded font-serif backdrop-blur-xs">
                  {item.urduName}
                </span>
                <span className="absolute top-2 left-2 bg-white/90 text-stone-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs italic text-stone-500 font-serif">
                    {item.scientificName}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2 rounded-xl">
                  <span>{item.nutritionPer100g.calories} kcal</span>
                  <span>Fiber: {item.nutritionPer100g.fiberG}g</span>
                  <span className="text-emerald-700 font-bold">GI {item.precautions.diabetes.glycemicIndex}</span>
                </div>

                <div className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {item.healthBenefits[0]?.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
