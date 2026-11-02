import React, { useState } from 'react';
import { CurrentUser, PostCategory, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { validateContentSafety } from '../utils/rules';
import {
  X,
  Flame,
  ShieldAlert,
  Ghost,
  CheckCircle2,
  Lock,
  Sparkles,
  Calendar,
  MapPin,
  Trophy,
  Activity,
} from 'lucide-react';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  initialVenue?: string;
  initialUniversity?: UniversityId;
  onSubmitPost: (newPost: {
    title: string;
    content: string;
    university: UniversityId;
    campusBranch: string;
    category: PostCategory;
    isAnonymous: boolean;
    isSpoilerTea: boolean;
    tags: string[];
    eventDate?: string;
    eventVenue?: string;
    isActivityLive?: boolean;
  }) => void;
}

export const PostComposerModal: React.FC<PostComposerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialVenue,
  initialUniversity,
  onSubmitPost,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [university, setUniversity] = useState<UniversityId>(initialUniversity || currentUser.university);
  const [campusBranch, setCampusBranch] = useState('Main Campus');
  const [category, setCategory] = useState<PostCategory>('gossip');
  const [isAnonymous, setIsAnonymous] = useState(currentUser.isGhostMode);
  const [isSpoilerTea, setIsSpoilerTea] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState(initialVenue || '');
  const [isActivityLive, setIsActivityLive] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [tags, setTags] = useState<string[]>(['#campus', '#zedwhisper']);
  const [errorWarning, setErrorWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (customTag.trim()) {
      const clean = customTag.trim().startsWith('#') ? customTag.trim() : `#${customTag.trim()}`;
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorWarning(null);

    // Validate title and content safety
    const titleCheck = validateContentSafety(title);
    if (!titleCheck.isValid) {
      setErrorWarning(titleCheck.warning || 'Please provide a valid title.');
      return;
    }

    const contentCheck = validateContentSafety(content);
    if (!contentCheck.isValid) {
      setErrorWarning(contentCheck.warning || 'Please adhere to campus safety guidelines.');
      return;
    }

    onSubmitPost({
      title: title.trim(),
      content: content.trim(),
      university,
      campusBranch: campusBranch.trim(),
      category,
      isAnonymous,
      isSpoilerTea,
      tags,
      eventDate: eventDate.trim() || undefined,
      eventVenue: eventVenue.trim() || undefined,
      isActivityLive,
    });

    // Reset
    setTitle('');
    setContent('');
    setEventDate('');
    setEventVenue('');
    setIsActivityLive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Post Campus Activity & Updates
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Share sports scores, event details, lost & found, news, and campus tea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning notification if triggered */}
        {errorWarning && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorWarning}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Identity Mode Selector: Anonymous vs Verified */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Posting Persona
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => setIsAnonymous(true)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isAnonymous
                    ? 'bg-purple-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Ghost className="w-3.5 h-3.5 text-purple-300" />
                <span>Anonymous Ghost</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAnonymous(false)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  !isAnonymous
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Verified ({currentUser.alias})</span>
              </button>
            </div>
          </div>

          {/* Activity Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Activity Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              <option value="sports">🏆 Sports & Inter-Uni Competitions (ZUSA, derbies)</option>
              <option value="events">🎭 Campus Events, Galas & Socials</option>
              <option value="news">📢 Campus News & Bursary (HELSB, Union, Senate)</option>
              <option value="exams">🎓 Academics, Lecturer Reviews & Study Intel</option>
              <option value="hostel">🏠 Hostels, Power/Water & Roommate Finder</option>
              <option value="lost_found">🔍 Lost & Found Items</option>
              <option value="gossip">🔥 Hot Tea & Anonymous Gossip</option>
              <option value="crushes">💘 Secret Crush & Missed Connection</option>
              <option value="marketplace">💼 Campus Hustle & Selling</option>
            </select>
          </div>

          {/* Target University & Campus Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campus University
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value as UniversityId)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campus Branch / Zone
              </label>
              <input
                type="text"
                value={campusBranch}
                onChange={(e) => setCampusBranch(e.target.value)}
                placeholder="e.g. Great East Road, Riverside, Dushanbe"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* Optional Activity Timing & Venue Details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              <span>Activity Details (Optional)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="Date/Time (e.g. Today 16:30 hrs)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  placeholder="Venue (e.g. OYDC Arena, Hall 3)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="liveToggle"
                checked={isActivityLive}
                onChange={(e) => setIsActivityLive(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
              />
              <label htmlFor="liveToggle" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
                <span>Mark as Live Ongoing Activity Update</span>
              </label>
            </div>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Activity Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UNZA vs CBU Basketball Finals: Halftime score update..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Post Body Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Activity Details & Updates
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the update, event schedule, lost item specifics, or match action. Real-time updates from students keep the campus informed!"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          {/* Spoiler Blur Checkbox */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="spoilerToggle"
              checked={isSpoilerTea}
              onChange={(e) => setIsSpoilerTea(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="spoilerToggle" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Mark as Sensitive Spoiler Tea (Users must click to reveal)</span>
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hashtags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag (e.g. zusa, basketball, unza, nipa)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
              >
                + Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish Activity Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
