import React, { useState } from 'react';
import {
  GossipPost,
  UniversityId,
} from '../types';
import { UNIVERSITIES } from '../data/mockData';
import {
  Flame,
  MessageCircle,
  Share2,
  Bookmark,
  ShieldAlert,
  Eye,
  CheckCircle,
  Ghost,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Lock,
  Calendar,
  MapPin,
} from 'lucide-react';

interface GossipFeedProps {
  posts: GossipPost[];
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onOpenPostDetail: (post: GossipPost) => void;
  onBookmark: (postId: string) => void;
  bookmarkedIds: string[];
  onReport: (postId: string) => void;
  onOpenComposer: () => void;
}

export const GossipFeed: React.FC<GossipFeedProps> = ({
  posts,
  onVote,
  onOpenPostDetail,
  onBookmark,
  bookmarkedIds,
  onReport,
  onOpenComposer,
}) => {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSpoiler = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getUniversityBadge = (uniId: UniversityId) => {
    const uni = UNIVERSITIES.find((u) => u.id === uniId);
    return uni ? uni.shortName : 'Zed Campus';
  };

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/60">
          <MessageCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Campus Feed is Blank & Ready
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-2">
          All postings come directly from actual Zambian students. No pre-seeded or artificial gossip.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          Be the first student from UNZA, CBU, NIPA, Mulungushi, Cavendish, or any campus to spill a whisper, share news, report lost items, or drop banter.
        </p>
        <button
          onClick={onOpenComposer}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 hover:scale-102 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Post First Campus Whisper</span>
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isSpoiler = post.isSpoilerTea && !revealedSpoilers[post.id];
        const isBookmarked = bookmarkedIds.includes(post.id);

        return (
          <article
            key={post.id}
            onClick={() => onOpenPostDetail(post)}
            className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 sm:p-5 transition-all shadow-sm hover:shadow-md cursor-pointer relative"
          >
            {/* Header: University, Category & Time (Unboxed clean metadata) */}
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {getUniversityBadge(post.university)}
                </span>
                {post.campusBranch && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600 dark:text-slate-300">{post.campusBranch}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="capitalize">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.timestamp}</span>
              </div>

              <div className="flex items-center gap-2">
                {post.isActivityLive && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                    LIVE UPDATE
                  </span>
                )}
                {post.isVerifiedNews && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified Alert</span>
                  </div>
                )}
              </div>
            </div>

            {/* Post Title */}
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
              {post.title}
            </h3>

            {/* Activity Date & Venue Bar if present */}
            {(post.eventDate || post.eventVenue) && (
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mb-2.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {post.eventDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>{post.eventDate}</span>
                  </span>
                )}
                {post.eventDate && post.eventVenue && <span className="text-slate-300">·</span>}
                {post.eventVenue && (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span className="truncate">{post.eventVenue}</span>
                  </span>
                )}
              </div>
            )}

            {/* Body Content with optional Spoiler Blur */}
            <div className="relative mb-3.5">
              {isSpoiler ? (
                <div
                  onClick={(e) => toggleSpoiler(post.id, e)}
                  className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg p-3 text-center cursor-pointer hover:bg-amber-100/80 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Juicy Campus Tea (Hidden Spoiler)</span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                    Click to reveal confidential discussion
                  </p>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {post.content}
                </p>
              )}
            </div>

            {/* Tags strip */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-3.5 flex-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="hover:text-emerald-600">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer row: Author info & Interactive action buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              {/* Author Alias & Identity */}
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                {post.isAnonymous ? (
                  <Ghost className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-[9px] text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                )}
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px] sm:max-w-none">
                  {post.authorAlias}
                </span>
                {post.authorBadge && (
                  <span className="hidden sm:inline text-[11px] text-slate-400">
                    ({post.authorBadge})
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Voting segmented controls */}
                <div
                  className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onVote(post.id, 'up')}
                    aria-label="Spill tea upvote"
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      post.userVoted === 'up'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{post.upvotes}</span>
                  </button>

                  <button
                    onClick={() => onVote(post.id, 'down')}
                    aria-label="Cap downvote"
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      post.userVoted === 'down'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Comments button */}
                <button
                  onClick={() => onOpenPostDetail(post)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label={`${post.commentsCount} comments`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{post.commentsCount}</span>
                </button>

                {/* Share button */}
                <button
                  onClick={(e) => handleShare(post.id, post.title, e)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy link"
                  aria-label="Share post"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedId === post.id && (
                    <span className="absolute -top-7 right-6 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>

                {/* Bookmark button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark(post.id);
                  }}
                  className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  aria-label="Bookmark post"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>

                {/* Report button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReport(post.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Report inappropriate content"
                  aria-label="Report post"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
