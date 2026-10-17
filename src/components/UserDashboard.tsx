import React, { useState } from 'react';
import {
  Heart,
  History,
  Sliders,
  Sparkles,
  Trash2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';
import type { ProduceItem, ScanHistoryEntry, UserProfile } from '../types/produce.ts';

interface UserDashboardProps {
  user: UserProfile;
  items: ProduceItem[];
  history: ScanHistoryEntry[];
  onSelectProduce: (item: ProduceItem) => void;
  onRemoveFavorite: (id: string) => void;
  onClearHistory: () => void;
  onUpdatePreferences: (prefs: UserProfile['dietaryPreferences']) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  items,
  history,
  onSelectProduce,
  onRemoveFavorite,
  onClearHistory,
  onUpdatePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history' | 'preferences'>('favorites');

  const favoriteItems = items.filter((item) => user.favorites.includes(item.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">{user.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-600">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-stone-500">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-center">
          <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 font-medium uppercase block">Saved Items</span>
            <span className="text-lg font-bold text-stone-800">{user.favorites.length}</span>
          </div>
          <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 font-medium uppercase block">Scans Run</span>
            <span className="text-lg font-bold text-stone-800">{history.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-2 px-3 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'favorites'
              ? 'bg-emerald-600 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          Saved Favorites ({favoriteItems.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-3 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'bg-emerald-600 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          Recognition Scan History ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`py-2 px-3 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'preferences'
              ? 'bg-emerald-600 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Health Preferences
        </button>
      </div>

      {/* TAB 1: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-2">
              <Heart className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-bold text-stone-800 text-sm">No saved fruits or vegetables yet</p>
              <p className="text-xs text-stone-500">
                Click the heart icon on any produce item to save it here for fast reference.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-xs flex items-center justify-between gap-3 group hover:border-emerald-300 transition-all"
                >
                  <div
                    onClick={() => onSelectProduce(item)}
                    className="flex items-center gap-3 cursor-pointer flex-1 overflow-hidden"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs font-serif text-emerald-800">{item.urduName}</p>
                      <span className="text-[10px] text-stone-400 block font-mono">
                        {item.nutritionPer100g.calories} kcal / 100g
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove from favorites"
                    aria-label="Remove favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECOGNITION SCAN HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Your recent camera and photo uploads analyzed by Gemini 3.8 Flash
            </span>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-2">
              <History className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-bold text-stone-800 text-sm">No image scans recorded yet</p>
              <p className="text-xs text-stone-500">
                Go to the AI Recognition tab to scan your first fruit or vegetable photo.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  onClick={() => onSelectProduce(record.itemData)}
                  className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={record.imageUrl}
                        alt={record.produceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700">
                          {record.produceName}
                        </h4>
                        <span className="text-xs font-serif text-emerald-800">{record.urduName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {record.confidence}% match
                        </span>
                      </div>
                      <p className="text-xs italic text-stone-400 font-serif">
                        {record.scientificName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400 self-end sm:self-auto">
                    <span>{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                      Review <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIETARY PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Personal Health Flags & Filtering Profile</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize warning highlights to prioritize produce safe for your specific nutritional needs.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Diabetic Friendly Toggle */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={user.dietaryPreferences.diabeticFriendlyOnly}
                onChange={(e) =>
                  onUpdatePreferences({
                    ...user.dietaryPreferences,
                    diabeticFriendlyOnly: e.target.checked,
                  })
                }
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div>
                <span className="font-bold text-stone-900 block">Diabetic-Safe Priority Filter</span>
                <span className="text-stone-500">
                  Automatically flags high-sugar tropical fruits and emphasizes Low Glycemic Index (GI ≤ 55) produce.
                </span>
              </div>
            </label>

            {/* Low Potassium Mode */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={user.dietaryPreferences.lowPotassiumMode}
                onChange={(e) =>
                  onUpdatePreferences({
                    ...user.dietaryPreferences,
                    lowPotassiumMode: e.target.checked,
                  })
                }
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div>
                <span className="font-bold text-stone-900 block">Low Potassium (Renal Care Mode)</span>
                <span className="text-stone-500">
                  Highlights produce with under 200mg potassium per 100g and raises warnings for spinach, avocado, and bananas.
                </span>
              </div>
            </label>

            {/* High Fiber Mode */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={user.dietaryPreferences.highFiberFocus}
                onChange={(e) =>
                  onUpdatePreferences({
                    ...user.dietaryPreferences,
                    highFiberFocus: e.target.checked,
                  })
                }
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div>
                <span className="font-bold text-stone-900 block">High Dietary Fiber Goal</span>
                <span className="text-stone-500">
                  Prioritizes produce with over 3g of soluble and insoluble fiber for optimal gut microbiome health.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
