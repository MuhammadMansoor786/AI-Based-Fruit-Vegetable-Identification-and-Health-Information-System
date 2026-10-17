import React, { useState } from 'react';
import {
  X,
  Heart,
  GitCompare,
  ExternalLink,
  ShieldAlert,
  Activity,
  Globe2,
  Sparkles,
  Flame,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Info,
} from 'lucide-react';
import type { ProduceItem } from '../types/produce.ts';
import { calculateDailyValuePercent } from '../utils/nutrition.ts';

interface ProduceDetailModalProps {
  item: ProduceItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: ProduceItem) => void;
  onCompareWith: (item: ProduceItem) => void;
}

export const ProduceDetailModal: React.FC<ProduceDetailModalProps> = ({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
  onCompareWith,
}) => {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'precautions' | 'benefits' | 'origin' | 'sources'>('nutrition');
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);

  if (!item) return null;

  const n = item.nutritionPer100g;

  const handleFeedback = async (type: 'accurate' | 'inaccurate') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produceName: item.name,
          feedbackType: type,
          userComment: type === 'accurate' ? 'Confirmed by user' : 'User reported correction needed',
        }),
      });
      setFeedbackSent(type);
    } catch {
      setFeedbackSent(type);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header & Cover Photo */}
        <div className="relative bg-stone-900 text-white min-h-[190px] sm:min-h-[220px] flex flex-col justify-end p-6 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-overlay filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => onToggleFavorite(item)}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/40 text-stone-200 hover:text-white hover:bg-black/60'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={() => onCompareWith(item)}
              className="p-2 rounded-full bg-black/40 text-stone-200 hover:text-white hover:bg-black/60 backdrop-blur-md transition-all"
              title="Compare with another food"
              aria-label="Compare with another produce"
            >
              <GitCompare className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 text-stone-200 hover:text-white hover:bg-black/60 backdrop-blur-md transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Urdu Heading */}
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-600 text-white">
                {item.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-stone-100 backdrop-blur-sm">
                {item.subCategory}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/10 text-stone-200 backdrop-blur-sm">
                Family: {item.family}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  {item.name}
                  <span className="text-xl sm:text-2xl font-serif text-emerald-300 font-normal">
                    {item.urduName}
                  </span>
                </h2>
                <p className="text-sm italic text-stone-300 font-serif">
                  {item.scientificName}
                </p>
              </div>

              {/* Calorie Pill */}
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-white font-bold text-sm">{n.calories} kcal</span>
                <span className="text-stone-300 text-xs">/ 100g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-stone-200 bg-stone-50/80 px-4 flex gap-2 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'nutrition'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            Nutrition Facts (USDA)
          </button>
          <button
            onClick={() => setActiveTab('precautions')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'precautions'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Health Precautions & Clinical Suitability
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'benefits'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Health Benefits ({item.healthBenefits.length})
          </button>
          <button
            onClick={() => setActiveTab('origin')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'origin'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe2 className="w-4 h-4 text-teal-600" />
            Origin, Agriculture & Culinary
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'sources'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-stone-600" />
            Sources & Verification
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: NUTRITION */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              {/* Macro overview cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-stone-500 font-medium">Carbohydrates</span>
                  <p className="text-xl font-bold text-stone-800 mt-0.5">{n.carbsG}g</p>
                  <span className="text-[11px] text-stone-400">Sugars: {n.sugarsG}g</span>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-emerald-700 font-medium">Dietary Fiber</span>
                  <p className="text-xl font-bold text-emerald-900 mt-0.5">{n.fiberG}g</p>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {calculateDailyValuePercent(n.fiberG, 'fiberG')}% DV
                  </span>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-stone-500 font-medium">Protein</span>
                  <p className="text-xl font-bold text-stone-800 mt-0.5">{n.proteinG}g</p>
                  <span className="text-[11px] text-stone-400">
                    {calculateDailyValuePercent(n.proteinG, 'proteinG')}% DV
                  </span>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-stone-500 font-medium">Water Content</span>
                  <p className="text-xl font-bold text-stone-800 mt-0.5">{n.waterPercent}%</p>
                  <span className="text-[11px] text-sky-600 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" /> Hydration
                  </span>
                </div>
              </div>

              {/* Glycemic Index banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900 text-sm">Glycemic Index (GI):</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                      {item.precautions.diabetes.glycemicIndex} ({item.precautions.diabetes.category})
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl">
                    {item.precautions.diabetes.advice}
                  </p>
                </div>
                <div className="text-xs bg-white px-3 py-1.5 rounded-lg border border-emerald-200 font-medium text-emerald-900 shrink-0">
                  Serving: {item.recommendedServing}
                </div>
              </div>

              {/* Micronutrients and Daily Value Breakdown */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Vitamins & Essential Minerals per 100g (% Daily Value)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Vitamin C */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-700">Vitamin C (Ascorbic Acid)</span>
                      <span className="font-bold text-stone-900">
                        {n.vitaminC_mg} mg ({calculateDailyValuePercent(n.vitaminC_mg, 'vitaminC_mg')}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateDailyValuePercent(n.vitaminC_mg, 'vitaminC_mg'), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Potassium */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-700">Potassium (K)</span>
                      <span className="font-bold text-stone-900">
                        {n.potassium_mg} mg ({calculateDailyValuePercent(n.potassium_mg, 'potassium_mg')}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateDailyValuePercent(n.potassium_mg, 'potassium_mg'), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Vitamin A */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-700">Vitamin A (Carotenoids RAE)</span>
                      <span className="font-bold text-stone-900">
                        {n.vitaminA_mcg} mcg ({calculateDailyValuePercent(n.vitaminA_mcg, 'vitaminA_mcg')}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateDailyValuePercent(n.vitaminA_mcg, 'vitaminA_mcg'), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Vitamin K */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-700">Vitamin K (Phylloquinone)</span>
                      <span className="font-bold text-stone-900">
                        {n.vitaminK_mcg} mcg ({calculateDailyValuePercent(n.vitaminK_mcg, 'vitaminK_mcg')}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateDailyValuePercent(n.vitaminK_mcg, 'vitaminK_mcg'), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Calcium & Iron */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-700">Calcium & Iron</span>
                      <span className="font-bold text-stone-900">
                        Ca: {n.calcium_mg}mg · Fe: {n.iron_mg}mg
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateDailyValuePercent(n.iron_mg, 'iron_mg'), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Folate & Magnesium */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-700">Folate & Magnesium</span>
                      <span className="font-bold text-stone-900">
                        B9: {n.folate_mcg}mcg · Mg: {n.magnesium_mg}mg
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateDailyValuePercent(n.folate_mcg, 'folate_mcg'), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL PRECAUTIONS & SUITABILITY */}
          {activeTab === 'precautions' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">Individual Health & Medical Conditions</h4>
                  <p className="mt-1 leading-relaxed">
                    While fruits and vegetables provide essential micronutrients, specific biochemical components (potassium, oxalates, natural sugars, vitamin K) interact with physiological conditions and pharmaceutical medications. Review the structured precautions below.
                  </p>
                </div>
              </div>

              {/* Diabetes suitability */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h5 className="font-bold text-stone-900 text-sm">Diabetes Mellitus (Blood Glucose Control)</h5>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      item.precautions.diabetes.suitability === 'Safe'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.precautions.diabetes.suitability === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Suitability: {item.precautions.diabetes.suitability}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {item.precautions.diabetes.advice}
                </p>
                <div className="mt-2 text-[11px] text-stone-500 font-mono">
                  GI: {item.precautions.diabetes.glycemicIndex} ({item.precautions.diabetes.category}) · Total Carbs: {n.carbsG}g · Net Carbs: {Math.max(0, n.carbsG - n.fiberG).toFixed(1)}g
                </div>
              </div>

              {/* Kidney Disease / Renal Diet */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <h5 className="font-bold text-stone-900 text-sm">Kidney Disease (Renal & Oxalate Considerations)</h5>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-700">
                      {item.precautions.kidneyDisease.potassiumTier}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      Oxalates: {item.precautions.kidneyDisease.oxalateLevel}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {item.precautions.kidneyDisease.advice}
                </p>
                <div className="mt-2 text-[11px] text-stone-500 font-mono">
                  Potassium: {n.potassium_mg}mg / 100g
                </div>
              </div>

              {/* Hypertension / Blood Pressure */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white shadow-xs">
                <h5 className="font-bold text-stone-900 text-sm mb-1">Cardiovascular & Hypertension</h5>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {item.precautions.hypertension.advice}
                </p>
              </div>

              {/* Allergies and Drug Interactions */}
              <div className="border border-rose-100 bg-rose-50/40 rounded-xl p-4">
                <h5 className="font-bold text-rose-950 text-sm mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Known Allergies, Cross-Reactivities & Drug Interactions
                </h5>
                <ul className="space-y-1.5 text-xs text-rose-900">
                  {item.precautions.allergiesAndInteractions.map((alert, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                  {item.precautions.contraindications.map((contra, idx) => (
                    <li key={`c-${idx}`} className="flex items-start gap-2 text-rose-800 font-medium">
                      <span className="text-rose-600 font-bold">⚠</span>
                      <span>{contra}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: HEALTH BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Detailed physiological benefits backed by clinical biochemistry and nutritional studies.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {item.healthBenefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {benefit.title}
                      </h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {benefit.targetedSystem}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORIGIN & AGRICULTURAL PROFILE */}
          {activeTab === 'origin' && (
            <div className="space-y-5 text-xs text-stone-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-teal-600" />
                    Geographical Origin
                  </h5>
                  <p>{item.origin}</p>

                  <h5 className="font-bold text-stone-900 pt-2">Primary Cultivation Regions:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {item.cultivationRegions.map((region, idx) => (
                      <span key={idx} className="bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px]">
                        {region}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900">Growing Season & Climate</h5>
                  <p><span className="font-semibold">Season:</span> {item.growingSeason.join(', ')}</p>
                  <p><span className="font-semibold">Climate:</span> {item.climate}</p>

                  <h5 className="font-bold text-stone-900 pt-2">Prominent Varieties / Cultivars:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {item.varieties.map((variety, idx) => (
                      <span key={idx} className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-medium">
                        {variety}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Local Names & Multilingual */}
              {item.localNames && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 text-xs block mb-1.5">Multilingual Vernacular Names:</span>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {item.localNames.hindi && <span><strong className="text-stone-500">Hindi:</strong> {item.localNames.hindi}</span>}
                    {item.localNames.spanish && <span><strong className="text-stone-500">Spanish:</strong> {item.localNames.spanish}</span>}
                    {item.localNames.arabic && <span><strong className="text-stone-500">Arabic:</strong> {item.localNames.arabic}</span>}
                    {item.localNames.french && <span><strong className="text-stone-500">French:</strong> {item.localNames.french}</span>}
                  </div>
                </div>
              )}

              {/* Culinary & Storage */}
              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl">
                  <h5 className="font-bold text-stone-900 mb-1">Culinary Applications & Preparation:</h5>
                  <div className="flex flex-wrap gap-2">
                    {item.culinaryUses.map((use, idx) => (
                      <span key={idx} className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md text-xs">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded-xl">
                  <h5 className="font-bold text-stone-900 mb-1">Proper Storage & Shelf-Life:</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.storageTips}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SOURCES & SCIENTIFIC REFERENCES */}
          {activeTab === 'sources' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Authoritative Scientific Databases
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  Nutritional calculations and biochemical safety profiles are referenced against the following peer-reviewed agricultural and nutritional bodies:
                </p>
                <div className="space-y-2 pt-2">
                  {item.sources.map((src, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-lg">
                      <div>
                        <span className="font-bold text-stone-900 block">{src.name}</span>
                        <span className="text-[11px] text-stone-500">Agency: {src.organization}</span>
                      </div>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Prompt */}
              <div className="p-4 border border-stone-200 rounded-xl bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-stone-900 block">AI Identification Accuracy Feedback</span>
                  <span className="text-stone-500 text-[11px]">Help us maintain scientific data integrity.</span>
                </div>
                {feedbackSent ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Thank you for your feedback!
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback('accurate')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Accurate
                    </button>
                    <button
                      onClick={() => handleFeedback('inaccurate')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 hover:text-rose-700 text-stone-700 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" /> Report Issue
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-stone-200 px-6 py-3.5 bg-stone-50 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-stone-400" /> Sourced from USDA FoodData Central & FAO
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onCompareWith(item)}
              className="px-3.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5" /> Compare Food
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
