import React, { useState, useEffect } from 'react';
import { MedicalDisclaimerBanner } from './components/MedicalDisclaimerBanner.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AiScanner } from './components/AiScanner.tsx';
import { ProduceGallery } from './components/ProduceGallery.tsx';
import { ProduceCompare } from './components/ProduceCompare.tsx';
import { SeasonalGuide } from './components/SeasonalGuide.tsx';
import { UserDashboard } from './components/UserDashboard.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { ProduceDetailModal } from './components/ProduceDetailModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { VERIFIED_PRODUCE } from './data/sampleProduce.ts';
import type { ProduceItem, RecognitionResult, ScanHistoryEntry, UserProfile } from './types/produce.ts';
import { Heart, Globe2, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'scanner' | 'gallery' | 'compare' | 'seasonal' | 'dashboard' | 'admin'>('home');
  const [produceList, setProduceList] = useState<ProduceItem[]>(VERIFIED_PRODUCE);
  const [selectedProduce, setSelectedProduce] = useState<ProduceItem | null>(null);
  const [compareItemA, setCompareItemA] = useState<ProduceItem | null>(null);
  const [compareItemB, setCompareItemB] = useState<ProduceItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // User and LocalStorage State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('nutriflora_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'default-user',
      name: 'Guest Explorer',
      email: 'guest@nutriflora.internal',
      role: 'user',
      favorites: ['mango', 'bitter-gourd'],
      dietaryPreferences: {
        diabeticFriendlyOnly: false,
        lowPotassiumMode: false,
        highFiberFocus: false,
      },
    };
  });

  const [history, setHistory] = useState<ScanHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nutriflora_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'hist-init-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        produceName: 'Bitter Gourd / Bitter Melon',
        scientificName: 'Momordica charantia',
        urduName: 'کریلہ (Karela)',
        category: 'vegetable',
        confidence: 96,
        imageUrl: VERIFIED_PRODUCE.find((p) => p.id === 'bitter-gourd')?.imageUrl || '',
        itemData: VERIFIED_PRODUCE.find((p) => p.id === 'bitter-gourd') || VERIFIED_PRODUCE[0],
      },
    ];
  });

  // Fetch produce catalog from backend API if available
  useEffect(() => {
    fetch('/api/produce')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items && data.items.length > 0) {
          setProduceList(data.items);
        }
      })
      .catch((err) => {
        console.warn('Using client-side verified catalog fallback:', err);
      });
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nutriflora_user', JSON.stringify(user));
    } catch {}
  }, [user]);

  // Sync history state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nutriflora_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  const handleToggleFavorite = (item: ProduceItem) => {
    const isFav = user.favorites.includes(item.id);
    const updatedFavs = isFav
      ? user.favorites.filter((id) => id !== item.id)
      : [...user.favorites, item.id];

    setUser((prev) => ({
      ...prev,
      favorites: updatedFavs,
    }));
  };

  const handleSaveHistory = (res: RecognitionResult) => {
    const newEntry: ScanHistoryEntry = {
      id: 'scan-' + Date.now(),
      timestamp: res.recognizedAt,
      produceName: res.item.name,
      scientificName: res.item.scientificName,
      urduName: res.item.urduName,
      category: res.item.category,
      confidence: res.confidence,
      imageUrl: res.item.imageUrl,
      itemData: res.item,
    };

    setHistory((prev) => [newEntry, ...prev.slice(0, 24)]);
  };

  const handleCompareWith = (item: ProduceItem) => {
    setCompareItemA(item);
    setActiveTab('compare');
    if (selectedProduce) setSelectedProduce(null);
  };

  const handleAddNewProduce = async (item: ProduceItem) => {
    try {
      await fetch('/api/produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch {}
    setProduceList((prev) => [item, ...prev]);
  };

  const handleDeleteProduce = async (id: string) => {
    try {
      await fetch(`/api/produce/${id}`, { method: 'DELETE' });
    } catch {}
    setProduceList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Clinical & Nutritional Disclaimer */}
      <MedicalDisclaimerBanner />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        favoritesCount={user.favorites.length}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroSection
            onStartScanning={() => setActiveTab('scanner')}
            onExploreGallery={() => setActiveTab('gallery')}
            featuredProduce={produceList}
            onSelectProduce={(item) => setSelectedProduce(item)}
          />
        )}

        {activeTab === 'scanner' && (
          <AiScanner
            onSelectProduce={(item) => setSelectedProduce(item)}
            onSaveHistory={handleSaveHistory}
          />
        )}

        {activeTab === 'gallery' && (
          <ProduceGallery
            items={produceList}
            onSelectProduce={(item) => setSelectedProduce(item)}
            favorites={user.favorites}
            onToggleFavorite={handleToggleFavorite}
            onCompareWith={handleCompareWith}
          />
        )}

        {activeTab === 'compare' && (
          <ProduceCompare
            items={produceList}
            preselectedA={compareItemA}
            preselectedB={compareItemB}
            onSelectProduce={(item) => setSelectedProduce(item)}
          />
        )}

        {activeTab === 'seasonal' && (
          <SeasonalGuide
            items={produceList}
            onSelectProduce={(item) => setSelectedProduce(item)}
          />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboard
            user={user}
            items={produceList}
            history={history}
            onSelectProduce={(item) => setSelectedProduce(item)}
            onRemoveFavorite={(id) =>
              setUser((prev) => ({
                ...prev,
                favorites: prev.favorites.filter((fId) => fId !== id),
              }))
            }
            onClearHistory={() => setHistory([])}
            onUpdatePreferences={(dietaryPreferences) =>
              setUser((prev) => ({ ...prev, dietaryPreferences }))
            }
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            items={produceList}
            onAddNewProduce={handleAddNewProduce}
            onDeleteProduce={handleDeleteProduce}
          />
        )}
      </main>

      {/* Full Produce Detail Modal */}
      <ProduceDetailModal
        item={selectedProduce}
        onClose={() => setSelectedProduce(null)}
        isFavorite={selectedProduce ? user.favorites.includes(selectedProduce.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onCompareWith={handleCompareWith}
      />

      {/* User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user.id === 'default-user' ? null : user}
        onLogin={(newUser) => setUser(newUser)}
        onLogout={() =>
          setUser({
            id: 'default-user',
            name: 'Guest Explorer',
            email: 'guest@nutriflora.internal',
            role: 'user',
            favorites: [],
            dietaryPreferences: {
              diabeticFriendlyOnly: false,
              lowPotassiumMode: false,
              highFiberFocus: false,
            },
          })
        }
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 py-12 px-4 sm:px-6 lg:px-8 text-xs mt-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs">
                  NF
                </div>
                NutriFlora AI
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                AI-based fruit and vegetable identification and clinical health information system. Grounded in FAO and USDA verified food data.
              </p>
              <p className="font-serif text-emerald-300 text-xs">
                پھلوں اور سبزیوں کی نباتاتی شناخت اور غذائی معلومات کا باضابطہ نظام
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Nutritional Databases
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li>USDA FoodData Central</li>
                <li>FAO/INFOODS Regional Tables</li>
                <li>Harvard T.H. Chan Nutrition Source</li>
                <li>World Health Organization (WHO)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Clinical Precautions
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li>Glycemic Index & Diabetic Safety</li>
                <li>Chronic Kidney Disease (CKD) & Potassium</li>
                <li>Soluble Oxalates & Nephrolithiasis</li>
                <li>Warfarin (Coumadin) & Vitamin K Interactions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Multimodal AI Engine
              </h4>
              <p className="text-stone-400 leading-relaxed mb-3">
                Image recognition powered by Google Gemini 3.8 Flash with high-precision botanical feature extraction.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 text-emerald-400 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" /> API Status: Connected
              </span>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
            <p>
              © {new Date().getFullYear()} NutriFlora AI. Information is intended for nutritional planning and educational exploration. Not intended as medical diagnosis.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('scanner')} className="hover:text-stone-300">
                Scan Photo
              </button>
              <button onClick={() => setActiveTab('gallery')} className="hover:text-stone-300">
                Directory
              </button>
              <button onClick={() => setActiveTab('compare')} className="hover:text-stone-300">
                Compare
              </button>
              <button onClick={() => setActiveTab('admin')} className="hover:text-stone-300">
                Curator Panel
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
