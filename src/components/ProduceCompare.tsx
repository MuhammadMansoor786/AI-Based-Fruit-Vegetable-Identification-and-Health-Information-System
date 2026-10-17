import React, { useState } from 'react';
import { GitCompare, Flame, Check, ShieldAlert, Sparkles, ArrowRight, Activity } from 'lucide-react';
import type { ProduceItem } from '../types/produce.ts';
import { compareNutrition, calculateDailyValuePercent } from '../utils/nutrition.ts';

interface ProduceCompareProps {
  items: ProduceItem[];
  preselectedA?: ProduceItem | null;
  preselectedB?: ProduceItem | null;
  onSelectProduce: (item: ProduceItem) => void;
}

export const ProduceCompare: React.FC<ProduceCompareProps> = ({
  items,
  preselectedA,
  preselectedB,
  onSelectProduce,
}) => {
  const [itemAId, setItemAId] = useState<string>(preselectedA?.id || items[0]?.id || 'mango');
  const [itemBId, setItemBId] = useState<string>(preselectedB?.id || items[1]?.id || 'bitter-gourd');

  const itemA = items.find((i) => i.id === itemAId) || items[0];
  const itemB = items.find((i) => i.id === itemBId) || items[1];

  const comparison = compareNutrition(itemA, itemB);

  const setPresetComparison = (idA: string, idB: string) => {
    setItemAId(idA);
    setItemBId(idB);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
          <GitCompare className="w-3.5 h-3.5" /> Direct Nutritional Analysis
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Compare Fruits & Vegetables Side-by-Side
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Evaluate nutritional density, glycemic impact, dietary fiber, and clinical suitability for diabetes and renal conditions between any two specimens.
        </p>
      </div>

      {/* Preset Comparisons */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-stone-500 font-medium">Quick Comparisons:</span>
        <button
          onClick={() => setPresetComparison('bitter-gourd', 'mango')}
          className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
        >
          Karela vs. Mango
        </button>
        <button
          onClick={() => setPresetComparison('spinach', 'broccoli')}
          className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
        >
          Spinach vs. Broccoli
        </button>
        <button
          onClick={() => setPresetComparison('avocado', 'banana')}
          className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
        >
          Avocado vs. Banana
        </button>
        <button
          onClick={() => setPresetComparison('tomato', 'guava')}
          className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
        >
          Tomato vs. Guava
        </button>
      </div>

      {/* Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item A Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg">
              Food A
            </span>
            <select
              value={itemAId}
              onChange={(e) => setItemAId(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {items.map((i) => (
                <option key={`a-${i.id}`} value={i.id}>
                  {i.name} ({i.urduName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
              <img
                src={itemA.imageUrl}
                alt={itemA.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                {itemA.name}
                <span className="text-lg font-serif text-emerald-700">{itemA.urduName}</span>
              </h3>
              <p className="text-xs italic text-stone-500 font-serif">{itemA.scientificName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                  {itemA.category}
                </span>
                <span className="text-xs font-bold text-amber-700">
                  {itemA.nutritionPer100g.calories} kcal / 100g
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Item B Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-lg">
              Food B
            </span>
            <select
              value={itemBId}
              onChange={(e) => setItemBId(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {items.map((i) => (
                <option key={`b-${i.id}`} value={i.id}>
                  {i.name} ({i.urduName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
              <img
                src={itemB.imageUrl}
                alt={itemB.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                {itemB.name}
                <span className="text-lg font-serif text-teal-700">{itemB.urduName}</span>
              </h3>
              <p className="text-xs italic text-stone-500 font-serif">{itemB.scientificName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                  {itemB.category}
                </span>
                <span className="text-xs font-bold text-amber-700">
                  {itemB.nutritionPer100g.calories} kcal / 100g
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Nutritional Values per 100g (Standard Reference)
          </h3>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {/* Calories */}
          <div className="grid grid-cols-3 p-3 items-center">
            <div className="text-stone-600 font-medium">Calories</div>
            <div className={`font-bold ${itemA.nutritionPer100g.calories < itemB.nutritionPer100g.calories ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemA.nutritionPer100g.calories} kcal
            </div>
            <div className={`font-bold ${itemB.nutritionPer100g.calories < itemA.nutritionPer100g.calories ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemB.nutritionPer100g.calories} kcal
            </div>
          </div>

          {/* Dietary Fiber */}
          <div className="grid grid-cols-3 p-3 items-center bg-stone-50/50">
            <div className="text-stone-600 font-medium">Dietary Fiber</div>
            <div className={`font-bold ${itemA.nutritionPer100g.fiberG > itemB.nutritionPer100g.fiberG ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemA.nutritionPer100g.fiberG} g ({calculateDailyValuePercent(itemA.nutritionPer100g.fiberG, 'fiberG')}% DV)
            </div>
            <div className={`font-bold ${itemB.nutritionPer100g.fiberG > itemA.nutritionPer100g.fiberG ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemB.nutritionPer100g.fiberG} g ({calculateDailyValuePercent(itemB.nutritionPer100g.fiberG, 'fiberG')}% DV)
            </div>
          </div>

          {/* Sugars */}
          <div className="grid grid-cols-3 p-3 items-center">
            <div className="text-stone-600 font-medium">Total Natural Sugars</div>
            <div className={`font-bold ${itemA.nutritionPer100g.sugarsG < itemB.nutritionPer100g.sugarsG ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemA.nutritionPer100g.sugarsG} g
            </div>
            <div className={`font-bold ${itemB.nutritionPer100g.sugarsG < itemA.nutritionPer100g.sugarsG ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemB.nutritionPer100g.sugarsG} g
            </div>
          </div>

          {/* Vitamin C */}
          <div className="grid grid-cols-3 p-3 items-center bg-stone-50/50">
            <div className="text-stone-600 font-medium">Vitamin C (Immune)</div>
            <div className={`font-bold ${itemA.nutritionPer100g.vitaminC_mg > itemB.nutritionPer100g.vitaminC_mg ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemA.nutritionPer100g.vitaminC_mg} mg ({calculateDailyValuePercent(itemA.nutritionPer100g.vitaminC_mg, 'vitaminC_mg')}% DV)
            </div>
            <div className={`font-bold ${itemB.nutritionPer100g.vitaminC_mg > itemA.nutritionPer100g.vitaminC_mg ? 'text-emerald-700' : 'text-stone-800'}`}>
              {itemB.nutritionPer100g.vitaminC_mg} mg ({calculateDailyValuePercent(itemB.nutritionPer100g.vitaminC_mg, 'vitaminC_mg')}% DV)
            </div>
          </div>

          {/* Potassium */}
          <div className="grid grid-cols-3 p-3 items-center">
            <div className="text-stone-600 font-medium">Potassium (Electrolyte)</div>
            <div className="font-bold text-stone-800">
              {itemA.nutritionPer100g.potassium_mg} mg
            </div>
            <div className="font-bold text-stone-800">
              {itemB.nutritionPer100g.potassium_mg} mg
            </div>
          </div>

          {/* Glycemic Index */}
          <div className="grid grid-cols-3 p-3 items-center bg-stone-50/50">
            <div className="text-stone-600 font-medium">Glycemic Index (GI)</div>
            <div>
              <span className="font-bold">{itemA.precautions.diabetes.glycemicIndex}</span>{' '}
              <span className="text-[10px] text-stone-500">({itemA.precautions.diabetes.category})</span>
            </div>
            <div>
              <span className="font-bold">{itemB.precautions.diabetes.glycemicIndex}</span>{' '}
              <span className="text-[10px] text-stone-500">({itemB.precautions.diabetes.category})</span>
            </div>
          </div>

          {/* Diabetes Suitability */}
          <div className="grid grid-cols-3 p-3 items-center">
            <div className="text-stone-600 font-medium">Diabetic Plan Suitability</div>
            <div>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                itemA.precautions.diabetes.suitability === 'Safe' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {itemA.precautions.diabetes.suitability}
              </span>
            </div>
            <div>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                itemB.precautions.diabetes.suitability === 'Safe' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {itemB.precautions.diabetes.suitability}
              </span>
            </div>
          </div>

          {/* Kidney Potassium & Oxalate */}
          <div className="grid grid-cols-3 p-3 items-center bg-stone-50/50">
            <div className="text-stone-600 font-medium">Kidney / Renal Profile</div>
            <div className="space-y-0.5">
              <span className="block font-medium">{itemA.precautions.kidneyDisease.potassiumTier}</span>
              <span className="text-[10px] text-stone-400">Oxalates: {itemA.precautions.kidneyDisease.oxalateLevel}</span>
            </div>
            <div className="space-y-0.5">
              <span className="block font-medium">{itemB.precautions.kidneyDisease.potassiumTier}</span>
              <span className="text-[10px] text-stone-400">Oxalates: {itemB.precautions.kidneyDisease.oxalateLevel}</span>
            </div>
          </div>
        </div>

        {/* View Profile Action Buttons */}
        <div className="grid grid-cols-2 p-4 bg-stone-50 border-t border-stone-200 gap-4">
          <button
            onClick={() => onSelectProduce(itemA)}
            className="w-full py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition-colors"
          >
            Full Profile: {itemA.name}
          </button>
          <button
            onClick={() => onSelectProduce(itemB)}
            className="w-full py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition-colors"
          >
            Full Profile: {itemB.name}
          </button>
        </div>
      </div>
    </div>
  );
};
