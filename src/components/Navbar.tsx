import React, { useState, useRef, useEffect } from 'react';
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
  Calendar,
  QrCode,
  Compass,
  Bookmark,
  Search,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { CampusEvent, CurrentUser, GossipPost, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: 'feed' | 'dating' | 'secret_crush' | 'polls' | 'messages' | 'map' | 'calendar' | 'saved';
  setActiveTab: (tab: 'feed' | 'dating' | 'secret_crush' | 'polls' | 'messages' | 'map' | 'calendar' | 'saved') => void;
  currentUser: CurrentUser;
  onOpenComposer: () => void;
  onOpenProfile: () => void;
  onOpenSafety: () => void;
  onToggleGhostMode: () => void;
  onOpenQrModal: () => void;
  unreadCount: number;
  savedCount: number;
  posts: GossipPost[];
  profiles: StudentProfile[];
  events: CampusEvent[];
  onSelectPost: (post: GossipPost) => void;
  onSelectProfile: (profile: StudentProfile) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onOpenSupabase?: () => void;
  isSupabaseReady?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenComposer,
  onOpenProfile,
  onOpenSafety,
  onToggleGhostMode,
  onOpenQrModal,
  unreadCount,
  savedCount,
  posts,
  profiles,
  events,
  onSelectPost,
  onSelectProfile,
  onSelectEvent,
  onOpenSupabase,
  isSupabaseReady,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = searchQuery.trim().toLowerCase();

  const matchingPeers = cleanQuery
    ? profiles
        .filter(
          (p) =>
            p.name.toLowerCase().includes(cleanQuery) ||
            p.alias.toLowerCase().includes(cleanQuery) ||
            p.program.toLowerCase().includes(cleanQuery) ||
            p.university.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const matchingPosts = cleanQuery
    ? posts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(cleanQuery) ||
            p.content.toLowerCase().includes(cleanQuery) ||
            p.authorAlias.toLowerCase().includes(cleanQuery) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(cleanQuery)))
        )
        .slice(0, 3)
    : [];

  const matchingEvents = cleanQuery
    ? events
        .filter(
          (e) =>
            e.title.toLowerCase().includes(cleanQuery) ||
            e.venue.toLowerCase().includes(cleanQuery) ||
            e.organizer.toLowerCase().includes(cleanQuery) ||
            e.description.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const hasAnyResults = matchingPeers.length > 0 || matchingPosts.length > 0 || matchingEvents.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 lg:gap-4 h-16">
          {/* Zone 1: Wordmark Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2 text-left group cursor-pointer"
              aria-label="Go to ZedWhisper Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20" />
              </div>
              <div>
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  Zed<span className="text-emerald-600 dark:text-emerald-400">Whisper</span>
                </span>
              </div>
            </button>
          </div>

          {/* Global Search Bar (Desktop) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xs xl:max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search peers, posts, events..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Global Search Dropdown Results */}
            {isSearchOpen && cleanQuery.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-150">
                {!hasAnyResults ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No peers, whispers, or events match "<span className="font-semibold text-slate-600 dark:text-slate-300">{searchQuery}</span>"
                  </div>
                ) : (
                  <>
                    {/* Peers Group */}
                    {matchingPeers.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Campus Peers</span>
                          <span>{matchingPeers.length} found</span>
                        </div>
                        {matchingPeers.map((peer) => (
                          <button
                            key={peer.id}
                            onClick={() => {
                              onSelectProfile(peer);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {peer.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                {peer.name} <span className="text-[11px] text-slate-400 font-normal">(@{peer.alias})</span>
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {peer.program} · {peer.university.toUpperCase()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Posts Group */}
                    {matchingPosts.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Whispers & Posts</span>
                          <span>{matchingPosts.length} found</span>
                        </div>
                        {matchingPosts.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => {
                              onSelectPost(post);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-2 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                {post.title}
                              </p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">
                                {post.university.toUpperCase()} · {post.upvotes} upvotes · by {post.authorAlias}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Events Group */}
                    {matchingEvents.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Campus Events</span>
                          <span>{matchingEvents.length} found</span>
                        </div>
                        {matchingEvents.map((evt) => (
                          <button
                            key={evt.id}
                            onClick={() => {
                              onSelectEvent(evt);
                              setActiveTab('calendar');
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-2 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                {evt.title}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {evt.date} · {evt.venue}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 text-xs xl:text-sm font-medium"
          >
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'feed'
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Campus Buzz</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`relative px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'saved'
                  ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Saved / Bookmarked Whispers"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Saved Whispers</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dating')}
              className={`px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dating'
                  ? 'text-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Encounters</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'map'
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Map</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Events</span>
            </button>

            <button
              onClick={() => setActiveTab('polls')}
              className={`px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'polls'
                  ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>Polls</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`relative px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'messages'
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>DMs</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Search"
              aria-label="Toggle Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Ghost Mode Persona Toggle */}
            <button
              onClick={onToggleGhostMode}
              title={currentUser.isGhostMode ? 'Incognito Ghost Mode is Active' : 'Verified Student Persona is Active'}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
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

            {/* Quick Campus Social QR Code Button */}
            <button
              onClick={onOpenQrModal}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title="My Campus Social QR Code & Anonymous WhatsApp Gateway"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My QR</span>
            </button>

            {/* Treats Sent badge */}
            <button
              onClick={onOpenProfile}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/60 hover:bg-pink-100 transition-colors cursor-pointer"
              title="Campus treats and peer appreciations sent"
            >
              <Gift className="w-3.5 h-3.5 text-pink-500" />
              <span className="tabular-nums font-bold">{currentUser.treatsSentCount}</span>
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

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchVisible && (
          <div className="pb-3 pt-1 md:hidden">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search peers, posts, events..."
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {cleanQuery.length > 0 && (
              <div className="mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                {!hasAnyResults ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No results match "{searchQuery}"
                  </div>
                ) : (
                  <>
                    {matchingPeers.map((peer) => (
                      <button
                        key={peer.id}
                        onClick={() => {
                          onSelectProfile(peer);
                          setIsMobileSearchVisible(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {peer.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{peer.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">@{peer.alias} · {peer.university.toUpperCase()}</p>
                        </div>
                      </button>
                    ))}
                    {matchingPosts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => {
                          onSelectPost(post);
                          setIsMobileSearchVisible(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{post.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{post.university.toUpperCase()} · {post.upvotes} upvotes</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile bottom navigation strip (8 tabs) */}
      <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 grid grid-cols-7 py-1 text-center">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center py-1 text-[10px] ${
            activeTab === 'feed' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>Buzz</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`relative flex flex-col items-center py-1 text-[10px] ${
            activeTab === 'saved' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Bookmark className="w-4 h-4 mb-0.5" />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-0.5 right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dating')}
          className={`flex flex-col items-center py-1 text-[10px] ${
            activeTab === 'dating' ? 'text-pink-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Heart className="w-4 h-4 mb-0.5" />
          <span>Crush</span>
        </button>

        <button
          onClick={onOpenQrModal}
          className="flex flex-col items-center py-1 text-[10px] text-emerald-600 font-semibold"
        >
          <QrCode className="w-4 h-4 mb-0.5 text-emerald-600" />
          <span>QR</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1 text-[10px] ${
            activeTab === 'map' ? 'text-teal-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center py-1 text-[10px] ${
            activeTab === 'calendar' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`relative flex flex-col items-center py-1 text-[10px] ${
            activeTab === 'messages' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Mail className="w-4 h-4 mb-0.5" />
          <span>DMs</span>
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-2 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
