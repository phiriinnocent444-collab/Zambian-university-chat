import React from 'react';
import { PostCategory } from '../types';
import {
  Search,
  Flame,
  Newspaper,
  Heart,
  GraduationCap,
  Home,
  ShoppingBag,
  SlidersHorizontal,
  Trophy,
  Calendar,
  HelpCircle,
} from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: PostCategory;
  onSelectCategory: (category: PostCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'trending' | 'latest' | 'discussed';
  onSortChange: (sort: 'trending' | 'latest' | 'discussed') => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const categories: { id: PostCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Activities', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'news', label: 'Campus News', icon: <Newspaper className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'sports', label: 'Sports & Games', icon: <Trophy className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'events', label: 'Events & Socials', icon: <Calendar className="w-3.5 h-3.5 text-purple-500" /> },
    { id: 'exams', label: 'Academics & Intel', icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'hostel', label: 'Hostels & Housing', icon: <Home className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'lost_found', label: 'Lost & Found', icon: <HelpCircle className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'gossip', label: 'Hot Tea', icon: <Flame className="w-3.5 h-3.5 text-orange-500" /> },
    { id: 'crushes', label: 'Crushes', icon: <Heart className="w-3.5 h-3.5 text-pink-500" /> },
    { id: 'marketplace', label: 'Hustle', icon: <ShoppingBag className="w-3.5 h-3.5 text-teal-500" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin flex-nowrap">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative flex-1 sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tea, hostel, exam..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'trending' | 'latest' | 'discussed')}
          aria-label="Sort discussions"
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
        >
          <option value="trending">🔥 Hot Tea (Trending)</option>
          <option value="latest">⚡ Latest Spill</option>
          <option value="discussed">💬 Most Discussed</option>
        </select>
      </div>
    </div>
  );
};
