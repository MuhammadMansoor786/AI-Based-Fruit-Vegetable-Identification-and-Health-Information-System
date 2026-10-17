import React from 'react';
import { Camera, Apple, Layers, GitCompare, Calendar, User, ShieldCheck, Heart } from 'lucide-react';
import type { UserProfile } from '../types/produce.ts';

interface NavbarProps {
  activeTab: 'home' | 'scanner' | 'gallery' | 'compare' | 'seasonal' | 'dashboard' | 'admin';
  setActiveTab: (tab: 'home' | 'scanner' | 'gallery' | 'compare' | 'seasonal' | 'dashboard' | 'admin') => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-stone-900 tracking-tight">NutriFlora</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  AI Vision
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Fruit & Veggie Health Intelligence</p>
            </div>
          </button>

          {/* Navigation links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'scanner'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Camera className="w-4 h-4" />
              AI Recognition
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              Food Directory
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'compare'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare
            </button>
            <button
              onClick={() => setActiveTab('seasonal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'seasonal'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Seasonal Guide
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              Saved {favoritesCount > 0 && <span className="bg-rose-100 text-rose-700 text-xs px-1.5 py-0.2 rounded-full font-bold">{favoritesCount}</span>}
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors ${
                activeTab === 'admin' ? 'bg-stone-200 text-stone-900 font-semibold' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </nav>

          {/* User Account Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">
                {user ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline">{user ? user.name : 'Sign In'}</span>
            </button>

            {/* Mobile Scan CTA */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600 text-white shadow-sm"
              aria-label="Scan produce"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-100 px-2 py-1.5 text-xs text-stone-600 bg-white">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 rounded ${activeTab === 'home' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-2 py-1 rounded ${activeTab === 'scanner' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Scan
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-2 py-1 rounded ${activeTab === 'gallery' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Directory
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-2 py-1 rounded ${activeTab === 'compare' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Compare
        </button>
        <button
          onClick={() => setActiveTab('seasonal')}
          className={`px-2 py-1 rounded ${activeTab === 'seasonal' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Season
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2 py-1 rounded ${activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Saved
        </button>
      </div>
    </header>
  );
};
