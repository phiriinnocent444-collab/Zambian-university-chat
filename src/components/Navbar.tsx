import React from 'react';
import {
  MessageSquare,
  Heart,
  Flame,
  BarChart3,
  Mail,
  Shield,
  Gift,
  User,
  Plus,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { CurrentUser } from '../types';

interface NavbarProps {
  activeTab: 'feed' | 'dating' | 'secret_crush' | 'polls' | 'messages';
  setActiveTab: (tab: 'feed' | 'dating' | 'secret_crush' | 'polls' | 'messages') => void;
  currentUser: CurrentUser;
  onOpenComposer: () => void;
  onOpenProfile: () => void;
  onOpenSafety: () => void;
  onToggleGhostMode: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenComposer,
  onOpenProfile,
  onOpenSafety,
  onToggleGhostMode,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              aria-label="Go to ZedWhisper Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  Zed<span className="text-emerald-600 dark:text-emerald-400">Whisper</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium"
          >
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Campus Buzz</span>
            </button>

            <button
              onClick={() => setActiveTab('dating')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dating'
                  ? 'text-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Campus Encounters</span>
            </button>

            <button
              onClick={() => setActiveTab('secret_crush')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'secret_crush'
                  ? 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <EyeOff className="w-4 h-4 text-purple-500" />
              <span>Secret Crush</span>
            </button>

            <button
              onClick={() => setActiveTab('polls')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'polls'
                  ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>Campus Polls</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`relative px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Whisper DMs</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action & compact status icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 pr-1">
            {/* Quick Ghost Mode Persona Toggle */}
            <button
              onClick={onToggleGhostMode}
              title={currentUser.isGhostMode ? 'Incognito Ghost Mode is Active' : 'Verified Student Persona is Active'}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                currentUser.isGhostMode
                  ? 'bg-purple-900 text-purple-200 border-purple-700 shadow-inner'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              aria-label="Toggle Ghost Mode"
            >
              {currentUser.isGhostMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-purple-300" />
                  <span className="font-medium whitespace-nowrap">Ghost Active</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-medium whitespace-nowrap">Verified ID</span>
                </>
              )}
            </button>

            {/* Free Campus Treats Sent badge */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/60 hover:bg-pink-100 transition-colors cursor-pointer"
              title="Campus treats and peer appreciations sent"
            >
              <Gift className="w-3.5 h-3.5 text-pink-500" />
              <span className="tabular-nums font-bold">{currentUser.treatsSentCount}</span>
              <span className="text-[10px] text-pink-600 dark:text-pink-400">Treats</span>
            </button>

            {/* Safety Rules Guide Button */}
            <button
              onClick={onOpenSafety}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cyber Safety & Anti-Doxxing Guidelines"
              aria-label="Safety & Community Guidelines"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Student Profile Button */}
            <button
              onClick={onOpenProfile}
              className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="View Student Profile"
              aria-label="Student Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Primary Action Button: Spill Tea */}
            <button
              onClick={onOpenComposer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Spill Tea</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation strip */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 grid grid-cols-5 py-1 text-center">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'feed' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>Buzz</span>
        </button>
        <button
          onClick={() => setActiveTab('dating')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'dating' ? 'text-pink-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Heart className="w-4 h-4 mb-0.5" />
          <span>Encounters</span>
        </button>
        <button
          onClick={() => setActiveTab('secret_crush')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'secret_crush' ? 'text-purple-600 font-bold' : 'text-slate-500'
          }`}
        >
          <EyeOff className="w-4 h-4 mb-0.5" />
          <span>Crush</span>
        </button>
        <button
          onClick={() => setActiveTab('polls')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'polls' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Polls</span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`relative flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'messages' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Mail className="w-4 h-4 mb-0.5" />
          <span>DMs</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-3 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
