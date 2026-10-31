import React, { useState } from 'react';
import { CurrentUser, GossipPost } from '../types';
import { validateContentSafety, generateAnonymousAlias } from '../utils/rules';
import {
  X,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Ghost,
  CheckCircle2,
  Send,
  ShieldAlert,
  Share2,
  Lock,
  Unlock,
  Calendar,
  MapPin,
} from 'lucide-react';

interface PostDetailModalProps {
  post: GossipPost | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onVotePost: (postId: string, direction: 'up' | 'down') => void;
  onAddComment: (postId: string, commentText: string, isAnonymous: boolean) => void;
  onVoteComment: (postId: string, commentId: string, direction: 'up' | 'down') => void;
  onReport: (postId: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  currentUser,
  onVotePost,
  onAddComment,
  onVoteComment,
  onReport,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [isAnonymousComment, setIsAnonymousComment] = useState(currentUser.isGhostMode);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [showSpoilerContent, setShowSpoilerContent] = useState(false);

  if (!isOpen || !post) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    const check = validateContentSafety(commentInput);
    if (!check.isValid) {
      setCommentError(check.warning || 'Invalid comment.');
      return;
    }

    onAddComment(post.id, commentInput.trim(), isAnonymousComment);
    setCommentInput('');
  };

  const isHiddenSpoiler = post.isSpoilerTea && !showSpoilerContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {post.university.toUpperCase()} Buzz
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 capitalize">{post.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Main Post Header */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {post.isAnonymous ? (
                  <Ghost className="w-3.5 h-3.5 text-purple-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                )}
                <span>{post.authorAlias}</span>
              </span>
              <span>·</span>
              <span>{post.timestamp}</span>
              {post.campusBranch && (
                <>
                  <span>·</span>
                  <span>{post.campusBranch}</span>
                </>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-3">
              {post.title}
            </h1>

            {/* Activity Date, Venue & Live Marker if present */}
            {(post.eventDate || post.eventVenue || post.isActivityLive) && (
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-slate-700 dark:text-slate-300 mb-3.5 bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                {post.isActivityLive && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                    LIVE UPDATE
                  </span>
                )}
                {post.eventDate && (
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>{post.eventDate}</span>
                  </span>
                )}
                {post.eventDate && post.eventVenue && <span className="text-slate-300">·</span>}
                {post.eventVenue && (
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{post.eventVenue}</span>
                  </span>
                )}
              </div>
            )}

            {/* Content with spoiler toggle if active */}
            {isHiddenSpoiler ? (
              <div
                onClick={() => setShowSpoilerContent(true)}
                className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-center cursor-pointer hover:bg-amber-100/80 transition-all"
              >
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Lock className="w-4 h-4" />
                  <span>Hidden Campus Tea Spoiler</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Click here to reveal the tea
                </p>
              </div>
            ) : (
              <div className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed space-y-3">
                <p>{post.content}</p>
                {post.isSpoilerTea && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 pt-1">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Spoiler revealed</span>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-400">
                {post.tags.map((t) => (
                  <span key={t} className="text-emerald-600 dark:text-emerald-400">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Post stats bar */}
            <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onVotePost(post.id, 'up')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    post.userVoted === 'up'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes} Upvotes</span>
                </button>

                <button
                  onClick={() => onVotePost(post.id, 'down')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    post.userVoted === 'down'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} replies</span>
                </span>
                <button
                  onClick={() => onReport(post.id)}
                  className="hover:text-rose-500 p-1"
                  title="Report post"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Discussion Thread Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Student Discussion</span>
              <span className="text-xs text-slate-400 font-normal">
                ({post.comments.length} comments)
              </span>
            </h2>

            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No replies yet. Drop your take first!
              </p>
            ) : (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        {comment.isAuthorGhost ? (
                          <Ghost className="w-3 h-3 text-purple-400" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        )}
                        <span>{comment.authorAlias}</span>
                        <span className="text-[10px] text-slate-400">({comment.authorUniversity.toUpperCase()})</span>
                      </div>
                      <span className="text-[10px]">{comment.timestamp}</span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/40">
                      <button
                        onClick={() => onVoteComment(post.id, comment.id, 'up')}
                        className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                          comment.userVoted === 'up'
                            ? 'text-emerald-600'
                            : 'text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        <ArrowUp className="w-3 h-3" />
                        <span className="tabular-nums">{comment.upvotes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comment Composer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          {commentError && (
            <div className="mb-2 p-2 rounded bg-rose-50 text-rose-700 text-xs flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{commentError}</span>
            </div>
          )}

          <form onSubmit={handleSendComment} className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>Replying as:</span>
                <button
                  type="button"
                  onClick={() => setIsAnonymousComment(!isAnonymousComment)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer ${
                    isAnonymousComment
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {isAnonymousComment ? (
                    <>
                      <Ghost className="w-3 h-3" />
                      <span>Ghost Mode</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{currentUser.alias}</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-slate-400">Zero doxxing policy</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Spill your thought or counter-argument..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs active:scale-95"
                title="Send reply"
                aria-label="Send reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
