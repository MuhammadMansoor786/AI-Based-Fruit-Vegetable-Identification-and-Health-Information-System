import React, { useState } from 'react';
import { Calendar, Sun, CloudRain, Wind, Snowflake, Sparkles } from 'lucide-react';
import type { ProduceItem } from '../types/produce.ts';

interface SeasonalGuideProps {
  items: ProduceItem[];
  onSelectProduce: (item: ProduceItem) => void;
}

export const SeasonalGuide: React.FC<SeasonalGuideProps> = ({
  items,
  onSelectProduce,
}) => {
  const [activeSeason, setActiveSeason] = useState<'Spring' | 'Summer' | 'Autumn' | 'Winter'>('Summer');

  const seasonalProduce = items.filter(
    (item) => item.growingSeason.includes(activeSeason as any) || item.growingSeason.includes('Year-round')
  );

  const seasonInfo = {
    Spring: {
      icon: CloudRain,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Spring is the season of renewal: tender leafy greens, cruciferous shoots, and early berries arrive with maximum polyphenol concentrations.',
    },
    Summer: {
      icon: Sun,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      description: 'Summer delivers peak hydration: tropical drupes (mangos), cucurbits (karela, melons), nightshades (tomatoes), and high-antioxidant berries.',
    },
    Autumn: {
      icon: Wind,
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      description: 'Autumn brings nutrient-dense storage crops: ruby pomegranates, root vegetables (carrots), and pome fruits (apples) rich in pectin and carotenoids.',
    },
    Winter: {
      icon: Snowflake,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      description: 'Winter features cold-hardy brassicas (broccoli, cabbage), sweet root tubers (carrots), and immune-protective citrus fruits (lemons, oranges).',
    },
  };

  const currentConfig = seasonInfo[activeSeason];
  const IconComponent = currentConfig.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" /> Agricultural Almanac
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Seasonal Produce & Harvest Guide
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Eating fruits and vegetables in their natural harvest season provides up to 3x higher micronutrient density, optimal flavor, and lower environmental pesticide residues.
        </p>
      </div>

      {/* Season Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-stone-100 p-1.5 rounded-2xl gap-1 text-xs font-bold">
          {(['Spring', 'Summer', 'Autumn', 'Winter'] as const).map((season) => (
            <button
              key={season}
              onClick={() => setActiveSeason(season)}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSeason === season
                  ? 'bg-white text-stone-900 shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* Season Description Banner */}
      <div className={`p-4 rounded-2xl border ${currentConfig.color} flex items-start gap-3 text-xs leading-relaxed`}>
        <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm block mb-0.5">{activeSeason} Agricultural Profile:</span>
          <p>{currentConfig.description}</p>
        </div>
      </div>

      {/* Grid of In-Season Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {seasonalProduce.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectProduce(item)}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer p-3 flex flex-col justify-between"
          >
            <div className="relative h-32 rounded-xl overflow-hidden bg-stone-100 mb-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-serif backdrop-blur-xs">
                {item.urduName}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                {item.category}
              </span>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 transition-colors">
                {item.name}
              </h3>
              <p className="text-[11px] text-stone-500 italic font-serif truncate">
                {item.scientificName}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>{item.nutritionPer100g.calories} kcal</span>
              <span className="text-emerald-700 font-semibold">View Facts →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
