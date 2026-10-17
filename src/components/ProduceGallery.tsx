import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Flame,
  Activity,
  Heart,
  GitCompare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { ProduceItem, ProduceCategory, GlycemicCategory, PotassiumTier } from '../types/produce.ts';
import { filterProduceItems } from '../utils/nutrition.ts';

interface ProduceGalleryProps {
  items: ProduceItem[];
  onSelectProduce: (item: ProduceItem) => void;
  favorites: string[];
  onToggleFavorite: (item: ProduceItem) => void;
  onCompareWith: (item: ProduceItem) => void;
}

export const ProduceGallery: React.FC<ProduceGalleryProps> = ({
  items,
  onSelectProduce,
  favorites,
  onToggleFavorite,
  onCompareWith,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProduceCategory | 'all'>('all');
  const [selectedSeason, setSelectedSeason] = useState<string | 'all'>('all');
  const [glycemicFilter, setGlycemicFilter] = useState<GlycemicCategory | 'all'>('all');
  const [potassiumFilter, setPotassiumFilter] = useState<PotassiumTier | 'all'>('all');
  const [highFiberOnly, setHighFiberOnly] = useState(false);
  const [highVitaminCOnly, setHighVitaminCOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'calories_asc' | 'vitaminc_desc' | 'fiber_desc'>('name');

  const filteredItems = useMemo(() => {
    let list = filterProduceItems(items, {
      query: searchQuery,
      category: selectedCategory,
      season: selectedSeason,
      glycemicTier: glycemicFilter,
      potassiumTier: potassiumFilter,
      highFiberOnly,
      highVitaminCOnly,
    });

    return list.sort((a, b) => {
      if (sortBy === 'calories_asc') {
        return a.nutritionPer100g.calories - b.nutritionPer100g.calories;
      }
      if (sortBy === 'vitaminc_desc') {
        return b.nutritionPer100g.vitaminC_mg - a.nutritionPer100g.vitaminC_mg;
      }
      if (sortBy === 'fiber_desc') {
        return b.nutritionPer100g.fiberG - a.nutritionPer100g.fiberG;
      }
      return a.name.localeCompare(b.name);
    });
  }, [
    items,
    searchQuery,
    selectedCategory,
    selectedSeason,
    glycemicFilter,
    potassiumFilter,
    highFiberOnly,
    highVitaminCOnly,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Directory Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Fruit & Vegetable Food Directory
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Browse verified botanical specimens with USDA FoodData Central nutrition facts, clinical health precautions, and growing regions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{filteredItems.length} Verified Entries</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        {/* Search Bar + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by English name, Urdu (آم، کریلہ), scientific name (e.g., Momordica)..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="name">Name (A-Z)</option>
              <option value="calories_asc">Lowest Calories</option>
              <option value="vitaminc_desc">Highest Vitamin C</option>
              <option value="fiber_desc">Highest Fiber</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 text-xs">
          {/* Category tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedCategory('fruit')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === 'fruit'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Fruits
            </button>
            <button
              onClick={() => setSelectedCategory('vegetable')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === 'vegetable'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Vegetables
            </button>
            <button
              onClick={() => setSelectedCategory('herb')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === 'herb'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Herbs
            </button>
          </div>

          {/* Quick Health Goals Toggles */}
          <button
            onClick={() => setGlycemicFilter(glycemicFilter === 'Low' ? 'all' : 'Low')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              glycemicFilter === 'Low'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-300'
            }`}
          >
            Diabetic Friendly (Low GI)
          </button>

          <button
            onClick={() => setHighFiberOnly(!highFiberOnly)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              highFiberOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-300'
            }`}
          >
            High Fiber (&gt;3g)
          </button>

          <button
            onClick={() => setHighVitaminCOnly(!highVitaminCOnly)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              highVitaminCOnly
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-amber-300'
            }`}
          >
            High Vitamin C (&gt;30mg)
          </button>

          <button
            onClick={() => setPotassiumFilter(potassiumFilter === 'Low Potassium' ? 'all' : 'Low Potassium')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              potassiumFilter === 'Low Potassium'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-teal-300'
            }`}
          >
            Low Potassium (&lt;200mg)
          </button>
        </div>
      </div>

      {/* Produce Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-3">
          <p className="text-base font-bold text-stone-800">No produce items found matching criteria</p>
          <p className="text-xs text-stone-500">
            Try adjusting your search query or reset the health filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedSeason('all');
              setGlycemicFilter('all');
              setPotassiumFilter('all');
              setHighFiberOnly(false);
              setHighVitaminCOnly(false);
            }}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectProduce(item)}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col cursor-pointer"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-stone-800 backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Favorite & Compare buttons */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                        isFav ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/70'
                      }`}
                      aria-label="Toggle favorite"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => onCompareWith(item)}
                      className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-all"
                      title="Compare"
                      aria-label="Compare"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom title inside image */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-base leading-tight text-white group-hover:text-emerald-200 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-base font-serif text-emerald-300 font-normal">
                        {item.urduName}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-200 italic font-serif truncate">
                      {item.scientificName}
                    </p>
                  </div>
                </div>

                {/* Card Content & Nutrition quick tags */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  {/* Macro chips */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="bg-stone-50 rounded-lg p-1.5 border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">Energy</span>
                      <span className="font-bold text-stone-800">{item.nutritionPer100g.calories} kcal</span>
                    </div>
                    <div className="bg-emerald-50/60 rounded-lg p-1.5 border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 block">Fiber</span>
                      <span className="font-bold text-emerald-900">{item.nutritionPer100g.fiberG}g</span>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-1.5 border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">GI Tier</span>
                      <span className="font-bold text-stone-800">{item.precautions.diabetes.category}</span>
                    </div>
                  </div>

                  {/* Clinical suitability tag */}
                  <div className="text-[11px] flex items-center justify-between text-stone-500 pt-1 border-t border-stone-100">
                    <span>Diabetic: <strong className={item.precautions.diabetes.suitability === 'Safe' ? 'text-emerald-700' : 'text-amber-700'}>{item.precautions.diabetes.suitability}</strong></span>
                    <span className="text-stone-400">·</span>
                    <span>Potassium: <strong>{item.precautions.kidneyDisease.potassiumTier.split(' ')[0]}</strong></span>
                  </div>

                  {/* View Details link */}
                  <div className="flex items-center justify-between pt-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                    <span>Clinical Profile</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
