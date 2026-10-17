import React, { useState } from 'react';
import { X, User, Lock, Mail, Apple, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../types/produce.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const profile: UserProfile = {
      id: 'usr-' + Date.now(),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: email.includes('admin') ? 'admin' : 'user',
      favorites: currentUser?.favorites || [],
      dietaryPreferences: currentUser?.dietaryPreferences || {
        diabeticFriendlyOnly: false,
        lowPotassiumMode: false,
        highFiberFocus: false,
      },
    };

    onLogin(profile);
    onClose();
  };

  const handleGuestLogin = () => {
    const guestProfile: UserProfile = {
      id: 'guest-1',
      name: 'Guest Explorer',
      email: 'guest@nutriflora.internal',
      role: 'user',
      favorites: currentUser?.favorites || [],
      dietaryPreferences: {
        diabeticFriendlyOnly: false,
        lowPotassiumMode: false,
        highFiberFocus: false,
      },
    };
    onLogin(guestProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
            <Apple className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            {currentUser ? 'Your Profile Account' : isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-stone-500">
            {currentUser
              ? 'Manage your scan records and health bookmarks'
              : 'Sign in to save recognition history and favorites'}
          </p>
        </div>

        {currentUser ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-stone-400 font-medium block">Signed in as:</span>
              <p className="text-sm font-bold text-stone-900">{currentUser.name}</p>
              <p className="text-stone-500">{currentUser.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {currentUser.role}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onLogout}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {isRegister && (
              <div>
                <label className="font-semibold block mb-1 text-stone-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Sara Khan"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold block mb-1 text-stone-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-stone-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              {isRegister ? 'Register & Continue' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold rounded-xl transition-colors"
            >
              Continue as Guest
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-stone-500 hover:text-emerald-700"
              >
                {isRegister
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up free"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
